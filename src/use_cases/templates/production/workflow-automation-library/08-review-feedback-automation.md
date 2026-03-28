# Review & Feedback Automation

> **"Turn the struggle into a system"**

## Problem It Solves

**The struggle:** You know you should be collecting feedback from customers and employees, but it feels overwhelming. Who do you ask? When? What do you ask? How do you categorize responses? Negative feedback sits unnoticed while you chase happy customers for testimonials. Positive feedback never gets shared. Employees quit and you never saw it coming.

**The system:** Automatic review requests sent at the right moments. Feedback collected, categorized, and routed instantly. Negative feedback triggers immediate alerts. Positive feedback gets shared with the team. Employee pulse surveys run regularly. You see trends, respond to issues, and celebrate wins—all on autopilot.

**Time saved:** 3-5 hours per week
**Feedback collection:** Up 400% (consistency works)
**Issue detection:** 10x faster (immediate alerts)
**Setup time**: 2-4 hours
**Maintenance:** 1 hour per month

---

## Tools Needed

### Required
- **Survey tool**: Typeform, Google Forms, or Tally (free-$29/month)
- **Automation platform**: Zapier (free tier) or Make ($9/month)
- **Notification**: Slack or Microsoft Teams (free)

### Optional But Recommended
- **Review platforms**: Google Reviews, Trustpilot, Capterra (free)
- **Sentiment analysis**: MonkeyLearn, Google Cloud NLP (pay-per-use)
- **Analytics**: Google Sheets or Airtable (free-$10/month)

### Total Monthly Cost
- **Minimum viable**: $0 (Typeform free + Zapier free)
- **Recommended setup:** $20-$40/month

---

## Step-by-Step Build (Zapier)

### Zap 1: Customer Review Request

**Trigger**: 7 days after purchase/project completion
1. Use "Scheduler by Zapier" or Make's "Wait" module
2. Trigger: 7 days after "Status: Complete" in CRM
3. Extract: Customer name, email, product/service purchased

**Action 1: Send review request email**
1. Connect Gmail/Outlook
2. Send email:
   ```
   Subject: Quick favor, [Name]?

   Hi [Name],

   I'm writing to ask a small favor.

   You recently [purchased X / worked with us on Y], and I'm
   wondering if you'd be willing to share your experience?

   It would mean a lot to me personally, and it helps other
   customers decide if we're right for them.

   QUICK REVIEW (2 minutes)
   [Link to Typeform/Google review]

   The form asks 3 simple questions:
   1. What did we help you with?
   2. How was your experience?
   3. Would you recommend us?

   Takes 2 minutes max.

   WHY I'M ASKING
   We're a small business and reviews help us reach more people
   like you. Every review makes a difference.

   HONEST FEEDBACK
   If something wasn't great, I want to know. Reply to this email
   and tell me what we could do better. I read every response.

   Thank you for considering it!

   [Your Name]
   Founder, [Company Name]
   ```

**Action 2: Schedule follow-up reminder**
1. If no response in 7 days:
   - Send gentle reminder email:
     ```
     Subject: Re: Quick favor?

     Hi [Name],

     I know you're busy, so I'll keep this brief.

     If you have 2 minutes, I'd really appreciate your feedback:
     [Link to review]

     No pressure, but it would mean a lot.

     Thanks!
     [Your Name]
     ```

---

### Zap 2: Response Categorization & Routing

**Trigger**: New Typeform/Google Form response

**Action 1: Analyze sentiment**
1. Add "Sentiment Analysis" module (MonkeyLearn or similar)
2. Analyze: "What was your experience?" response
3. Output: Positive, Neutral, or Negative

**Action 2: Calculate rating score**
1. Extract: Numerical rating (1-5 or 1-10 scale)
2. Determine:
   - 9-10: "Promoter" (Positive)
   - 7-8: "Passive" (Neutral)
   - 0-6: "Detractor" (Negative)

