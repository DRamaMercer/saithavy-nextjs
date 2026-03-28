---
title: "AI Systems Weekly Audit Checklist"
description: "Keep AI workflows accurate and safe"
category: "ai-automation"
slug: "ai-systems-weekly-audit-checklist"
type: "Checklist"
difficulty: "Intermediate"
timeToRead: "15 min"
targetAudience: "AI Implementers"
featured: false
isPremium: false
downloads: 10300
fileSize: "650 KB PDF"
---

# AI Systems Weekly Audit Checklist

## Keep Your AI Workflows Accurate, Safe, and Cost-Effective

---

## Introduction

AI systems degrade over time. Prompts that worked yesterday may underperform today. Costs can creep up unnoticed. The **AI Systems Weekly Audit Checklist** helps you maintain healthy, efficient, and reliable AI automations.

**What this checklist covers:**
- Performance monitoring for AI outputs
- Cost tracking and optimization
- Accuracy and quality verification
- Security and compliance checks
- Maintenance triggers and alerts

**Time investment:** 30-60 minutes per week

**Result:** AI systems that stay reliable, accurate, and cost-effective.

---

## Part 1: The Weekly Audit Framework

### Audit Categories

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WEEKLY AUDIT FRAMEWORK                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │ PERFORMANCE │  │   QUALITY   │  │    COST     │  │  SECURITY   ││
│  │             │  │             │  │             │  │             ││
│  │ • Speed     │  │ • Accuracy  │  │ • Usage     │  │ • Access    ││
│  │ • Uptime    │  │ • Relevance │  │ • Spend     │  │ • Data      ││
│  │ • Errors    │  │ • Tone      │  │ • ROI       │  │ • Compliance││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    ACTION TRACKING                           │   │
│  │  • Issues found        • Fixes applied        • Results     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Part 2: Pre-Audit Preparation

### Gather Your Data

Before starting the audit, collect:

- [ ] **AI Platform Dashboards**
  - [ ] OpenAI/ChatGPT usage dashboard
  - [ ] Claude usage dashboard
  - [ ] Other AI tool dashboards
  - [ ] Automation platform logs (Zapier, Make, etc.)

- [ ] **Output Samples**
  - [ ] Recent AI-generated content samples
  - [ ] Customer/feedback on AI outputs
  - [ ] Error logs or failure reports

- [ ] **Cost Data**
  - [ ] Current month's AI spend to date
  - [ ] Previous month's total spend
  - [ ] Budget or spend targets

- [ ] **System Inventory**
  - [ ] List of all active AI automations
  - [ ] List of AI prompts in use
  - [ ] List of integrations依赖 on AI

---

## Part 3: The Weekly Audit Checklist

### Section A: Performance Audit

