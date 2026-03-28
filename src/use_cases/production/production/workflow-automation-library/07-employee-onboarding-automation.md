# Employee Onboarding Automation

> **"Turn the struggle into a system"**

## Problem It Solves

**The struggle:** New employee joins and chaos ensues. Accounts aren't ready. Equipment hasn't arrived. Nobody knows they're starting. Manager forgets to schedule check-ins. Training is inconsistent. New hire feels neglected and unprepared. Time-to-productivity is 3+ months.

**The system:** Offer accepted triggers complete onboarding orchestration. Accounts created before Day 1. Equipment ordered and delivered. Documents sent automatically. Training assigned. Check-ins scheduled. Manager and HR notified of every step. Employee feels welcomed and prepared from Day 1.

**Time saved:** 8-12 hours per new hire
**Time-to-productivity:** Reduced by 40%
**New hire satisfaction:** Up 60%
**Setup time**: 4-6 hours
**Maintenance:** 2 hours per quarter

---

## Tools Needed

### Required
- **HR system**: BambooHR ($6/employee/month) or Airtable ($10/month)
- **Automation platform**: Make ($9/month) - Zapier can't handle this complexity
- **Email**: Gmail/Outlook (already have)

### Optional But Recommended
- **Project management**: Asana ($10/month) for onboarding tasks
- **Documentation**: Notion (free) or Google Drive
- **Training management**: Trainual ($99/month) or Lessonly

### Total Monthly Cost
- **Minimum viable**: $20/month (Airtable + Make)
- **Recommended setup:** $50-$120/month

---

## Step-by-Step Build (Make/Integromat)

### Scenario 1: Offer Accepted → Pre-Boarding

**Trigger**: New employee status = "Offer Accepted" in HR system

**Action 1: Send welcome email**
1. Send email:
   ```
   Subject: Welcome to the team, [Name]!

   Hi [Name],

   Congratulations on joining [Company Name]! We're thrilled to have you.

   YOUR FIRST DAY
   Date: [Start date]
   Time: [Start time]
   Location: [Address or "Remote"]

   WHAT HAPPENS NEXT
   - Equipment and access setup
   - Benefits enrollment
   - Company handbook and policies
   - First-week schedule
   - Introduction to your team

   PRE-BOARDING CHECKLIST
   Before your first day, please complete:
   1. Benefits enrollment (link below)
   2. Review employee handbook (link below)
   3. Set up direct deposit (link below)
   4. Sign employment documents (link below)

   QUESTIONS?
   Reply to this email anytime. I'm here to help!

   Looking forward to working together,
   [HR Manager]
   ```

**Action 2: Create onboarding project**
1. Connect Asana
2. Create project: "Onboarding - [Name]"
3. Template tasks (see full template below)
4. Assign due dates based on start date
5. Assign to hiring manager + HR

**Action 3: Notify IT**
1. Send email to IT:
   ```
   Subject: NEW HIRE: [Name] starts [Start date]

   EMPLOYEE DETAILS
   Name: [Full name]
   Start date: [Start date]
   Role: [Job title]
   Department: [Department]
   Manager: [Manager name]

   IT REQUIREMENTS
   - Equipment: [Laptop model, monitor, etc.]
   - Software: [List required software]
   - Accounts needed:
     ✅ Email: [First.last@company.com]
     ✅ Slack: [@username]
     ✅ Google Workspace: [username]
     ✅ [Other tools: CRM, GitHub/GitLab, etc.]

   DEADLINE: All accounts and equipment ready by [Start date - 2 days]

   Please update when complete.

   Thanks!
   [HR Manager]
   ```

**Action 4: Order equipment**
1. Add "Create Record" in Airtable
2. Table: Equipment Orders
3. Fields:
   - Employee name
   - Start date
   - Equipment needed
   - Order status: "Not ordered"
   - Expected delivery: [Start date - 3 days]

**Action 5: Notify hiring manager**
1. Send Slack DM to manager:
   ```
   👋 NEW HIRE ALERT: [Name] joins [Start date]

   Role: [Job title]
   Department: [Department]

   YOUR ONBOARDING TASKS:
   □ Schedule 30-minute intro call before Day 1
   □ Prepare first-week schedule
   □ Assign buddy/mentor
   □ Set up 30/60/90-day plan
   □ Schedule team lunch for Week 1
   □ Prepare desk/workspace (if onsite)

   Onboarding project created in Asana: [Link]

   Need help? Check the Onboarding Checklist: [Link]
   ```