**Action 3: Route based on sentiment + rating**

**Route A: Positive (9-10 + Positive sentiment)**
1. Add to "Positive Feedback" spreadsheet
2. Send to Slack #customer-love channel:
   ```
   ⭐ 5-STAR REVIEW!

   [Customer name]: "[Quote from review]"

   [Link to full review]
   ```
3. Send thank-you email:
   ```
   Subject: Thank you, [Name]!

   Hi [Name],

   Wow, thank you for the kind words!

   Your review made my day. I'm so glad we could [help with X].

   ONE SMALL FAVOR
   Would you mind posting this as a public review? It helps us
   reach more people:

   - Google: [Link]
   - [Other platform]: [Link]

   Totally understand if you'd prefer not to, but we'd be
   grateful for your support.

   Thanks again for being a great customer!

   [Your Name]
   ```

**Route B: Neutral (7-8 + Neutral sentiment)**
1. Add to "Neutral Feedback" spreadsheet
2. Send internal notification to customer success:
   ```
   📊 NEUTRAL FEEDBACK

   Customer: [Name]
   Rating: [7-8]
   Feedback: "[Quote]"

   Opportunity to improve: [What they mentioned]

   Consider reaching out to learn more.
   ```
3. Add to follow-up queue (contact in 30 days)

**Route C: Negative (0-6 + Negative sentiment)**
1. Add to "Critical Issues" spreadsheet
2. IMMEDIATE Slack notification to #customer-alerts:
   ```
   🚨 NEGATIVE FEEDBACK RECEIVED

   Customer: [Name]
   Rating: [0-6]
   Feedback: "[Quote]"

   IMMEDIATE ACTION REQUIRED
   - Read full feedback: [Link]
   - Respond within 2 hours
   - Escalate if needed

   This requires attention NOW.
   ```
3. Send email to founder/customer success lead:
   ```
   Subject: URGENT: Negative feedback from [Name]

   Negative feedback received. Please respond immediately.

   CUSTOMER: [Name]
   RATING: [0-6]/10
   FEEDBACK: "[Full feedback]"

   NEXT STEPS:
   1. Read full feedback here: [Link]
   2. Respond within 2 hours
   3. Document resolution in feedback log

   This is high priority.
   ```
4. Create task in Asana:
   - Title: "Resolve issue for [Name] - [Rating]/10"
   - Priority: High
   - Due: Today
   - Description: Customer feedback + link

---

### Zap 3: Employee Pulse Survey

**Trigger**: Last Friday of every month (scheduler)

**Action 1: Send pulse survey to all employees**
1. Send email:
   ```
   Subject: Quick monthly check-in (5 minutes)

   Hi team,

   It's time for our monthly pulse survey. This is anonymous,
   takes 5 minutes, and helps us make [Company Name] better.

   [Link to Typeform/Google Form]

   QUESTIONS:
   1. How are you feeling this month? (1-5 scale)
   2. What's going well right now?
   3. What's challenging you?
   4. What support do you need?
   5. Any suggestions for improvement?

   WHY THIS MATTERS
   Your feedback shapes decisions. We read every response and
   discuss themes at our monthly all-hands.

   ANONYMOUS
   Responses are confidential. We only share themes, not
   individual responses.

   Thank you for your feedback!

   [Founder/HR]
   ```

**Action 2: Aggregate responses after 7 days**
1. Trigger: 7 days after survey sent
2. Compile all responses
3. Calculate:
   - Average satisfaction score
   - Common themes (positive)
   - Common themes (challenges)
   - Request for support (by category)
   - Suggestions (categorized)