```
┌─────────────────────────────────────────────────────────────────────┐
│  A. PERFORMANCE AUDIT                                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ AUTOMATION HEALTH                                                   │
│                                                                     │
│ 1. Review all active AI automations:                                │
│                                                                     │
│    Automation Name         | Status | Runs/Week | Errors          │
│    ┌───────────────────────────────────────────────────────────┐   │
│    │ [Name 1]          │  OK   │    ___    │  [ ] None/[ ] Yes │   │
│    │ [Name 2]          │  OK   │    ___    │  [ ] None/[ ] Yes │   │
│    │ [Name 3]          │  OK   │    ___    │  [ ] None/[ ] Yes │   │
│    │ [Name 4]          │  OK   │    ___    │  [ ] None/[ ] Yes │   │
│    └───────────────────────────────────────────────────────────┘   │
│                                                                     │
│ 2. Check for failed runs:                                          │
│    [ ] No failed runs this week                                    │
│    [ ] Failed runs identified - investigate                        │
│    [ ] Patterns in failures (noted below)                          │
│                                                                     │
│    Failure patterns: ___________________________________________   │
│                                                                     │
│ 3. Response time monitoring:                                       │
│    [ ] Response times normal (< ___ seconds target)               │
│    [ ] Response times degraded - investigate                       │
│    [ ] Intermittent slowdowns noted                                │
│                                                                     │
│    Average response time: ______ seconds (target: ______)          │
│                                                                     │
│ 4. API/Integration status:                                         │
│    [ ] All AI services operational                                 │
│    [ ] Some services degraded/noted                                │
│                                                                     │
│    Service status:                                                 │
│    • OpenAI/ChatGPT: [ ] Operational  [ ] Issues                   │
│    • Claude/Anthropic: [ ] Operational  [ ] Issues                 │
│    • Other: _________________: [ ] Operational  [ ] Issues         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Section B: Quality Audit

```
┌─────────────────────────────────────────────────────────────────────┐
│  B. QUALITY AUDIT                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ OUTPUT QUALITY REVIEW                                               │
│                                                                     │
│ For each AI system, review a sample of this week's outputs:        │
│                                                                     │
│ 1. Accuracy Check                                                   │
│    [ ] Facts are correct                                           │
│    [ ] No hallucinations detected                                  │
│    [ ] Data引用 are accurate                                       │
│    [ ] Calculations are correct                                    │
│                                                                     │
│    Issues found: _______ (None / Minor / Major)                    │
│                                                                     │
│ 2. Relevance Check                                                 │
│    [ ] Outputs address the prompt                                  │
│    [ ] Content is aligned with intent                              │
│    [ ] No irrelevant tangents                                      │
│    [ ] Appropriate depth for request                               │
│                                                                     │
│    Issues found: _______ (None / Minor / Major)                    │
│                                                                     │
│ 3. Tone & Voice Check                                              │
│    [ ] Brand voice consistent                                      │
│    [ ] Appropriate for audience                                    │
│    [ ] No offensive or problematic content                         │
│    [ ] Language style consistent                                   │
│                                                                     │
│    Issues found: _______ (None / Minor / Major)                    │
│                                                                     │
│ 4. Format Check                                                    │
│    [ ] Output follows expected format                              │
│    [ ] Structure is sound                                          │
│    [ ] No broken or incomplete sections                            │
│    [ ] Rendering correctly in application                          │
│                                                                     │
│    Issues found: _______ (None / Minor / Major)                    │
│                                                                     │
│                                                                     │
│ SAMPLE AUDIT LOG (Test 5-10 outputs per system)                    │
│                                                                     │
│ System: ______________________  Date: _________________              │
│                                                                     │
│  Output ID        | Accuracy | Relevance | Tone | Format | Pass/Fail│
│  ┌───────────────────────────────────────────────────────────────┐│
│  │ [Sample 1]    │     ✓    │     ✓     │   ✓  │    ✓   │    PASS ││
│  │ [Sample 2]    │     ✗    │     ✓     │   ✓  │    ✓   │    FAIL ││
│  │ [Sample 3]    │     ✓    │     ✓     │   ✓  │    ✓   │    PASS ││
│  │ [Sample 4]    │     ✓    │     ✗     │   ✓  │    ✓   │    FAIL ││
│  │ [Sample 5]    │     ✓    │     ✓     │   ✓  │    ✓   │    PASS ││
│  └───────────────────────────────────────────────────────────────┘│
│                                                                     │
│  Pass Rate: _____% (Target: 95%+)                                  │
│                                                                     │
│  Quality Issues Summary:                                           │
│  ___________________________________________________________________│
│  ___________________________________________________________________│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Section C: Cost Audit

