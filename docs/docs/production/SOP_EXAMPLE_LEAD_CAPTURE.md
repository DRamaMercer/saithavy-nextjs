# SOP: Lead Capture Automation

**SOP ID:** SOP-001
**Version:** 1.0
**Last Updated:** March 13, 2026
**Owner:** Marketing Operations Manager
**Review Date:** September 13, 2026

---

## 📋 PURPOSE

**What this automation does:**
Automatically captures, validates, qualifies, and routes incoming leads from multiple sources (website forms, landing pages, social media) to the appropriate sales team member with immediate notification and CRM entry.

**Business Impact:**
- Saves approximately 12 hours per week in manual data entry
- Eliminates 95% of lead routing errors
- Enables 5-minute average response time (vs. 4+ hours manual)
- Prevents lost leads from delayed follow-up

**Success Metrics:**
- Lead response time: < 5 minutes (target: 95% of leads)
- Data accuracy: 99%+ (automated validation)
- Routing accuracy: 100% (territory-based rules)
- Zero lost leads (all captured in CRM)

---

## 🎯 SCOPE

**In Scope:**
- All lead sources: website forms, landing pages, social media ads, email inquiries
- Lead qualification: demographic scoring, territory assignment
- CRM integration: Salesforce entry, duplicate detection
- Sales notification: email alerts, Slack notifications, task creation
- Lead nurturing: automated email sequences for unqualified leads

**Out of Scope:**
- Lead outreach/follow-up (handled by sales team)
- Lead scoring adjustments (quarterly review by marketing)
- Custom integrations beyond standard tools
- Manual lead imports (separate SOP)

---

## 🛠️ PREREQUISITES

### Required Tools & Accounts
- **Zapier** or **Make (Integromat)**: Automation platform (Pro plan minimum)
- **Salesforce**: CRM with Enterprise edition or higher
- **Typeform** or **Google Forms**: Lead capture forms
- **Slack**: Team notifications (Business plan or higher)
- **Google Sheets**: Backup storage

### Technical Requirements
- API access for Salesforce, Typeform, Slack
- Webhook configuration for form submissions
- Email server access for notification routing
- Data validation rules defined in Salesforce

### Permissions Needed
- **Salesforce**: API access, Lead creation/read/write permissions
- **Zapier/Make**: Account admin access
- **Slack**: Channel webhook creation permissions
- **Forms**: Form editing and webhook setup

### Before You Begin
- [ ] Salesforce lead fields are configured and validated
- [ ] Sales territory assignments are documented
- [ ] Lead qualification criteria are defined
- [ ] Slack notification channels are created
- [ ] Backup Google Sheet is set up

---

## 🔄 WORKFLOW OVERVIEW

**Visual Description:**

```
[Form Submission] → [Validation] → [Qualification] → [Territory Check] → [CRM Entry] → [Notification]
        ↓                ↓               ↓                  ↓                ↓              ↓
    [Webhook]        [Email/Phone]   [Score 1-100]    [Zip Code/State]   [Salesforce]   [Slack + Email]
```

**Process Flow:**
1. **Trigger:** Lead submits form (website, landing page, social)
2. **Input Processing:** Validate email format, phone number, required fields
3. **Qualification:** Score lead based on budget, timeline, company size
4. **Territory Assignment:** Assign to sales rep based on geography/industry
5. **CRM Entry:** Create lead in Salesforce, check for duplicates
6. **Notification:** Alert assigned rep via Slack and email

**Integration Points:**
- Connects to: Typeform, Salesforce, Slack, Gmail/Outlook
- Data flows from: Forms → Zapier/Make → Salesforce → Slack
- Dependencies: Salesforce territory management, email validation API

---

## 📝 STEP-BY-STEP INSTRUCTIONS

### Step 1: Configure Lead Capture Forms
**Purpose:** Set up standardized forms with proper field mapping

**Actions:**
1. Create form in Typeform/Google Forms with required fields:
   - First Name, Last Name, Email (required)
   - Phone Number, Company Name (required)
   - Industry, Company Size (dropdowns)
   - Budget range, Timeline (dropdowns)
   - State/Region, Zip Code (required for territory)
   - Lead Source (hidden field, auto-populated)

2. Enable webhook integration:
   - In Typeform: Connect → Webhooks → Add webhook
   - Copy webhook URL (will be generated in Zapier/Make)
   - Test webhook submission

3. Set up form-specific hidden fields:
   - utm_source, utm_medium, utm_campaign (for tracking)
   - form_id (identifies which form captured lead)