---

### Scenario 2: 2 Weeks Before Start → Document Delivery

**Trigger**: 14 days before start date (use "Wait" module)

**Action 1: Send employee handbook**
1. Send email:
   ```
   Subject: Welcome to [Company Name] - Employee Handbook

   Hi [Name],

   Please review our employee handbook before your first day. It covers:

   - Company values and culture
   - Benefits and perks
   - Time off and holidays
   - Performance expectations
   - Code of conduct

   HANDBOOK ACKNOWLEDGMENT
   Please sign that you've read and understand the handbook:
   [Link to signature form]

   See you soon!

   [HR Manager]
   ```

**Action 2: Send benefits enrollment**
1. Send email:
   ```
   Subject: Enroll in your benefits

   Hi [Name],

   Here's your benefits information:

   HEALTH INSURANCE
   - Medical: [Plan details]
   - Dental: [Plan details]
   - Vision: [Plan details]

   OTHER BENEFITS
   - 401(k): [Match details]
   - Life insurance: [Coverage details]
   - Disability: [Coverage details]
   - [Other benefits]

   ENROLLMENT DEADLINE: [Start date - 3 days]

   ENROLL HERE: [Benefits portal link]

   Questions? Reply or schedule a call: [Calendly link]

   [HR Manager]
   ```

**Action 3: Send first-week schedule**
1. Send email:
   ```
   Subject: Your first week at [Company Name]

   Hi [Name],

   Here's what your first week will look like:

   DAY 1 (Monday)
   9:00 AM - Arrive, setup, tour
   10:00 AM - Meeting with your manager
   11:00 AM - Team introductions
   12:00 PM - Lunch with the team
   1:00 PM - Product/overview training
   3:00 PM - Setup accounts and tools
   4:00 PM - Manager check-in

   DAY 2-5: [Overview of training and tasks]

   WEEK 1 GOALS
   - Meet everyone on your team
   - Complete product training
   - Set up all accounts
   - Learn our workflows
   - Complete [specific task]

   Can't wait to get started!

   [Your Name]
   ```

---

### Scenario 3: Day 1 → Welcome & Training Assignment

**Trigger**: Start date arrives (scheduler)

**Action 1: Send Day 1 welcome**
1. Send Slack message to new hire:
   ```
   Welcome to the team, [Name]! 👋

   Your first day is here! A few things to know:

   🏢 WHERE TO GO
   [Address or "Remote - check your email for calendar invite"]

   👥 WHO TO ASK
   Your manager: [@Manager]
   Your buddy: [@Buddy]
   HR: [@HR]

   📚 TODAY'S SCHEDULE
   [Link to first-week schedule]

   🎉 FIRST WEEK EVENTS
   - Team lunch: [Day/time]
   - Happy hour: [Day/time]

   We're so glad you're here!

   P.S. Check #welcome channel and say hi!
   ```

**Action 2: Assign training modules**
1. Connect to LMS (Trainual, Lessonly, etc.)
2. Enroll in "New Hire Orientation" course:
   - Module 1: Company history and values (1 hour)
   - Module 2: Product overview (2 hours)
   - Module 3: Tools and workflows (3 hours)
   - Module 4: Compliance and security (1 hour)
3. Set due date: End of Week 1
4. Notify manager: "[Name] enrolled in training. Due: [Date]"