**Action 3: Generate monthly report**
1. Create document:
   ```
   # Monthly Employee Pulse Report
   **Month:** [Month Year]
   **Response rate:** [X]% of team

   ## Overall Sentiment
   **Average satisfaction:** [X]/5
   **Trend:** [↑ Same ↓] from last month
   **Distribution:**
   - Very positive (5): [X]%
   - Positive (4): [X]%
   - Neutral (3): [X]%
   - Negative (2): [X]%
   - Very negative (1): [X]%

   ## What's Going Well
   [Top 5 themes mentioned]

   ## What's Challenging
   [Top 5 challenges mentioned]

   ## Support Needed
   - Training: [X requests]
   - Resources: [X requests]
   - Process changes: [X requests]
   - Management support: [X requests]

   ## Suggestions
   [Top 5 suggestions]

   ## Action Items
   Based on this feedback, we're:
   1. [Action 1]
   2. [Action 2]
   3. [Action 3]

   ## Themes to Watch
   - [Concerning trend 1]
   - [Concerning trend 2]

   ---
   **Next survey:** [Date]
   ```

**Action 4: Send summary to leadership**
1. Email to founders/managers:
   - Subject: "[Company Name] Pulse - [Month] - [Sentiment]"
   - Attach full report
   - If satisfaction dropped >10%: Mark urgent

**Action 5: Share themes with team**
1. Send Slack message to #general:
   ```
   📊 MONTHLY PULSE RESULTS

   Thank you to the [X]% who responded!

   **Overall sentiment:** [X]/5 ([emoji])

   **What you said is going well:**
   - [Theme 1]
   - [Theme 2]
   - [Theme 3]

   **What we're working on:**
   - [Action 1]
   - [Action 2]

   Full report: [Link]

   Next pulse: [Date]
   ```

---

### Zap 4: Anonymous Concern Channel

**Trigger**: New submission to "Anonymous Feedback" form

**Condition**: Always sends (no filtering)

**Action 1: Assess urgency**
1. Analyze keywords:
   - "Harassment", "discrimination", "illegal": CRITICAL
   - "Quitting", "leaving": HIGH
   - "Frustrated", "struggling": MEDIUM
   - Other: LOW

**Action 2: Route based on urgency**

**Route A: CRITICAL (harassment, illegal, safety)**
1. IMMEDIATE email to CEO + HR:
   ```
   🚨 CRITICAL: Anonymous Report

   An anonymous report has been submitted requiring immediate
   attention.

   REPORT:
   "[Full feedback]"

   CATEGORY: [Harassment/Illegal/Safety/Other]

   ACTION REQUIRED:
   1. Review immediately
   2. Follow legal/HR protocols
   3. Document response
   4. Protect reporter anonymity

   This is urgent and sensitive.
   ```
2. Create high-priority task for HR

**Route B: HIGH (quitting, retention risk)**
1. Email to HR + manager:
   ```
   ⚠️ RETENTION RISK: Anonymous Feedback

   Anonymous feedback suggests someone is considering leaving.

   FEEDBACK:
   "[Full feedback]"

   ACTION:
   - Review team members for signs
   - Consider 1:1 check-ins
   - Address themes (without revealing source)
   - Document retention efforts
   ```

**Route C: MEDIUM/LOW (frustrations, suggestions)**
1. Add to feedback log
2. Categorize for monthly review
3. No immediate action unless pattern emerges

---

### Zap 5: Positive Feedback Distribution

**Trigger**: New positive review added to spreadsheet

**Action 1: Determine sharing channels**
1. If product review:
   - Post to website testimonials
   - Share in #marketing Slack
   - Add to sales deck
2. If team member shoutout:
   - Share in #general Slack
   - Add to team member's performance file
   - Mention in next all-hands

**Action 2: Auto-post testimonials**
1. Connect to website CMS
2. Add testimonial to testimonials page
3. Include: Name, photo (if available), quote, rating

**Action 3: Quarterly celebration**
1. Trigger: End of quarter
2. Compile all positive feedback
3. Create "Win Wall" document:
   ```
   # This Quarter's Wins

   ## Customer Love
   "Best service ever!" - [Name]
   "Changed our business" - [Name]
   [All 5-star reviews]

   ## Team Appreciation
   [Shoutouts to team members]

   ## Metrics
   - Average rating: [X]/5
   - Total reviews: [X]
   - Promoter score: [X]%

   Let's keep this up!
   ```