**Expected Result:**
Functional form that sends webhook on submission with all required fields

**Time Estimate:** 30 minutes per form

**Notes/Pro Tips:**
💡 Use Typeform's "Hidden Fields" feature to automatically capture UTM parameters for campaign tracking
💡 Set up separate forms for different campaigns to track conversion rates by source

---

### Step 2: Create Automation in Zapier/Make
**Purpose:** Build the lead processing workflow

**Actions:**
1. Create new zap/scenario with webhook trigger:
   - Trigger: "Webhooks by Zapier" or "Webhooks" in Make
   - Event: "Catch Hook"
   - Copy webhook URL and paste into Typeform form settings

2. Add validation step:
   - Action: "Filter" in Zapier or "Filter" module in Make
   - Set rules:
     - Email must contain "@"
     - Phone must have 10+ digits
     - Required fields not empty
   - If validation fails: Send alert to marketing team

3. Add lead qualification step:
   - Action: "Code by Zapier" or "JavaScript" in Make
   - Create scoring logic:
     ```
     score = 0
     if budget_range >= "$10,000+": score += 30
     if timeline <= "1-3 months": score += 25
     if company_size >= "50-249 employees": score += 20
     if industry in ["Technology", "Finance", "Healthcare"]: score += 15
     if lead_source == "Referral": score += 10
     ```
   - Set qualified threshold: score >= 60

4. Add territory assignment:
   - Action: "Lookup Table" or "Switch" module
   - Map territory based on state/region:
     - West: CA, OR, WA, NV, AZ → Rep: Sarah (sarah@company.com)
     - Midwest: IL, MI, OH, WI, MN → Rep: Mike (mike@company.com)
     - East: NY, MA, PA, NJ, CT → Rep: Jennifer (jennifer@company.com)
     - South: TX, FL, GA, NC, TN → Rep: David (david@company.com)

**Expected Result:**
Automation that validates, scores, and assigns territory for each lead

**Time Estimate:** 2 hours

**Decision Point:**
```
IF lead_score >= 60 AND email_valid
  THEN create Salesforce lead as "Qualified"
  AND notify assigned rep immediately
ELSE
  THEN create Salesforce lead as "Unqualified"
  AND add to nurturing email sequence
```

---

### Step 3: Configure Salesforce Integration
**Purpose:** Automatically create and update lead records

**Actions:**
1. Add Salesforce "Create Lead" action:
   - Map form fields to Salesforce lead fields:
     - First Name → FirstName
     - Last Name → LastName
     - Email → Email (match on email to prevent duplicates)
     - Phone → Phone
     - Company → Company
     - Industry → Industry
     - Lead Source → LeadSource
   - Set additional fields:
     - Status = "New"
     - Lead Rating = score from qualification step
     - Owner ID = assigned rep (from territory mapping)

2. Add duplicate check:
   - Before creating, search for existing lead with same email
   - If found: Update existing lead instead of creating new one
   - Log update in "Last Activity" field

3. Set up auto-assignment:
   - Use Salesforce territory management rules
   - Or manually assign Owner ID based on territory mapping
   - Ensure assigned rep has proper permissions

4. Add error handling:
   - If Salesforce API fails: Send alert to admin
   - If field validation fails: Log to Google Sheet backup
   - Retry logic: 3 attempts with 5-minute intervals

**Expected Result:**
Leads automatically created in Salesforce with correct owner and no duplicates

**Time Estimate:** 1.5 hours

**Notes/Pro Tips:**
💡 Use Salesforce's "Duplicate Rules" feature to catch duplicates the automation might miss
💡 Set up a custom "Lead Source Detail" field to track which specific form captured the lead

---

### Step 4: Configure Notifications
**Purpose:** Alert sales team instantly about new qualified leads

**Actions:**
1. Set up Slack notification:
   - Action: "Send Slack Message"
   - Channel: #sales-leads (private channel for sales team)
   - Message template:
     ```
     🚨 New Qualified Lead!

     Name: {{First Name}} {{Last Name}}
     Company: {{Company}}
     Email: {{Email}}
     Phone: {{Phone}}
     Budget: {{Budget Range}}
     Timeline: {{Timeline}}
     Score: {{Lead Score}}/100

     Assigned to: @{{Sales Rep Name}}
     View in Salesforce: {{Lead Link}}

     Lead Source: {{UTM Source}} / {{UTM Campaign}}
     ```

