# SOP: Invoice Generation Workflow Automation

**SOP ID:** SOP-002
**Version:** 1.0
**Last Updated:** March 13, 2026
**Owner:** Finance Operations Manager
**Review Date:** September 13, 2026

---

## 📋 PURPOSE

**What this automation does:**
Automatically generates professional invoices from approved timesheets/expense reports, calculates totals and taxes, routes for approval, sends to clients with payment links, and tracks payment status with automatic reminders.

**Business Impact:**
- Saves approximately 8 hours per week in manual invoice creation
- Eliminates calculation errors (100% accurate totals)
- Reduces payment cycle from 45 days to 32 days (29% faster)
- Prevents revenue loss from missed invoices

**Success Metrics:**
- Invoice generation accuracy: 100% (zero calculation errors)
- Invoice delivery time: < 24 hours after timesheet approval
- Payment cycle reduction: 45 → 32 days (target: < 30 days)
- Zero missed invoices (all billable hours invoiced)

---

## 🎯 SCOPE

**In Scope:**
- Timesheet-based billing (hourly services)
- Fixed-fee project milestone invoicing
- Expense reimbursement invoices
- Multi-currency invoicing (USD, EUR, GBP)
- Client approval workflows
- Payment link generation (Stripe, PayPal)
- Automated payment reminders

**Out of Scope:**
- Complex tiered pricing structures (manual review required)
- Retainer invoicing (separate automation SOP-003)
- Credit memos and refunds (separate SOP-007)
- Tax filing and reporting (separate SOP-009)

---

## 🛠️ PREREQUISITES

### Required Tools & Accounts
- **QuickBooks Online** or **Xero**: Accounting software (Plus plan minimum)
- **Harvest**, **Toggl Track**, or **Clockify**: Time tracking
- **Expensify** or **Ramp**: Expense management
- **Stripe** or **PayPal**: Payment processing
- **DocuSign** or **HelloSign**: Electronic signatures
- **Zapier** or **Make (Integromat)**: Automation platform
- **Google Drive** or **Dropbox**: Document storage

### Technical Requirements
- API access for QuickBooks/Xero, Harvest, Stripe
- Webhook configuration for approval triggers
- Email template access in accounting software
- Multi-currency rate feed (API or manual upload)

### Permissions Needed
- **QuickBooks/Xero**: API access, Invoice create/send/approve permissions
- **Harvest**: Time entry exports, project management
- **Stripe**: Payment link creation, refund permissions
- **DocuSign**: Template creation, send permissions
- **Zapier/Make**: Account admin access

### Before You Begin
- [ ] Chart of accounts is set up correctly
- [ ] Client billing information is current in accounting software
- [ ] Tax rates are configured for all jurisdictions
- [ ] Invoice templates are designed and approved
- [ ] Approval workflows are documented

---

## 🔄 WORKFLOW OVERVIEW

**Visual Description:**

```
[Timesheet Approved] → [Calculate Hours] → [Check Billing Rules] → [Generate Invoice] → [Manager Approval] → [Send to Client]
        ↓                    ↓                    ↓                    ↓                    ↓                      ↓
    [Harvest]          [Hourly Rate]      [Project Type]      [QuickBooks]        [DocuSign]             [Email + Link]
```

**Process Flow:**
1. **Trigger:** Timesheet/expense report approved by manager
2. **Data Collection:** Pull billable hours, expenses, project details
3. **Calculation:** Apply rates, calculate taxes, convert currency
4. **Invoice Generation:** Create invoice in accounting software
5. **Approval Route:** Send to finance manager for review
6. **Client Delivery:** Email invoice with payment link
7. **Payment Tracking:** Monitor status, send reminders

**Integration Points:**
- Connects to: Harvest, QuickBooks, DocuSign, Stripe, Gmail
- Data flows from: Harvest → Zapier → QuickBooks → DocuSign → Stripe
- Dependencies: Client billing terms, tax tables, currency rates

---

## 📝 STEP-BY-STEP INSTRUCTIONS

### Step 1: Configure Time & Expense Tracking
**Purpose:** Ensure accurate data capture for invoicing

