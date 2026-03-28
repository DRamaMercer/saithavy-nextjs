# Time-Blocking Tools and Apps Guide

**Digital and Analog Tools That Actually Work**

I've tested 30+ time-blocking tools over the past decade. Most are overcomplicated or unnecessary. You need 2-3 tools max, not 10.

Here are the tools that work, organized by use case and budget.

Systems before willpower. Your environment shapes your behavior.

---

## Quick Guide: Choose Your Tools

| Use Case | Best Digital Tool | Best Analog Tool | Cost |
|----------|-------------------|------------------|------|
| **Calendar blocking** | Google Calendar | Printed template | Free |
| **Task management** | Todoist | Notebook + pen | Free-$5/mo |
| **Weekly planning** | Notion | Printed worksheet | Free-$10/mo |
| **Progress tracking** | Google Sheets | Printed tracker | Free |
| **Energy tracking** | Notion | Printed worksheet | Free |
| **Team coordination** | Calendly + Google Calendar | Shared calendar | Free-$15/mo |

**My recommendation:** Start with free tools (Google Calendar + printed templates). Upgrade only when you outgrow them.

---

## Digital Tools

### 1. Google Calendar (Free)

**Best for:** Calendar time-blocking, meeting scheduling, team coordination

**How to set up time-blocking in Google Calendar:**

#### Step 1: Create Category Calendars

Create separate calendars for each time-block category:
- **Deep Work** (color: blue)
- **Shallow Work** (color: green)
- **Meetings** (color: yellow)
- **Breaks** (color: orange)
- **Life** (color: red)
- **Buffer** (color: gray)

**How:**
1. Click the "+" next to "Other calendars"
2. Select "Create new calendar"
3. Name it (e.g., "Deep Work")
4. Choose color
5. Repeat for each category

#### Step 2: Set Up Recurring Blocks

**Deep Work Blocks:**
1. Create new event on your Deep Work calendar
2. Title: "Deep Work - Focus Time"
3. Time: Your peak energy hours (e.g., 9-11am)
4. Repeat: Mon-Fri
5. Description: What you'll work on
6. Set to "Busy" (not "Free")

**Shallow Work Blocks:**
1. Create new event on your Shallow Work calendar
2. Title: "Email, Slack, Admin"
3. Time: Your low energy hours (e.g., 4-4:30pm)
4. Repeat: Mon-Fri
5. Set to "Busy"

**Break Blocks:**
1. Create new event on your Breaks calendar
2. Title: "Break - Walk, Stretch, Fuel"
3. Time: 5-15 min between deep work blocks
4. Repeat: Mon-Fri
5. Set reminders: 5 min before

**Life Blocks:**
1. Create new event on your Life calendar
2. Title: Exercise, meals, family time, etc.
3. Time: Non-negotiable times
4. Repeat: As needed
5. Set to "Busy"

#### Step 3: Use "Focus Time" Feature

Google Calendar's "Focus Time" feature:
- Automatically declines meeting invitations
- Sets status to "In a meeting"
- Lets people know you're focusing

**How:**
1. Create new event
2. Select "Focus time" instead of "Event"
3. Schedule your deep work blocks
4. Add description: "Working on [project]. Urgent? Call [phone]."

**Pro tip:** Use Focus Time for your most important deep work blocks.

#### Step 4: Share Calendars (Optional)

**Share your Deep Work calendar as "busy":**
1. Hover over Deep Work calendar
2. Click the three dots
3. Select "Settings and sharing"
4. Share with specific people or make public
5. Set permission: "See only free/busy (hide details)"

**Share your Meeting calendar as "available":**
1. Follow same steps
2. Set permission: "See all event details"

**Benefit:** Team sees when you're available without seeing your deep work tasks.

#### Advanced: Use Google Calendar Tasks

**Add your top 3 priorities as tasks:**
1. Open Google Calendar
2. Click the Tasks icon (right sidebar)
3. Add task: "Priority #1: [task name]"
4. Due date: Today
5. Drag task into your deep work block

**Benefit:** Integrates tasks directly with time blocks.