2. Set up email notification:
   - Action: "Send Email" (Gmail or Outlook)
   - To: Assigned rep's email (from territory mapping)
   - CC: Sales manager
   - Subject: "New Qualified Lead: {{Company}} ({{Score}}/100)"
   - Body: Same details as Slack message

3. Add Salesforce task creation:
   - Action: "Create Task" in Salesforce
   - Assigned to: Lead owner
   - Subject: "Follow up with new lead"
   - Due date: Today
   - Priority: High
   - Status: Not Started

4. Set up escalation:
   - IF no response in 2 hours: Remind rep
   - IF no response in 4 hours: Alert sales manager
   - Check Salesforce "Last Activity" for response tracking

**Expected Result:**
Sales reps receive instant notifications via Slack and email for qualified leads

**Time Estimate:** 45 minutes

---

### Step 5: Add Backup & Logging
**Purpose:** Ensure no leads are lost and enable troubleshooting

**Actions:**
1. Create Google Sheet backup:
   - Action: "Create Spreadsheet Row"
   - Sheet: "Lead Capture Backup"
   - Columns: Timestamp, Email, Name, Company, Score, Territory, Status, Error
   - Map all lead fields

2. Add error logging:
   - IF any step fails: Log to "Error Log" sheet
   - Include: Timestamp, Lead email, Step failed, Error message
   - Send alert to admin if error rate > 5% in 1 hour

3. Set up weekly report:
   - Schedule: Every Monday at 9 AM
   - Report summary:
     - Total leads captured
     - Qualified vs unqualified ratio
     - Average response time
     - Errors/failed captures
     - Top performing lead sources

**Expected Result:**
Complete audit trail of all leads and ability to recover from failures

**Time Estimate:** 30 minutes

---

## 🔧 CONFIGURATION

### Settings & Parameters
| Parameter | Value | Description |
|-----------|-------|-------------|
| Lead Qualification Threshold | 60+ | Minimum score to be "qualified" |
| Response Time Target | < 5 minutes | Maximum time before first contact |
| Duplicate Match Field | Email | Field used to detect duplicates |
| Territory Assignment | State/Region | Geographic assignment rule |
| Alert Frequency | Immediate + 2hr escalation | Notification schedule |
| Backup Retention | 90 days | How long to keep backup data |

### Customization Options
- **Scoring Weights:** Adjust point values based on current priorities
- **Territory Boundaries:** Modify state assignments as team changes
- **Notification Channels:** Add Microsoft Teams instead of Slack
- **Qualification Criteria:** Add/remove scoring factors

### Environment-Specific Settings
- **Development:** Use test Salesforce instance and test forms
- **Staging:** Test with real form but sandbox Salesforce
- **Production:** Live forms and live Salesforce instance

---

## 🧪 TESTING PROCEDURES

### Pre-Deployment Checklist
- [ ] Unit test completed: Webhook trigger receives form data
- [ ] Integration test passed: Lead created in Salesforce correctly
- [ ] User acceptance test approved by: Sales Manager
- [ ] Performance benchmark met: < 30 second end-to-end processing
- [ ] Security review completed: PII data encrypted in transit

### Test Scenarios

**Scenario 1: Normal Qualified Lead**
1. **Input:**
   - Form: John Smith, john@techcorp.com, CA, Budget $50k+, Timeline 1-3 months
2. **Expected Output:**
   - Lead score: 95 (qualified)
   - Territory: West (Sarah)
   - Salesforce lead created with Sarah as owner
   - Slack notification sent to #sales-leads
   - Email sent to sarah@company.com
3. **Actual Output:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 2: Unqualified Lead**
1. **Input:**
   - Form: Jane Doe, jane@startup.com, TX, Budget <$1k, Timeline 6+ months
2. **Expected Output:**
   - Lead score: 25 (unqualified)
   - Territory: South (David)
   - Salesforce lead created with "Unqualified" status
   - Added to nurturing email sequence
   - NO Slack notification sent
3. **Actual Output:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 3: Duplicate Lead**
1. **Input:**
   - Form: Same email as existing lead (john@techcorp.com)
2. **Expected Behavior:**
   - Search finds existing lead in Salesforce
   - Update existing lead instead of creating new one
   - Log "Updated via automation" in lead activity
   - Send notification to rep about updated lead
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 4: Invalid Data**
1. **Input:**
   - Form: Missing email, invalid phone format