4. Share with company in all-hands meeting

---

## Survey Templates

### Customer Review Survey (Typeform/Google Form)

**Question 1: What did we help you with?**
- Text input

**Question 2: How would you rate your experience?**
- Scale: 1-10
   - 1 = Extremely dissatisfied
   - 10 = Extremely satisfied

**Question 3: What specifically went well? (Optional)**
- Text input

**Question 4: What could we improve? (Optional)**
- Text input

**Question 5: Would you recommend us to a friend or colleague?**
- Yes / No
- If no: "What would need to change for you to recommend us?"

**Question 6: Can we share your review publicly?**
- Yes, with my name
- Yes, anonymously
- No, keep it private

### Employee Pulse Survey

**Question 1: How are you feeling this month?**
- Scale: 1-5
   - 1 = Struggling
   - 3 = Okay
   - 5 = Thriving

**Question 2: What's going well right now?**
- Text input (optional)

**Question 3: What's challenging you right now?**
- Text input (optional)

**Question 4: What support do you need that you're not getting?**
- Multiple choice + "Other":
   - More training
   - Better tools/resources
   - Clearer expectations
   - More autonomy
   - Better communication
   - Manager support
   - Other: ______

**Question 5: Any suggestions for improvement?**
- Text input (optional)

**Question 6: Is there anything else you'd like to share (anonymously)?**
- Text input (optional)

---

## Workflow Diagram

```
[7 Days After Purchase]
       ↓
[Send Review Request]
       ↓
   ┌───┴───────┬────────┐
   ↓           ↓        ↓
[Responds]   [Reminder]  [No Response]
   ↓           ↓          ↓
[Analyze]   [7 Days]   [Move to Passive]
   ↓           ↓
[Sentiment + Rating]
   ↓
   ┌─────┴─────┬──────────┐
   ↓           ↓          ↓
[Positive]  [Neutral]  [Negative]
   ↓           ↓          ↓
[Share]     [Log]    [🚨 ALERT]
[Thank]     [Follow]   [Respond]
[Ask for    [in 30     [Resolve]
public]     days]
```

---

## Testing Checklist

Before going live, test these scenarios:

### ✅ Customer Review Flow
- [ ] Review request sends 7 days after purchase
- [ ] Reminder sends 7 days later if no response
- [ ] Responses categorize correctly (positive/neutral/negative)
- [ ] Positive feedback shares to #customer-love
- [ ] Negative feedback triggers immediate alert
- [ ] Thank-you emails send appropriately

### ✅ Employee Pulse Flow
- [ ] Pulse survey sends last Friday of month
- [ ] Responses aggregate correctly after 7 days
- [ ] Report generates with accurate calculations
- [ ] Summary shares with team appropriately
- [ ] Leadership receives full report

### ✅ Anonymous Feedback Flow
- [ ] Anonymous submissions work (truly anonymous)
- [ ] Urgency assessment works (keywords trigger correctly)
- [ ] Critical issues alert CEO/HR immediately
- [ ] Lower-urgency items log for review

### ✅ Positive Feedback Distribution
- [ ] Testimonials post to website correctly
- [ ] Team shoutouts share in appropriate channels
- [ ] Quarterly win wall compiles correctly