**Best for:** Beginners, teams, anyone with free Google account

**Cost:** Free

---

### 2. Notion (Free-$10/mo)

**Best for:** Custom templates, weekly planning, progress tracking, all-in-one workspace

**How to set up time-blocking in Notion:**

#### Step 1: Create Time-Blocking Dashboard

**Create a new page:**
1. Click "Add a page"
2. Name: "Time-Blocking Dashboard"
3. Choose icon (📅)
4. Choose cover image (optional)

#### Step 2: Add Daily Time Blocks Template

**Create a template block:**
1. Type "/template" and select "Template block"
2. Create daily template:
```
# Daily Time Blocks - [Date]

## Top 3 Priorities
1. [ ]
2. [ ]
3. [ ]

## Time Blocks
🟦 Deep Work Block 1 (90 min)
- Time: _______ - _______
- Task:

🟧 Break (15 min)
- Time: _______ - _______
- Activity:

🟦 Deep Work Block 2 (90 min)
- Time: _______ - _______
- Task:

🟩 Shallow Work (30-60 min)
- Time: _______ - _______
- Tasks:

🟥 Life Block (60 min)
- Time: _______ - _______
- Activity:

## Evening Review
- Deep work hours: _____
- Priorities completed: _____ / 3
- One thing that worked:
- One thing to improve:
```

3. Click "Turn into" → "Template button"
4. Button name: "New Day"

**How to use:** Click "New Day" button to generate a new daily template.

#### Step 3: Add Weekly Planning Template

**Create a weekly planning template:**
1. Type "/template" and select "Template block database"
2. Create template with sections:
   - Review last week
   - Identify this week's priorities
   - Schedule deep work blocks
   - Batch shallow work and meetings
   - Add life blocks and buffers
3. Add properties: Week start date, deep work target, actual deep work hours

**How to use:** Click "New Week" every Sunday or Monday.

#### Step 4: Add Progress Tracking Database

**Create a database:**
1. Type "/database" and select "Table - inline"
2. Add properties:
   - Week start date (date)
   - Deep work hours (number)
   - Deep work target (number)
   - Priorities completed (number)
   - Schedule adherence (number)
   - Energy alignment (number)
   - Notes (text)
3. Create views:
   - Table view (all data)
   - Calendar view (visual)
   - Gallery view (cards)

**Track weekly:** Add a new entry every Sunday or Monday.

#### Step 5: Add Energy Audit Database

**Create a database:**
1. Type "/database" and select "Table - inline"
2. Add properties:
   - Date (date)
   - Time (datetime)
   - Energy level (number 1-10)
   - Activity (text)
   - Notes (text)
3. Create filtered views: Day 1, Day 2, Day 3

**Track for 3 days:** Log energy hourly during your energy audit.

#### Advanced: Automate with Notion API

**For advanced users:**
- Use Notion API to auto-generate daily templates
- Connect to Google Calendar to sync blocks
- Create custom dashboards with formulas

**Best for:** Power users, people who want all-in-one workspace, people who love customization

**Cost:** Free (Personal) or $10/mo (Plus - for advanced features)

---

### 3. Todoist (Free-$5/mo)

**Best for:** Task-based time-blocking, simple to-do list with time estimates

**How to set up time-blocking in Todoist:**

#### Step 1: Create Projects

**Create projects for each category:**
- 🟦 Deep Work
- 🟩 Shallow Work
- 🟡 Meetings
- 🟥 Life
- ⬜ Buffer

#### Step 2: Add Tasks with Time Estimates

**Add your top 3 priorities:**
1. Click "Add task"
2. Task name: "Priority #1: [task]"
3. Assign to project: Deep Work
4. Due date: Today
5. Duration: 90 min (in task description or using integrations)

#### Step 3: Integrate with Google Calendar

**Todoist + Google Calendar integration:**
1. Install Todoist for Google Calendar
2. Tasks with due dates appear on calendar
3. Drag tasks to specific time slots
4. Time-block your tasks visually

**Benefit:** Task management + calendar blocking in one view.

**Best for:** People who prefer tasks over calendar, people who want simplicity