2. **Expected Behavior:**
   - Validation step catches errors
   - Lead not created in Salesforce
   - Logged to "Error Log" sheet
   - Alert sent to marketing team
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 5: API Failure**
1. **Input:**
   - Salesforce API is down (simulate by using invalid token)
2. **Expected Behavior:**
   - Automation retries 3 times
   - If all retries fail: Lead saved to backup Google Sheet
   - Alert sent to admin: "Salesforce API down - leads being backed up"
   - No data lost
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

### Rollback Testing
- [ ] Rollback procedure tested: March 10, 2026
- [ ] Data integrity verified post-rollback: All leads intact
- [ ] Recovery time: 5 minutes (disable automation, revert to manual entry)

---

## 🚨 ERROR HANDLING

### Common Errors & Solutions

| Error | Cause | Solution | Prevention |
|-------|-------|----------|------------|
| "Email already exists" in Salesforce | Duplicate lead | Update existing lead instead of creating new | Use Salesforce duplicate rules |
| Webhook timeout | Zapier/Make API slow | Increase timeout to 30 seconds | Monitor automation performance |
| Invalid phone format | User entered non-standard format | Use phone validation library | Add phone format hints to form |
| Territory not found | State not in mapping table | Assign to "Unassigned" queue | Review territory mapping monthly |
| Salesforce API limit exceeded | Too many API calls | Implement batch processing | Monitor API usage daily |

### Emergency Contacts
- **Primary:** Marketing Ops Manager - ops@company.com - (555) 123-4567
- **Secondary:** Salesforce Admin - sfadmin@company.com - (555) 234-5678
- **Escalation:** CMO - cmo@company.com - (555) 345-6789

### Failure Mode Analysis
**What happens when:**
- **Salesforce goes down:** Leads backed up to Google Sheet, auto-synced when API restored
- **Zapier/Make fails:** Alert sent immediately, leads queued in form tool until processed
- **Webhook fails:** Form tool auto-retries 3 times, leads saved in form database
- **Duplicate detection misses:** Salesforce duplicate rules catch during lead creation
- **Territory assignment wrong:** Rep manually reassigns, logs for mapping update

---

## 📊 MONITORING & MAINTENANCE

### Key Metrics to Track
| Metric | Target | Alert Threshold | Frequency |
|--------|--------|-----------------|-----------|
| Lead processing time | < 30 seconds | > 2 minutes | Real-time |
| Lead qualification rate | 60-70% | < 40% or > 80% | Daily |
| Response time (first contact) | < 5 minutes | > 15 minutes | Real-time |
| Error rate | < 2% | > 5% | Hourly |
| Duplicate leads created | 0 | > 1 per week | Weekly |
| Salesforce API usage | < 80% of limit | > 90% | Daily |

### Daily Maintenance Tasks
- [ ] Check error log for new entries (5 minutes)
- [ ] Verify at least 1 lead processed successfully (2 minutes)
- [ ] Monitor response times for spikes (3 minutes)

### Weekly Maintenance Tasks
- [ ] Review qualified vs unqualified lead ratio (15 minutes)
- [ ] Check for territory assignment errors (10 minutes)
- [ ] Verify backup Google Sheet is syncing (5 minutes)
- [ ] Review top-performing lead sources (10 minutes)
- [ ] Update qualification scoring if conversion rates shift (30 minutes)

### Monthly Maintenance Tasks
- [ ] Full audit of lead capture accuracy (2 hours)
- [ ] Review and update territory assignments (1 hour)
- [ ] Clean up duplicate leads in Salesforce (1 hour)
- [ ] Performance audit: processing time, API usage (1 hour)
- [ ] Security review: API key rotation (30 minutes)
- [ ] Documentation update based on feedback (1 hour)
- [ ] Retest automation with updated scenarios (2 hours)

### Maintenance Log
| Date | Task | Performed By | Notes |
|------|------|--------------|-------|
| March 13, 2026 | Initial deployment | Marketing Ops | All tests passed |
| March 20, 2026 | Weekly review | Marketing Ops | Adjusted scoring: timeline weight +5 |
| April 1, 2026 | Territory update | Marketing Ops | Added CO to West territory |
| April 15, 2026 | Performance audit | Marketing Ops | Processing time improved to 18s |

---

## 🔄 ROLLBACK PROCEDURE

**When to Rollback:**
- Lead processing failure rate > 20% for 1 hour
- Salesforce corruption or data integrity issues detected
- Critical security vulnerability discovered
- Sales team reports widespread incorrect assignments

