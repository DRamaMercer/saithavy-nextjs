# Invoice & Payment Automation

> **"Turn the struggle into a system"**

## Problem It Solves

**The struggle:** You track time in one tool, manually create invoices in another, chase payments via email, calculate late fees by hand, and then enter everything into accounting software. It's repetitive, error-prone, and wastes hours you could spend on billable work. Plus, you forget to follow up and payments sit outstanding for months.

**The system:** Time tracked automatically triggers invoice creation. Invoices send instantly. Payment reminders go out on schedule. Late fees calculate and apply automatically. Payments sync to your accounting software. You just do the work and get paid.

**Time saved:** 5-8 hours per month
**Error reduction:** 95% (no more calculation mistakes or lost invoices)
**Faster payment:** Average time to payment drops 40%
**Setup time:** 4-6 hours
**Maintenance:** 1 hour per quarter

---

## Tools Needed

### Required
- **Time tracking**: Harvest, Toggl Track, or Clockwise ($10-$20/month)
- **Invoicing**: FreshBooks, QuickBooks, or Xero ($15-$30/month)
- **Payment processing**: Stripe, PayPal, or Wave (2.9% + $0.30 per transaction)
- **Automation platform**: Make ($9/month) - Zapier can't handle this complexity

### Optional But Recommended
- **Accounting**: QuickBooks Online ($25/month) or Xero ($12/month)
- **Contract management**: HelloWorks, DocuSign ($10-$25/month)
- **CRM**: HubSpot or Pipedrive (to track client relationships)

### Total Monthly Cost
- **Minimum viable**: $25/month (Harvest + FreshBooks + Make)
- **Recommended setup**: $50-$80/month

---

## Step-by-Step Build (Make/Integromat)

### Scenario 1: Time Tracked → Invoice Created

**Trigger**: New timesheet entry approved in Harvest
1. Add "Watch a Timesheet Entry" module for Harvest
2. Filter: Only when "Approved" = true
3. Extract: Hours, project, client, rate, description, date

**Action 1: Check if should invoice now**
1. Add "Router" module
2. Condition: Client billing setting
   - Route A: "Weekly invoicing" - Create invoice every Friday
   - Route B: "Monthly invoicing" - Create invoice on 1st of month
   - Route C: "Project completion" - Create invoice when project marked complete
   - Route D: "Retainer" - Create invoice on retainer schedule

**Route A Example (Weekly invoicing):**
1. Add "Date/Time" aggregator module
2. Group all approved timesheet entries by client + week
3. Calculate: Total hours × Rate = Amount

**Action 2: Create invoice in FreshBooks**
1. Add "Create an Invoice" module for FreshBooks
2. Map fields:
   - Client: From timesheet
   - Date: Today
   - Due date: Net 15 (today + 15 days)
   - Line items: Grouped timesheet entries
     - Description: "Professional services - Week of [date]"
     - Quantity: Total hours
     - Rate: Client rate
   - Notes: Standard payment terms
3. Create invoice
4. Store Invoice ID for tracking

**Action 3: Update project in Harvest**
1. Add "Update a Project" module for Harvest
2. Mark: "Invoiced" = true
3. Add invoice number and link to project notes
4. Prevent double invoicing

---

### Scenario 2: Invoice Created → Sent + Payment Reminder

**Trigger**: New invoice created in FreshBooks (from Scenario 1)

**Action 1: Send invoice email**
1. Add "Send an Invoice" module for FreshBooks
2. Email template:
   ```
   Subject: Invoice [Invoice Number] for [Month] - [Company Name]

   Hi [Client Name],

   Please find attached invoice for [description] for the period of [date range].

   INVOICE DETAILS
   Invoice Number: [Invoice Number]
   Amount Due: [Amount]
   Due Date: [Due Date]

   PAYMENT METHODS
   - Bank Transfer: [Account details]
   - Credit Card: [Payment link]
   - PayPal: [PayPal link]

   QUESTIONS?
   If you have any questions about this invoice, just reply to this email.

   Thanks for your business!

   [Your Name]
   [Company Name]
   ```
3. Attach PDF invoice
4. Send to client billing contact

