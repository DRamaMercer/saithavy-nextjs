# Security Implementation Guide

**Version:** 1.0.0
**Last Updated:** 2025-03-13
**Target Audience:** DevOps Engineers, Security Engineers, Developers

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Infrastructure Setup](#infrastructure-setup)
3. [Core Security Services](#core-security-services)
4. [Integration Guides](#integration-guides)
5. [Testing & Validation](#testing--validation)
6. [Deployment Checklist](#deployment-checklist)

---

## Prerequisites

### Required Tools & Services

```bash
# Cloud Providers (choose one or more)
- AWS Account with IAM permissions
- Google Cloud Project
- Azure Subscription

# Secret Management
- HashiCorp Vault Enterprise
- AWS Secrets Manager
- Azure Key Vault

# Database & Storage
- PostgreSQL 14+
- Redis 7+
- S3-compatible storage

# Monitoring & Logging
- Datadog or New Relic
- Splunk or ELK Stack
- PagerDuty for incident response

# Development Tools
- Node.js 20+
- TypeScript 5+
- Docker 24+
- Kubernetes 1.28+
```

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/swarm-agency-platform.git
cd swarm-agency-platform

# 2. Install dependencies
npm ci
npm run setup:security

# 3. Configure environment
cp .env.example .env
# Edit .env with your configuration

# 4. Initialize security infrastructure
npm run security:init

# 5. Run security checks
npm run security:check
```

---

## Infrastructure Setup

### 1. Network Architecture

#### VPC Configuration

```hcl
# terraform/network/vpc.tf
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "swarm-agency-vpc"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# Public subnets for load balancers
resource "aws_subnet" "public" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "swarm-agency-public-${count.index}"
  }
}

# Private subnets for application servers
resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 3)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "swarm-agency-private-${count.index}"
  }
}

# Isolated subnets for databases and vault
resource "aws_subnet" "isolated" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 6)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "swarm-agency-isolated-${count.index}"
  }
}
```

#### Security Groups

```hcl
# Application tier security group
resource "aws_security_group" "app_tier" {
  name_prefix = "app-tier-"
  description = "Security group for application servers"
  vpc_id      = aws_vpc.main.id

  # HTTPS from load balancer only
  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.lb.id]
  }

  # Health checks
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.lb.id]
  }

  # All outbound (for external APIs)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Database tier security group
resource "aws_security_group" "db_tier" {
  name_prefix = "db-tier-"
  description = "Security group for databases"
  vpc_id      = aws_vpc.main.id

  # PostgreSQL from app tier only
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_tier.id]
  }

  # No outbound (databases shouldn't initiate connections)
  lifecycle {
    create_before_destroy = true
  }
}
```

### 2. HashiCorp Vault Setup

#### Vault Configuration

```hcl
# terraform/vault/main.tf
resource "aws_ecs_task_definition" "vault" {
  family                   = "vault"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "2048"
  memory                   = "4096"

  container_definitions = jsonencode([
    {
      name      = "vault"
      image     = "hashicorp/vault:1.15"
      cpu       = 2048
      memory    = 4096
      essential = true

      portMappings = [
        {
          containerPort = 8200
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "VAULT_ADDR"
          value = "https://vault.internal:8200"
        },
        {
          name  = "VAULT_CLUSTER_ADDR"
          value = "https://${aws_service.vault.name}:8201"
        },
        {
          name  = "VAULT_API_ADDR"
          value = "https://vault.${var.domain}:8200"
        }
      ]

      secrets = [
        {
          name      = "VAULT_TLS_CERT_FILE"
          valueFrom = aws_secretsmanager_secret.vault_cert.arn
        },
        {
          name      = "VAULT_TLS_KEY_FILE"
          valueFrom = aws_secretsmanager_secret.vault_key.arn
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.vault.name
          awslogs-region        = var.region
          awslogs-stream-prefix = "vault"
        }
      }
    }
  ])
}
```

#### Vault Policies

```hcl
# vault/policies/swarm-agency.hcl
# Allow managing secrets for a specific tenant
path "secret/data/tenants/{{identity.entity.aliases.auth_oidc_*/name}}/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Allow reading shared secrets
path "secret/data/shared/*" {
  capabilities = ["read", "list"]
}