**Action 3: Create 30/60/90-day plan**
1. Add "Create Document" in Notion
2. Template:
   ```
   # 30/60/90-Day Plan: [Name]

   ## 30 Days: Learning Phase
   **Goal:** Become productive in core responsibilities

   ### Week 1-2: Orientation
   - [ ] Complete all training modules
   - [ ] Meet with all team members
   - [ ] Learn our product/service inside out
   - [ ] Shadow experienced team members

   ### Week 3-4: Initial Tasks
   - [ ] Complete first [specific task]
   - [ ] Participate in [meeting/activity]
   - [ ] Contribute to [project]
   - [ ] Demonstrate [skill]

   SUCCESS CRITERIA
   - Can explain our product to a customer
   - Completed [X] tasks independently
   - Positive feedback from manager

   ## 60 Days: Contributing Phase
   **Goal:** Contributing value independently

   ### Month 2 Focus Areas
   - [ ] Lead [specific project]
   - [ ] Handle [responsibility] independently
   - [ ] Improve [process/area]
   - [ ] Collaborate with [other teams]

   SUCCESS CRITERIA
   - Managing [X] projects independently
   - Positive feedback from stakeholders
   - Suggested [X] improvements

   ## 90 Days: Full Integration
   **Goal:** Fully integrated and adding value

   ### Month 3 Focus Areas
   - [ ] Take ownership of [major responsibility]
   - [ ] Mentor or train others
   - [ ] Lead [initiative]
   - [ ] Exceed performance targets

   SUCCESS CRITERIA
   - Fully autonomous in role
   - Exceeding expectations
   - Contributing to team growth

   ---
   **Created:** [Date]
   **Manager:** [Manager name]
   **Review dates:** [30-day review], [60-day review], [90-day review]
   ```

**Action 4: Schedule check-ins**
1. Connect Google Calendar
2. Create events:
   - "Day 1 Check-in" (Day 1, 4:00 PM, 15 min)
   - "Week 1 Check-in" (Day 5, 3:00 PM, 30 min)
   - "30-Day Review" (30 days out, 1 hour)
   - "60-Day Review" (60 days out, 1 hour)
   - "90-Day Review" (90 days out, 1 hour)
3. Include: Agenda, preparation tasks, links to review forms

---

### Scenario 4: 30/60/90-Day Reviews

**Trigger**: Review date arrives (scheduler)

**Action 1: Send prep email to employee**
1. Send email (3 days before review):
   ```
   Subject: Preparing for your [30/60/90]-Day Review

   Hi [Name],

   Your [30/60/90]-day review is coming up on [Date]. This is a chance
   to reflect on your progress and align on expectations.

   PREPARATION: PLEASE COMPLETE
   1. Self-assessment form: [Link]
   2. What's gone well? (3 accomplishments)
   3. What's been challenging? (3 challenges)
   4. What support do you need?
   5. Goals for next [30/60/90] days

   REVIEW AGENDA
   - Your reflections and feedback
   - Manager feedback and observations
   - Progress against goals
   - Adjustments needed
   - Goals for next period

   Looking forward to a great conversation!

   [Manager name]
   ```

**Action 2: Send prep email to manager**
1. Send email (3 days before review):
   ```
   Subject: Preparing for [Name]'s [30/60/90]-Day Review

   Hi [Manager],

   [Name]'s [30/60/90]-day review is [Date]. Please prepare:

   MANAGER PREPARATION
   1. Review [Name]'s self-assessment
   2. Gather feedback from [team members they worked with]
   3. Review progress against [30/60/90]-day plan
   4. Identify: 3 strengths, 3 areas for development
   5. Prepare goals for next period

   REVIEW FORM: [Link]

   Need guidance? Check the Manager Review Guide: [Link]
   ```

**Action 3: Post-review follow-up**
1. Trigger: Review completed (calendar event ends)
2. Send email to employee:
   ```
   Subject: Next steps from your [30/60/90]-Day Review

   Hi [Name],

   Great meeting today! Here's what we discussed:

   KEY TAKEAWAYS
   - [Insight 1]
   - [Insight 2]
   - [Insight 3]

   ACTION ITEMS
   You:
   - [Action item 1] - Due: [Date]
   - [Action item 2] - Due: [Date]

   Manager:
   - [Action item 1] - Due: [Date]

   GOALS FOR NEXT PERIOD
   - [Goal 1]
   - [Goal 2]
   - [Goal 3]

   Our next check-in is [Date].

   Keep up the great work!

   [Manager name]
   ```

**Action 4: Update HR system**
1. Connect BambooHR/Airtable
2. Update employee record:
   - [30/60/90]-day review completed: [Date]
   - Review rating: [From review form]
   - Next review date: [Calculated]
   - Status: "On track" or "Needs support"

---

