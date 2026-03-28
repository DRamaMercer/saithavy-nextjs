# SOP: Automated Report Generation

**SOP ID:** SOP-005
**Version:** 1.0
**Last Updated:** March 13, 2026
**Owner:** Data Analytics Manager
**Review Date:** September 13, 2026

---

## 📋 PURPOSE

**What this automation does:**
Automatically generates business performance reports (sales, marketing, finance, operations) by pulling data from multiple sources, transforming and visualizing it, and delivering formatted reports via email and dashboard on a scheduled basis.

**Business Impact:**
- Saves approximately 12 hours per week in manual report compilation
- Ensures 100% data accuracy (no human calculation errors)
- Enables real-time decision-making (same-day reporting vs. weekly)
- Provides consistent insights across all departments

**Success Metrics:**
- Report generation time: < 15 minutes (vs. 4+ hours manual)
- Data accuracy: 100% (validated against source systems)
- On-time delivery: 100% (never miss a scheduled report)
- Stakeholder satisfaction: > 4.5/5 rating

---

## 🎯 SCOPE

**In Scope:**
- Daily operational dashboards (sales, support tickets, server metrics)
- Weekly performance reports (marketing, sales, finance summary)
- Monthly executive summaries (KPIs, OKRs, financials)
- Ad-hoc custom reports (on-demand requests)
- Cross-departmental reports (integrated data from multiple systems)
- Automated alert reports (anomalies, threshold breaches)

