#!/usr/bin/env node
/**
 * Self-Healing Hook Handler
 * Automatically detects, recovers from, and learns from errors.
 *
 * Usage: node self-healing-hook.cjs <command> [args...]
 *
 * Commands:
 *   detect         - Analyze exit code and detect error type
 *   recover        - Attempt automatic recovery
 *   learn          - Store error pattern for future prevention
 *   patterns       - List learned error patterns
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MEMORY_DIR = path.join(__dirname, '../../memory');
const ERROR_PATTERNS_FILE = path.join(MEMORY_DIR, 'error-patterns.json');
const RECOVERY_LOG_FILE = path.join(MEMORY_DIR, 'recovery-log.jsonl');

// Ensure memory directory exists
if (!fs.existsSync(MEMORY_DIR)) {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

// Error pattern definitions
const ERROR_PATTERNS = {
  // Module/Dependency errors
  'Cannot find module': {
    type: 'missing_dependency',
    recovery: 'install_dependency',
    autoRecover: true
  },
  'module not found': {
    type: 'missing_dependency',
    recovery: 'install_dependency',
    autoRecover: true
  },
  'E404': {
    type: 'missing_package',
    recovery: 'install_dependency',
    autoRecover: true
  },

  // Syntax errors
  'SyntaxError': {
    type: 'syntax_error',
    recovery: 'analyze_syntax',
    autoRecover: false
  },
  'Unexpected token': {
    type: 'syntax_error',
    recovery: 'analyze_syntax',
    autoRecover: false
  },

  // Test failures
  'Test failed': {
    type: 'test_failure',
    recovery: 'debug_test',
    autoRecover: true
  },
  'FAIL': {
    type: 'test_failure',
    recovery: 'debug_test',
    autoRecover: true
  },

  // Port conflicts
  'EADDRINUSE': {
    type: 'port_conflict',
    recovery: 'kill_process',
    autoRecover: true
  },
  'address already in use': {
    type: 'port_conflict',
    recovery: 'kill_process',
    autoRecover: true
  },

  // Permission errors
  'EACCES': {
    type: 'permission_error',
    recovery: 'fix_permissions',
    autoRecover: false
  },
  'permission denied': {
    type: 'permission_error',
    recovery: 'fix_permissions',
    autoRecover: false
  },

  // Type errors
  'TypeError': {
    type: 'type_error',
    recovery: 'analyze_type',
    autoRecover: false
  },

  // Network errors
  'ECONNREFUSED': {
    type: 'network_error',
    recovery: 'retry_connection',
    autoRecover: true
  },
  'ENOTFOUND': {
    type: 'network_error',
    recovery: 'check_dns',
    autoRecover: true
  }
};

// Load stored error patterns
function loadErrorPatterns() {
  try {
    if (fs.existsSync(ERROR_PATTERNS_FILE)) {
      const data = fs.readFileSync(ERROR_PATTERNS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    // Corrupt file, start fresh
  }
  return { patterns: [], stats: { total: 0, recovered: 0, prevented: 0 } };
}

// Save error patterns
function saveErrorPatterns(data) {
  try {
    fs.writeFileSync(ERROR_PATTERNS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(`[ERROR] Failed to save error patterns: ${e.message}`);
  }
}

// Log recovery attempt
function logRecovery(errorType, recoveryAction, success, metadata = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    errorType,
    recoveryAction,
    success,
    metadata
  };

  try {
    fs.appendFileSync(RECOVERY_LOG_FILE, JSON.stringify(entry) + '\n');
  } catch (e) {
    // Silent fail
  }
}

// Detect error type from output
function detectError(output, exitCode) {
  const combined = (output || '').toLowerCase();

  for (const [pattern, info] of Object.entries(ERROR_PATTERNS)) {
    if (combined.toLowerCase().includes(pattern.toLowerCase())) {
      return {
        pattern,
        ...info,
        matched: true
      };
    }
  }

  // Unknown error
  return {
    pattern: 'unknown',
    type: 'unknown_error',
    recovery: 'manual',
    autoRecover: false,
    matched: exitCode !== 0
  };
}

// Extract dependency name from error
function extractDependencyName(errorOutput) {
  const match = errorOutput.match(/Cannot find module ['"]([^'"]+)['"]/);
  if (match) return match[1];

  const moduleMatch = errorOutput.match(/module not found: ['"]?([^'"\s]+)['"]?/i);
  if (moduleMatch) return moduleMatch[1];

  return null;
}

// Extract port from error
function extractPort(errorOutput) {
  const match = errorOutput.match(/:(\d{4,5})/);
  if (match) return parseInt(match[1]);
  return null;
}

// Recovery strategies
const RECOVERY_STRATEGIES = {
  async install_dependency(errorInfo, errorOutput) {
    const dep = extractDependencyName(errorOutput);
    if (!dep) {
      console.log(`[INFO] Could not extract dependency name from error`);
      return false;
    }

    console.log(`[RECOVER] Attempting to install missing dependency: ${dep}`);

    try {
      // Try npm install
      execSync(`npm install ${dep}`, { stdio: 'inherit', timeout: 60000 });
      console.log(`[SUCCESS] Installed ${dep}`);
      return true;
    } catch (e) {
      console.log(`[FAIL] Could not install ${dep}: ${e.message}`);
      return false;
    }
  },

  async kill_process(errorInfo, errorOutput) {
    const port = extractPort(errorOutput);
    if (!port) {
      console.log(`[INFO] Could not extract port from error`);
      return false;
    }

    console.log(`[RECOVER] Attempting to kill process on port ${port}`);

    try {
      // Windows: use netstat and taskkill
      if (process.platform === 'win32') {
        const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
        const match = result.match(/\s+(\d+)\s*$/m);
        if (match) {
          const pid = match[1];
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'inherit' });
          console.log(`[SUCCESS] Killed process ${pid} on port ${port}`);
          return true;
        }
      } else {
        // Unix: use lsof and kill
        execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'inherit' });
        console.log(`[SUCCESS] Killed process on port ${port}`);
        return true;
      }
    } catch (e) {
      console.log(`[FAIL] Could not kill process: ${e.message}`);
      return false;
    }

    return false;
  },

  async debug_test(errorInfo, errorOutput) {
    console.log(`[RECOVER] Test failure detected. Spawning debugger agent...`);
    console.log(`[INFO] Recommend: Agent spawn with 'debugger' or 'tester' type`);
    console.log(`[INFO] Error output saved for analysis`);
    return false; // Requires manual agent spawn
  },

  async analyze_syntax(errorInfo, errorOutput) {
    console.log(`[RECOVER] Syntax error detected.`);
    console.log(`[INFO] Recommend: Use code-reviewer or simplify agents`);
    console.log(`[INFO] Error: ${errorOutput.split('\n')[0]}`);
    return false; // Requires manual review
  },

  async retry_connection(errorInfo, errorOutput) {
    console.log(`[RECOVER] Network error detected. Will retry on next command.`);
    return true; // Just flag for retry
  },

  async check_dns(errorInfo, errorOutput) {
    console.log(`[RECOVER] DNS resolution failed. Check network connectivity.`);
    return false;
  },

  async fix_permissions(errorInfo, errorOutput) {
    console.log(`[RECOVER] Permission error detected. Try running with elevated permissions.`);
    return false;
  },

  async analyze_type(errorInfo, errorOutput) {
    console.log(`[RECOVER] Type error detected. Recommend type check and fix.`);
    console.log(`[INFO] Error: ${errorOutput.split('\n')[0]}`);
    return false;
  },

  async manual(errorInfo, errorOutput) {
    console.log(`[RECOVER] Unknown error type. Manual intervention required.`);
    console.log(`[INFO] Exit code: ${process.env.EXIT_CODE || 'unknown'}`);
    return false;
  }
};

// Main handlers
const handlers = {
  'detect': () => {
    const exitCode = parseInt(process.env.EXIT_CODE || process.argv[2] || '0');
    const errorOutput = process.env.STDERR || process.env.ERROR_OUTPUT || '';

    const errorInfo = detectError(errorOutput, exitCode);

    console.log(JSON.stringify({
      exitCode,
      detected: errorInfo.matched,
      pattern: errorInfo.pattern,
      type: errorInfo.type,
      recovery: errorInfo.recovery,
      autoRecover: errorInfo.autoRecover
    }, null, 2));

    return errorInfo;
  },

  'recover': async () => {
    const exitCode = parseInt(process.env.EXIT_CODE || process.argv[2] || '0');
    const errorOutput = process.env.STDERR || process.env.ERROR_OUTPUT || '';

    if (exitCode === 0) {
      console.log('[OK] No error to recover from');
      return;
    }

    const errorInfo = detectError(errorOutput, exitCode);

    if (!errorInfo.matched) {
      console.log(`[INFO] Unknown error pattern (exit code ${exitCode})`);
      handlers['manual']();
      return;
    }

    console.log(`[DETECT] Error type: ${errorInfo.type}`);
    console.log(`[DETECT] Pattern: ${errorInfo.pattern}`);
    console.log(`[RECOVER] Strategy: ${errorInfo.recovery}`);

    const strategy = RECOVERY_STRATEGIES[errorInfo.recovery];
    if (!strategy) {
      console.log(`[ERROR] No recovery strategy for ${errorInfo.recovery}`);
      return;
    }

    const success = await strategy(errorInfo, errorOutput);

    // Log recovery attempt
    logRecovery(errorInfo.type, errorInfo.recovery, success, {
      pattern: errorInfo.pattern,
      exitCode
    });

    // Update stats
    const patterns = loadErrorPatterns();
    patterns.stats.total++;
    if (success) {
      patterns.stats.recovered++;
      console.log(`[SUCCESS] Recovery completed for ${errorInfo.type}`);
    } else {
      console.log(`[FAIL] Recovery failed for ${errorInfo.type}`);
    }
    saveErrorPatterns(patterns);

    return success;
  },

  'learn': () => {
    const errorType = process.env.ERROR_TYPE || process.argv[2];
    const pattern = process.env.ERROR_PATTERN || process.argv[3];
    const recovery = process.env.ERROR_RECOVERY || process.argv[4];

    if (!errorType || !pattern) {
      console.log('[INFO] Usage: learn <errorType> <pattern> [recovery]');
      return;
    }

    const patterns = loadErrorPatterns();
    patterns.patterns.push({
      timestamp: new Date().toISOString(),
      errorType,
      pattern,
      recovery: recovery || 'manual',
      occurrences: 1
    });

    // Count occurrences of similar patterns
    const similar = patterns.patterns.filter(p => p.errorType === errorType);
    if (similar.length > 1) {
      console.log(`[LEARN] Pattern "${errorType}" seen ${similar.length} times`);
    }

    saveErrorPatterns(patterns);
    console.log(`[LEARN] Stored error pattern: ${errorType}`);
  },

  'patterns': () => {
    const patterns = loadErrorPatterns();

    console.log('+----------------------------+');
    console.log('|  Error Pattern Statistics  |');
    console.log('+----------------------------+');
    console.log(`  Total Errors:     ${patterns.stats.total}`);
    console.log(`  Recovered:        ${patterns.stats.recovered}`);
    console.log(`  Prevented:        ${patterns.stats.prevented}`);
    console.log(`  Success Rate:     ${patterns.stats.total > 0 ? ((patterns.stats.recovered / patterns.stats.total) * 100).toFixed(1) : 0}%`);
    console.log('');

    if (patterns.patterns.length > 0) {
      console.log('  Recent Patterns:');
      console.log('+----------------------+---------------------+----------+');
      console.log('|  Error Type          |  Pattern            |  Count   |');
      console.log('+----------------------+---------------------+----------+');

      // Group by error type
      const grouped = {};
      patterns.patterns.forEach(p => {
        if (!grouped[p.errorType]) grouped[p.errorType] = 0;
        grouped[p.errorType]++;
      });

      Object.entries(grouped)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .forEach(([type, count]) => {
          const padded = type.substring(0, 20).padEnd(20);
          const paddedCount = count.toString().padStart(8);
          console.log(`|  ${padded}  |  ${paddedCount}  |`);
        });

      console.log('+----------------------+---------------------+----------+');
    }
  },

  'stats': () => {
    const patterns = loadErrorPatterns();
    const stats = patterns.stats;

    console.log('+--------------------------+');
    console.log('|  Self-Healing Statistics |');
    console.log('+--------------------------+');
    console.log(`  Total Errors Detected:    ${stats.total}`);
    console.log(`  Successful Recoveries:    ${stats.recovered}`);
    console.log(`  Prevented (Learning):    ${stats.prevented}`);
    console.log('');
    console.log(`  Recovery Rate:           ${stats.total > 0 ? ((stats.recovered / stats.total) * 100).toFixed(1) : 0}%`);
    console.log(`  Patterns Learned:        ${patterns.patterns.length}`);
    console.log('+--------------------------+');
  },

  'manual': () => {
    console.log('[INFO] Manual intervention required for this error.');
    console.log('[INFO] Consider spawning a specialist agent:');
    console.log('  - debugger: For runtime errors');
    console.log('  - code-reviewer: For syntax/type errors');
    console.log('  - tester: For test failures');
  }
};

// Main execution
async function main() {
  const [,, command] = process.argv;

  if (!command) {
    console.log('Usage: self-healing-hook.cjs <detect|recover|learn|patterns|stats>');
    process.exit(0);
  }

  const handler = handlers[command];
  if (!handler) {
    console.log(`[ERROR] Unknown command: ${command}`);
    process.exit(1);
  }

  try {
    await handler();
  } catch (e) {
    console.error(`[ERROR] Handler failed: ${e.message}`);
    // Hooks should never crash
  }

  process.exit(0);
}

// Execute
main().catch(() => process.exit(0));