## Onboarding Task Template

### Pre-Boarding (Before Day 1)
**HR Tasks:**
- [ ] Send welcome email
- [ ] Create employee record in HR system
- [ ] Order equipment
- [ ] Request IT accounts
- [ ] Send employee handbook
- [ ] Send benefits enrollment
- [ ] Send first-week schedule

**IT Tasks:**
- [ ] Create email account
- [ ] Create Slack account
- [ ] Create software accounts (CRM, etc.)
- [ ] Order and configure laptop
- [ ] Set up workspace (if onsite)
- [ ] Send login credentials [Day -1]

**Manager Tasks:**
- [ ] Schedule intro call (pre-start)
- [ ] Assign buddy/mentor
- [ ] Create 30/60/90-day plan
- [ ] Prepare first-week schedule
- [ ] Schedule team lunch (Week 1)
- [ ] Notify team of new hire

### Week 1
**Day 1:**
- [ ] Welcome breakfast or coffee
- [ ] Office tour and introductions
- [ ] Manager meeting (expectations)
- [ ] Team lunch
- [ ] Setup accounts and tools
- [ ] Product training (begin)
- [ ] End-of-day check-in

**Day 2-5:**
- [ ] Complete training modules
- [ ] Shadow team members
- [ ] Complete first small task
- [ ] Attend team meetings
- [ ] 1:1 with manager (Friday)
- [ ] Complete Week 1 goals

### Week 2-4 (First Month)
- [ ] Take on independent tasks
- [ ] Collaborate on projects
- [ ] Meet with cross-functional partners
- [ ] Weekly 1:1s with manager
- [ ] Complete Month 1 goals
- [ ] Prepare for 30-day review

### Month 2-3
- [ ] Lead small projects
- [ ] Handle full workload
- [ ] Suggest improvements
- [ ] Mentor others (if applicable)
- [ ] Complete 60/90-day goals
- [ ] Transition to ongoing performance management

---

## Workflow Diagram

```
[Offer Accepted]
       ↓
[Send Welcome Email]
       ↓
   ┌───┴──────────────┬────────────────┐
   ↓                  ↓                ↓
[Create Onboarding]  [Notify IT]    [Notify Manager]
[Project in Asana]   [Order Equip]   [Assign Tasks]
   ↓                  ↓                ↓
[2 Weeks Before]    [Equipment]      [Intro Call]
   ↓               [Delivered]           ↓
[Send Documents]      ↓                  ↓
[Handbook]        [Day 1 Arrives]   [Prepare Schedule]
[Benefits]            ↓                  ↓
[Schedule]       [Welcome Message]  [Buddy Assigned]
   ↓                  ↓                  ↓
[Day 1] ←─────────────┴──────────────────┘
   ↓
[Assign Training]
   ↓
[Create 30/60/90 Plan]
   ↓
[Schedule Reviews]
   ↓
   ┌─────┴──────────────────┬─────────────────┐
   ↓                        ↓                 ↓
[30-Day Review]        [60-Day Review]  [90-Day Review]
   ↓                        ↓                 ↓
[Update Goals]        [Update Goals]   [Full Integration]
```

---

## Testing Checklist

Before going live, test these scenarios:

### ✅ Pre-Boarding Flow
- [ ] Offer accepted triggers welcome email
- [ ] Onboarding project creates with all tasks
- [ ] IT receives notification with all details
- [ ] Equipment order creates
- [ ] Manager receives Slack notification

### ✅ Document Delivery
- [ ] Employee handbook sends 14 days before start
- [ ] Benefits enrollment sends correctly
- [ ] First-week schedule includes all details
- [ ] All links work and are accessible

### ✅ Day 1 Automation
- [ ] Day 1 welcome Slack message sends
- [ ] Training modules assigned correctly
- [ ] 30/60/90-day plan creates
- [ ] Calendar events schedule for all reviews

### ✅ Review Automations
- [ ] Review prep emails send 3 days before
- [ ] Prep emails send to both employee and manager
- [ ] Post-review follow-up sends after review
- [ ] HR system updates correctly

### ✅ Edge Cases
- [ ] Start date changes (all automations update)
- [ ] Offer declined (automations cancel)
- [ ] Remote vs. onsite (correct tasks triggered)
- [ ] Manager changes (tasks reassigned)

