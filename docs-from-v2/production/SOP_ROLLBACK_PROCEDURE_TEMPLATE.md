# Rollback Procedure Template

**Purpose:** Document the exact steps to revert an automation if critical issues occur

**Automation Name:** ________________________________________________

**SOP ID:** SOP-XXX

**Last Updated:** ________________________________________________

---

## 🚨 Rollback Triggers

### Immediate Rollback Required (Stop Automation Now)
- [ ] Data corruption or integrity issues detected
- [ ] Security breach or compromise confirmed
- [ ] Financial impact exceeding $[amount]
- [ ] Customer-facing impact affecting > [X]% of users
- [ ] Compliance or legal risk identified
- [ ] Critical system dependencies failing

### Evaluate Within 1 Hour
- [ ] Error rate > [X]% for sustained period
- [ ] Performance degradation > [X]%
- [ ] Feature not working as designed
- [ ] Unexpected side effects observed

### Monitor Closely
- [ ] Minor bugs or edge cases
- [ ] Performance below target but acceptable
- [ ] Non-critical user complaints

---

## ⚡ Immediate Rollback Steps

**Time to Execute:** _______ minutes

### Step 1: Disable Automation
**Estimated Time:** [X] minutes

**Action:** Turn off automation in [platform/tool]

**Detailed Steps:**
1. Log into [platform] at [URL]
2. Navigate to [Automation Name]
3. Click [Off/Disable/Pause] button
4. Confirm disable when prompted
5. Verify status shows "Disabled/Stopped"

**Verification:**
- [ ] Automation status shows "Disabled"
- [ ] No new triggers being processed
- [ ] Dashboard shows "Stopped" status

**Screenshot of Disabled Status:** (Attach or paste below)

---

### Step 2: Notify Stakeholders
**Estimated Time:** [X] minutes

**Communication Channels:**
- [ ] Slack: #[channel-name]
- [ ] Email: [distribution-list]
- [ ] SMS/Phone: [on-call-person]

**Message Template:**
```
🚨 ROLLBACK ALERT: [Automation Name]

Status: Automation has been disabled as of [Time]
Reason: [Brief reason - e.g., Data integrity issue detected]
Impact: [What this means for operations]
Next Steps: [What happens next]
Contact: [Person to contact for questions]

Update will be provided in [X] hours.
```

**Verification:**
- [ ] Slack message sent to #[channel]
- [ ] Email sent to [list]
- [ ] Key stakeholders confirmed receipt

---

### Step 3: Assess Current State
**Estimated Time:** [X] minutes

**Assessment Checklist:**
- [ ] Last successful run: [Date/Time]
- [ ] Data affected: [What data/timeline]
- [ ] Users affected: [Who is impacted]
- [ ] Business impact: [Revenue, operations, customer experience]
- [ ] Root cause hypothesis: [What went wrong]

**Data Assessment:**
- [ ] Total records processed: [Number]
- [ ] Records with errors: [Number]
- [ ] Data backup available: ☐ Yes ☐ No
- [ ] Data corruption extent: [Description]

**Impact Assessment:**
| Area | Impact Level | Details |
|------|--------------|---------|
| Operations | ☐ Low ☐ Medium ☐ High | |
| Customers | ☐ Low ☐ Medium ☐ High | |
| Revenue | ☐ Low ☐ Medium ☐ High | |
| Compliance | ☐ Low ☐ Medium ☐ High | |

---

### Step 4: Restore Manual Process
**Estimated Time:** [X] minutes/hours per day

**Manual Process Steps:**
1. [Step 1 of manual process]
2. [Step 2 of manual process]
3. [Step 3 of manual process]

**Tools Needed:**
- [ ] [Tool 1]
- [ ] [Tool 2]
- [ ] [Tool 3]

**Responsibilities:**
| Task | Owner | Time Required | Frequency |
|------|-------|---------------|-----------|
| [Task 1] | [Name] | [X min/day] | [Daily/etc] |
| [Task 2] | [Name] | [X min/day] | [Daily/etc] |

**Training Needed:**
- [ ] Team trained on manual process: ☐ Yes ☐ No
- [ ] Documentation available: ☐ Yes ☐ No
- [ ] Support runbook created: ☐ Yes ☐ No

---

### Step 5: Data Recovery (If Needed)
**Estimated Time:** [X] hours