# Allow managing transit encryption
path "transit/keys/*" {
  capabilities = ["create", "read", "update", "delete"]
}

path "transit/decrypt/*" {
  capabilities = ["update"]
}

path "transit/encrypt/*" {
  capabilities = ["update"]
}

# Allow PKI operations
path "pki/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Deny access to other tenants
path "secret/data/tenants/*" {
  capabilities = ["deny"]
}
```

### 3. Database Security

#### PostgreSQL Configuration

```sql
-- postgresql/security.sql

-- Enable row-level security
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_credentials ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policy
CREATE POLICY tenant_isolation ON content_items
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON analytics_data
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON api_credentials
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Enable encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create audit function
CREATE OR REPLACE FUNCTION audit.log_table_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit.audit_log (table_name, operation, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit.audit_log (table_name, operation, old_data, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit.audit_log (table_name, operation, old_data)
    VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD));
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers
CREATE TRIGGER audit_content_items
  AFTER INSERT OR UPDATE OR DELETE ON content_items
  FOR EACH ROW EXECUTE FUNCTION audit.log_table_changes();
```

#### Encryption at Rest

```sql
-- Enable Transparent Data Encryption (TDE)
-- Note: This is AWS RDS specific configuration

-- For application-level encryption:
CREATE TABLE encrypted_content (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  content_metadata JSONB,
  encrypted_content BYTEA,
  content_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to encrypt content
CREATE OR REPLACE FUNCTION crypto.encrypt_content(content TEXT, key TEXT)
RETURNS BYTEA AS $$
BEGIN
  RETURN pgp_sym_encrypt(content, key);
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt content
CREATE OR REPLACE FUNCTION crypto.decrypt_content(encrypted_content BYTEA, key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_content, key);
END;
$$ LANGUAGE plpgsql;
```

---

## Core Security Services

### 1. Authentication Service

#### JWT Configuration

```typescript
// src/auth/jwt.config.ts
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const jwtFactory = {
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get('JWT_EXPIRES_IN', '15m'),
      issuer: configService.get('JWT_ISSUER', 'swarm-agency'),
      audience: configService.get('JWT_AUDIENCE', 'swarm-agency-api'),
      algorithm: 'RS256',
    },
    verifyOptions: {
      algorithms: ['RS256'],
      issuer: configService.get('JWT_ISSUER', 'swarm-agency'),
      audience: configService.get('JWT_AUDIENCE', 'swarm-agency-api'),
    },
  }),
  inject: [ConfigService],
};

// JWT payload interface
export interface JWTPayload {
  sub: string;          // User ID
  tenant_id: string;    // Tenant ID
  roles: string[];      // User roles
  permissions: string[]; // Granular permissions
  iat: number;          // Issued at
  exp: number;          // Expiration
  jti: string;          // JWT ID (for revocation)
}