```
┌─────────────────────────────────────────────────────────────────────┐
│  C. COST AUDIT                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ SPEND TRACKING                                                      │
│                                                                     │
│ 1. Current Period Spend                                            │
│                                                                     │
│    Platform/Service    | This Week | This Month | Budget/Target   │
│    ┌───────────────────────────────────────────────────────────┐   │
│    │ OpenAI/ChatGPT     │   $____   │   $____   │    $____      │   │
│    │ Claude            │   $____   │   $____   │    $____      │   │
│    │ [Tool 3]          │   $____   │   $____   │    $____      │   │
│    │ [Tool 4]          │   $____   │   $____   │    $____      │   │
│    │ TOTAL             │   $____   │   $____   │    $____      │   │
│    └───────────────────────────────────────────────────────────┘   │
│                                                                     │
│ 2. Usage Analysis                                                  │
│                                                                     │
│    Service            | Usage | Cost/Unit | Total | vs Last Week   │
│    ┌───────────────────────────────────────────────────────────┐   │
│    │ [Service 1]        │  ____  │   $___   │ $___ │ [ ] Same   │   │
│    │                                        │ [ ] Up ____%   │   │
│    │                                        │ [ ] Down ____% │   │
│    │ [Service 2]        │  ____  │   $___   │ $___ │ [ ] Same   │   │
│    │                                        │ [ ] Up ____%   │   │
│    │                                        │ [ ] Down ____% │   │
│    └───────────────────────────────────────────────────────────┘   │
│                                                                     │
│ 3. Cost Per Output Analysis                                       │
│                                                                     │
│    Use Case           | Outputs | Cost | Cost/Output | Trend     │
│    ┌───────────────────────────────────────────────────────────┐   │
│    │ [Use Case 1]       │   ___   │ $___ │    $___    │ [ ] OK  │   │
│    │ [Use Case 2]       │   ___   │ $___ │    $___    │ [ ] OK  │   │
│    │ [Use Case 3]       │   ___   │ $___ │    $___    │ [ ] OK  │   │
│    └───────────────────────────────────────────────────────────┘   │
│                                                                     │
│ 4. Cost Optimization Opportunities                                 │
│    [ ] Identify unused or low-value AI use                        │
│    [ ] Check for more cost-effective alternatives                 │
│    [ ] Review token usage efficiency                              │
│    [ ] Consider caching for repeated requests                     │
│                                                                     │
│    Opportunities found:                                           │
│    ___________________________________________________________________│
│    ___________________________________________________________________│
│                                                                     │
│ 5. ROI Assessment                                                  │
│                                                                     │
│    Use Case           | Value Generated | Cost | ROI             │
│    ┌───────────────────────────────────────────────────────────┐   │
│    │ [Use Case 1]       │    $_____      │ $___ │  _____%        │   │
│    │ [Use Case 2]       │    $_____      │ $___ │  _____%        │   │
│    │ [Use Case 3]       │    $_____      │ $___ │  _____%        │   │
│    └───────────────────────────────────────────────────────────┘   │
│                                                                     │
│    Low ROI use cases to review:                                   │
│    ___________________________________________________________________│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Section D: Security & Compliance Audit

```
┌─────────────────────────────────────────────────────────────────────┐
│  D. SECURITY & COMPLIANCE AUDIT                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ DATA PRIVACY                                                        │
│                                                                     │
│ 1. Data Handling Review                                            │
│    [ ] No sensitive data in prompts (reviewed samples)             │
│    [ ] PII properly handled                                        │
│    [ ] Data retention policies followed                            │
│    [ ] No unintended data exposure                                  │
│                                                                     │
│    Issues found: _______________________________________________   │
│                                                                     │
│ 2. Access Control                                                  │
│    [ ] API keys properly secured (not in code)                     │
│    [ ] Access revoked for former team members                      │
│    [ ] Role-based access appropriate                               │
│    [ ] No shared credentials                                       │
│                                                                     │
│    Issues found: _______________________________________________   │
│                                                                     │
│ 3. Compliance Check                                                │
│    [ ] GDPR compliance maintained (if applicable)                  │
│    [ ] Data processing agreements current                          │
│    [ ] Consent tracking working                                    │
│    [ ] Right to deletion functional                                │
│                                                                     │
│    Issues found: _______________________________________________   │
│                                                                     │
│                                                                     │
│ CONTENT SAFETY                                                      │
│                                                                     │
│ 4. Output Safety Review                                            │
│    [ ] No harmful content generated                                │
│    [ ] No biased content detected                                  │
│    [ ] No copyright violations                                     │
│    [ ] Appropriate content filters in place                        │
│                                                                     │
│    Issues found: _______________________________________________   │
│                                                                     │
│ 5. Brand Safety                                                    │
│    [ ] Outputs align with brand values                             │
│    [ ] No controversial statements                                 │
│    [ ] Professional language maintained                            │
│    [ ] No misrepresentation of capabilities                        │
│                                                                     │
│    Issues found: _______________________________________________   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Section E: Prompt & Configuration Audit