**Data Recovery Options:**
- [ ] Restore from backup: [Location/Method]
- [ ] Manual data correction: [Process]
- [ ] Re-process from source: [Method]
- [ ] Accept partial data loss: [Details]

**Recovery Steps:**
1. [Step 1 of recovery process]
2. [Step 2 of recovery process]
3. [Step 3 of recovery process]

**Data Verification:**
- [ ] Spot check [X]% of records
- [ ] Verify totals match expected values
- [ ] Confirm no duplicates or corruption
- [ ] Stakeholder review and sign-off

**Recovery Completed By:** _______________ **Date:** _______________

---

## 🔍 Root Cause Investigation

### Investigation Process
**Timeline:** [X] hours

**Investigation Team:**
| Role | Name | Contact |
|------|------|---------|
| Lead Investigator | | |
| Technical Owner | | |
| Business Stakeholder | | |
| Security Review (if needed) | | |

**Investigation Steps:**
1. [ ] Review error logs and timestamps
2. [ ] Interview team members involved
3. [ ] Analyze data before/after issue
4. [ ] Test hypothesis in development environment
5. [ ] Document root cause

**Root Cause Analysis Template:**
- **What happened:** ________________________________________________
- **When did it happen:** ________________________________________________
- **How was it detected:** ________________________________________________
- **Why did it happen:** ________________________________________________
- **What systems/processes were involved:** ________________________________________________
- **Could this have been prevented:** ☐ Yes ☐ No
  - If yes, how: ________________________________________________

**Root Cause:** _________________________________________________________________________
_________________________________________________________________________________

**Contributing Factors:**
1. ___________________________________________________________________
2. ___________________________________________________________________

---

## 🛠️ Fix & Re-Deploy Process

### Fix Development
**Timeline:** [X] hours/days

**Fix Options:**
- [ ] Quick fix (temporary workaround)
- [ ] Permanent fix (address root cause)
- [ ] Redesign (fundamental change)

**Fix Development Steps:**
1. [ ] Document fix requirements
2. [ ] Develop fix in development environment
3. [ ] Unit test fix thoroughly
4. [ ] Integration test with related systems
5. [ ] Security review (if applicable)
6. [ ] Performance test fix
7. [ ] Document fix and update SOP

**Testing Checklist:**
- [ ] Unit tests passed
- [ ] Integration tests passed
- [ ] Edge cases tested
- [ ] Error handling tested
- [ ] Performance meets benchmarks
- [ ] Security approved
- [ ] Stakeholder sign-off obtained

**Fix Approved By:** _______________ **Date:** _______________

---

### Re-Deployment Plan
**Target Date:** _______________

**Deployment Steps:**
1. [ ] Communicate deployment to stakeholders
2. [ ] Schedule deployment during low-impact window
3. [ ] Deploy fix to production
4. [ ] Monitor for [X] hours
5. [ ] Verify data accuracy
6. [ ] Confirm all systems functioning

**Gradual Rollout Plan:**
- [ ] Phase 1: [X]% of traffic/volume - Date: ___________
- [ ] Phase 2: [X]% of traffic/volume - Date: ___________
- [ ] Phase 3: 100% of traffic/volume - Date: ___________

**Monitoring During Rollout:**
| Metric | Target | Alert Threshold | Frequency |
|--------|--------|-----------------|-----------|
| [Metric 1] | [Value] | [Value] | [Check freq] |
| [Metric 2] | [Value] | [Value] | [Check freq] |
| [Metric 3] | [Value] | [Value] | [Check freq] |

**Rollback if Issue Recurs:**
- If same issue occurs during rollout: ☐ Stop rollout ☐ Complete rollback
- If new issue occurs: ☐ Continue ☐ Rollback ☐ Investigate live

---

## 📊 Post-Incident Review

### Incident Report

**Incident ID:** INC-___

**Dates:**
- Incident Occurred: _______________
- Rollback Initiated: _______________
- Rollback Completed: _______________
- Fix Deployed: _______________
- Service Restored: _______________

**Impact Summary:**
- **Downtime Duration:** _______ hours/minutes
- **Users Affected:** _______ (___% of total)
- **Data Loss:** ☐ None ☐ Partial (_______ records) ☐ Complete
- **Financial Impact:** $_______ (estimated)
- **Customer Impact:** ☐ Low ☐ Medium ☐ High