**Out of Scope:**
- Data analysis and insights generation (that's analyst work)
- Strategic recommendations (reports present data, not decisions)
- Real-time streaming dashboards (separate SOP-021)
- Regulatory compliance reports (separate SOP-022)

---

## 🛠️ PREREQUISITES

### Required Tools & Accounts
- **Google Data Studio** or **Tableau** or **Power BI**: Data visualization
- **Google Sheets** or **Airtable**: Data storage and transformation
- **Zapier** or **Make (Integromat)**: Automation platform
- **Google Analytics**, **Salesforce**, **Stripe**: Data sources
- **Slack**: Report delivery and alerts
- **Gmail**: Email distribution

### Technical Requirements
- API access for all data sources (Google Analytics, Salesforce, etc.)
- Data visualization platform Pro plan or higher
- Google Sheets API access (for automated updates)
- Webhook configuration for real-time data pulls
- Scheduled query execution (cron jobs or platform-native scheduling)

### Permissions Needed
- **Data Sources**: Read-only API access (analytics, CRM, payment)
- **Google Sheets**: Edit access for report data sheets
- **Data Studio**: Admin access for dashboard creation
- **Slack**: Webhook posting permissions
- **Zapier/Make**: Account admin access

### Before You Begin
- [ ] Data sources are connected and API-authenticated
- [ ] Report templates are designed and approved
- [ ] KPI definitions are documented
- [ ] Distribution lists are finalized
- [ ] Data quality checks are in place

---

## 🔄 WORKFLOW OVERVIEW

**Visual Description:**

```
[Schedule Trigger] → [Pull Data from Sources] → [Transform & Clean] → [Calculate Metrics] → [Populate Dashboard] → [Generate Report] → [Deliver to Stakeholders]
        ↓                     ↓                     ↓                    ↓                    ↓                    ↓                     ↓
    [Cron/Timer]        [API Calls]         [Google Sheets]      [Formulas/Queries]   [Data Studio]      [PDF/Email]          [Slack/Email]
```

**Process Flow:**
1. **Trigger:** Scheduled time (daily 9 AM, weekly Monday, monthly 1st)
2. **Data Collection:** Pull raw data from all sources via API
3. **Transformation:** Clean, normalize, and aggregate data
4. **Metric Calculation:** Apply formulas and business logic
5. **Visualization:** Update charts, graphs, and tables
6. **Report Generation:** Export as PDF, screenshot, or link
7. **Distribution:** Email report, post to Slack, update dashboard

**Integration Points:**
- Connects to: Google Analytics, Salesforce, Stripe, Google Sheets, Slack, Gmail
- Data flows from: Sources → Google Sheets → Data Studio → Reports
- Dependencies: API rate limits, data freshness, visualization templates

---

## 📝 STEP-BY-STEP INSTRUCTIONS

### Step 1: Define Report Requirements
**Purpose:** Document what data each report needs and why

**Actions:**
1. Create report specification documents for each type:

**Daily Operations Report**
- **Audience:** Operations Manager, Support Lead, DevOps team
- **Frequency:** Every day at 9 AM
- **KPIs:**
  - New sales yesterday (count, $ amount)
  - Support tickets (opened, closed, backlog)
  - Server uptime (%)
  - Website traffic (sessions, conversions)
  - Active users (DAU/MAU)
- **Data Sources:** Salesforce, Zendesk, Pingdom, Google Analytics

**Weekly Marketing Report**
- **Audience:** Marketing team, CMO
- **Frequency:** Every Monday at 8 AM
- **KPIs:**
  - Website traffic (sessions, users, pageviews)
  - Lead generation (MQLs, SQLs, conversion rate)
  - Email marketing (open rate, click rate, unsubscribes)
  - Social media (followers, engagement rate)
  - Content performance (top 5 blog posts, webinars)
  - Ad spend and ROI (Google Ads, LinkedIn Ads)
- **Data Sources:** Google Analytics, HubSpot, Mailchimp, Buffer, Google Ads

**Monthly Executive Summary**
- **Audience:** CEO, CFO, Board
- **Frequency:** 1st of month at 10 AM
- **KPIs:**
  - Revenue (MRR, ARR, growth rate)
  - Customer metrics (new, churned, NRR)
  - Cash position (burn rate, runway)
  - Team headcount (hiring plan vs actual)
  - Product usage (active users, feature adoption)
  - OKR progress (objective completion %)
- **Data Sources:** Stripe, Salesforce, HRIS, Product analytics

2. Document for each report:
   - Purpose and audience
   - Data freshness requirements (real-time, daily, weekly)
   - Data retention period (how much historical data)
   - Distribution method (email, Slack, dashboard link)
   - Alert thresholds (when to notify of anomalies)

**Expected Result:**
Clear report requirements documentation

**Time Estimate:** 3 hours

**Notes/Pro Tips:**
💡 Start with 3-5 KPIs per report (more gets overwhelming)
💡 Always answer "so what?" - each KPI should drive a decision
💡 Document the "why" behind each metric for context

---

### Step 2: Set Up Data Sources & APIs
**Purpose:** Connect all data systems for automated pulls

**Actions:**
1. Configure API connections:

**Google Analytics:**
- Create Service Account in Google Cloud Console
- Download JSON key file
- Add Service Account to Google Analytics property (Read & Analyze permission)
- Note: View ID (not Property ID) for API calls
- Test API: Pull last 7 days of sessions data

**Salesforce (CRM):**
- Create Connected App in Salesforce
- Enable OAuth 2.0
- Set callback URL and scopes
- Note: Client ID, Client Secret, Instance URL
- Test API: Pull closed opportunities last month

**Stripe (Payments):**
- Create API keys in Stripe Dashboard
- Use "Test mode" keys for development
- Use "Live mode" keys for production (never share these!)
- Note: Publishable key (starts with pk_) and Secret key (starts with sk_)
- Test API: Pull last month's revenue

**Other sources:** (HubSpot, Zendesk, etc.)
- Follow similar process: Create API credentials → Test connection

2. Store credentials securely:
- **NEVER** hardcode API keys in scripts
- Use environment variables (.env file, never committed to Git)
- Or use secret management (AWS Secrets Manager, HashiCorp Vault)
- Document credential rotation schedule (quarterly recommended)

3. Configure rate limits:
- Note API rate limits for each source (e.g., Salesforce: 15,000 calls/day)
- Implement exponential backoff for retries
- Cache data in Google Sheets to reduce API calls

**Expected Result:**
Working API connections to all data sources

**Time Estimate:** 4 hours

**Notes/Pro Tips:**
💡 Use API "test mode" or "sandbox" environments during development
💡 Monitor API usage - hitting rate limits will break your reports
💡 Document all API credentials in a secure password manager (1Password, LastPass)

---

### Step 3: Build Data Transformation Pipeline
**Purpose:** Clean, normalize, and aggregate raw data

**Actions:**
1. Create Google Sheets for data storage:
   - **Sheet 1:** "Raw Data" - Import raw API data here
   - **Sheet 2:** "Cleaned Data" - Transform and clean data
   - **Sheet 3:** "Metrics" - Calculate KPIs and ratios
   - **Sheet 4:** "Dashboard Data" - Final data for visualization
   - **Sheet 5:** "Log" - Track report runs, errors, data freshness

2. Set up automated data import (Zapier/Make):
   - **Trigger:** Schedule (daily 6 AM, weekly Sunday 10 PM)
   - **Action 1:** "Pull GA Data" (Google Analytics API)
     - Query: Last 24 hours sessions, users, conversions
     - Output: Sheet "Raw Data", Columns A-E
   - **Action 2:** "Pull Salesforce Data" (Salesforce API)
     - Query: New leads, closed deals, pipeline value
     - Output: Sheet "Raw Data", Columns F-J
   - **Action 3:** "Pull Stripe Data" (Stripe API)
     - Query: Revenue, refunds, MRR, churn
     - Output: Sheet "Raw Data", Columns K-O

3. Add data transformation in Google Sheets:
   - **Remove duplicates:** =UNIQUE(range)
   - **Fill missing values:** =IF(ISBLANK(A2), "N/A", A2)
   - **Date formatting:** =TEXT(A2, "YYYY-MM-DD")
   - **Currency formatting:** =TEXT(A2, "$#,##0.00")
   - **Calculate ratios:** =B2/C2 (e.g., conversion rate = leads/opportunities)
   - **Moving averages:** =AVERAGE(OFFSET(A2,0,0,7,1)) (7-day avg)
   - **YoY growth:** =(A2-B2)/B2 (current year / previous year)

4. Add data validation checks:
   - **Range checks:** Values should be within expected range
   - **Completeness checks:** No missing required fields
   - **Freshness checks:** Data timestamp within last 24 hours
   - **Cross-system checks:** Reconcile totals between systems
   - Alert if validation fails: Send Slack message to data team

**Expected Result:**
Automated data pipeline that pulls, cleans, and transforms data

**Time Estimate:** 5 hours

**Decision Point:**
```
IF data_validation_fails
  THEN send alert: "Data quality issue in [report name]"
  AND do NOT update dashboard (use last known good data)
  AND notify data team for manual investigation
ELSE
  THEN proceed to update dashboard
```

---

### Step 4: Create Visual Dashboards
**Purpose:** Build interactive visualizations of KPIs

**Actions:**
1. Set up Google Data Studio (or Tableau/Power BI):
   - Create new report: "Daily Operations Dashboard"
   - Connect data source: Google Sheets "Dashboard Data" sheet
   - Set refresh frequency: Every 24 hours (or 1 hour for real-time)

2. Design dashboard layout:
   - **Header:** Report name, last updated timestamp, date range selector
   - **Top row:** 4-5 key scorecards (headline numbers)
     - New Sales Today: $12,450 (▲ 15% vs yesterday)
     - Support Tickets Closed: 45 (Goal: 50)
     - Server Uptime: 99.95% (Target: 99.9%)
     - Website Sessions: 3,421 (▼ 3% vs last week)
   - **Middle row:** Charts and trends
     - Line chart: Sales trend (last 30 days)
     - Bar chart: Lead sources (organic, paid, referral, social)
     - Pie chart: Support ticket categories
     - Table: Top 10 blog posts by views
   - **Bottom row:** Details and drill-downs
     - Filter by date range, region, product line
     - Export to PDF/CSV buttons

3. Configure visualizations:
   - **Scorecards:** Single number with comparison (vs target, vs last period)
   - **Time series:** Line charts for trends over time
   - **Comparisons:** Bar charts for categorical data
   - **Distributions:** Pie charts for parts-of-whole
   - **Tables:** Detailed data with sorting and filtering
   - **Geo maps:** Regional data visualization (if applicable)

4. Add conditional formatting:
   - Green: Above target or positive trend
   - Yellow: At target or flat trend
   - Red: Below target or negative trend
   - Example: If server uptime < 99.9%, show red background

5. Set up interactivity:
   - Date range selector: Last 7 days, 30 days, 90 days, YTD
   - Filters: Region, product line, team member
   - Drill-downs: Click scorecard → see detailed breakdown
   - Annotations: Mark key events (product launch, marketing campaign)

**Expected Result:**
Interactive dashboard with all KPIs visualized

**Time Estimate:** 4 hours

**Notes/Pro Tips:**
💡 Use consistent color schemes (green = good, red = bad)
💡 Limit to 3-4 charts per page (more gets cluttered)
💡 Add "last updated" timestamp so users know data freshness
💡 Test on mobile devices (many executives view on phones)

---

### Step 5: Configure Automated Delivery
**Purpose:** Distribute reports to stakeholders automatically

**Actions:**
1. Set up scheduled exports (Zapier/Make):
   - **Trigger:** Dashboard data updated
   - **Schedule:**
     - Daily report: Every day at 9 AM
     - Weekly report: Every Monday at 8 AM
     - Monthly report: 1st of month at 10 AM
   - **Action:** Export dashboard as PDF

2. Configure email distribution:
   - **Daily Report:**
     - To: ops-team@company.com
     - Subject: "Daily Operations Report - [Date]"
     - Body:
       ```
       Here's today's operations report:

       Key Highlights:
       • New Sales: $12,450 (▲ 15%)
       • Support Tickets Closed: 45/50 (90%)
       • Server Uptime: 99.95% ✅

       Full dashboard: [Dashboard Link]

       Data as of: [Timestamp]
       ```
     - Attachment: PDF export of dashboard
   - **Weekly Report:**
     - To: marketing-team@company.com
     - Subject: "Weekly Marketing Performance - Week of [Date]"
     - Body: Similar format, with weekly summaries
   - **Monthly Report:**
     - To: executive-team@company.com
     - Subject: "Monthly Executive Summary - [Month] [Year]"
     - Body: Executive summary format, with strategic insights

3. Set up Slack notifications:
   - **Daily summary in #operations channel:**
     ```
     📊 Daily Operations Report

       💰 Sales: $12,450 (▲ 15% vs yesterday)
       🎫 Support: 45 tickets closed (90% of goal)
       ⚡ Uptime: 99.95% (target: 99.9%)
       📈 Traffic: 3,421 sessions (▼ 3%)

       Full report: [Dashboard Link]
     ```
   - **Alerts in #alerts channel:**
     - IF server uptime < 99.5%: "🚨 Server uptime below threshold: 99.3%"
     - IF sales drop > 20%: "⚠️ Sales down 22% vs yesterday"
     - IF support backlog > 100: "🎫 Support backlog at 112 tickets"

4. Add delivery confirmation:
   - Log every report sent in "Report Log" sheet
   - Track: Date, report type, recipients, delivery status
   - Alert if delivery fails: Retry 3 times, then escalate

**Expected Result:**
Automated report delivery via email and Slack

**Time Estimate:** 2 hours

**Notes/Pro Tips:**
💡 Send reports at consistent times (builds expectation and habit)
💡 Include "view in browser" link for email clients that block images
💡 Keep Slack summaries short (use bullet points and emojis)

---

### Step 6: Implement Alerts & Anomalies
**Purpose:** Proactively notify stakeholders of issues

**Actions:**
1. Define alert thresholds:
   - **Sales alerts:**
     - Daily sales < 80% of target (warning)
     - Daily sales < 60% of target (critical)
     - New customer count = 0 for 3 days (critical)
   - **Operations alerts:**
     - Server uptime < 99.5% (warning)
     - Server uptime < 99.0% (critical)
     - Support backlog > 100 tickets (warning)
     - Support backlog > 200 tickets (critical)
   - **Marketing alerts:**
     - Website traffic drop > 20% vs same day last week (warning)
     - Lead volume drop > 30% (critical)
     - Email bounce rate > 5% (critical)

2. Set up alert automation (Zapier/Make):
   - **Trigger:** Data update in Google Sheets
   - **Condition:** Check threshold (e.g., IF sales < target)
   - **Action:** Send Slack message to appropriate channel
   - **Action:** Send email alert to on-call person

3. Add anomaly detection:
   - Calculate standard deviation of metrics
   - Alert if value > 2 standard deviations from mean (statistical anomaly)
   - Example: If avg daily sales = $10K ± $1K, alert if < $8K or > $12K

4. Configure escalation:
   - **First alert:** Send to channel (e.g., #operations-alerts)
   - **Second alert (if not acknowledged in 30 min):** Send direct message to on-call person
   - **Third alert (if not acknowledged in 1 hour):** Send to manager + exec team

5. Test alert system:
   - Simulate threshold breach (lower alert temporarily)
   - Verify alert sent to correct channel
   - Verify escalation works if not acknowledged
   - Restore normal threshold

**Expected Result:**
Proactive alerting for anomalies and threshold breaches

**Time Estimate:** 2 hours

**Notes/Pro Tips:**
💡 Don't over-alert (alert fatigue means people ignore them)
💡 Use different alert levels (info, warning, critical)
💡 Include context in alerts (what's expected, what's actual, what to do)

---

## 🔧 CONFIGURATION

### Settings & Parameters
| Parameter | Value | Description |
|-----------|-------|-------------|
| Daily Report Time | 9:00 AM | When daily report runs |
| Weekly Report Day | Monday 8:00 AM | When weekly report runs |
| Monthly Report Day | 1st at 10:00 AM | When monthly report runs |
| Data Refresh Frequency | Every 24 hours | How often dashboard updates |
| Alert Check Frequency | Every hour | How often to check thresholds |
| Data Retention | 12 months | How much historical data to keep |

### Customization Options
- **Report timing:** Adjust based on stakeholder time zones
- **KPIs:** Add/remove metrics based on business priorities
- **Alert thresholds:** Customize based on acceptable ranges
- **Delivery channels:** Add Microsoft Teams, email, SMS for critical alerts

### Environment-Specific Settings
- **Development:** Test with sample data, no external delivery
- **Staging:** Use production data but send to test email only
- **Production:** Full automation with all delivery channels

---

## 🧪 TESTING PROCEDURES

### Pre-Deployment Checklist
- [ ] Unit test completed: Data pulls from all sources
- [ ] Integration test passed: End-to-end report generation
- [ ] User acceptance test approved by: Data Analytics Manager, Stakeholders
- [ ] Performance benchmark met: < 15 minutes report generation
- [ ] Security review completed: API keys secured, access controls in place

### Test Scenarios

**Scenario 1: Daily Report Generation**
1. **Input:**
   - Trigger: Daily schedule at 9 AM
   - Data sources: GA (traffic), Salesforce (sales), Stripe (revenue)
2. **Expected Output:**
   - Data pulled from all 3 sources successfully
   - Data transformed and cleaned
   - KPIs calculated (sales, traffic, revenue)
   - Dashboard updated with latest data
   - PDF report generated
   - Email sent to ops-team@company.com
   - Slack summary posted to #operations
   - Log entry created (timestamp, status = success)
3. **Actual Output:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 2: Data Quality Validation**
1. **Input:**
   - Salesforce API returns incomplete data (missing field)
   - Expected: 100 sales records, Actual: 50 (missing 50)
2. **Expected Behavior:**
   - Validation check detects missing data
   - Alert sent: "Salesforce data incomplete: 50 records missing"
   - Dashboard NOT updated (uses last known good data)
   - Email notification sent to data team
   - Report run logged as "Failed - data quality issue"
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 3: Alert Threshold Breach**
1. **Input:**
   - Server uptime drops to 99.2% (below 99.5% threshold)
2. **Expected Behavior:**
   - Anomaly detection triggers alert
   - Slack message sent to #operations-alerts: "⚠️ Server uptime 99.2% (threshold: 99.5%)"
   - Email sent to on-call DevOps engineer
   - Alert logged in dashboard
   - Dashboard shows uptime in RED (conditional formatting)
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 4: API Rate Limit Handling**
1. **Input:**
   - Salesforce API returns 429 (Too Many Requests)
   - Automation hit rate limit after 15,000 calls
2. **Expected Behavior:**
   - Automation catches error (429 status code)
   - Implements exponential backoff: wait 30 seconds, retry
   - If still failing: wait 60 seconds, retry again
   - After 3 retries: Mark as failed, send alert
   - Use cached data from last successful run
   - Log error: "Salesforce API rate limit exceeded"
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 5: Monthly Executive Report**
1. **Input:**
   - Trigger: 1st of month at 10 AM
   - Data sources: All sources (12 months of historical data)
2. **Expected Output:**
   - Comprehensive report with:
     - Revenue trends (MRR, ARR, growth rate)
     - Customer metrics (new, churned, NRR)
     - OKR progress (objectives completion %)
     - Year-over-year comparisons
     - Visualizations: Line charts, bar charts, scorecards
   - PDF emailed to executive-team@company.com
   - Slack summary posted to #executive
   - Dashboard updated with monthly data
3. **Actual Output:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

### Rollback Testing
- [ ] Rollback procedure tested: March 10, 2026
- [ ] Data integrity verified: No corrupted data in dashboards
- [ ] Recovery time: 30 minutes (pause automation, manual report creation)

---

## 🚨 ERROR HANDLING

### Common Errors & Solutions

| Error | Cause | Solution | Prevention |
|-------|-------|----------|------------|
| API connection failed | Expired API token | Refresh OAuth token | Set token auto-refresh |
| Data mismatch | Different time zones | Normalize all to UTC | Document timezone handling |
| Dashboard blank | Data source changed | Update data source schema | Monitor source changes |
| Report not delivered | Email/Slack API down | Retry 3 times, then escalate | Use backup delivery method |
| Calculation error | Formula broken in sheet | Add error checking | Test formulas with edge cases |
| Stale data | Automation didn't run | Check logs, restart job | Monitor automation health |

### Emergency Contacts
- **Primary:** Data Analytics Manager - analytics@company.com - (555) 567-8901
- **Secondary:** Data Engineer - dataeng@company.com - (555) 678-9012
- **Escalation:** CTO - cto@company.com - (555) 789-0123

### Failure Mode Analysis
**What happens when:**
- **Data source API down:** Use cached data from last run, alert data team
- **Google Sheets syncing fails:** Pause automation, investigate quota limits
- **Calculation errors detected:** Roll back to previous version, alert immediately
- **Delivery fails (email/Slack):** Retry 3 times, escalate to manual delivery
- **Threshold breach:** Immediate alert to on-call person + escalation path

---

## 📊 MONITORING & MAINTENANCE

### Key Metrics to Track
| Metric | Target | Alert Threshold | Frequency |
|--------|--------|-----------------|-----------|
| Report generation time | < 15 min | > 30 min | Per report |
| Data freshness | < 24 hrs | > 48 hrs | Daily |
| Data accuracy | 100% | Any error | Per report |
| On-time delivery | 100% | < 95% | Weekly |
| API error rate | < 1% | > 5% | Per report |
| Stakeholder satisfaction | > 4.5/5 | < 4.0/5 | Monthly |

### Daily Maintenance Tasks
- [ ] Check report runs completed successfully (5 minutes)
- [ ] Review overnight alerts (10 minutes)
- [ ] Verify dashboard data updated (2 minutes)

### Weekly Maintenance Tasks
- [ ] Review report performance metrics (20 minutes)
- [ ] Check for data quality issues (15 minutes)
- [ ] Update documentation if any changes (10 minutes)
- [ ] Review stakeholder feedback (15 minutes)

### Monthly Maintenance Tasks
- [ ] Full audit of data pipeline (2 hours)
- [ ] Review and update KPI definitions (1 hour)
- [ ] Performance audit: generation speed, data freshness (1 hour)
- [ ] Security review: Rotate API keys (30 minutes)
- [ ] Documentation update based on feedback (1 hour)
- [ ] Stakeholder satisfaction survey (30 minutes)
- [ ] Retest automation with platform updates (2 hours)

### Maintenance Log
| Date | Task | Performed By | Notes |
|------|------|--------------|-------|
| March 13, 2026 | Initial deployment | Data Analytics | All reports live |
| March 20, 2026 | KPI update | Data Analytics | Added NRR metric |
| April 1, 2026 | API key rotation | Data Engineer | Refreshed all tokens |
| April 15, 2026 | Dashboard redesign | Data Analytics | Improved layout |

---

## 🔄 ROLLBACK PROCEDURE

**When to Rollback:**
- Data corruption detected in dashboards
- Critical calculation errors affecting decisions
- Delivery system down for > 4 hours
- Security breach (compromised API keys)

**Rollback Steps:**
1. **Immediate Action:** Pause all report automations in Zapier/Make
2. **Notify:** Slack message to #data-team and stakeholders: "Reports paused - [reason]"
3. **Restore:**
   - Revert Google Sheets to previous version (Version History)
   - Manually run reports with verified good data
   - Email PDFs to distribution lists
4. **Verify:**
   - Check last 3 reports for accuracy
   - Confirm no corrupted data in dashboards
5. **Document:**
   - Log incident in "Data Incident Report"
   - Note root cause and prevention steps

**Rollback Time Estimate:** 30 minutes to pause, 2-4 hours for manual reports

**Post-Rollback Actions:**
- [ ] Investigate root cause with data engineering team
- [ ] Fix issue in development environment
- [ ] Re-test all scenarios with sample data
- [ ] Update this SOP with lessons learned
- [ ] Gradual re-rollout: Resume daily reports first, then weekly, then monthly

---

## 📚 REFERENCE MATERIALS

### Related SOPs
- [Data Quality Management](SOP-023): Ensuring data accuracy
- [Dashboard Design Best Practices](SOP-024): Visualization guidelines
- [API Management](SOP-025): API key rotation and security

### External Documentation
- [Google Data Studio](https://support.google.com/datastudio): Dashboard creation
- [Google Sheets API](https://developers.google.com/sheets/api): Data manipulation
- [Salesforce API](https://developer.salesforce.com/docs): CRM data access

### Training Resources
- Video: "Building Automated Reports" (40 min) - Internal LMS
- Template Library: "Report Templates (Daily, Weekly, Monthly)" - Google Drive
- Workshop: Monthly "Data Analytics Office Hours" - Last Friday of month

---

## 📝 CHANGE LOG

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | March 13, 2026 | Initial version | Data Analytics Manager |
|  |  |  |  |

---

## 💬 FEEDBACK & IMPROVEMENTS

**Got ideas to improve this automation?**
1. Document suggestion in "Data Automation Backlog" sheet
2. Test in development environment first
3. Submit for review at monthly analytics meeting
4. Update this SOP after approval

**Continuous Improvement:**
- Last optimization: March 20, 2026 (added anomaly detection)
- Next scheduled review: April 15, 2026
- Optimization backlog: 3 items (ML predictions, real-time streaming, custom ETL)

---

## ✅ APPENDIX: EXAMPLE OUTPUTS

### Example 1: Daily Operations Report (Slack)
```
📊 Daily Operations Report - March 13, 2026

💰 SALES
  • New Sales: $12,450 (▲ 15% vs yesterday)
  • Deals Closed: 3 (Goal: 5)
  • Pipeline Value: $234,567

🎫 SUPPORT
  • Tickets Opened: 52
  • Tickets Closed: 45 (90% of goal)
  • Backlog: 127 (Target: < 100) ⚠️

⚡ INFRASTRUCTURE
  • Server Uptime: 99.95% ✅ (Target: 99.9%)
  • Page Load Time: 1.2s (Target: < 2s)
  • Error Rate: 0.05% (Target: < 0.1%)

📈 TRAFFIC
  • Sessions: 3,421 (▼ 3% vs last week)
  • Conversions: 142 (4.2% conversion rate)
  • Top Page: /blog/automation-tips (892 views)

Full Dashboard: [Dashboard Link]
Data as of: 9:00 AM ET
```

### Example 2: Monthly Executive Summary (Email Excerpt)
```
EXECUTIVE SUMMARY - MARCH 2026

KEY HIGHLIGHTS
-------------
✅ Revenue: $487,234 (▲ 12% vs Feb, ▲ 45% vs Mar 2025)
✅ New Customers: 47 (▲ 8% vs Feb)
✅ MRR: $234,567 (▲ $15,432 vs Feb)
⚠️ Churn: 2.3% (Target: < 2.0%)

OPERATIONAL METRICS
------------------
• Server Uptime: 99.97% (Target: 99.9%)
• Support Response Time: 2.3 hrs (Target: < 4 hrs)
• Customer NPS: 72 (Target: > 70)

OKR PROGRESS
------------
Objective 1: Scale to $500K MRR - 78% complete
Objective 2: Launch Enterprise tier - 100% complete ✅
Objective 3: Hire 20 new team members - 65% complete

FORWARD LOOK
-----------
• Q2 Focus: Enterprise customer acquisition
• Major Launch: Mobile app (June 2026)
• Key Risk: Hiring pipeline slower than expected

Full dashboard available here: [Dashboard Link]
```

---

## 🎓 NOTES FOR NEW USERS

**Critical Success Factors:**
1. **Start simple:** Don't boil the ocean - 3-5 KPIs per report is plenty
2. **Automate incrementally:** Start with 1 report, prove value, then expand
3. **Monitor relentlessly:** Check reports daily for first month
4. **Get feedback early:** Show stakeholders draft reports and iterate

**Common Mistakes to Avoid:**
- ❌ Too many KPIs (analysis paralysis)
- ❌ Not documenting data sources (where did this number come from?)
- ❌ Ignoring data quality (garbage in, garbage out)
- ❌ Forgetting to update when business changes (obsolete metrics)

**Best Practices:**
- ✅ Always show context (vs target, vs last period, vs last year)
- ✅ Use visual hierarchy (headline numbers first, details later)
- ✅ Include "last updated" timestamp
- ✅ Provide actionable insights, not just data
- ✅ Test with sample data before going live

**Remember:** "Systems before willpower. Automate the boring, keep the human."