**Action 2: Schedule payment reminders**
1. Add "Create a Reminder" module
2. Reminder 1: 3 days before due date
3. Reminder 2: On due date
4. Reminder 3: 7 days past due
5. Reminder 4: 14 days past due
6. Reminder 5: 30 days past due (final notice + late fee)

**Action 3: Log to accounting spreadsheet**
1. Add "Create a Row" module for Google Sheets/Airtable
2. Table: Invoice Log
3. Fields:
   - Invoice number
   - Client
   - Amount
   - Date issued
   - Due date
   - Payment status (Pending)
   - Reminder sent (None yet)

---

### Scenario 3: Payment Reminders

**Trigger**: Scheduled reminder fires (from Scenario 2)

**Route**: Based on reminder type

**Route 1: 3 Days Before Due Date**
```
Subject: Friendly reminder: Invoice [Invoice Number] due in 3 days

Hi [Client Name],

Just a friendly reminder that invoice [Invoice Number] for [Amount]
is due on [Due Date].

PAYMENT LINK: [Quick payment link]

Everything looks good on my end, so just wanted to make sure you
had this on your radar.

Thanks!

[Your Name]
```

**Route 2: On Due Date**
```
Subject: Today's the day! Invoice [Invoice Number] due now

Hi [Client Name],

Invoice [Invoice Number] for [Amount] is due today.

PAY NOW: [Quick payment link]

If you've already paid, thank you! You can ignore this email.

If you need more time, just let me know and we can work something out.

Best,
[Your Name]
```

**Route 3: 7 Days Past Due**
```
Subject: OVERDUE: Invoice [Invoice Number]

Hi [Client Name],

Invoice [Invoice Number] for [Amount] is now 7 days overdue.

OUTSTANDING INVOICE: [Link to invoice]
AMOUNT: [Amount]
DUE DATE: [Due Date]
DAYS OVERDUE: 7

Please remit payment at your earliest convenience.

If you have questions or need to discuss payment terms, please
reply to this email and let's talk.

Thanks,
[Your Name]
```

**Route 4: 14 Days Past Due**
```
Subject: URGENT: Invoice [Invoice Number] - 14 days overdue

Hi [Client Name],

Invoice [Invoice Number] is now 14 days overdue.

OUTSTANDING INVOICE: [Link to invoice]
AMOUNT: [Amount]
DUE DATE: [Due Date]
DAYS OVERDUE: 14
LATE FEE: [Calculate: 1.5% per month = $X]

Please remit payment immediately to avoid additional late fees.

If there's an issue with this invoice or you need to discuss a
payment plan, please reply immediately.

Let's get this resolved.

[Your Name]
```

**Route 5: 30 Days Past Due (Final Notice)**
```
Subject: FINAL NOTICE: Invoice [Invoice Number] - Services may be suspended

Hi [Client Name],

Invoice [Invoice Number] is now 30 days overdue.

OUTSTANDING INVOICE: [Link to invoice]
AMOUNT: [Amount]
DUE DATE: [Due Date]
DAYS OVERDUE: 30
LATE FEES: [Calculate total]

FINAL NOTICE
Unless payment is received within 5 business days, we will be
forced to:
- Suspend all ongoing work
- Pause access to [services/tools]
- Consider this account delinquent

We value your business and don't want to reach this point.
If you're experiencing financial difficulties, let's discuss a
payment plan NOW rather than later.

Please reply immediately to avoid service interruption.

[Your Name]
```

---

### Scenario 4: Late Fee Calculation

**Trigger**: Invoice is 30+ days overdue

**Action 1: Calculate late fee**
1. Add "Math" module in Make
2. Formula: `Invoice Amount × 0.015 × (Days Overdue ÷ 30)`
3. Example: $5,000 × 1.5% × (30 ÷ 30) = $75 late fee
4. Cap: Maximum 10% of invoice amount

**Action 2: Update invoice with late fee**
1. Add "Update an Invoice" module for FreshBooks
2. Add line item:
   - Description: "Late fee - [Days Overdue] days overdue"
   - Quantity: 1
   - Rate: [Calculated late fee]
3. Update invoice total
4. Mark: "Late fee applied" = true

**Action 3: Send updated invoice**
1. Add "Send an Invoice" module for FreshBooks
2. Email: Subject includes "UPDATED WITH LATE FEE"
3. Include: Original amount + late fee breakdown
4. Payment link: Updated total