**Timeline of Events:**
| Time | Event | Action Taken |
|------|-------|--------------|
| [Time] | [Event] | [Action] |
| [Time] | [Event] | [Action] |
| [Time] | [Event] | [Action] |

**Root Cause:** _________________________________________________________________________

**Fix Applied:** _________________________________________________________________________

**Prevention Measures:**
1. ___________________________________________________________________
2. ___________________________________________________________________

**Lessons Learned:**
1. ___________________________________________________________________
2. ___________________________________________________________________

---

### Process Improvements

**SOP Updates Needed:**
- [ ] Update rollback procedure based on lessons learned
- [ ] Add new monitoring/alerts
- [ ] Improve testing procedures
- [ ] Update documentation

**System Improvements:**
- [ ] Add additional error handling
- [ ] Improve data validation
- [ ] Enhance monitoring/alerts
- [ ] Implement circuit breakers

**Team Improvements:**
- [ ] Additional training needed: ☐ Yes ☐ No
- [ ] Runbook updates: ☐ Yes ☐ No
- [ ] On-call procedures: ☐ Yes ☐ No

**Improvements Implemented By:** _______________ **Date:** _______________

---

## 📞 Emergency Contacts

| Role | Name | Primary Contact | Backup Contact | Timezone |
|------|------|-----------------|-----------------|----------|
| Automation Owner | | | | |
| Technical Lead | | | | |
| Business Stakeholder | | | | |
| On-Call Engineer | | | | |
| Escalation Manager | | | | |
| Communications Lead | | | | |

**On-Call Rotation:** [Describe rotation schedule]

---

## 📋 Rollback Decision Tree

```
                           [Issue Detected]
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
          [Critical?]                         [Non-Critical]
                │                                   │
           ┌────┴────┐                        [Assess Impact]
           │         │                              │
        [Yes]      [No]                    ┌─────────┴─────────┐
           │         │                    │                   │
    [ROLLBACK   [Monitor Closely]    [High Impact?]    [Low Impact]
      NOW]           │                        │                   │
         │            │                   ┌────┴────┐         [Monitor
         │         [Re-evaluate          │         │        & Document]
         │         in 1 hour]        [Yes]      [No]
         │              │              │           │
         │              └──────────────┴───┐    [Document
         │                                 │      & Monitor]
         │                          [ROLLBACK
         │                         WITHIN 1 HOUR]
         │
    [Follow Full
    Rollback
    Procedure]
```

---

## 📚 Supporting Documentation

**Related Documents:**
- [ ] Master SOP (SOP-XXX)
- [ ] Testing Checklist (SOP-XXX-TC)
- [ ] Maintenance Log (SOP-XXX-ML)
- [ ] Incident Report Template (INC-XXX)

**External Resources:**
- [ ] Platform documentation: [URL]
- [ ] API documentation: [URL]
- [ ] Vendor support: [Contact]

---

## ✅ Rollback Completion Checklist

### Immediate Actions (First 30 Minutes)
- [ ] Automation disabled
- [ ] Stakeholders notified
- [ ] Current state assessed
- [ ] Manual process initiated
- [ ] Incident logged

### Short-Term Actions (Within 4 Hours)
- [ ] Root cause investigation started
- [ ] Impact assessment completed
- [ ] Data recovery initiated (if needed)
- [ ] Fix development started
- [ ] Stakeholders updated on status

### Medium-Term Actions (Within 24 Hours)
- [ ] Root cause identified
- [ ] Fix developed and tested
- [ ] Fix deployed to production
- [ ] Service fully restored
- [ ] Post-incident review scheduled

### Long-Term Actions (Within 1 Week)
- [ ] Post-incident review completed
- [ ] SOP updated with lessons learned
- [ ] Process improvements implemented
- [ ] Team training conducted
- [ ] Incident report archived

---

## 📝 Rollback Log

| Rollback # | Date/Time | Trigger | Impact | Resolution | Duration | Notes |
|------------|-----------|---------|--------|------------|----------|-------|
| RB-001 | [Date] | [Trigger] | [Impact] | [Resolution] | [Duration] | |
| RB-002 | [Date] | [Trigger] | [Impact] | [Resolution] | [Duration] | |
| RB-003 | [Date] | [Trigger] | [Impact] | [Resolution] | [Duration] | |

---

**Remember:** A well-documented rollback procedure reduces stress and downtime during incidents. Test rollback procedures regularly!