---

## Common Pitfalls & Fixes

### ❌ Pitfall 1: Information Overload
**What happens:** Send 20 documents, 15 tasks, 10 emails in Week 1. New hire overwhelmed. Can't find anything.

**Fix it:** Space it out. Pre-boarding: Handbooks and benefits. Week 1: Focus on team and product. Week 2-4: Deeper training. Less is more.

**Real example:** Sent all training on Day 1. Completion rate: 20%. Spaced over 4 weeks. Completion: 95%.

---

### ❌ Pitfall 2: IT Not Ready Day 1
**What happens:** Employee starts, laptop not there, accounts not working. Sits around doing nothing. Bad first impression.

**Fix it:** IT deadline: 2 days before start. Automated reminder if not complete. Day -1 verification checklist.

**Real example:** New hire waited 3 days for laptop. Felt neglected. Now IT deadline is Day -2, verified before start.

---

### ❌ Pitfall 3: Manager Forgets Onboarding
**What happens:** Automation creates tasks, but manager doesn't check. New hire has no 1:1s, no guidance, no clarity.

**Fix it:** Build manager accountability. Daily task reminders. HR checks in with new hire weekly. Manager performance includes onboarding quality.

**Real example:** Manager "too busy" for new hire. Employee quit after 3 weeks. Now onboarding is manager KPI.

---

### ❌ Pitfall 4: One-Size-Fits-All Onboarding
**What happens:** Sales rep gets same onboarding as engineer. Irrelevant training. Wasted time. Bored and frustrated.

**Fix it:** Role-based onboarding paths. Sales: Product and CRM training. Engineering: Codebase and tools. Customize content.

**Real example:** Engineer had to sit through sales training. Complained. Now role-specific tracks.

---

### ❌ Pitfall 5: 90-Day Review Never Happens
**What happens:** 30-day happens, 60-day happens, 90-day forgotten. Employee limps along without feedback.

**Fix it:** Auto-schedule all three on Day 1. Manager prep emails send automatically. HR monitors completion.

**Real example:** 60% of 90-day reviews didn't happen. Added automation and reminders. Now 95% happen.

---

### ❌ Pitfall 6: New Hire Isolated
**What happens:** Onboarding tasks assigned, but no social integration. Eats lunch alone. Doesn't know anyone.

**Fix it:** Automate social integration. Assign buddy. Schedule team lunch. Introduce in Slack channel. Virtual coffee chats.

**Real example:** Developer isolated for first month. Quit. Now buddy system, team lunches, coffee chats. Belonging up.

---

### ❌ Pitfall 7: No Feedback Loop
**What happens:** Onboarding runs, but nobody asks new hires how it went. Same broken process repeats.

**Fix it:** Auto-send feedback survey at Day 30. "What worked? What didn't?" Quarterly review and optimization.

**Real example:** Onboarding was 4 weeks of boring slides. Survey feedback: "Too much lecture." Changed to hands-on. Satisfaction up 80%.

---

## Maintenance Guide

### Weekly (30 minutes per new hire)
- [ ] Check new hire's progress (training, tasks)
- [ ] Verify manager is doing check-ins
- [ ] Ask new hire: "How's it going?"
- [ ] Address any issues immediately

### Monthly (2 hours)
- [ ] Review all active onboarding projects
- [ ] Survey new hires from last month
- [ ] Update training content (outdated?)
- [ ] Check equipment orders (delivered on time?)
- [ ] Meet with managers about their new hires

### Quarterly (4 hours)
- [ ] Full onboarding audit (completion rates, satisfaction)
- [ ] Update 30/60/90-day plans (still relevant?)
- [ ] Review and refresh training content
- [ ] Analyze time-to-productivity data
- [ ] Update task templates based on feedback

### Annually (8 hours)
- [ ] Complete onboarding program review
- [ ] Evaluate if tools still right (better options?)
- [ ] Benchmark against industry best practices
- [ ] Set goals for next year (faster time-to-productivity?)
- [ ] Document annual learnings

---

## Real Implementation

### Company: Tech Startup (Growing from 20 to 50 employees)

