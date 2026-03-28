# Master SOP Template: [Automation Name]

**SOP ID:** SOP-[XXX]
**Version:** 1.0
**Last Updated:** [Date]
**Owner:** [Name/Role]
**Review Date:** [Date + 6 months]

---

## 📋 PURPOSE

**What this automation does:**
[Clear, 1-2 sentence description of the automation's primary function]

**Business Impact:**
- Saves approximately [X] hours per [week/month]
- Eliminates errors in [specific process]
- Enables [business outcome] without manual intervention

**Success Metrics:**
- [Metric 1]: [Target value] (e.g., "95% reduction in manual data entry")
- [Metric 2]: [Target value] (e.g., "Response time < 2 minutes")
- [Metric 3]: [Target value] (e.g., "Zero missed deadlines")

---

## 🎯 SCOPE

**In Scope:**
- [Specific process/task covered]
- [Departments/roles affected]
- [Systems/tools integrated]

**Out of Scope:**
- [What this automation does NOT handle]
- [Manual interventions still required]
- [Edge cases requiring human review]

---

## 🛠️ PREREQUISITES

### Required Tools & Accounts
- [Tool 1]: [Account/Access needed]
- [Tool 2]: [Account/Access needed]
- [Tool 3]: [Account/Access needed]

### Technical Requirements
- [Requirement 1]: [Details]
- [Requirement 2]: [Details]

### Permissions Needed
- [System 1]: [Specific permissions]
- [System 2]: [Specific permissions]

### Before You Begin
- [ ] Checklist item 1
- [ ] Checklist item 2
- [ ] Checklist item 3

---

## 🔄 WORKFLOW OVERVIEW

**Visual Description:**

```
[Trigger] → [Step 1] → [Step 2] → [Step 3] → [Output]
     ↓           ↓           ↓           ↓           ↓
   [Event]    [Action]   [Decision]  [Action]    [Result]
```

**Process Flow:**
1. **Trigger:** [What starts this automation]
2. **Input Processing:** [How data is received/validated]
3. **Core Action:** [Main automated task]
4. **Output Generation:** [What is produced/sent]
5. **Notification:** [Who gets alerted and how]

**Integration Points:**
- Connects to: [System 1], [System 2], [System 3]
- Data flows from: [Source] → [Destination]
- Dependencies: [What this automation relies on]

---

## 📝 STEP-BY-STEP INSTRUCTIONS

### Step 1: [Step Name]
**Purpose:** [Why this step exists]

**Actions:**
1. [First action with specific details]
2. [Second action]
3. [Third action]

**Expected Result:**
[What success looks like]

**Time Estimate:** [X minutes]

**Notes/Pro Tips:**
💡 [Best practices or common pitfalls]

---

### Step 2: [Step Name]
**Purpose:** [Why this step exists]

**Actions:**
1. [First action]
2. [Second action]

**Decision Point:**
```
IF [condition]
  THEN [action A]
  ELSE [action B]
```

**Expected Result:**
[What success looks like]

**Time Estimate:** [X minutes]

---

### Step 3: [Step Name]
[Continue pattern for remaining steps]

---

## 🔧 CONFIGURATION

### Settings & Parameters
| Parameter | Value | Description |
|-----------|-------|-------------|
| [Param 1] | [Value] | [What it controls] |
| [Param 2] | [Value] | [What it controls] |
| [Param 3] | [Value] | [What it controls] |

### Customization Options
- **Option 1:** [How to customize]
- **Option 2:** [How to customize]

### Environment-Specific Settings
- **Development:** [Settings]
- **Staging:** [Settings]
- **Production:** [Settings]

---

## 🧪 TESTING PROCEDURES

### Pre-Deployment Checklist
- [ ] Unit test completed: [Test name]
- [ ] Integration test passed: [Test name]
- [ ] User acceptance test approved by: [Name]
- [ ] Performance benchmark met: [Metric]
- [ ] Security review completed: [Date]

### Test Scenarios
**Scenario 1: Normal Operation**
1. **Input:** [Test data]
2. **Expected Output:** [Result]
3. **Actual Output:** [Result]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 2: Edge Case [Name]**
1. **Input:** [Test data]
2. **Expected Output:** [Result]
3. **Actual Output:** [Result]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 3: Error Handling**
1. **Input:** [Intentional error]
2. **Expected Behavior:** [Error handling action]
3. **Actual Behavior:** [What happened]
4. **Status:** ✅ Pass / ❌ Fail

### Rollback Testing
- [ ] Rollback procedure tested: [Date]
- [ ] Data integrity verified post-rollback
- [ ] Recovery time: [X minutes]

---

## 🚨 ERROR HANDLING

### Common Errors & Solutions

| Error | Cause | Solution | Prevention |
|-------|-------|----------|------------|
| [Error 1] | [Root cause] | [Fix steps] | [How to avoid] |
| [Error 2] | [Root cause] | [Fix steps] | [How to avoid] |
| [Error 3] | [Root cause] | [Fix steps] | [How to avoid] |

### Emergency Contacts
- **Primary:** [Name] - [Role] - [Contact]
- **Secondary:** [Name] - [Role] - [Contact]
- **Escalation:** [Name] - [Role] - [Contact]

### Failure Mode Analysis
**What happens when:**
- [System] goes down: [Impact + mitigation]
- [API] fails: [Impact + mitigation]
- [Data] is corrupted: [Impact + mitigation]
- [External service] changes: [Impact + mitigation]

---

## 📊 MONITORING & MAINTENANCE

### Key Metrics to Track
| Metric | Target | Alert Threshold | Frequency |
|--------|--------|-----------------|-----------|
| [Metric 1] | [Value] | [Alert level] | [Check freq] |
| [Metric 2] | [Value] | [Alert level] | [Check freq] |
| [Metric 3] | [Value] | [Alert level] | [Check freq] |

### Daily Maintenance Tasks
- [ ] [Task 1]: [Time required]
- [ ] [Task 2]: [Time required]

### Weekly Maintenance Tasks
- [ ] [Task 1]: [Time required]
- [ ] [Task 2]: [Time required]
- [ ] Review error logs for patterns
- [ ] Verify data backups

### Monthly Maintenance Tasks
- [ ] [Task 1]: [Time required]
- [ ] [Task 2]: [Time required]
- [ ] Performance audit
- [ ] Security review
- [ ] Documentation update

### Maintenance Log
| Date | Task | Performed By | Notes |
|------|------|--------------|-------|
| [Date] | [Task] | [Name] | [Notes] |
| [Date] | [Task] | [Name] | [Notes] |

---

## 🔄 ROLLBACK PROCEDURE

**When to Rollback:**
- [Condition 1]
- [Condition 2]
- [Condition 3]

**Rollback Steps:**
1. **Immediate Action:** [First step (e.g., "Disable automation in [tool]")]
2. **Notify:** [Who to alert and how]
3. **Restore:** [How to restore previous state]
4. **Verify:** [How to confirm rollback succeeded]
5. **Document:** [Where to record the incident]

**Rollback Time Estimate:** [X minutes]

**Post-Rollback Actions:**
- [ ] Investigate root cause
- [ ] Fix underlying issue
- [ ] Re-test thoroughly
- [ ] Update this SOP with lessons learned

---

## 📚 REFERENCE MATERIALS

### Related SOPs
- [SOP Name](link): [Relationship]
- [SOP Name](link): [Relationship]

### External Documentation
- [Resource 1](URL): [What it covers]
- [Resource 2](URL): [What it covers]

### Training Resources
- [Training material 1]: [Location/link]
- [Video tutorial]: [Location/link]

---

## 📝 CHANGE LOG

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [Date] | Initial version | [Name] |
| 1.1 | [Date] | [Change description] | [Name] |
| 1.2 | [Date] | [Change description] | [Name] |

---

## 💬 FEEDBACK & IMPROVEMENTS

**Got ideas to improve this automation?**
1. Document your suggestion
2. Test in development environment
3. Submit for review
4. Update this SOP after approval

**Continuous Improvement:**
- Last optimization: [Date]
- Next scheduled review: [Date]
- Optimization backlog: [Link to tracking system]

---

## ✅ APPENDIX: EXAMPLE OUTPUTS

### Example 1: [Scenario]
**Input:**
```
[Sample input data]
```

**Output:**
```
[Sample output data]
```

### Example 2: [Scenario]
**Input:**
```
[Sample input data]
```

**Output:**
```
[Sample output data]
```

---

## 🎓 NOTES FOR NEW USERS

**Critical Success Factors:**
1. [Most important thing to know]
2. [Second most important thing]
3. [Third most important thing]

**Common Mistakes to Avoid:**
- ❌ [Mistake 1]
- ❌ [Mistake 2]
- ❌ [Mistake 3]

**Best Practices:**
- ✅ [Practice 1]
- ✅ [Practice 2]
- ✅ [Practice 3]

**Remember:** "Systems before willpower. Automate the boring, keep the human."