**Actions:**
1. Set up projects in Harvest (or equivalent):
   - Create project for each client engagement
   - Set billing type: "Hourly", "Fixed Fee", or "Non-Billable"
   - Assign default hourly rate per project
   - Link to QuickBooks customer record

2. Configure task categories:
   - Billable tasks: Development, Design, Strategy, Meetings
   - Non-billable tasks: Admin, Internal, Training
   - Set each task as billable or non-billable

3. Set up expense categories in Expensify:
   - Travel, Software, Hardware, Client Entertainment
   - Mark each as "Billable to Client" or "Internal"
   - Require receipt uploads for expenses > $25
   - Link expenses to projects

4. Configure approval workflows:
   - Timesheets: Require project manager approval
   - Expenses: Require finance team approval for > $500
   - Set approval triggers: Weekly deadline (Fridays 5 PM)

**Expected Result:**
All billable time and expenses tracked with proper categorization

**Time Estimate:** 2 hours initial setup + 30 min per new project

**Notes/Pro Tips:**
💡 Use Harvest's "Budget" feature to alert when approaching project cap
💡 Require descriptions for all time entries for detailed invoices

---

### Step 2: Build Invoice Generation Automation
**Purpose:** Automatically create invoices from approved data

**Actions:**
1. Create zap/scenario in Zapier/Make:
   - **Trigger:** "Timesheet Approved" in Harvest
   - **Filter:** Only "Billable" projects and "Approved" status

2. Add data transformation step:
   - Pull time entries for date range (e.g., previous week)
   - Group by project (each client = separate invoice)
   - Sum hours by task category
   - Calculate totals: hours × rate

3. Add billing rules logic:
   ```
   IF project_type = "Hourly"
     THEN total = sum(hours × hourly_rate)
   ELSE IF project_type = "Fixed Fee - Milestone"
     THEN total = milestone_amount
     AND include progress percentage
   ELSE IF project_type = "Retainer"
     THEN total = retainer_monthly_fee
   ```

4. Add tax calculation:
   - Look up tax rate based on client location/state
   - Calculate tax: total × tax_rate
   - Add line item for taxes if > $0

5. Add currency conversion (if international):
   - Fetch exchange rate from API (e.g., Fixer.io)
   - Convert: total USD × rate = total EUR
   - Display both currencies on invoice

**Expected Result:**
Automation that pulls approved time/expenses and calculates invoice totals

**Time Estimate:** 3 hours

**Decision Point:**
```
IF total_amount > client_billing_threshold
  THEN require senior finance approval
  AND route to DocuSign for signature
ELSE
  THEN auto-approve and send directly
```

---

### Step 3: Create Invoice in Accounting Software
**Purpose:** Generate professional invoice with proper accounting

**Actions:**
1. Add "Create Invoice" action (QuickBooks/Xero):
   - Customer: Map from Harvest project → QuickBooks customer
   - Line items:
     - Time entries: "Professional Services - [Task Category]"
     - Expenses: "Reimbursed Expenses - [Category]"
   - Due date: invoice_date + payment_terms (e.g., +30 days)
   - Message: Custom message based on project type

2. Set invoice template:
   - Template A: Detailed time breakdown (hourly projects)
   - Template B: Summary with milestone progress (fixed fee)
   - Template C: Simple summary (retainers)
   - Include company logo, payment terms, contact info