**Cost:** Free (Basic) or $5/mo (Premium - for reminders and duration tracking)

---

### 4. Calendly (Free-$15/mo)

**Best for:** Meeting scheduling, consolidating meetings, reducing email ping-pong

**How to set up time-blocking with Calendly:**

#### Step 1: Create Meeting Types

**Create event types for different meeting types:**
- 15-min quick sync
- 30-min 1:1
- 60-min strategy session
- 90-min deep-dive meeting

#### Step 2: Set Availability

**Limit availability to your meeting blocks only:**
- Mon/Wed/Fri: 2-4pm only
- Tue/Thu: Unavailable (meeting-free days)

**Benefit:** Meetings automatically consolidate into specific blocks.

#### Step 3: Share Your Link

**Share your Calendly link:**
- In email signature
- In Slack/Teams profile
- On your website

**Benefit:** People schedule meetings during your available times without back-and-forth.

**Best for:** People with lots of external meetings, consultants, freelancers

**Cost:** Free (Basic) or $15/mo (Premium - for unlimited event types)

---

## Analog Tools

### 1. Printed Templates (Free)

**Best for:** People who prefer pen and paper, people easily distracted by digital tools

**How to create printed templates:**

#### Step 1: Choose Your Template

Copy the template from this package:
- Standard 9-5 Schedule
- Early Bird (6am-2pm)
- Night Owl (12pm-8pm)
- Flexible/Async
- Parent/Break Schedule

#### Step 2: Print and Customize

**Print multiple copies** (one for each workday)
**Fill in by hand** each morning or night before

**Pro tip:** Laminate your template and use wet-erase markers. Reuse daily.

#### Step 3: Store in a Binder

**Create a "Time-Blocking Binder":**
- Front section: Daily templates
- Middle section: Weekly planning worksheets
- Back section: Progress tracking sheets

**Review weekly** to see patterns and progress.

**Best for:** Analog lovers, people who want to reduce screen time, people who retain info better when writing by hand

**Cost:** Free (print yourself) or $10-30 (purchase printed planner)

---

### 2. Bullet Journal (Free-$25)

**Best for:** Custom tracking, combining time-blocking with journaling, creative expression

**How to set up time-blocking in a bullet journal:**

#### Step 1: Create Daily Log

**Draw a daily schedule template:**
```
DATE: ___________

⏰ TIME BLOCKS
_____-______ 🔵 Deep Work
_____-______ 🟧 Break
_____-______ 🔵 Deep Work
_____-______ 🟩 Shallow Work
_____-______ 🟥 Life

📋 TASKS
- [ ]
- [ ]
- [ ]

📝 NOTES
```

**Fill in by hand** each morning or night before.

#### Step 2: Create Weekly Log

**Draw a weekly overview:**
- Monday through Friday
- Top 3 priorities
- Deep work blocks scheduled
- Life commitments

**Fill in** every Sunday or Monday.

#### Step 3: Create Monthly Log

**Draw a monthly calendar:**
- Important dates
- Deadlines
- Commitments

**Fill in** at the start of each month.

#### Step 4: Track Progress

**Create a spread for tracking:**
- Deep work hours per week
- Priorities completed
- Energy levels
- Schedule adherence

**Update weekly.**

**Best for:** Creative people, people who want full customization, people who enjoy writing by hand

**Cost:** $15-25 for a quality bullet journal notebook

---

### 3. Specialized Planners ($20-50)

**Best for:** People who want pre-made templates in book format

#### Options:

**Passion Planner ($30)**
- Focus on goal-oriented time-blocking
- Monthly, weekly, and daily views
- Prompted reflections
- Roadmap for goals

**Best for:** People who want to connect daily blocks to long-term goals

**Full Focus Planner ($50)**
- Michael Hyatt's productivity system
- Daily time-blocking templates
- Weekly preview and review
- Goal tracking
- Quarterly planning

**Best for:** People who want a complete productivity system

**Panda Planner ($25)**
- Scientific approach to happiness and productivity
- Monthly, weekly, daily planning
- Goal setting and tracking
- Review and reflection sections