### ✅ Edge Cases
- [ ] Extremely negative feedback (don't auto-share publicly)
- [ ] Very short responses (still categorize correctly)
- [ ] Multiple submissions from same person (handle appropriately)
- [ ] Survey fatigue (don't over-survey)

---

## Common Pitfalls & Fixes

### ❌ Pitfall 1: Survey Fatigue
**What happens:** Send survey requests every week. Customers annoyed. Response rate drops to near zero. Unsubscribe spike.

**Fix it:** Maximum once per customer per 90 days. Time requests carefully (after positive interaction). Make surveys short (2 minutes max).

**Real example:** Sent survey requests weekly. Response rate: 3%. Changed to quarterly. Response rate: 28%.

---

### ❌ Pitfall 2: Only Hearing from Extremes
**What happens:** Only very happy or very angry customers respond. Missing middle (silent majority). Skewed data.

**Fix it:** Incentivize middle customers. "Your honest feedback helps us improve." Share that negative feedback is welcome and valued.

**Real example:** Only 10% response, all extremes. Added "we want honest feedback, good or bad." Response rate 25%, more balanced.

---

### ❌ Pitfall 3: Negative Feedback Sits Unanswered
**What happens:** Negative feedback triggers alert, but nobody responds. Customer angrier. Leaves worse review. Damage compounds.

**Fix it:** Clear ownership (who responds?). 2-hour SLA for response. Response template + escalation path.

**Real example:** Negative feedback sat for 3 days. Customer posted 1-star review publicly. Now 2-hour response required.

---

### ❌ Pitfill 4: Positive Feedback Never Gets Shared
**What happens:** Collecting great feedback but keeping it internal. Team doesn't hear good news. Morale suffers. Marketing can't use testimonials.

**Fix it:** Auto-share positive feedback to Slack. Create "win wall." Use testimonials in marketing. Celebrate wins publicly.

**Real example:** Had 100+ positive reviews sitting in spreadsheet. Nobody knew. Now auto-posts to #customer-love. Team morale up.

---

### ❌ Pitfall 5: Employees Don't Trust Anonymity
**What happens:** Pulse survey says "anonymous" but employees paranoid. Responses guarded or fake. Data useless.

**Fix it:** Use truly anonymous tools (no email collection). Use third-party survey platforms. Be transparent about how data is used.

**Real example:** Employees thought "anonymous" survey tracked them. Switched to Typeform (no tracking). Honest feedback increased 300%.

---

### ❌ Pitfall 6: No Follow-Up on Feedback
**What happens:** Collect feedback, analyze it, discuss it... then do nothing. Employees/customers feel ignored. Stop giving feedback.

**Fix it:** Always communicate action taken. "You said X, we did Y." Close the loop. Show feedback matters.

**Real example:** Employees suggested changes, nothing happened. Stopped giving feedback. Now every survey: "Here's what we did with your feedback." Participation up.

---

### ❌ Pitfall 7: Sentiment Analysis Inaccurate
**What happens:** AI mis-categorizes sarcasm as positive. Or nuanced feedback as neutral. Wrong routing.

**Fix it:** Human review of edge cases. Train sentiment model on your data. When in doubt, route to human review.

**Real example:** "Great job (not)" marked as positive. Human caught it. Now sarcasm detection trained on our data.

---

## Maintenance Guide

### Weekly (30 minutes)
- [ ] Review negative feedback (did we respond?)
- [ ] Check positive feedback (shared with team?)
- [ ] Verify survey requests sending (any errors?)

### Monthly (2 hours)
- [ ] Review all feedback themes (patterns emerging?)
- [ ] Update response templates based on learnings
- [ ] Check sentiment analysis accuracy
- [ ] Optimize survey timing/frequency

### Quarterly (4 hours)
- [ ] Full feedback review (all channels)
- [ ] Update surveys (questions still relevant?)
- [ ] Analyze trends over time (improving? declining?)
- [ ] Share insights with leadership
- [ ] Celebrate wins (testimonials, shoutouts)

### Annually (8 hours)
- [ ] Complete feedback program audit
- [ ] Evaluate if tools still right (better options?)
- [ ] Update survey questions based on business changes
- [ ] Set goals for next year (response rate, satisfaction)
- [ ] Document annual learnings

---

## Real Implementation

### Company: B2B SaaS (500 customers, 25 employees)

**Before automation:**
- Manual review requests: Sent sporadically, forgot often
- Customer feedback: Collected but never reviewed
- Employee feedback: Annual survey only (too infrequent)
- Negative feedback: Discovered months later (too late)
- Positive feedback: Sat in spreadsheet, never shared

**After automation:**
- Automated review requests: 7 days after purchase
- Feedback collected, categorized, routed instantly
- Monthly employee pulse surveys
- Negative feedback: Immediate alerts (2-hour response)
- Positive feedback: Auto-shared, celebrated

**Results after 6 months:**
- Review volume: Up 400% (15/month to 75/month)
- Response rate: Up from 8% to 24%
- Average rating: Increased from 4.2 to 4.6/5
- Negative feedback: Response time from 14 days to 4 hours
- Employee satisfaction: Up from 6.8 to 8.1/10
- Positive feedback shared: 0 to 25+ per month

**What broke:**
- Month 2: Survey fatigue (too many requests)
  - Fix: Reduced to quarterly, response rate recovered
- Month 4: Sentiment analysis inaccurate (sarcasm)
  - Fix: Added human review for edge cases
- Month 5: Employees doubted anonymity
  - Fix: Switched to truly anonymous tool, participation up 300%

**What they'd do differently:**
- Start with truly anonymous surveys from day 1
- Build human review into sentiment analysis from start
- Share positive feedback with team immediately (don't wait)
- Close the loop on feedback sooner (show action taken)

---

## Advanced Features (Once Basic Version Works)

### 1. Net Promoter Score (NPS) Tracking
- Add "Would you recommend?" question (0-10 scale)
- Calculate NPS: % Promoters - % Detractors
- Track NPS over time
- Segment by customer type, product, etc.

### 2. AI-Powered Theme Detection
- Use AI to cluster feedback into themes
- Identify emerging issues before they become problems
- Track theme volume over time

### 3. Closed-Loop Feedback
- Automatically follow up on feedback:
  - "You said X, we did Y. Thanks for your feedback!"
- Close the loop with every respondent

### 4. Predictive Churn Detection
- Analyze feedback patterns
- Identify customers at risk of leaving
- Trigger retention outreach automatically

### 5. 360-Degree Employee Feedback
- Peer-to-peer feedback
- Manager feedback
- Upward feedback (employees rate managers)
- Automated prompts at project milestones

---

## Limitations & What It Can't Do

### ❌ Can't Fix Bad Product/Service
Automation collects feedback efficiently, but can't make customers happy if product/service is poor. Fix the root cause first.

### ❌ Can't Replace Human Connection
Automated "thank you" emails are nice, but can't replace genuine relationship building. Use automation to enable more human interaction, not less.

### ❌ Can't Make People Be Honest
If culture doesn't value feedback, people won't give it honestly (or at all). Build psychological safety first.

### ❌ Can't Compensate for Inaction
Collecting feedback without acting on it is worse than not collecting it at all. Always close the loop.

### ❌ Can't Resolve Complex Issues
Some feedback requires deep investigation, conversation, and problem-solving. Automation flags, humans resolve.

---

## Remember

**Feedback is a gift, but only if you use it.** Automation makes collection effortless. The real work is listening, responding, and improving. That's on you.

**Turn the struggle into a system**

---

## Quick Start

### If you have 2 hours:
1. Create simple review request email
2. Build 3-question review survey
3. Set up sentiment analysis (even basic keyword matching)
4. Route positive/negative to different Slack channels
5. Test with 5 customers

### If you have 4 hours:
1. All of the above (2 hours)
2. Add reminder email for non-responders
3. Build employee pulse survey
4. Create anonymous concern channel
5. Implement positive feedback distribution

### If you have 8 hours:
1. All of the above (4 hours)
2. Add NPS tracking
3. Implement closed-loop feedback
4. Create quarterly win wall
5. Build feedback analytics dashboard

---

**Bottom line:** You're already getting feedback (explicit or implicit). Automation helps you hear it, respond to it, and learn from it consistently. That's how you improve.