**Rollback Steps:**
1. **Immediate Action:** Turn off automation in Zapier/Make (click "Off" switch)
2. **Notify:** Send Slack message to #sales-ops and email sales leadership
3. **Restore:**
   - Sales team reverts to manual lead entry from forms
   - Download unprocessed leads from backup Google Sheet
   - Manually enter into Salesforce with proper assignment
4. **Verify:**
   - Check last 10 leads entered manually are correct
   - Confirm no duplicate leads created
5. **Document:**
   - Log incident in "Incident Report" sheet
   - Note root cause and prevention steps

**Rollback Time Estimate:** 15 minutes to disable, 1-2 hours to process backlog

**Post-Rollback Actions:**
- [ ] Investigate root cause with technical team
- [ ] Fix underlying issue in development environment
- [ ] Re-test all scenarios thoroughly
- [ ] Update this SOP with lessons learned
- [ ] Gradual re-rollout: 25% of forms day 1, 50% day 2, 100% day 3

---

## 📚 REFERENCE MATERIALS

### Related SOPs
- [Lead Nurturing Email Sequences](SOP-002): Automated follow-up for unqualified leads
- [Salesforce Lead Management](SOP-005): Manual lead handling procedures
- [Territory Management](SOP-008): How territories are defined and managed

### External Documentation
- [Zapier Salesforce Guide](https://zapier.com/apps/salesforce/integrations): Zapier-Salesforce integration
- [Typeform Webhooks](https://developer.typeform.com/webhooks/): Setting up webhooks
- [Salesforce Lead Object](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_lead.htm): Lead field reference

### Training Resources
- Video: "Setting Up Lead Capture Automation" (15 min) - Internal LMS
- Cheat Sheet: "Quick Reference for Troubleshooting" - Attached to this SOP
- Workshop: Monthly "Automation Office Hours" - Last Friday of month

---

## 📝 CHANGE LOG

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | March 13, 2026 | Initial version | Marketing Ops Manager |
|  |  |  |  |

---

## 💬 FEEDBACK & IMPROVEMENTS

**Got ideas to improve this automation?**
1. Document your suggestion in the "Improvement Backlog" sheet
2. Test in development environment first
3. Submit for review at monthly operations meeting
4. Update this SOP after approval

**Continuous Improvement:**
- Last optimization: March 20, 2026 (adjusted scoring weights)
- Next scheduled review: April 15, 2026
- Optimization backlog: 3 items (see tracking sheet)

---

## ✅ APPENDIX: EXAMPLE OUTPUTS

### Example 1: Qualified Lead Notification
**Slack Message:**
```
🚨 New Qualified Lead!

Name: Sarah Johnson
Company: TechCorp Inc.
Email: sarah.johnson@techcorp.com
Phone: (555) 123-4567
Budget: $50,000+
Timeline: 1-3 months
Score: 95/100

Assigned to: @Sarah (sarah@company.com)
View in Salesforce: https://salesforce.com/lead/12345

Lead Source: google / cpc_spring_campaign_2026

_This is an automated message - do not reply_
```

### Example 2: Unqualified Lead (Nurturing)
**Salesforce Lead Record:**
- **Name:** Mike Chen
- **Company:** StartupXYZ
- **Email:** mike@startupxyz.com
- **Score:** 35/100
- **Status:** Unqualified - In Nurture
- **Lead Source:** LinkedIn Ads
- **Action:** Added to "Startup Nurture Sequence" (5 emails over 30 days)
- **Owner:** Marketing Queue (not assigned to sales rep)

---

## 🎓 NOTES FOR NEW USERS

**Critical Success Factors:**
1. **Keep forms simple:** Only ask for essential info - more fields = lower conversion
2. **Test thoroughly:** One bad field mapping can break the entire automation
3. **Monitor daily:** Catch issues early before they impact lead flow
4. **Communicate with sales:** Get their feedback on lead quality and territory assignments

**Common Mistakes to Avoid:**
- ❌ Forgetting to update territory mappings when team changes
- ❌ Setting qualification threshold too high (no qualified leads) or too low (spam)
- ❌ Not testing with real data before launch (test data doesn't catch all edge cases)
- ❌ Ignoring error logs until there's a major problem

**Best Practices:**
- ✅ Review qualification scoring monthly based on actual conversion rates
- ✅ Use hidden fields to track UTM parameters - invaluable for attribution
- ✅ Set up escalation alerts for when reps don't follow up quickly
- ✅ Keep backup running even after automation is stable

**Remember:** "Systems before willpower. Automate the boring, keep the human."