// JWT claims validator
export function validateClaims(payload: JWTPayload): boolean {
  const now = Date.now() / 1000;

  // Check expiration
  if (payload.exp && payload.exp < now) {
    return false;
  }

  // Check required fields
  if (!payload.sub || !payload.tenant_id) {
    return false;
  }

  // Check token in revocation list
  if (await isTokenRevoked(payload.jti)) {
    return false;
  }

  return true;
}
```

#### OAuth 2.0 Integration

```typescript
// src/auth/oauth.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class OAuthService {
  private clients: Map<string, OAuth2Client> = new Map();

  constructor(private configService: ConfigService) {
    this.initializeClients();
  }

  private initializeClients(): void {
    // Initialize OAuth clients for different platforms
    const platforms = ['twitter', 'facebook', 'instagram', 'linkedin'];

    for (const platform of platforms) {
      const clientId = this.configService.get(`OAUTH_${platform.toUpperCase()}_CLIENT_ID`);
      const clientSecret = this.configService.get(`OAUTH_${platform.toUpperCase()}_CLIENT_SECRET`);

      this.clients.set(platform, new OAuth2Client(clientId, clientSecret));
    }
  }

  async getAuthorizationUrl(platform: string, redirectUri: string): Promise<string> {
    const client = this.clients.get(platform);
    if (!client) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const scopes = this.getScopesForPlatform(platform);
    const state = this.generateState();

    // Store state for verification
    await this.storeState(state, { platform, redirectUri });

    return client.generateAuthUrl({
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
      state: state,
      access_type: 'offline',
      prompt: 'consent',
    });
  }

  async exchangeCodeForToken(
    platform: string,
    code: string,
    redirectUri: string,
    state: string
  ): Promise<TokenResponse> {
    // Verify state
    const storedState = await this.getStoredState(state);
    if (!storedState || storedState.platform !== platform) {
      throw new Error('Invalid state parameter');
    }

    const client = this.clients.get(platform);
    if (!client) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    try {
      const response = await client.getToken({
        code,
        redirect_uri: redirectUri,
      });

      const tokens = response.tokens;

      // Store tokens securely in Vault
      await this.storeTokens(platform, tokens);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expiry_date
          ? Math.floor((tokens.expiry_date.getTime() - Date.now()) / 1000)
          : undefined,
        scope: tokens.scope,
      };
    } catch (error) {
      throw new Error(`Failed to exchange code for token: ${error.message}`);
    }
  }

  async refreshToken(platform: string, refreshToken: string): Promise<TokenResponse> {
    const client = this.clients.get(platform);
    if (!client) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    try {
      client.setCredentials({
        refresh_token: refreshToken,
      });

      const response = await client.refreshAccessToken();
      const tokens = response.credentials;

      // Store new tokens securely
      await this.storeTokens(platform, tokens);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || refreshToken,
        expires_in: tokens.expiry_date
          ? Math.floor((tokens.expiry_date.getTime() - Date.now()) / 1000)
          : undefined,
      };
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }

  private getScopesForPlatform(platform: string): string[] {
    const scopes = {
      twitter: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
      facebook: ['pages_manage_posts', 'pages_read_engagement', 'offline_access'],
      instagram: ['instagram_basic', 'instagram_content_publish', 'offline_access'],
      linkedin: ['r_member_social', 'w_member_social', 'offline_access'],
    };

    return scopes[platform] || [];
  }

  private generateState(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async storeState(state: string, data: any): Promise<void> {
    // Store state in Redis with 5-minute expiration
    await this.redis.setex(`oauth:state:${state}`, 300, JSON.stringify(data));
  }

  private async getStoredState(state: string): Promise<any> {
    const data = await this.redis.get(`oauth:state:${state}`);
    await this.redis.del(`oauth:state:${state}`); // Use once
    return data ? JSON.parse(data) : null;
  }

  private async storeTokens(platform: string, tokens: any): Promise<void> {
    // Encrypt and store in Vault
    const encrypted = await this.vault.write(
      `secret/oauth/${platform}`,
      {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date?.toISOString(),
        scope: tokens.scope,
      },
      { encrypt: true }
    );
  }
}
```

### 2. Authorization Service

#### Claims-Based Authorization

```typescript
// src/authz/claims-authz.service.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export interface PermissionClaim {
  resource: string;
  actions: string[];
  conditions?: ClaimCondition[];
}

export interface ClaimCondition {
  type: 'time' | 'ip' | 'mfa' | 'custom';
  operator: 'equals' | 'contains' | 'between' | 'matches';
  value: any;
}