---

### Scenario 5: Payment Received

**Trigger**: Payment recorded in FreshBooks/Stripe

**Action 1: Send payment confirmation**
```
Subject: Payment received - Invoice [Invoice Number]

Hi [Client Name],

Great news! We've received your payment of [Amount] for invoice
[Invoice Number].

PAYMENT DETAILS
Invoice: [Invoice Number]
Amount Paid: [Amount]
Payment Date: [Date]
Payment Method: [Credit Card / Bank Transfer / etc.]

Transaction ID: [Transaction ID for their records]

Your account is current. Thank you for your prompt payment!

We look forward to continuing to work together.

Best regards,
[Your Name]
[Company Name]
```

**Action 2: Update accounting software**
1. Add "Create a Payment" module for QuickBooks/Xero
2. Map payment details from FreshBooks
3. Reconcile against invoice
4. Mark invoice: "Paid" = true

**Action 3: Update invoice log**
1. Add "Update a Row" module for Google Sheets/Airtable
2. Find invoice by invoice number
3. Update fields:
   - Payment status: "Paid"
   - Payment date: [Today]
   - Payment method: [From FreshBooks]
   - Days to pay: [Calculate]

**Action 4: Financial reporting**
1. Add "Create a Row" module for Google Sheets
2. Table: Financial Dashboard
3. Fields:
   - Date: [Today]
   - Client: [Client name]
   - Amount: [Payment amount]
   - Days to pay: [Calculated]
   - On time? (Yes if ≤ 15 days, No if > 15 days)

**Action 5: Internal notification**
1. Add "Create a Message" module for Slack
2. Channel: #finance
3. Message: "💰 Payment received: [Client Name] - [Amount] - Invoice [Invoice Number]"

---

## Workflow Diagram

```
[Time Tracked & Approved]
       ↓
[Check Invoicing Schedule]
   ┌───┴───┬────────┐
   ↓       ↓        ↓
[Weekly] [Monthly] [Project]
   ↓       ↓        ↓
[Group by Client]  [Invoice on Complete]
   ↓       ↓        ↓
[Create Invoice] ←───────┘
   ↓
[Send Invoice Email]
   ↓
[Schedule Reminders]
   ↓
   ┌──────────────────────────────────┐
   ↓                                  ↓
[Payment Received?]              [Wait for Due Date]
   ↓                                  ↓
[Send Confirmation]            [3 Days Before: Reminder]
   ↓                                  ↓
[Sync to Accounting]           [Due Date: Reminder]
   ↓                                  ↓
[Update Log]                    [7 Days Overdue: Reminder]
   ↓                                  ↓
[Notify Team]                   [14 Days Overdue + Late Fee]
                                     ↓
                              [30 Days Overdue: Final Notice]
                                     ↓
                              [Suspend Services (manual)]
```

---

## Testing Checklist

Before going live, test these scenarios:

### ✅ Invoice Creation Flow
- [ ] Timesheet entry triggers invoice creation
- [ ] Correct client selected
- [ ] Line items populate correctly (hours, rates, descriptions)
- [ ] Invoice total calculates accurately
- [ ] Due date sets correctly (Net 15)

### ✅ Invoice Delivery
- [ ] Invoice email sends immediately
- [ ] Email includes all required details
- [ ] PDF invoice attaches correctly
- [ ] Payment links work
- [ ] Client receives and can open invoice

### ✅ Reminder Sequence
- [ ] Reminder 1 sends 3 days before due date
- [ ] Reminder 2 sends on due date
- [ ] Reminder 3 sends 7 days past due
- [ ] Reminder 4 sends 14 days past due (with late fee)
- [ ] Reminder 5 sends 30 days past due (final notice)

### ✅ Late Fee Calculation
- [ ] Late fee calculates correctly (1.5% per month)
- [ ] Late fee capped at 10% of invoice
- [ ] Updated invoice sends with late fee
- [ ] Email explains late fee breakdown

### ✅ Payment Processing
- [ ] Payment triggers confirmation email
- [ ] Accounting software syncs correctly
- [ ] Invoice log updates to "Paid"
- [ ] Financial dashboard records payment
- [ ] Team notified via Slack

