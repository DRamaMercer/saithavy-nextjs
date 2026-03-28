# Lead Capture Automation

> **"Turn the struggle into a system"**

## Problem It Solves

**The struggle:** Manual lead entry is a time-suck and error-prone. Leads come from landing pages, events, referrals—but they end up in spreadsheets, sticky notes, and your sales team's inbox. Welcome emails don't go out. Hot leads get cold. Sales opportunities slip through the cracks.

**The system:** Automatically capture every lead, score it based on criteria you define, route to the right salesperson, welcome the new prospect, and notify your team—all without lifting a finger.

**Time saved:** 3-5 hours per week
**Error reduction:** 90% (no more typos, lost leads, or missed follow-ups)
**Setup time:** 2-4 hours
**Maintenance:** 1 hour per quarter

---

## Tools Needed

### Required
- **Form tool**: Typeform, Google Forms, or Gravity Forms ($0-$29/month)
- **CRM**: HubSpot (free tier), Pipedrive ($12/month), or Airtable ($10/month)
- **Automation platform**: Zapier (free tier) or Make ($9/month)

### Optional But Recommended
- **Slack** or **Microsoft Teams** (for team notifications)
- **Email service**: ConvertKit, Mailchimp, or HubSpot (for welcome sequences)

### Total Monthly Cost
- **Minimum viable**: $0 (using free tiers)
- **Recommended setup**: $20-$50/month

---

## Step-by-Step Build (Zapier)

### Zap 1: Lead Capture to CRM

**Trigger**: New form submission
1. Connect your form tool (e.g., Typeform)
2. Select "New Entry" as trigger
3. Test trigger to ensure data is coming through

**Action 1**: Create/update CRM record
1. Connect your CRM (e.g., HubSpot)
2. Map form fields to CRM fields:
   - Email → Email (required)
   - Name → First Name, Last Name
   - Company → Company Name
   - Phone → Phone Number
   - "How did you hear about us?" → Lead Source
3. Set to "Create contact if doesn't exist, update if exists"
4. Test action to verify record creation

**Action 2**: Add lead score
1. In CRM, create custom property: "Lead Score" (number field)
2. Add scoring logic in Zapier:
   - If company size = "Enterprise" +20 points
   - If budget = "$10k+" +15 points
   - If timeline = "Immediate" +10 points
   - If referral = "Yes" +10 points
3. Update CRM record with calculated score
4. Test with sample data

---

### Zap 2: Welcome Email Sequence

**Trigger**: New CRM contact with Lead Score > 20

**Action 1**: Add to email list
1. Connect your email service (e.g., ConvertKit)
2. Add contact to "Leads - Hot" list/segment
3. Set to receive welcome sequence (see below)
4. Test to verify contact is added

**Action 2**: Send immediate welcome email
```
Subject: Thanks for your interest in [Company Name]!

Hi [First Name],

Thanks for reaching out! I received your inquiry and wanted to
let you know what happens next.

Within 24 hours, you'll hear from [Sales Rep Name] who will:
- Learn more about your specific needs
- Share how we've helped companies like [their company type]
- Answer any questions you have

In the meantime, here's a resource you might find helpful:
[Link to relevant case study or blog post]

Talk soon!

[Your Name]
Founder, [Company Name]
```

**Action 3**: Schedule drip sequence (Day 2, 4, 7)
- **Day 2**: Value-focused email (case study, testimonial)
- **Day 4**: Educational email (how-to guide, best practices)
- **Day 7**: Soft check-in (any questions? ready to talk?)

---

### Zap 3: Sales Team Notification

**Trigger**: New CRM contact with Lead Score > 40 (hot lead)