```
┌─────────────────────────────────────────────────────────────────────┐
│  E. PROMPT & CONFIGURATION AUDIT                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ PROMPT PERFORMANCE                                                  │
│                                                                     │
│ 1. Prompt Effectiveness Review                                     │
│                                                                     │
│    Prompt/System      | Use Case     | Quality | Cost | Action     │
│    ┌───────────────────────────────────────────────────────────┐   │
│    │ [Prompt 1]         │ [Case]      │   ___   │ $___ │ [ ] OK  │   │
│    │ [Prompt 2]         │ [Case]      │   ___   │ $___ │ [ ] OK  │   │
│    │ [Prompt 3]         │ [Case]      │   ___   │ $___ │ [ ] OK  │   │
│    └───────────────────────────────────────────────────────────┘   │
│                                                                     │
│ 2. Prompt Optimization Needs                                       │
│    [ ] Prompts needing refinement identified                       │
│    [ ] New prompts to test documented                             │
│    [ ] A/B tests in progress                                      │
│    [ ] Model changes to consider                                  │
│                                                                     │
│    Optimization opportunities:                                     │
│    ___________________________________________________________________│
│                                                                     │
│ 3. Model Selection Review                                          │
│    [ ] Current model appropriate for use case                      │
│    [ ] Cheaper model could work for some tasks                     │
│    [ ] Newer model offers significant improvement                  │
│    [ ] Multi-model strategy makes sense                            │
│                                                                     │
│    Changes recommended:                                           │
│    ___________________________________________________________________│
│                                                                     │
│ 4. Configuration Drift Check                                       │
│    [ ] Settings unchanged from baseline                            │
│    [ ] No unauthorized changes detected                            │
│    [ ] Configuration documentation current                         │
│    [ ] Change log updated                                          │
│                                                                     │
│    Drift detected: _____________________________________________   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Section F: Action Tracking

```
┌─────────────────────────────────────────────────────────────────────┐
│  F. ACTION TRACKING                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ISSUES IDENTIFIED THIS WEEK                                         │
│                                                                     │
│  ID | Category     | Issue                  | Severity | Owner     │
│  ┌───────────────────────────────────────────────────────────────┐│
│  │ 1  │ [Performance│                      │ [ ] Low  │          ││
│  │    │  Quality    │                      │ [ ] Med  │ ________  ││
│  │    │  Cost       │                      │ [ ] High │          ││
│  │    │  Security   │                      │          │          ││
│  ├─────┼────────────┼──────────────────────┼──────────┼──────────┤│
│  │ 2  │ [_______]   │                      │ [ ] Low  │          ││
│  │    │             │                      │ [ ] Med  │ ________  ││
│  │    │             │                      │ [ ] High │          ││
│  ├─────┼────────────┼──────────────────────┼──────────┼──────────┤│
│  │ 3  │ [_______]   │                      │ [ ] Low  │          ││
│  │    │             │                      │ [ ] Med  │ ________  ││
│  │    │             │                      │ [ ] High │          ││
│  └─────┴────────────┴──────────────────────┴──────────┴──────────┘│
│                                                                     │
│                                                                     │
│ ACTIONS TAKEN THIS WEEK                                            │
│                                                                     │
│  ID | Action                        | Result     | Date       │
│  ┌───────────────────────────────────────────────────────────────┐│
│  │ 1  │                              │ [ ] Fixed │ __/__/__  ││
│  │    │                              │ [ ] Failed│            ││
│  │    │                              │ [ ] Ongoing│           ││
│  ├─────┼──────────────────────────────┼───────────┼────────────┤│
│  │ 2  │                              │ [ ] Fixed │ __/__/__  ││
│  │    │                              │ [ ] Failed│            ││
│  │    │                              │ [ ] Ongoing│           ││
│  ├─────┼──────────────────────────────┼───────────┼────────────┤│
│  │ 3  │                              │ [ ] Fixed │ __/__/__  ││
│  │    │                              │ [ ] Failed│            ││
│  │    │                              │ [ ] Ongoing│           ││
│  └─────┴──────────────────────────────┴───────────┴────────────┘│
│                                                                     │
│                                                                     │
│ PENDING ACTIONS                                                     │
│                                                                     │
│  ID | Action                        | Priority   | Due Date    │
│  ┌───────────────────────────────────────────────────────────────┐│
│  │    │                              │ [ ] Low   │            ││
│  │    │                              │ [ ] Med   │ __/__/__  ││
│  │    │                              │ [ ] High  │            ││
│  ├─────┼──────────────────────────────┼───────────┼────────────┤│
│  │    │                              │ [ ] Low   │            ││
│  │    │                              │ [ ] Med   │ __/__/__  ││
│  │    │                              │ [ ] High  │            ││
│  └─────┴──────────────────────────────┴───────────┴────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Part 4: Monthly Deep Dive

### Extended Audit (Monthly)

Some checks need less frequent but deeper review:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MONTHLY DEEP DIVE CHECKLIST                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ PERFORMANCE                                                         │
│ [ ] Compare uptime vs. previous month                              │
│ [ ] Analyze error patterns for trends                              │
│ [ ] Review automation dependencies                                 │
│ [ ] Assess scaling needs                                           │
│                                                                     │
│ QUALITY                                                             │
│ [ ] Conduct detailed output quality analysis (100+ samples)        │
│ [ ] Survey users on AI output satisfaction                         │
│ [ ] Review and update quality benchmarks                           │
│ [ ] Document best performing prompts                               │
│                                                                     │
│ COST                                                                │
│ [ ] Full cost-benefit analysis per use case                        │
│ [ ] Compare AI vs. human cost for each task                        │
│ [ ] Evaluate new pricing/models from vendors                       │
│ [ ] Update ROI calculations                                        │
│                                                                     │
│ STRATEGY                                                            │
│ [ ] Review AI tool landscape for new options                       │
│ [ ] Assess competitive AI capabilities                             │
│ [ ] Evaluate new use case opportunities                            │
│ [ ] Update AI strategy and roadmap                                 │
│                                                                     │
│ TEAM                                                                │
│ [ ] Review team AI literacy and skills                             │
│ [ ] Identify training needs                                        │
│ [ ] Share learnings and best practices                             │
│ [ ] Update documentation                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Part 5: Issue Severity Matrix

### How to Prioritize Issues

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ISSUE SEVERITY MATRIX                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SEVERITY     | IMPACT                   | RESPONSE TIME           │
│  ─────────────────────────────────────────────────────────────────│
│  CRITICAL     | Complete system failure,    | Immediate             │
│               | security breach, major      │ (within 1 hour)       │
│               | data exposure                                       │
│                                                                     │
│  HIGH         | Significant degradation,    | Same day              │
│               | accuracy issues affecting   │ (within 4 hours)      │
│               | business outcomes                                  │
│                                                                     │
│  MEDIUM       | Noticeable issues,          | This week             │
│               | minor accuracy problems,    │ (within 5 days)       │
│               | cost overages < 20%                                │
│                                                                     │
│  LOW          | Minor optimization         | Next scheduled audit   │
│               | opportunities, small       │ or when convenient     │
│               | inefficiencies                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Examples by Severity

**CRITICAL:**
- AI system completely down
- Data breach or PII exposure
- Malicious content generated at scale
- Cost spike > 300% of expected

**HIGH:**
- Accuracy drops below 80%
- Frequent timeout failures
- Unauthorized access detected
- Cost spike > 100% of expected

**MEDIUM:**
- Accuracy drops below 90%
- Occasional timeout failures
- Brand voice inconsistency
- Cost 20-50% above expected

**LOW:**
- Minor wording improvements needed
- Cost 10-20% above expected
- Newer model available but not urgent
- Documentation updates needed

---

## Part 6: Audit Summary Template

### Weekly Audit Report

```
┌─────────────────────────────────────────────────────────────────────┐
│                      WEEKLY AUDIT SUMMARY                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Week of: _________________________                                 │
│  Auditor: _________________________                                 │
│  Systems audited: ___________________                               │
│                                                                     │
│                                                                     │
│  OVERALL STATUS: [ ] HEALTHY  [ ] ISSUES FOUND  [ ] ACTION NEEDED  │
│                                                                     │
│                                                                     │
│  KEY METRICS:                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Total automations reviewed:     ____________                 │   │
│  │ Automations with issues:        ____________                 │   │
│  │ Total outputs reviewed:         ____________                 │   │
│  │ Outputs passing quality check:  ____________                 │   │
│  │ Total AI spend this week:       $__________                  │   │
│  │ Spend vs. budget:               [ ] Under  [ ] Over          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                                                                     │
│  ISSUES SUMMARY:                                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Critical: _______  High: _______  Medium: _______  Low: _____│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                                                                     │
│  TOP ISSUES (Top 3 by severity):                                   │
│  1. ___________________________________________________________   │
│     Status: [ ] Open  [ ] In Progress  [ ] Resolved              │
│                                                                     │
│  2. ___________________________________________________________   │
│     Status: [ ] Open  [ ] In Progress  [ ] Resolved              │
│                                                                     │
│  3. ___________________________________________________________   │
│     Status: [ ] Open  [ ] In Progress  [ ] Resolved              │
│                                                                     │
│                                                                     │
│  WINS THIS WEEK:                                                   │
│  • ___________________________________________________________   │
│  • ___________________________________________________________   │
│  • ___________________________________________________________   │
│                                                                     │
│                                                                     │
│  NEXT WEEK'S FOCUS:                                                │
│  • ___________________________________________________________   │
│  • ___________________________________________________________   │
│                                                                     │
│                                                                     │
│  NOTES/OBSERVATIONS:                                               │
│  ___________________________________________________________________│
│  ___________________________________________________________________│
│  ___________________________________________________________________│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Signature: _________________________  Date: _________________
```

---

## Part 7: Automation Triggers

### Set Up Automated Monitoring Alerts

```
ALERT CONFIGURATION CHECKLIST

Performance Alerts:
[ ] Set up alert for automation failures
[ ] Set up alert for increased error rate (> 5%)
[ ] Set up alert for response time degradation
[ ] Set up alert for API service outages

Quality Alerts:
[ ] Set up alert for negative feedback on AI outputs
[ ] Set up alert for accuracy complaints
[ ] Set up alert for brand safety issues

Cost Alerts:
[ ] Set up alert for daily spend threshold
[ ] Set up alert for unusual usage spikes
[ ] Set up alert for approaching budget limits

Security Alerts:
[ ] Set up alert for failed authentication attempts
[ ] Set up alert for data access anomalies
[ ] Set up alert for compliance violations
```

---

## Part 8: Quick Reference

### Weekly Audit Checklist (One-Page Summary)

```
WEEKLY AI AUDIT - ONE PAGE SUMMARY

Week of: _________________    Auditor: ___________________

PERFORMANCE
[ ] All automations running
[ ] Error rate acceptable (< 5%)
[ ] Response times normal
[ ] No service outages

QUALITY
[ ] Output samples reviewed (5+ per system)
[ ] Accuracy verified (95%+ target)
[ ] Brand voice consistent
[ ] No safety issues detected

COST
[ ] Spend tracked: $_________ (budget: $_________)
[ ] No unusual spikes
[ ] Cost per output stable
[ ] ROI positive for all active use cases

SECURITY
[ ] No sensitive data in prompts
[ ] Access controls appropriate
[ ] Compliance maintained
[ ] No safety violations

ACTIONS
Issues found: _______ (Critical: ____  High: ____  Med: ____  Low: ____)
[ ] All critical issues addressed
[ ] High-priority items scheduled
[ ] Documentation updated

OVERALL STATUS: [ ] HEALTHY  [ ] ISSUES  [ ] ACTION NEEDED
```

---

**Version:** 1.0
**Last Updated:** March 2026

---

*"AI systems need care and feeding. Weekly audits catch small issues before they become big problems."*