@Injectable()
export class ClaimsAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private vaultService: VaultService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredClaims = this.reflector.get<PermissionClaim[]>('claims', context.getHandler());

    if (!requiredClaims || requiredClaims.length === 0) {
      return true; // No claims required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Validate each required claim
    for (const claim of requiredClaims) {
      if (!await this.evaluateClaim(user, claim, request)) {
        return false;
      }
    }

    return true;
  }

  private async evaluateClaim(
    user: JWTPayload,
    claim: PermissionClaim,
    request: any
  ): Promise<boolean> {
    // Check if user has permission for this resource
    const hasPermission = user.permissions.some(p => {
      const [resource, action] = p.split(':');
      return resource === claim.resource && claim.actions.includes(action);
    });

    if (!hasPermission) {
      return false;
    }

    // Check conditions
    if (claim.conditions) {
      for (const condition of claim.conditions) {
        if (!await this.evaluateCondition(condition, user, request)) {
          return false;
        }
      }
    }

    return true;
  }

  private async evaluateCondition(
    condition: ClaimCondition,
    user: JWTPayload,
    request: any
  ): Promise<boolean> {
    switch (condition.type) {
      case 'time':
        return this.evaluateTimeCondition(condition);

      case 'ip':
        return this.evaluateIPCondition(condition, request);

      case 'mfa':
        return this.evaluateMFACondition(condition, user);

      case 'custom':
        return await this.evaluateCustomCondition(condition, user, request);

      default:
        return false;
    }
  }

  private evaluateTimeCondition(condition: ClaimCondition): boolean {
    if (condition.operator === 'between') {
      const now = new Date();
      const currentHour = now.getHours();
      const { start, end } = condition.value;
      return currentHour >= start && currentHour < end;
    }
    return false;
  }

  private evaluateIPCondition(condition: ClaimCondition, request: any): boolean {
    const clientIP = request.ip || request.connection.remoteAddress;

    switch (condition.operator) {
      case 'equals':
        return clientIP === condition.value;

      case 'contains':
        return clientIP.includes(condition.value);

      case 'matches':
        return new RegExp(condition.value).test(clientIP);

      default:
        return false;
    }
  }

  private async evaluateMFACondition(condition: ClaimCondition, user: JWTPayload): Promise<boolean> {
    // Check if user has completed MFA
    const mfaStatus = await this.vaultService.read(`auth/mfa/status/${user.sub}`);
    return mfaStatus?.completed === true;
  }

  private async evaluateCustomCondition(
    condition: ClaimCondition,
    user: JWTPayload,
    request: any
  ): Promise<boolean> {
    // Implement custom condition logic
    // This could include checking user attributes, roles, etc.
    return true;
  }
}

// Decorator for using claims-based authorization
export const RequireClaims = (...claims: PermissionClaim[]) =>
  SetMetadata('claims', claims);