### ✅ Edge Cases
- [ ] Multiple timesheets for same client (group into one invoice)
- [ ] Client has different billing schedule (weekly vs. monthly)
- [ ] Partial payment received (update balance correctly)
- [ ] Client disputes invoice (stop reminders, flag for manual review)
- [ ] Overpayment recorded (handle credit correctly)

---

## Common Pitfalls & Fixes

### ❌ Pitfall 1: Double Invoicing
**What happens:** Same time tracked entry triggers two invoices. Client billed twice. Very unprofessional.

**Fix it:** Mark timesheet entries as "Invoiced" after invoice creation. Only invoice entries marked "Approved" but not "Invoiced."

**Real example:** Client got billed for same 20 hours twice. Had to credit one invoice, apologize. Now strict "Invoiced" flag prevents this.

---

### ❌ Pitfall 2: Wrong Email Address
**What happens:** Invoice sends to old contact at client company. Sits in someone's inbox who left the company. Payment never comes.

**Fix it:** Use CRM billing contact, not project contact. Validate email address exists. Annual verification of billing contacts.

**Real example:** Sent invoices to person who left company 6 months ago. $15k sat unpaid for 3 months. Now verify billing contacts quarterly.

---

### ❌ Pitfall 3: Late Fees Anger Good Clients
**What happens:** Long-time client who always pays (but sometimes late) gets hit with late fee. They're offended. Relationship damaged.

**Fix it:** Don't automate late fees for everyone. Review client-by-client. Manually approve late fees for good clients. Or waive as "goodwill gesture."

**Real example:** $50k client got $75 late fee. They were insulted. Waived it, apologized. Now late fees require manual approval for clients >$10k.

---

### ❌ Pitfall 4: Payment Links Don't Work
**What happens:** Client clicks "Pay Now" link but it's broken or leads to generic page. They give up, pay later (or never).

**Fix it:** Test every payment link before sending. Make it one-click payment (pre-fill amount, invoice number). Multiple payment options.

**Real example:** 20% of clients couldn't figure out payment link. Dropped payment time from 30 days to 45 days. Simplified to one-click. Back to 20 days.

---

### ❌ Pitfall 5: Reminders Send After Payment
**What happens:** Client pays on Day 13. Automation doesn't know. Sends "7 days past due" reminder on Day 14. Client annoyed.

**Fix it:** Check payment status before sending every reminder. If paid, cancel reminder sequence.

**Real example:** Client paid Day 10, got "past due" email Day 14. They were confused. Now automation checks payment status first.

---

### ❌ Pitfall 6: Accounting Sync Fails
**What happens:** FreshBooks and QuickBooks don't sync. Payment recorded in FreshBooks but not QuickBooks. Books don't balance.

**Fix it:** Add error handling. If sync fails, notify immediately. Manual reconciliation log. Weekly sync verification.

**Real example:** Sync failed silently for 3 weeks. 45 payments not in QuickBooks. Month-end reconciliation was nightmare. Added failure notifications.

---

### ❌ Pitfall 7: Tax Law Changes
**What happens:** Tax rates change. Automation still uses old rate. Invoices have wrong tax. Legal and accounting headache.

**Fix it:** Centralized tax rate configuration. Quarterly tax law review. Test invoices when rates change.

**Real example:** State tax rate changed, automation didn't update. 40 invoices had wrong tax. Had to reissue all. Now tax rates in one place, reviewed quarterly.

---

## Maintenance Guide

### Weekly (30 minutes)
- [ ] Review invoice log (any invoices not sent?)
- [ ] Check for failed payments
- [ ] Verify accounting sync working
- [ ] Respond to payment questions

### Monthly (2 hours)
- [ ] Review outstanding invoices (30+ days)
- [ ] Follow up manually on very overdue accounts
- [ ] Calculate and review late fees (should you waive any?)
- [ ] Update client billing contacts (any changes?)
- [ ] Financial dashboard review (trends, issues)

### Quarterly (4 hours)
- [ ] Review all automations end-to-end
- [ ] Check tax rates (any changes?)
- [ ] Update payment terms if needed
- [ ] Analyze payment times (clients consistently late?)
- [ ] Review late fee policy (is it working?)
- [ ] Backup financial data