3. Add invoice numbers:
   - Format: INV-[YYYY]-[####] (e.g., INV-2026-0456)
   - Auto-increment for each new invoice
   - Reset sequence each year

4. Add supporting details:
   - Purchase Order number (if client provided)
   - Project reference code
   - Contract period dates
   - Authorized contact from client side

**Expected Result:**
Professional invoice in QuickBooks ready for approval

**Time Estimate:** 1 hour

**Notes/Pro Tips:**
💡 Use QuickBooks "Custom Fields" to store project codes and PO numbers
💡 Set up "Recurring Invoices" for retainers to automate monthly

---

### Step 4: Configure Approval Workflow
**Purpose:** Ensure accuracy before sending to clients

**Actions:**
1. Set up approval routing:
   - **Invoices < $5,000:** Auto-approve (pre-approved rates)
   - **Invoices $5,000-$25,000:** Finance manager approval
   - **Invoices > $25,000:** CFO approval

2. Create DocuSign approval template:
   - Fields: Approver signature, date, comments
   - Email notification: "Invoice #INV-2026-0456 ready for review"
   - Reminder: Send reminder if not approved in 24 hours

3. Add approval logic:
   ```
   IF invoice_total < 5000
     THEN status = "Auto-Approved"
     AND skip DocuSign
   ELSE IF invoice_total >= 5000
     THEN send to DocuSign
     AND await approval
   ```

4. Handle approval rejections:
   - IF rejected in DocuSign:
     - Notify finance team immediately
     - Log rejection reason
     - Route back to Harvest for timesheet correction
     - Flag project manager to review

**Expected Result:**
Invoices reviewed and approved before client delivery

**Time Estimate:** 1.5 hours

---

### Step 5: Send Invoice with Payment Link
**Purpose:** Deliver invoice and enable easy payment

**Actions:**
1. Generate payment link (Stripe):
   - Create Stripe Payment Link from invoice total
   - Set payment methods: Credit card, ACH (for US clients)
   - Add invoice number to Stripe metadata
   - Set expiration: 60 days

2. Configure email delivery:
   - Template: Professional invoice email
   - From: billing@company.com
   - To: Client billing contact
   - CC: Project manager, Finance team
   - Attach: PDF invoice from QuickBooks
   - Include: Stripe payment link ("Pay Now" button)

3. Email template:
   ```
   Subject: Invoice INV-2026-0456 from [Company Name] - [Project Name]

   Hi [Client Name],

   Please find attached invoice INV-2026-0456 for [Project Name]
   covering the period [Date Range].

   Invoice Summary:
   - Total Hours: [X]
   - Billable Amount: $[Amount]
   - Expenses: $[Amount]
   - Tax: $[Amount]
   - **Total Due: $[Total]**

   Due Date: [Due Date]
   Payment Terms: Net 30

   💳 Pay Online Securely: [Stripe Payment Link]

   Or mail check to:
   [Company Name]
   [Address]
   [City, State ZIP]

   Questions? Reply to this email or call [Phone].

   Thank you for your business!
   [Finance Team]
   ```

4. Add delivery tracking:
   - IF email bounces: Alert finance team
   - IF email opened: Log in QuickBooks "Viewed" status
   - IF no payment in 7 days: Send reminder

**Expected Result:**
Client receives invoice with easy payment options

**Time Estimate:** 45 minutes

**Notes/Pro Tips:**
💡 Include late fee terms in invoice footer (e.g., "1.5% monthly after due date")
💡 Use Stripe's "Payment Methods" feature to save client cards for faster future payments

---

### Step 6: Track Payments & Send Reminders
**Purpose:** Monitor payment status and accelerate collections

**Actions:**
1. Set up payment tracking:
   - Trigger: "Invoice Paid" webhook from Stripe
   - Action: Update QuickBooks invoice status to "Paid"
   - Record: Payment date, payment method, transaction ID
   - Notify: Project manager, Finance team

2. Configure automated reminders:
   - **Reminder 1:** 7 days before due date
     - "Friendly reminder: Invoice INV-2026-0456 due in 7 days"
   - **Reminder 2:** On due date
     - "Invoice INV-2026-0456 due today - payment link included"
   - **Reminder 3:** 7 days past due
     - "Invoice INV-2026-0456 now 7 days overdue - please arrange payment"
   - **Reminder 4:** 14 days past due
     - "URGENT: Invoice INV-2026-0456 14 days overdue - late fees applied"

3. Handle overdue invoices:
   - IF 30+ days overdue:
     - Calculate late fees: 1.5% of invoice total
     - Add fee to QuickBooks invoice
     - Send updated invoice with late fees
     - Notify CFO and project manager

4. Weekly aging report:
   - Schedule: Every Monday at 9 AM
   - Report: All unpaid invoices grouped by age (0-30, 31-60, 61-90+ days)
   - Recipients: CFO, Finance team, Account managers
   - Action: Highlight invoices > 60 days for immediate follow-up

**Expected Result:**
Proactive payment tracking with automated reminders

**Time Estimate:** 1 hour

---

## 🔧 CONFIGURATION

### Settings & Parameters
| Parameter | Value | Description |
|-----------|-------|-------------|
| Invoice Approval Threshold | $5,000 | Minimum amount requiring manager approval |
| Payment Terms | Net 30 | Days until payment due |
| Late Fee Rate | 1.5% monthly | Fee for overdue payments |
| Reminder Schedule | -7, 0, +7, +14 days | When to send payment reminders |
| Currency Update Frequency | Daily | How often to refresh exchange rates |
| Invoice Number Format | INV-YYYY-#### | Sequential numbering |

### Customization Options
- **Approval thresholds:** Adjust based on team size and risk tolerance
- **Reminder frequency:** Add/remove reminders based on client relationships
- **Payment methods:** Add wire transfer, check, or cryptocurrency options
- **Invoice templates:** Create custom templates per client type

### Environment-Specific Settings
- **Development:** Test with small amounts ($10 invoices)
- **Staging:** Use test QuickBooks company and test Stripe keys
- **Production:** Live accounting and payment processing

---

## 🧪 TESTING PROCEDURES

### Pre-Deployment Checklist
- [ ] Unit test completed: Invoice calculation accuracy
- [ ] Integration test passed: End-to-end flow from Harvest to Stripe
- [ ] User acceptance test approved by: Finance Manager, CFO
- [ ] Performance benchmark met: < 5 minutes invoice generation
- [ ] Security review completed: PCI compliance for payment links

### Test Scenarios

**Scenario 1: Standard Hourly Invoice**
1. **Input:**
   - 40 hours billable time at $150/hr
   - 10 hours travel at $100/hr
   - $500 in billable expenses
   - Client: US-based (8% tax)
2. **Expected Output:**
   - Line items: Professional Services $6,000, Travel $1,000, Expenses $500
   - Subtotal: $7,500
   - Tax: $600 (8% of services only, not expenses)
   - Total: $8,100
   - Payment link: Stripe link for $8,100
3. **Actual Output:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 2: Fixed Fee Milestone Invoice**
1. **Input:**
   - Project: Website redesign, fixed fee $50,000
   - Milestone 3: Design complete, 30% of project
   - Client: EU-based (VAT applicable)
2. **Expected Output:**
   - Single line item: "Website Redesign - Milestone 3: Design Complete (30%)"
   - Amount: $15,000
   - VAT: $3,000 (20% EU VAT)
   - Total: $18,000
   - Payment link: Stripe link for €16,200 (converted)
3. **Actual Output:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 3: High-Value Approval Workflow**
1. **Input:**
   - Invoice total: $35,000 (exceeds $25,000 threshold)
   - Requires: CFO approval
2. **Expected Behavior:**
   - Route to DocuSign for CFO signature
   - Do NOT send to client until approved
   - Notify finance team of pending approval
   - Once approved: Auto-send with payment link
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 4: Payment Reminder Sequence**
1. **Input:**
   - Invoice created and sent, no payment received
   - Wait 7 days past due date
2. **Expected Behavior:**
   - Day -7: Send "7 days until due" reminder
   - Day 0: Send "Due today" reminder
   - Day +7: Send "Now 7 days overdue" reminder
   - Day +14: Send "URGENT: 14 days overdue" reminder
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 5: International Currency Conversion**
1. **Input:**
   - Client: UK-based, billing in GBP
   - Invoice: $10,000 USD services
   - Exchange rate: 1 USD = 0.79 GBP (current rate)
2. **Expected Output:**
   - Invoice displays both currencies:
     - Services: $10,000 USD / £7,900 GBP
     - Total: $10,000 USD / £7,900 GBP
   - Payment link: Stripe GBP link for £7,900
   - QuickBooks: Records in base currency (USD) with conversion note
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

### Rollback Testing
- [ ] Rollback procedure tested: March 10, 2026
- [ ] Data integrity verified: No duplicate invoices created
- [ ] Recovery time: 20 minutes (disable automation, manual invoice creation)

---

## 🚨 ERROR HANDLING

### Common Errors & Solutions

| Error | Cause | Solution | Prevention |
|-------|-------|----------|------------|
| Invoice total mismatch | Wrong rate applied | Verify project rate in Harvest | Sync rates monthly |
| Tax calculation error | Incorrect tax jurisdiction | Update client tax settings | Review quarterly |
| Duplicate invoice | Timesheet approved twice | Check for existing invoice # | Add deduplication check |
| Payment link expired | Stripe link > 60 days old | Regenerate link on demand | Auto-regenerate at 45 days |
| Client wrong email | Contact info outdated | Verify in CRM before sending | Quarterly data audit |
| Currency conversion outdated | Stale exchange rates | Use live API feed | Daily rate updates |

### Emergency Contacts
- **Primary:** Finance Ops Manager - finance@company.com - (555) 234-5678
- **Secondary:** CFO - cfo@company.com - (555) 345-6789
- **Escalation:** CEO - ceo@company.com - (555) 456-7890

### Failure Mode Analysis
**What happens when:**
- **QuickBooks API down:** Queue invoices in Google Sheet, auto-sync when restored
- **Harvest API fails:** Pull data from backup CSV export, process manually
- **Stripe payment link fails:** Send invoice without link, add "call to pay by phone"
- **Approval workflow broken:** Route all invoices to finance manager for manual review
- **Email bounces:** Alert finance team, phone client for updated contact info

---

## 📊 MONITORING & MAINTENANCE

### Key Metrics to Track
| Metric | Target | Alert Threshold | Frequency |
|--------|--------|-----------------|-----------|
| Invoice generation time | < 5 min | > 30 min | Real-time |
| Calculation accuracy | 100% | Any error | Per invoice |
| Payment cycle (avg) | 32 days | > 40 days | Weekly |
| Overdue invoice rate | < 15% | > 25% | Weekly |
| Payment link usage | > 60% | < 40% | Monthly |
| API error rate | < 1% | > 5% | Hourly |

### Daily Maintenance Tasks
- [ ] Check for failed invoice generations (5 minutes)
- [ ] Verify at least 1 invoice created successfully (2 minutes)
- [ ] Review overnight error logs (5 minutes)

### Weekly Maintenance Tasks
- [ ] Review invoice approval queue (15 minutes)
- [ ] Check payment aging report (10 minutes)
- [ ] Verify currency rates are current (5 minutes)
- [ ] Review client payment trends (15 minutes)
- [ ] Update tax rates if regulations changed (10 minutes)

### Monthly Maintenance Tasks
- [ ] Full audit of invoice accuracy (2 hours)
- [ ] Review and update project billing rates (1 hour)
- [ ] Clean up unpaid invoices > 90 days (1 hour)
- [ ] Performance audit: payment cycle analysis (1 hour)
- [ ] Security review: API key rotation (30 minutes)
- [ ] Documentation update based on feedback (1 hour)
- [ ] Retest automation with updated scenarios (2 hours)

### Maintenance Log
| Date | Task | Performed By | Notes |
|------|------|--------------|-------|
| March 13, 2026 | Initial deployment | Finance Ops | All tests passed |
| March 20, 2026 | Rate update | Finance Ops | Increased Design rate to $165/hr |
| April 1, 2026 | Tax update | Finance Ops | Added NJ tax rate 6.625% |
| April 15, 2026 | Payment cycle review | CFO | Avg cycle improved to 31 days |

---

## 🔄 ROLLBACK PROCEDURE

**When to Rollback:**
- Invoice calculation error rate > 5% in 1 day
- Payment link failures > 10% in 1 day
- Critical accounting discrepancy discovered
- Client complaints about incorrect invoices

**Rollback Steps:**
1. **Immediate Action:** Turn off automation in Zapier/Make
2. **Notify:** Email finance team and CFO: "Invoice automation paused - manual mode"
3. **Restore:**
   - Finance team creates invoices manually in QuickBooks
   - Pull timesheet data from Harvest directly
   - Generate payment links manually in Stripe
   - Send invoices via normal email process
4. **Verify:**
   - Check last 5 manually created invoices for accuracy
   - Confirm no duplicate invoices in QuickBooks
5. **Document:**
   - Log incident in "Finance Incident Report"
   - Note root cause and prevention steps

**Rollback Time Estimate:** 20 minutes to disable, 2-4 hours/day for manual processing

**Post-Rollback Actions:**
- [ ] Investigate root cause with technical team
- [ ] Fix issue in development environment
- [ ] Re-test all scenarios with sample data
- [ ] Update this SOP with lessons learned
- [ ] Gradual re-rollout: Start with low-risk clients first

---

## 📚 REFERENCE MATERIALS

### Related SOPs
- [Expense Report Processing](SOP-004): How expenses are approved and tracked
- [Payment Reconciliation](SOP-006): Matching payments to invoices
- [Collections Process](SOP-010): Handling overdue accounts

### External Documentation
- [QuickBooks API Documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting): Invoice creation
- [Harvest Time Tracking](https://help.getharvest.com/harvest): Managing projects and time
- [Stripe Payment Links](https://stripe.com/docs/payment-links): Creating payment links

### Training Resources
- Video: "Invoice Automation Walkthrough" (20 min) - Internal LMS
- Quick Reference: "Invoice Approval Thresholds" - Posted in finance slack
- Workshop: Monthly "Finance Automation Office Hours" - Last Thursday of month

---

## 📝 CHANGE LOG

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | March 13, 2026 | Initial version | Finance Ops Manager |
|  |  |  |  |

---

## 💬 FEEDBACK & IMPROVEMENTS

**Got ideas to improve this automation?**
1. Document suggestion in "Finance Automation Backlog" sheet
2. Test in development environment first
3. Submit for review at monthly finance operations meeting
4. Update this SOP after CFO approval

**Continuous Improvement:**
- Last optimization: March 20, 2026 (added automated reminders)
- Next scheduled review: April 15, 2026
- Optimization backlog: 2 items (wire transfer integration, bulk invoicing)

---

## ✅ APPENDIX: EXAMPLE OUTPUTS

### Example 1: Hourly Invoice
**Invoice Line Items:**
```
INV-2026-0456
Client: TechCorp Inc.
Date: March 1, 2026
Due: March 31, 2026

Professional Services - Development (40 hrs × $150/hr)    $6,000.00
Professional Services - Meetings (5 hrs × $150/hr)         $750.00
Travel - Client Site Visit (10 hrs × $100/hr)            $1,000.00
Reimbursed Expenses - Software                           $    500.00
                                                             ----------
Subtotal                                                     $8,250.00
Tax (CA 8%)                                                    $660.00
                                                             ----------
Total Due                                                     $8,910.00

Payment Link: https://pay.stripe.com/link/abc123
```

### Example 2: Payment Reminder Email
**Reminder 3 (7 Days Past Due):**
```
Subject: URGENT: Invoice INV-2026-0456 now 7 days overdue

Hi [Client Name],

Our records show that invoice INV-2026-0456 for $8,910.00
is now 7 days past due.

Invoice Details:
- Invoice Number: INV-2026-0456
- Due Date: March 31, 2026
- Days Overdue: 7
- Amount Due: $8,910.00
- Late Fees: $133.65 (1.5% monthly fee now applied)
- **New Total: $9,043.65**

💳 Pay Now: https://pay.stripe.com/link/abc123

If you've already paid, please disregard this notice and
send us the payment confirmation.

If there's an issue with the invoice, please contact us
immediately so we can resolve it.

Thank you,
[Finance Team]
billing@company.com
(555) 234-5678
```

---

## 🎓 NOTES FOR NEW USERS

**Critical Success Factors:**
1. **Keep timesheets current:** Delayed approvals = delayed invoices = delayed cash flow
2. **Test calculation logic:** One wrong tax rate can compound across many invoices
3. **Monitor approval queue:** Don't let high-value invoices sit unapproved
4. **Track payment patterns:** Know which clients consistently pay late

**Common Mistakes to Avoid:**
- ❌ Forgetting to update tax rates when jurisdictions change
- ❌ Sending invoices before verifying client PO numbers
- ❌ Ignoring small calculation errors (they add up)
- ❌ Not following up on overdue invoices promptly

**Best Practices:**
- ✅ Review invoice templates quarterly for professionalism
- ✅ Set up automatic late fees (but waive for good clients manually)
- ✅ Use payment links consistently - they dramatically increase on-time payments
- ✅ Keep a backup manual process for when automation inevitably breaks

**Remember:** "Systems before willpower. Automate the boring, keep the human."