// Usage example
@RequireClaims(
  {
    resource: 'content:publish',
    actions: ['create', 'update'],
    conditions: [
      {
        type: 'time',
        operator: 'between',
        value: { start: 9, end: 17 }
      },
      {
        type: 'mfa',
        operator: 'equals',
        value: true
      }
    ]
  }
)
async publishContent(@Body() content: ContentDTO) {
  // Handler implementation
}
```

### 3. API Security Middleware

```typescript
// src/api-security/api-security.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class APISecurityMiddleware implements NestMiddleware {
  private rateLimiter: RateLimiter;
  private circuitBreaker: CircuitBreaker;
  private validator: RequestValidator;

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate request structure
      await this.validator.validate(req);

      // 2. Check rate limits
      const rateLimitResult = await this.rateLimiter.check(req);
      if (!rateLimitResult.allowed) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter,
        });
      }

      // 3. Validate authentication
      const authResult = await this.validateAuthentication(req);
      if (!authResult.valid) {
        return res.status(401).json({
          error: 'Invalid or expired token',
        });
      }

      // 4. Check authorization
      const authzResult = await this.validateAuthorization(req);
      if (!authzResult.allowed) {
        return res.status(403).json({
          error: 'Insufficient permissions',
        });
      }

      // 5. Check for SQL injection
      const sqlInjectionCheck = this.checkSQLInjection(req);
      if (sqlInjectionCheck.detected) {
        await this.logSecurityEvent('SQL_INJECTION_ATTEMPT', req);
        return res.status(400).json({
          error: 'Invalid request parameters',
        });
      }

      // 6. Check for XSS
      const xssCheck = this.checkXSS(req);
      if (xssCheck.detected) {
        await this.logSecurityEvent('XSS_ATTEMPT', req);
        return res.status(400).json({
          error: 'Invalid request content',
        });
      }

      // 7. Validate request size
      const contentLength = parseInt(req.headers['content-length'] || '0', 10);
      if (contentLength > 10485760) { // 10MB limit
        return res.status(413).json({
          error: 'Request too large',
        });
      }

      next();
    } catch (error) {
      await this.logSecurityEvent('MIDDLEWARE_ERROR', req, error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  private async validateAuthentication(req: Request): Promise<{ valid: boolean }> {
    const token = this.extractToken(req);
    if (!token) {
      return { valid: false };
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      req.user = decoded;
      return { valid: true };
    } catch (error) {
      return { valid: false };
    }
  }

  private async validateAuthorization(req: Request): Promise<{ allowed: boolean }> {
    // Implementation depends on your authorization model
    return { allowed: true };
  }

  private checkSQLInjection(req: Request): { detected: boolean } {
    const sqlPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /(\bor\b|\band\b).*=/i,
      /exec(\s|\+)+(s|x)p\w+/i,
      /union(\s|\+)+(select|all)/i,
    ];

    const checkObject = (obj: any): boolean => {
      for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'string') {
          for (const pattern of sqlPatterns) {
            if (pattern.test(value)) {
              return true;
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          if (checkObject(value)) {
            return true;
          }
        }
      }
      return false;
    };

    return {
      detected: checkObject({ ...req.query, ...req.body, ...req.params }),
    };
  }

  private checkXSS(req: Request): { detected: boolean } {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi, // onclick=, onload=, etc.
      /<iframe[^>]*>/gi,
    ];

    const checkObject = (obj: any): boolean => {
      for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'string') {
          for (const pattern of xssPatterns) {
            if (pattern.test(value)) {
              return true;
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          if (checkObject(value)) {
            return true;
          }
        }
      }
      return false;
    };

    return {
      detected: checkObject({ ...req.query, ...req.body, ...req.params }),
    };
  }

  private async logSecurityEvent(eventType: string, req: Request, error?: any): Promise<void> {
    await this.auditLogger.log({
      event_type: eventType,
      timestamp: new Date(),
      ip: req.ip,
      user_agent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      user_id: req.user?.sub,
      tenant_id: req.user?.tenant_id,
      error: error?.message,
    });
  }

  private extractToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }
}
```

---

## Integration Guides

### 1. SEO Tool Integration Security

#### Ahrefs Integration

```typescript
// src/integrations/seo/ahrefs.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { VaultService } from '../vault/vault.service';

@Injectable()
export class AhrefsService {
  private readonly baseURL = 'https://apiv2.ahrefs.com';
  private readonly rateLimit = 60; // requests per minute

  constructor(
    private httpService: HttpService,
    private vaultService: VaultService,
  ) {}

  private async getCredentials(): Promise<{ apiKey: string }> {
    // Retrieve from Vault
    const credentials = await this.vaultService.read('secret/integrations/ahrefs');
    return credentials;
  }

  async getBacklinks(target: string, mode: string = 'domain'): Promise<any> {
    const { apiKey } = await this.getCredentials();

    try {
      const response = await this.httpService
        .get(`${this.baseURL}/backlinks`, {
          params: {
            target,
            mode,
            from: 'backlinks_page_metrics',
            output: 'json',
          },
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded for Ahrefs API');
      }
      throw error;
    }
  }

  async rotateAPIKey(): Promise<void> {
    // Generate new API key
    const newKey = await this.generateNewAPIKey();

    // Store in Vault with versioning
    await this.vaultService.write('secret/integrations/ahrefs', {
      apiKey: newKey,
      rotatedAt: new Date().toISOString(),
    });

    // Notify monitoring
    await this.notifyKeyRotation('ahrefs');
  }
}
```

#### Semrush Integration

```typescript
// src/integrations/seo/semrush.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SemrushService {
  private readonly baseURL = 'https://api.semrush.com';
  private readonly rateLimit = 120; // requests per minute

  constructor(
    private httpService: HttpService,
    private vaultService: VaultService,
    private redis: Redis,
  ) {}

  async checkRateLimit(tenantId: string): Promise<boolean> {
    const key = `ratelimit:semrush:${tenantId}`;
    const current = await this.redis.incr(key);

    if (current === 1) {
      await this.redis.expire(key, 60); // 1 minute window
    }

    return current <= this.rateLimit;
  }