**Before automation:**
- Manager-led onboarding: 12-15 hours per new hire
- Inconsistent experience (depended on manager)
- Time-to-productivity: 12 weeks
- 30% of new hires quit in first 90 days
- No standard training or documentation

**After automation:**
- Automated onboarding: 2-3 hours per new hire (HR oversight)
- Consistent experience for every new hire
- Time-to-productivity: 7 weeks (42% faster)
- 10% quit in first 90 days (67% reduction)
- Comprehensive training library

**Results after 12 months:**
- Time saved: 200 hours (15 hires × 13 hours saved each)
- Retention improvement: Saved $150k in recruiting costs
- Time-to-productivity: 5 weeks faster per hire = more value sooner
- New hire satisfaction: Up from 6.2 to 8.9/10
- Manager satisfaction: "Can focus on work, not admin tasks"

**What broke:**
- Month 3: IT overwhelmed, accounts not ready
  - Fix: Added IT deadline (Day -2) and capacity planning
- Month 6: Training outdated, new hires confused
  - Fix: Quarterly training review, SMEs assigned to keep current
- Month 9: Managers not doing check-ins
  - Fix: Made onboarding quality a manager KPI

**What they'd do differently:**
- Get SMEs to own training content from day 1
- Build manager accountability earlier (KPIs)
- Add new hire feedback loop from the start
- Create role-specific onboarding paths immediately

---

## Advanced Features (Once Basic Version Works)

### 1. Pre-Boarding Portal
- Custom portal where new hires can:
  - Complete paperwork before Day 1
  - Meet the team (bios, photos)
  - Preview training content
  - Set up their workspace preferences

### 2. Automated Buddy Matching
- Match new hires with buddies based on:
  - Role/department
  - Interests (from survey)
  - Personality/work style
- Auto-schedule coffee chats

### 3. Onboarding Analytics
- Track metrics:
  - Time-to-productivity by role
  - Training completion rates
  - New hire satisfaction scores
  - 90-day retention rates
- Identify bottlenecks and improve

### 4. Integration with Performance Management
- 30/60/90-day goals flow into ongoing goals
- Initial feedback informs first performance review
- Onboarding strengths/weaknesses inform development plans

### 5. Alumni Network
- After onboarding, add to alumni Slack channel
- Peer mentorship opportunities
- Social events for recent hires
- Feedback loop to improve onboarding

---

## Limitations & What It Can't Do

### ❌ Can't Fix Bad Management
Automation ensures tasks get done, but can't make managers be good mentors, supportive leaders, or provide helpful feedback. That's culture and skill.

### ❌ Can't Replace Human Connection
Automated emails are efficient, but can't replace warm welcomes, genuine interest, or relationship building. Automate the admin, preserve the human.

### ❌ Can't Compensate for Poor Role Design
If the role is unclear, responsibilities are vague, or expectations are unrealistic, automation just speeds up confusion. Good role design first.

### ❌ Can't Make Up for Weak Training Content
Automation can deliver training, but if the content is boring, irrelevant, or poorly designed, new hires won't learn. Invest in good content.

### ❌ Can't Build Culture for You
Onboarding is cultural transmission. Automation can deliver values and stories, but culture is lived daily. Leaders model culture, automations support it.

---

## Remember

**Onboarding isn't about tasks—it's about belonging.** Automation handles the logistics so managers and team members can focus on making new hires feel welcome, valued, and part of the team.

**Turn the struggle into a system**

---

## Quick Start

### If you have 4 hours:
1. Set up offer accepted → welcome email flow
2. Build basic onboarding task template
3. Create IT notification automation
4. Implement Day 1 welcome message
5. Test with one new hire

### If you have 6 hours:
1. All of the above (4 hours)
2. Add document delivery (handbook, benefits)
3. Implement training assignment
4. Create 30/60/90-day plan automation
5. Schedule all review check-ins

### If you have 12 hours:
1. All of the above (6 hours)
2. Build pre-boarding portal
3. Implement buddy matching system
4. Create role-specific onboarding paths
5. Add analytics and feedback loops

---

**Bottom line:** Great onboarding pays for itself. Faster time-to-productivity, higher retention, better culture. Automation makes it scalable and consistent.