**Best for:** People who want balance between productivity and well-being

**Best for:** People who don't want to create their own templates, people who want a physical book

**Cost:** $20-50 one-time purchase

---

## Hybrid Approach (Digital + Analog)

**My recommendation for most people:**

**Digital (Google Calendar):**
- Schedule time blocks
- Set reminders
- Share with team

**Analog (printed template or notebook):**
- Daily planning (write by hand)
- Weekly review (write by hand)
- Progress tracking (write by hand)

**Why hybrid?**
- Digital gives you reminders and team coordination
- Analog gives you focus and retention (writing by hand increases memory and commitment)

---

## Tool Combinations by Use Case

### For Freelancers/Solopreneurs

**Recommended:**
- Google Calendar (time-blocking)
- Todoist (task management)
- Printed templates (daily planning)

**Why:** Simple, portable, integrates with client calendars

### For Remote Workers/Teams

**Recommended:**
- Google Calendar (time-blocking + team coordination)
- Notion (weekly planning + progress tracking)
- Calendly (meeting scheduling)

**Why:** Team visibility, comprehensive tracking, easy meeting scheduling

### For Parents/Caregivers

**Recommended:**
- Printed templates (flexible, can modify mid-day)
- Google Calendar (family coordination)
- Notebook (quick notes during chaos)

**Why:** Analog adapts to unpredictable schedules, digital coordinates with family

### For Students

**Recommended:**
- Google Calendar (class schedule + study blocks)
- Notion (assignment tracking + project planning)
- Bullet journal (daily planning + reflection)

**Why:** Structure for classes, flexibility for study, creative outlet for stress

### For Corporate Employees

**Recommended:**
- Google Calendar (time-blocking + meeting coordination)
- Notion (weekly planning + progress tracking)
- Todoist (task management)

**Why:** Integrates with corporate calendar, professional tracking, team-friendly

---

## Free vs. Paid: What's Worth Paying For?

### Stick with Free If...

- You're just starting time-blocking
- You're on a tight budget
- You don't need advanced features

**Free tools work perfectly:**
- Google Calendar (everything you need for blocking)
- Printed templates (daily/weekly planning)
- Google Sheets (progress tracking)

### Upgrade to Paid If...

- You've used free tools for 3+ months and hit limits
- You need advanced features (automations, integrations)
- You value the convenience and will pay to save time

**Paid tools worth it:**
- Notion Plus ($10/mo) - for power users and automations
- Todoist Premium ($5/mo) - for reminders and duration tracking
- Calendly Premium ($15/mo) - for unlimited meeting types

**Rule:** Free tools are 90% as good as paid. Upgrade only when you clearly need more.

---

## Tool Setup Checklist

### Week 1: Basic Setup

- [ ] Choose your calendar tool (Google Calendar recommended)
- [ ] Create category calendars (Deep Work, Shallow Work, etc.)
- [ ] Set up recurring deep work blocks
- [ ] Set up recurring shallow work blocks
- [ ] Set up recurring life blocks
- [ ] Print or create daily planning template
- [ ] Complete your first daily plan

### Week 2: Add Tracking

- [ ] Create progress tracker (Google Sheets or Notion)
- [ ] Track first week of metrics
- [ ] Review what's working/not working
- [ ] Adjust your template based on data

### Week 3: Add Energy Awareness

- [ ] Complete 3-day energy audit
- [ ] Adjust deep work blocks to match peak energy
- [ ] Track energy alignment score
- [ ] Optimize based on data

### Week 4: Advanced Features (Optional)

- [ ] Explore Notion automations
- [ ] Set up Calendly for meeting scheduling
- [ ] Integrate Todoist with Google Calendar
- [ ] Create custom dashboards

**Key:** Don't set up everything at once. Start simple. Add features as you outgrow basic tools.

---

## Your Turn

Choose your tools. Set them up. Start using them.

The tool doesn't make you productive. You using the tool makes you productive.

Don't overthink this. Google Calendar + printed template is all most people need.

Systems before willpower. Your environment shapes your behavior.