### Annually (8 hours)
- [ ] Complete billing process audit
- [ ] Review all client contracts
- [ ] Update tax forms (W9s, etc.)
- [ ] Evaluate if tools still right for business
- [ ] Set goals for next year (reduce payment time, etc.)
- [ ] Document annual learnings

---

## Real Implementation

### Company: Digital Agency (6 employees, $1M ARR)

**Before automation:**
- Manual invoicing: 8 hours/month
- Chased payments: 4 hours/month
- Average payment time: 35 days
- 15% of invoices 60+ days overdue
- Frequent calculation errors
- Embarrassing follow-up delays

**After automation:**
- Automated invoicing: 1 hour/month (review)
- Automated reminders: 0 hours
- Average payment time: 18 days (48% faster)
- 3% of invoices 60+ days overdue (80% reduction)
- Zero calculation errors
- Professional, timely follow-up

**Results after 12 months:**
- Time saved: 132 hours/year
- Cash flow: Improved by $45k (faster payments)
- Overdue invoices: Reduced by 85%
- Client satisfaction: Up (clear, professional process)
- Revenue: Up (less time chasing, more time doing billable work)

**What broke:**
- Month 3: Tax rate changed, invoices had wrong tax
  - Fix: Centralized tax rate config, quarterly review
- Month 7: Payment link failed for international client
  - Fix: Added multiple payment methods by region
- Month 10: Good client hit with late fee, relationship strained
  - Fix: Manual approval for clients >$25k

**What they'd do differently:**
- Test payment links with international clients from day 1
- Build client-specific rules earlier (not all clients should get late fees)
- Add "pause reminders" feature for clients discussing payment plans

---

## Advanced Features (Once Basic Version Works)

### 1. Dynamic Payment Terms
- Different terms for different clients (Net 15, Net 30, Net 60)
- Automatically offer early payment discounts (2% 10 days)
- Longer terms for high-value clients

### 2. Predictive Billing
- AI predicts which clients will pay late
- Flag high-risk invoices for extra attention
- Adjust payment terms based on history

### 3. Multi-Currency Support
- Automatic currency conversion
- Client-billed in their currency
- Accounting handled in your currency

### 4. Expense Integration
- Automatically attach project expenses to invoices
- Receipt scanning and categorization
- Profit margin calculation per invoice

### 5. Client Portal
- Self-service portal for clients to view/pay invoices
- Download past invoices, update billing info
- Reduces "can you send me a copy?" requests

---

## Limitations & What It Can't Do

### ❌ Can't Fix Cash Flow Issues
Automation speeds payment but can't make clients pay faster than their cash flow allows. Some clients will always be slow. Build buffer.

### ❌ Can't Handle Complex Billing
Retainers with draws, milestone-based billing, percent-complete billing—these are complex and often require manual invoicing.

### ❌ Can't Replace Human Judgment
When to send final notice? When to waive late fee? When to offer payment plan? These are business decisions, not automation.

### ❌ Can't Fix Bad Contracts
If contract doesn't specify payment terms or late fees, automation can't create them. Good contracts = good automation.

### ❌ Can't Sue Non-Paying Clients
Automation can remind, but can't force payment. For truly delinquent accounts, you need collections or legal action.

---

## Remember

**Automating invoicing isn't about being aggressive—it's about being consistent.** Clear, professional, predictable billing processes build trust. Clients know what to expect, you know what to do, and everyone wins.

**Turn the struggle into a system**

---

## Quick Start

### If you have 4 hours:
1. Set up time tracking → invoice creation
2. Build invoice email template
3. Create basic 3-reminder sequence
4. Test with 1 invoice
5. Go live with 1 client

### If you have 6 hours:
1. All of the above (4 hours)
2. Add late fee calculation
3. Build payment confirmation flow
4. Sync to accounting software
5. Create financial dashboard

### If you have 12 hours:
1. All of the above (6 hours)
2. Implement all 5 reminder types
3. Add multi-client billing schedules
4. Build client portal access
5. Complete documentation

---

**Bottom line:** Every hour you spend building this saves you 10 hours per month. That's 120 hours per year. What could you do with an extra 2 hours per week?