  async getKeywords(domain: string): Promise<any> {
    // Check rate limit first
    const tenantId = 'current_tenant'; // Get from context
    const canProceed = await this.checkRateLimit(tenantId);

    if (!canProceed) {
      throw new Error('Semrush API rate limit exceeded');
    }

    const credentials = await this.vaultService.read('secret/integrations/semrush');
    const apiKey = credentials.apiKey;

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseURL}/analytics`, {
          params: {
            type: 'domain_ranks',
            domain,
            key: apiKey,
          },
        })
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Attempt to refresh token
        await this.refreshOAuthToken();
      }
      throw error;
    }
  }

  private async refreshOAuthToken(): Promise<void> {
    const credentials = await this.vaultService.read('secret/integrations/semrush');
    const refreshToken = credentials.refreshToken;

    // Exchange refresh token for new access token
    const newCredentials = await this.exchangeRefreshToken(refreshToken);

    // Store new credentials
    await this.vaultService.write('secret/integrations/semrush', newCredentials);
  }
}
```

### 2. Social Media Platform Integration

#### Twitter/X Integration

```typescript
// src/integrations/social/twitter.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TwitterService {
  private readonly baseURL = 'https://api.twitter.com/2';

  constructor(
    private httpService: HttpService,
    private oauthService: OAuthService,
    private vaultService: VaultService,
  ) {}

  async publishTweet(content: string, mediaIds?: string[]): Promise<any> {
    const credentials = await this.getCredentials();

    try {
      const response = await this.httpService
        .post(`${this.baseURL}/tweets`, {
          text: content,
          media: mediaIds ? { media_ids: mediaIds } : undefined,
        }, {
          headers: {
            'Authorization': `Bearer ${credentials.access_token}`,
          },
        })
        .toPromise();

      // Audit log
      await this.auditLogger.log({
        action: 'TWEET_PUBLISHED',
        platform: 'twitter',
        tweetId: response.data.data.id,
        content: content.substring(0, 100),
        timestamp: new Date(),
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired, attempt refresh
        await this.oauthService.refreshToken('twitter', credentials.refresh_token);
        // Retry with new token
        return this.publishTweet(content, mediaIds);
      }
      throw error;
    }
  }

  async getAnalytics(tweetId: string): Promise<any> {
    const credentials = await this.getCredentials();

    const response = await this.httpService
      .get(`${this.baseURL}/tweets/${tweetId}/metrics`, {
        headers: {
          'Authorization': `Bearer ${credentials.access_token}`,
        },
        params: {
          'tweet.fields': 'public_metrics,created_at',
        },
      })
      .toPromise();

    return response.data;
  }

  private async getCredentials(): Promise<any> {
    return await this.vaultService.read('secret/oauth/twitter');
  }
}
```

---

## Testing & Validation

### Security Testing Suite

```typescript
// test/security/security.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from '../src/security/security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityService],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
  });

  describe('Authentication', () => {
    it('should reject invalid JWT tokens', async () => {
      const result = await service.validateToken('invalid.token.here');
      expect(result.valid).toBe(false);
    });

    it('should reject expired tokens', async () => {
      const expiredToken = generateExpiredToken();
      const result = await service.validateToken(expiredToken);
      expect(result.valid).toBe(false);
    });

    it('should accept valid tokens', async () => {
      const validToken = generateValidToken();
      const result = await service.validateToken(validToken);
      expect(result.valid).toBe(true);
    });
  });

  describe('Authorization', () => {
    it('should reject unauthorized access', async () => {
      const user = { sub: 'user123', permissions: ['content:read'] };
      const result = await service.checkPermission(user, 'content:publish');
      expect(result.allowed).toBe(false);
    });

    it('should allow authorized access', async () => {
      const user = { sub: 'user123', permissions: ['content:publish'] };
      const result = await service.checkPermission(user, 'content:publish');
      expect(result.allowed).toBe(true);
    });
  });

  describe('Input Validation', () => {
    it('should detect SQL injection attempts', async () => {
      const maliciousInput = "'; DROP TABLE users; --";
      const result = service.validateInput(maliciousInput);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('SQL injection');
    });

    it('should detect XSS attempts', async () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      const result = service.validateInput(maliciousInput);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('XSS');
    });

    it('should accept valid input', async () => {
      const validInput = 'Hello, world!';
      const result = service.validateInput(validInput);
      expect(result.valid).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const userId = 'user123';
      const endpoint = '/api/content/publish';

      // Make requests up to the limit
      for (let i = 0; i < 10; i++) {
        const result = await service.checkRateLimit(userId, endpoint);
        expect(result.allowed).toBe(true);
      }

      // Next request should be rate limited
      const result = await service.checkRateLimit(userId, endpoint);
      expect(result.allowed).toBe(false);
    });

    it('should reset rate limit after window expires', async () => {
      const userId = 'user123';
      const endpoint = '/api/content/publish';

      // Make requests up to the limit
      for (let i = 0; i < 10; i++) {
        await service.checkRateLimit(userId, endpoint);
      }

      // Wait for rate limit window to expire
      await sleep(61000); // 61 seconds

      // Should be allowed again
      const result = await service.checkRateLimit(userId, endpoint);
      expect(result.allowed).toBe(true);
    });
  });
});

// Integration tests
describe('Security Integration Tests', () => {
  it('should complete full OAuth flow', async () => {
    // Start OAuth flow
    const authUrl = await authService.getAuthorizationUrl('twitter');
    expect(authUrl).toContain('twitter.com');

    // Simulate callback
    const callbackCode = 'simulated_callback_code';
    const tokens = await authService.exchangeCodeForToken('twitter', callbackCode);

    expect(tokens.access_token).toBeDefined();
    expect(tokens.refresh_token).toBeDefined();
  });

  it('should handle token refresh', async () => {
    const refreshToken = 'existing_refresh_token';
    const newTokens = await authService.refreshToken('twitter', refreshToken);

    expect(newTokens.access_token).toBeDefined();
    expect(newTokens.refresh_token).toBeDefined();
  });
});
```

---

## Deployment Checklist

### Pre-Deployment

```bash
# Run security scans
npm run security:scan

# Run all tests
npm test

# Run linting
npm run lint

# Check for vulnerabilities
npm audit

# Build application
npm run build

# Generate deployment package
npm run package
```

### Deployment Steps

```bash
# 1. Update infrastructure
terraform apply -var-file=environments/production.tfvars

# 2. Deploy application
kubectl apply -f k8s/production/

# 3. Run database migrations
npm run migrations:up

# 4. Seed security configuration
npm run security:seed

# 5. Verify deployment
npm run health:check

# 6. Run smoke tests
npm run test:smoke

# 7. Enable monitoring
npm run monitoring:enable
```

### Post-Deployment Verification

```bash
# 1. Check health endpoints
curl https://api.example.com/health

# 2. Verify authentication
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"password"}'

# 3. Check rate limiting
for i in {1..20}; do
  curl https://api.example.com/api/test
done

# 4. Verify audit logging
curl https://api.example.com/admin/audit-log \
  -H "Authorization: Bearer <token>"

# 5. Test circuit breakers
# Disable external service and verify fallback
```

---

## Troubleshooting Guide

### Common Issues

#### 1. JWT Token Issues

```bash
# Check token expiration
echo "<your_token>" | jq -R 'split(".") | .[1] | @base64d | fromjson | .exp'

# Verify token signature
# Use JWT.io or jwt-cli to decode and verify

# Check revocation list
redis-cli GET "revoked_tokens:<token_id>"
```

#### 2. Rate Limiting Issues

```bash
# Check current rate limit status
redis-cli GET "ratelimit:user123:/api/content/publish"

# Clear rate limit (emergency only)
redis-cli DEL "ratelimit:user123:/api/content/publish"

# Check rate limit configuration
kubectl get configmap rate-limit-config -o yaml
```

#### 3. OAuth Token Issues

```bash
# Check token expiration
vault kv get -field=expires_at secret/oauth/twitter

# Refresh token manually
npm run oauth:refresh -- --platform=twitter

# Check token scopes
vault kv get -field=scopes secret/oauth/twitter
```

---

## Conclusion

This implementation guide provides step-by-step instructions for deploying the security architecture. Follow the checklist and verify each component before moving to production.

For additional support or questions, contact the security team at security@swarm-agency.com.