**Action 1**: Post to Slack channel
1. Connect Slack
2. Choose channel (e.g., #sales-leads)
3. Create message template:
```
🔥 New Hot Lead!

Name: [First Name] [Last Name]
Company: [Company Name]
Score: [Lead Score]/100
Source: [Lead Source]

Quick note: [Message from form - e.g., "Looking for help with..."]

[Link to CRM record]
```
4. Test to verify formatting and link

**Action 2**: Create task for sales rep
1. Connect task tool (Asana, HubSpot Tasks, etc.)
2. Create task: "Follow up with [Company Name]"
3. Assign to rep based on territory (use lookup table)
4. Set due date: Tomorrow
5. Add CRM record link and lead details
6. Test assignment

---

### Zap 4: Lead Routing (Multi-Territory)

**Trigger**: New CRM contact

**Action**: Assign to sales rep based on territory
1. Create lookup table in Zapier:
   - "US West" → Rep A
   - "US East" → Rep B
   - "Europe" → Rep C
   - "Asia" → Rep D
2. Match form field "Location/Region" to lookup table
3. Update CRM "Owner" field with assigned rep
4. Send notification to assigned rep
5. Test with various locations

---

## Step-by-Step Build (Make/Integromat)

### Scenario 1: Complete Lead Capture Flow

**Trigger**: Watch new entries in Typeform
1. Add Typeform module
2. Select form to watch
3. Set poll frequency (e.g., 15 minutes)

**Route 1**: Score and categorize lead
1. Add "Router" module
2. Create routes based on lead score:
   - Route 1: Score > 40 (Hot lead)
   - Route 2: Score 20-40 (Warm lead)
   - Route 3: Score < 20 (Cold lead)

**Route 1 Actions** (Hot leads):
1. Create HubSpot contact
2. Add to "Hot Leads" list
3. Send Slack notification to #sales-leads
4. Create high-priority task
5. Send personal email from founder

**Route 2 Actions** (Warm leads):
1. Create HubSpot contact
2. Add to email welcome sequence
3. Send Slack notification to #sales-leads (different emoji)
4. Create standard follow-up task

**Route 3 Actions** (Cold leads):
1. Create HubSpot contact
2. Add to nurture campaign (monthly newsletter)
3. No Slack notification (don't clutter)
4. No task (automated nurture only)

**Error Handling**:
1. Add "Error Handler" route
2. Send Slack notification to #automation-errors
3. Log error to Google Sheets for review
4. Send email to automation manager

---

## Workflow Diagram

```
[Form Submission]
       ↓
[Capture Data]
       ↓
[Calculate Lead Score]
       ↓
   ┌───┴────┬─────────┐
   ↓        ↓         ↓
[Hot]    [Warm]    [Cold]
   ↓        ↓         ↓
[CRM]     [CRM]      [CRM]
   ↓        ↓         ↓
[Slack]   [Email]   [Email]
[Task]    [Task]    (nurture)
[Email]   (sequence)
   ↓        ↓
[Personal  (drip)
Follow-up] sequence]
```

---

## Testing Checklist

Before going live, test these scenarios:

### ✅ Basic Functionality
- [ ] Form submission creates CRM record
- [ ] All fields map correctly (no missing data)
- [ ] Lead score calculates accurately
- [ ] Duplicate handling works (updating vs. creating)

### ✅ Hot Lead Path (Score > 40)
- [ ] Slack notification posts immediately
- [ ] Task creates for correct rep
- [ ] Welcome email sends within 5 minutes
- [ ] CRM link in notification works
- [ ] Lead assigned to correct territory

### ✅ Warm Lead Path (Score 20-40)
- [ ] Added to email sequence
- [ ] Welcome email sends
- [ ] Task creates with standard priority
- [ ] Drip sequence schedules correctly

### ✅ Cold Lead Path (Score < 20)
- [ ] Added to nurture list
- [ ] No Slack notification (don't clutter)
- [ ] No task created
- [ ] Monthly newsletter sends

### ✅ Edge Cases
- [ ] Duplicate email address (updates existing, doesn't create duplicate)
- [ ] Missing fields (gracefully handles incomplete data)
- [ ] Special characters (handles emojis, apostrophes, etc.)
- [ ] Very long responses (doesn't truncate)
- [ ] Multiple rapid submissions (queue processes correctly)

### ✅ Error Handling
- [ ] If CRM is down, notification sends
- [ ] If Slack is down, email backup sends
- [ ] If form field is missing, uses default value
- [ ] Automation errors logged for review

---

## Common Pitfalls & Fixes

### ❌ Pitfall 1: Lead Scoring Too Complex
**What happens**: 20 different scoring criteria, impossible to maintain, mysterious scores.

**Fix it**: Start simple. 3-5 criteria max. Reevaluate quarterly. You can always add complexity later.

**Real example**: I built a 15-criteria scoring system. It was genius but impossible to maintain. Simplified to 5 criteria and actually used it.

---

### ❌ Pitfall 2: No Duplicate Handling
**What happens**: Same person submits form twice. Now you have duplicate records, confusion, and annoyed sales reps.

**Fix it**: Always set CRM action to "Create if doesn't exist, update if exists" keyed by email address.

**Real example**: Had a client who created 7 duplicates for one lead. Sales team chased the same person 7 times. They blocked us.

---

### ❌ Pitfall 3: Welcome Email Too Generic
**What happens**: "Thanks for your interest!" with no context. Feels robotic. Low engagement.

**Fix it**: Reference what they told you. "I saw you're looking for help with [specific challenge]." Use their name, company, problem.

**Real example**: Changed generic welcome to personalized ("saw you're in healthcare dealing with HIPAA..."). Reply rate went from 3% to 22%.

---

### ❌ Pitfall 4: Slack Notification Fatigue
**What happens**: Every lead triggers notification. Team tunes out. Hot leads get ignored along with cold ones.

**Fix it**: Only notify for qualified leads (Score > 40). Use different channels or emojis for urgency. Don't cry wolf.

**Real example**: Team stopped checking #sales-leads because it was 90% noise. Changed to only notify hot leads. Channel became useful again.

---

### ❌ Pitfall 5: Missing Mobile Phone Formatting
**What happens**: Phone numbers come in as "(555) 123-4567" but CRM expects "5551234567". Calls fail.

**Fix it**: Add formatting step in automation. Strip all non-numeric characters. Validate length.

**Real example**: 30% of phone numbers couldn't be dialed because of formatting. Added formatting step. Fixed.

---

### ❌ Pitfall 6: Territory Routing Logic
**What happens**: "US-West" routes to wrong rep because of slight spelling variation ("US West", "us-west", "US WEST").

**Fix it**: Use "contains" matching, not exact match. Normalize to lowercase. Add fallback territory.

**Real example**: Missed 15% of leads because of "West" vs "west". Added normalize + contains. Fixed.

---

### ❌ Pitfall 7: Automation Breaks Silently
**What happens**: CRM API changes. Automation fails. Nobody notices for 2 weeks. 50 leads lost.

**Fix it**: Add error handling. Send Slack notification on failure. Log errors to spreadsheet. Weekly review of error log.

**Real example**: Automation broke for 11 days. Lost 89 leads. Added error notifications. Next break caught in 2 hours.

---

## Maintenance Guide

### Weekly (5 minutes)
- [ ] Check Zapier/Make run history for errors
- [ ] Review error log spreadsheet
- [ ] Verify recent leads came through correctly

### Monthly (30 minutes)
- [ ] Review lead scoring criteria
- [ ] Check conversion rates by score
- [ ] Adjust scoring if needed (e.g., raise threshold if too many low-quality leads)
- [ ] Verify all integrations still working

### Quarterly (1 hour)
- [ ] Full end-to-end test (submit test form, verify entire flow)
- [ ] Review welcome email performance (open rates, click rates)
- [ ] Get feedback from sales team (are notifications useful? lead quality?)
- [ ] Check for new features in tools (better ways to do things)
- [ ] Update territory assignments if team changed

### Annually (2 hours)
- [ ] Audit entire automation (still needed? better way?)
- [ ] Review costs (cheaper tools? consolidating platforms?)
- [ ] Document learnings and improvements
- [ ] Consider if more advanced lead scoring is needed

---

## Real Implementation

### Company: B2B SaaS Startup (Marketing Team Size: 2)

**Before automation:**
- Manual lead entry: 5 hours/week
- Welcome emails sent sporadically (when someone remembered)
- Hot leads sat for 2-3 days before follow-up
- Sales team complained about lead quality
- Lost leads from manual entry errors

**After automation:**
- Lead entry: 0 hours/week
- Welcome emails: 100% sent within 5 minutes
- Hot leads: Sales notified instantly, follow-up within 2 hours
- Lead scoring helped team prioritize
- Zero lost leads from data entry

**Results after 3 months:**
- Time saved: 20 hours/month
- Lead response time: From 48 hours to 2 hours
- Lead-to-meeting conversion: Up 35%
- Sales team satisfaction: "Finally getting quality leads"
- ROI: $50/month in tools → $2,000/month in saved time + more deals

**What broke:**
- Month 2: CRM API changed, automation failed for 4 days
  - Fix: Added error notifications, caught in 2 hours next time
- Month 3: Form added new field, automation didn't capture it
  - Fix: Added field mapping review to monthly checklist

**What they'd do differently:**
- Start with simpler scoring (5 criteria, not 15)
- Set up error notifications from day 1
- Test with 10 real leads before fully launching

---

## Advanced Features (Once Basic Version Works)

### 1. Lead Enrichment
- Use Clearbit, FullContact, or similar to auto-fill company info
- Add employee count, industry, tech stack
- Helps scoring and personalization

### 2. Behavioral Scoring
- Track website visits, email opens, link clicks
- Increase lead score for engagement
- Prioritize leads showing buying signals

### 3. Account-Based Marketing
- If lead from target account company, boost score
- Route to enterprise team instead of general sales
- Trigger special ABM sequence

### 4. SMS Follow-Up
- For hot leads, add SMS notification to sales rep
- Faster response than email
- Higher conversion for urgent inquiries

### 5. Calendar Integration
- For very hot leads, suggest booking meeting immediately
- Link to Calendly in welcome email
- Auto-create task if meeting booked

---

## Limitations & What It Can't Do

### ❌ Can't Replace Human Judgment
Lead scoring is a signal, not a decision. Low score doesn't mean "ignore"—just "prioritize lower." High score doesn't guarantee sale. Your team still needs to assess fit.

### ❌ Can't Fix Bad Forms
Garbage in, garbage out. If your form asks confusing questions, you'll get confusing data. Automation just processes what you give it.

### ❌ Can't Handle Complex Sales Cycles
This is for initial capture and routing. Complex, multi-stakeholder sales still require human orchestration. Automation supports, doesn't replace, your sales process.

### ❌ Can't Compensate for Slow Follow-Up
If your sales team doesn't follow up quickly, automation doesn't matter. Speed to lead is critical. Automation enables speed, but humans must execute.

### ❌ Can't Overcome Poor Fit
A perfectly automated, perfectly scored lead still won't buy if they're not a good fit. Automation improves efficiency, not product-market fit.

---

## Remember

**Automation amplifies your process, it doesn't fix a broken one.** Get the handoff between marketing and sales working manually first. Then automate it.

**Turn the struggle into a system**

---

## Quick Start

### If you have 2 hours:
1. Set up Typeform → Zapier → HubSpot
2. Create basic 3-criteria lead scoring
3. Send simple welcome email
4. Test thoroughly
5. Go live

### If you have 4 hours:
1. All of the above (2 hours)
2. Add Slack notifications for hot leads
3. Create territory routing
4. Build drip sequence (3 emails)
5. Add error handling

### If you have 8 hours:
1. All of the above (4 hours)
2. Add task creation for sales reps
3. Implement lead enrichment
4. Create advanced scoring (5+ criteria)
5. Build full documentation

---

**Bottom line:** Every hour you spend building this saves you 5 hours per week. That's 250 hours per year. What would you do with an extra month of time?
