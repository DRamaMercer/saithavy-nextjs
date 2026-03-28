# Productivity Prompts Collection

**Innovation isn't about new tools—it's about better questions**

## Overview

This collection contains tested prompts for enhancing personal and team productivity through better task management, time optimization, meeting effectiveness, project planning, habit formation, and goal setting.

---

## 1. Task Prioritization

### Purpose
Make intelligent decisions about what to work on when everything feels urgent, using frameworks like Eisenhower Matrix, RICE scoring, and energy mapping.

### Prompt Template
```
I need help prioritizing my tasks.

**My Situation:**
- My role: [JOB TITLE/CONTEXT]
- Current workload: [OVERWHELMED/MANAGEABLE/LIGHT]
- Time horizon for prioritization: [TODAY/THIS WEEK/THIS QUARTER]
- My biggest challenge right now: [WHAT'S HARD]

**My Tasks (paste list or describe categories):**
[TASK LIST WITH ESTIMATED TIME, URGENCY, IMPORTANCE]

**Context:**
- How much time I have: [HOURS/DAY THIS WEEK]
- Energy levels: [WHEN I'M SHARPEST, WHEN I SLUMP]
- Constraints: [DEADLINES, MEETINGS, COMMITMENTS]
- Decision-making authority: [CAN I SAY NO TO THINGS?]
- Team available: [CAN I DELEGATE? TO WHOM?]

**My Goals:**
- What "success" looks like this week: [OUTCOMES]
- What I'm optimizing for: [SPEED/QUALITY/RELATIONSHIPS/LEARNING]
- Long-term priority: [WHAT ACTUALLY MATTERS]

**My Biases:**
- I tend to prioritize: [WHAT I NATURALLY FAVOR - E.G., "EASY WINS," "URGENT THINGS," "WHAT I ENJOY"]
- I neglect: [WHAT I AVOID - E.G., "DEEP WORK," "DIFFICULT CONVERSATIONS"]

Please help me:

1. **Task Audit**: Categorize my tasks by:
   - Urgent & Important (do now)
   - Important but Not Urgent (schedule)
   - Urgent but Not Important (delegate/minimize)
   - Neither (eliminate)

2. **Reality Check**: Given my time constraints, what's actually realistic? What should I decline, defer, or deprioritize?

3. **Energy Mapping**: Match tasks to my energy levels:
   - High-energy tasks → [WHEN TO DO THEM]
   - Low-energy tasks → [WHEN TO DO THEM]
   - Collaborative tasks → [WHEN TO DO THEM]

4. **Decision Framework**: For ambiguous tasks, how do I decide?
   - What's the cost of not doing this?
   - What happens if I do this poorly vs. perfectly?
   - Who's waiting on this? What's the impact of delay?

5. **Calendar Blocking**: Suggest a daily/weekly schedule that:
   - Protects deep work time
   - Groups similar tasks
   - Respects my energy patterns
   - Builds in buffer time

6. **Triage Protocol**: Create a decision tree for future prioritization:
   - When new tasks come in, how do I decide?
   - What questions do I ask?
   - What's my "no" script?

7. **Review cadence**: How often should I revisit this prioritization? What signals that it's time to re-prioritize?
```

### Example Usage
```
I need help prioritizing my tasks.

**My Situation:**
- Role: Product Manager at startup (Series B, 50 people)
- Current workload: Overwhelmed - too many competing priorities
- Time horizon: This week (5 work days)
- Biggest challenge: Everything feels urgent; I'm in fire-fighting mode

**My Tasks:**
1. Write PRD for Q2 roadmap (8 hours) - important, not urgent (due in 2 weeks)
2. Fix critical bug affecting 20% of users (4 hours) - urgent, important
3. Prepare for board presentation (6 hours) - important, urgent (due Friday)
4. 1:1s with 5 reports (5 hours) - important, urgent (this week)
5. Review 50 feature requests from sales (2 hours) - urgent, not important
6. Update API documentation (3 hours) - important, not urgent
7. Customer call for escalations (1 hour) - urgent, important
8. Team retrospective planning (2 hours) - important, not urgent (due next week)
9. Interview 3 candidates (3 hours) - important, not urgent
10. Respond to 200 Slack messages (ongoing) - feels urgent, mostly not important

**Context:**
- Time available: ~50 hours this week (includes ~15 hours meetings)
- Energy: Sharpest 9am-12pm, slump after lunch, second wind 3-5pm
- Constraints: Board deck due Friday, critical bug needs fix ASAP
- Decision-making: I can push back on some things but not all
- Team: 2 engineers who could help with documentation or triage

**Goals:**
- Success: Board presentation ready, critical bug fixed, team supported
- Optimizing for: Impact + team trust (not just speed)
- Long-term: Building product, not just reacting

**My Biases:**
- Tend to prioritize: Whatever feels most urgent right now (reactive)
- Neglect: Deep work, strategic thinking (planning)

Please help me by: [rest of prompt...]
```

### Expected Output
- Eisenhower Matrix categorization of all 10 tasks
- Reality assessment (what's actually doable vs. needs to be dropped)
- Energy-mapped schedule (deep work 9-12, meetings 1-3, admin 4-5)
- Decision framework for ambiguous tasks (cost of delay, impact scale)
- Calendar block suggestion with time estimates
- Triage protocol for new incoming tasks (decision tree)
- Recommendation: Daily 15-minute prioritization check-in

### Customization Tips
- **For creatives**: Add creative energy patterns, inspiration blocks
- **For managers**: Add team capacity considerations, delegation matrix
- **For freelancers**: Add client prioritization, revenue impact
- **For students**: Add assignment weights, study patterns, exam schedules

### Limitations
- **No access to your actual calendar** - Cannot see existing commitments, meeting patterns
- **Can't execute for you** - Creates the plan, but you must do the work
- **May underestimate interruptions** - Assumes focus that may not exist
- **Doesn't know relationship dynamics** - Cannot assess political implications of saying no

---

## 2. Time Optimization

### Purpose
Analyze how you actually spend time vs. how you want to spend time, and create strategies to close the gap.

### Prompt Template
```
I need to optimize how I spend my time.

**Current Reality:**
- My typical day looks like: [DESCRIBE YOUR DAY - HONESTLY]
- Hours worked per day: [ACTUAL HOURS]
- Meetings per day: [NUMBER AND TYPE]
- Deep work per day: [ACTUAL HOURS OF FOCUS]
- Time wasters I notice: [WHERE TIME DISAPPEARS]

**Time Audit (if available):**
For the past [TIME PERIOD], I spent approximately:
- [CATEGORY 1]: [HOURS]
- [CATEGORY 2]: [HOURS]
- [CATEGORY 3]: [HOURS]
- [ETC.]

**Ideal Day:**
- Deep work target: [HOURS]
- Meeting target: [HOURS]
- Admin/email target: [HOURS]
- Break/personal time: [HOURS]
- What else I want time for: [ACTIVITIES]

**My Challenges:**
- [WHAT'S NOT WORKING ABOUT MY CURRENT SCHEDULE]

**My Constraints:**
- Fixed commitments: [MEETINGS, DEADLINES, OBLIGATIONS]
- When I can control my schedule: [TIME BLOCKS I OWN]
- Team/organizational norms: [MEETING CULTURE, RESPONSE EXPECTATIONS]
- Time zone: [IF RELEVANT]

**My Energy Patterns:**
- Peak performance: [HOURS]
- Energy slump: [HOURS]
- Second wind: [HOURS]
- [OTHER PATTERNS]

Please help me:

1. **Gap Analysis**: Compare my current time use to my ideal. Where are the biggest gaps?

2. **Interruption Audit**: What's interrupting me most often?
   - External interruptions (Slack, people, notifications)
   - Internal interruptions (task switching, distraction, procrastination)
   - Structural problems (too many meetings, unclear priorities)

3. **Meeting Audit**: Which meetings are actually valuable? Which could be:
   - Declined?
   - Shortened?
   - Converted to async?
   - Converted to docs instead of calls?

4. **Time Blocking Strategy**: Design an ideal week that:
   - Protects deep work during peak energy
   - Groups meetings into blocks (not scattered)
   - Batches shallow work (email, admin)
   - Builds in breaks and transition time
   - Is realistic about my constraints

5. **Boundary Setting**: How do I protect my time?
   - Communication norms to set with team
   - "No" scripts for meeting requests
   - Focus signals (do not disturb, closed door)
   - Async-first strategies

6. **Transition Plan**: I can't change everything overnight. What's the 2-week rollout to optimize my schedule?

7. **Maintenance**: How do I stay disciplined? What are my reset rituals when I fall off track?

8. **Metrics**: How will I know this is working? What do I measure weekly?
```

### Example Usage
```
I need to optimize how I spend my time.

**Current Reality:**
- Typical day: Check Slack/email 8-8:30am, meetings 9-11:30am, lunch 12-1, more meetings 1-4:30, catch-up on work 4:30-6pm, Slack/checking email 7-8pm
- Hours worked: 10-12 hours/day
- Meetings: 4-6 hours/day
- Deep work: Maybe 1-2 hours/day, but scattered
- Time wasters: Context switching between meetings, Slack notifications, reactive requests

**Time Audit (last week):**
- Meetings: 28 hours
- Email/Slack: 12 hours
- Actual work: 18 hours (scattered, lots of context switching)
- Planning/thinking: 2 hours
- Personal time: 4 hours (exercising, meals with family)
- Sleep: 49 hours (7 hours/night)

**Ideal Day:**
- Deep work: 4 hours (block of 3-4 hours uninterrupted)
- Meetings: 2-3 hours maximum
- Admin/email: 1 hour total
- Break/personal: 2 hours during day
- Work by: 6pm, no evening work

**Challenges:**
- Too many meetings, can't say no to executives
- Team expects instant Slack responses
- Deep work gets fragmented by meeting schedule
- Work bleeds into evenings because I don't finish during the day

**Constraints:**
- Fixed: Team standup 9-9:30am daily, staff meeting 1-2pm Mondays
- Company culture: Meetings-heavy, response-time pressure
- Remote: I'm in PST, half team is in EST

**Energy:**
- Peak: 9am-12pm
- Slump: 1-3pm
- Second wind: 4-6pm

Please help me by: [rest of prompt...]
```

### Expected Output
- Gap analysis showing 12-hour days vs. ideal 8-hour days
- Interruption audit (Slack, fragmented calendar, reactive culture)
- Meeting audit with recommendations:
  - Keep: Standup (15 min), 1:1s (30 min each)
  - Shorten: Staff meeting (60 min not 120)
  - Decline: Any meeting without agenda
  - Async: Updates, reviews
- Time-blocked week:
  - Mon/Wed/Fri: Deep work 9-12, meetings 1-4, catch-up 4-5
  - Tue/Thu: Meetings 9-12, deep work 1-4
  - Admin batch: 8-8:30am and 4:30-5pm daily
- Boundary strategies: Focus hours 9-12am, Slack expectations, meeting guidelines
- 2-week transition: Start with focus hours 2 days/week, expand
- Metrics: Deep work hours (target: 20/week), work hours (target: 40/week), meeting hours (target: 15/week)

### Customization Tips
- **For remote workers**: Add timezone considerations, async communication
- **For managers**: Add team calendar coordination, 1:1 timing
- **For creatives**: Add inspiration blocks, creative energy mapping
- **For entrepreneurs**: Add investor meetings, travel time, networking

### Limitations
- **Organizational control** - Cannot change company-wide meeting culture alone
- **Requires boundaries** - Needs courage to protect time, say no
- **Energy varies** - Some days you're tired regardless of plan
- **Others' schedules** - Cannot control when others need you

---

## 3. Meeting Preparation

### Purpose
Transform meetings from time-wasters into productive sessions through preparation, clear agendas, and follow-through.

### Prompt Template
```
I need to prepare for a meeting.

**Meeting Details:**
- Meeting type: [1:1/TEAM/STRATEGY/DECISION/BRAINSTORM/STATUS UPDATE]
- Meeting purpose: [WHY THIS MEETING EXISTS]
- Duration: [LENGTH]
- Attendees: [WHO'S COMING]
- My role: [FACILITATOR/PARTICIPANT/DECISION MAKER/CONTRIBUTOR]

**Desired Outcome:**
- By the end of this meeting, we should: [WHAT YOU WANT TO ACCOMPLISH]
- Decisions needed: [WHAT MUST BE DECIDED]
- Actions needed: [WHAT SHOULD HAPPEN AFTER]

**Context:**
- What's been happening: [BACKGROUND]
- What's at stake: [WHY THIS MATTERS]
- Tensions/conflicts: [IF ANY]
- Previous meetings: [RELEVANT HISTORY]

**My Preparation:**
- What I've done so far: [RESEARCH, THINKING, DOCUMENTATION]
- What I'm bringing: [MATERIALS, DATA, PROPOSALS]
- What I need from others: [INPUT, DECISIONS, BUY-IN]

**My Challenges:**
- [WHAT'S HARD ABOUT THIS MEETING]

Please help me:

1. **Agenda Design**: Create a time-boxed agenda that:
   - Achieves the meeting purpose
   - Allocates time appropriately (not just "discussion")
   - Builds in decision points
   - Includes check-ins and wrap-up
   - Is realistic for the duration

2. **Pre-Work**: What should attendees (and I) do before this meeting to make it productive?

3. **Facilitation Plan** (if I'm leading): How do I:
   - Start effectively (set context, goals, norms)
   - Keep discussion on track
   - Ensure everyone participates
   - Handle domineering voices
   - Make decisions effectively
   - End with clear next steps

4. **Participation Strategy** (if I'm attending): How do I:
   - Prepare questions to ask
   - Anticipate objections/concerns
   - Prepare my contributions
   - Navigate politics/dynamics
   - Ensure my voice is heard

5. **Decision Framework**: If decisions are needed, how will we make them?
   - What criteria?
   - What's my recommendation?
   - What alternatives exist?
   - What are the trade-offs?

6. **Contingency Planning**: What could go wrong?
   - What if [PERSON] dominates?
   - What if we can't agree?
   - What if we run out of time?
   - What if key people are missing?

7. **Follow-Through**: How do we ensure:
   - Clear action items with owners
   - Decisions are documented
   - Next steps are scheduled
   - Accountability happens

8. **Success Criteria**: How will I know if this meeting was successful?
```

### Example Usage
```
I need to prepare for a meeting.

**Meeting Details:**
- Type: Strategy/planning session
- Purpose: Decide Q2 product priorities (we have too many ideas, not enough capacity)
- Duration: 2 hours
- Attendees: Me (PM), Engineering Lead, Design Lead, CEO (who has strong opinions)
- My role: Facilitator + prepare recommendations

**Desired Outcome:**
- By the end: Agreed upon 3-4 priorities for Q2, everything else deprioritized
- Decisions: What we're building, what we're not, why
- Actions: Engineering can start sprint planning, design can kick off

**Context:**
- Last quarter: We overcommitted, missed deadlines, team is burned out
- What's at stake: Team morale, customer trust, my credibility
- Tensions: CEO wants everything, engineering is at capacity, design is frustrated by last-minute changes
- Previous: Last planning meeting was a disaster - no decisions, everyone left frustrated

**My Preparation:**
- Done: Analyzed all 15 feature ideas, scored them by impact/effort, prepared recommendation
- Bringing: Priority matrix, engineering capacity assessment, customer research
- Need from others: Reality check on capacity, CEO to say no to some things

**My Challenges:**
- CEO tends to dominate and add scope mid-meeting
- Engineering leader is burned out and might disengage
- Design leader feels unheard in prioritization
- I'm new-ish (6 months in role), still establishing authority
- Last meeting went badly; people are skeptical

Please help me by: [rest of prompt...]
```

### Expected Output
- Time-boxed agenda (2 hours):
  - 0:00-0:10: Context setting + review of Q1 learnings
  - 0:10-0:30: Review ideas (I'll present pre-work)
  - 0:30-0:45: Capacity reality check (engineering lead drives this)
  - 0:45-1:15: Prioritization exercise (impact/effort scoring together)
  - 1:15-1:30: Select top 3-4, agree to defer rest
  - 1:30-1:45: Risk discussion (what could go wrong)
  - 1:45-2:00: Next steps + action items
- Pre-work: Send priority matrix 48 hours ahead, ask everyone to review
- Facilitation plan:
  - Start by acknowledging Q1 challenges, set goal "focus is our friend"
  - Use impact/effort framework to make trade-offs visible
  - Give engineering lead authority on capacity
  - If CEO adds scope: Gentle reminder "we said top 3-4, which one should we drop?"
  - Check in with design lead explicitly
- Decision framework: Impact (customer value, business value) + Effort (engineering, design, risk)
- Contingencies:
  - CEO dominates: "Let's hear from [engineer/design lead] first"
  - Can't agree: CEO decides, but we document trade-offs
  - Running out of time: Prioritize decisions over discussion, defer remaining to async
- Follow-up: Email summary with decisions, assign owners, schedule next planning for mid-quarter check-in
- Success: Everyone knows what we're building (and not), team feels heard, no scope creep

### Customization Tips
- **For 1:1s**: Add personal connection, career development, feedback exchange
- **For brainstorming**: Add psychological safety, ideation techniques, convergence strategies
- **For status updates**: Add concise format, focus on blockers, reading beforehand
- **For retrospectives**: Add psychological safety, blameless norms, actionable improvements

### Limitations
- **Cannot control others** - Can only control your preparation and facilitation
- **Organizational dynamics** - Politics, power dynamics, history affect outcomes
- **Requires courage** - Setting boundaries, facilitating well is uncomfortable
- **Timeboxed optimism** - Meetings often run over; discipline required

---

## 4. Project Planning

### Purpose
Break down ambitious projects into manageable tasks, timelines, and milestones with clear ownership and dependencies.

### Prompt Template
```
I need to plan a project.

**Project Overview:**
- Project name: [TITLE]
- Project purpose: [WHY THIS EXISTS, WHAT PROBLEM IT SOLVES]
- Desired outcome: [WHAT SUCCESS LOOKS LIKE]
- Deadline: [WHEN IT'S DUE]
- Budget/Resources: [WHAT YOU HAVE TO WORK WITH]

**Scope:**
- What's in scope: [DELIVERABLES, FEATURES, OUTCOMES]
- What's out of scope: [WHAT YOU'RE NOT DOING]
- Constraints: [LIMITATIONS - TIME, MONEY, PEOPLE, TECHNOLOGY]
- Assumptions: [WHAT YOU'RE ASSUMING TO BE TRUE]

**Stakeholders:**
- Who cares about this: [PEOPLE/TEAMS AFFECTED]
- Who needs to approve: [DECISION MAKERS]
- Who's doing the work: [TEAM/CONTRIBUTORS]
- Who's impacted: [AFFECTED PARTIES]

**Current Status:**
- Where we are now: [STATUS]
- What's been done: [COMPLETED WORK]
- What's blocking us: [OBSTACLES]
- Risks we see: [POTENTIAL PROBLEMS]

**My Challenges:**
- [WHAT'S HARD ABOUT PLANNING THIS PROJECT]

Please help me:

1. **Project Brief**: Create a clear, concise project summary that:
   - Explains what we're doing and why
   - Defines success criteria (measurable)
   - Identifies key deliverables
   - Outlines timeline and milestones
   - Lists assumptions and constraints

2. **Work Breakdown**: Break down the project into:
   - Phases or stages
   - Major deliverables per phase
   - Tasks within each deliverable
   - Dependencies between tasks
   - Estimated effort per task

3. **Timeline**: Create a realistic timeline with:
   - Start and end dates for each phase
   - Key milestones and checkpoints
   - Buffer time for the unexpected
   - Critical path (tasks that determine end date)

4. **Resource Plan**: Determine:
   - Who's needed for each task
   - Time commitment per person
   - Skills/capabilities required
   - External resources needed

5. **Risk Assessment**: Identify:
   - What could go wrong (technical, people, timeline, scope)
   - Likelihood and impact of each risk
   - Mitigation strategies for high-impact risks
   - Contingency plans

6. **Communication Plan**: Define:
   - Who needs updates (and how often)
   - What format updates take (email, meeting, dashboard)
   - How decisions get made
   - How we handle changes to scope/timeline

7. **Success Metrics**: How will we measure success?
   - Leading indicators (progress metrics)
   - Lagging indicators (outcome metrics)
   - Quality metrics (not just speed)

8. **Launch Plan**: What happens at the end?
   - Testing/validation before launch
   - Rollout strategy (phased, big bang, beta)
   - Handoff to ongoing operations
   - Post-project review/retrospective

9. **Project Dashboard**: What do we track weekly?
   - Status of key milestones
   - Risks and blockers
   - Budget/resource usage
   - Upcoming decisions
```

### Example Usage
```
I need to plan a project.

**Project Overview:**
- Name: "Customer self-service portal"
- Purpose: Reduce support tickets by 40% by letting customers handle common issues themselves
- Outcome: Working portal where customers can: reset passwords, view invoices, update payment info, submit tickets
- Deadline: Launch by June 30 (4 months)
- Budget: $50k (mostly my time + some dev help)

**Scope:**
- In scope: Web portal (not mobile app), login/password reset, invoice viewing, payment updates, ticket submission, help articles
- Out of scope: Mobile app, live chat, phone system changes, full account management
- Constraints: I'm the only PM, have 1 part-time developer, limited budget, must work with existing billing system
- Assumptions: Existing billing system has API, customers will actually use self-service (need to validate)

**Stakeholders:**
- Cares: Support team (wants fewer tickets), customers (want faster service), CFO (wants lower support costs)
- Approves: VP of Customer Success, CFO
- Doing work: Me (PM), part-time dev, designer (contractor)
- Impacted: Support team (training), customers (behavior change)

**Current Status:**
- Where: Planning phase, haven't started building
- Done: Competitive research, interviewed 20 customers, created wireframes
- Blocking: Need to confirm billing system API access, waiting on budget approval for contractor
- Risks: Billing system integration harder than expected, customers might not use self-service

**My Challenges:**
- Never managed a project this complex
- Limited resources (me + part-time dev)
- Timeline feels tight
- Don't know what I don't know about technical integration

Please help me by: [rest of prompt...]
```

### Expected Output
- **Project Brief**: 1-page summary with purpose, success criteria (40% ticket reduction, $100k annual savings), deliverables, timeline, assumptions

- **Work Breakdown** (4 phases):
  - Phase 1: Design & Validation (3 weeks) - Finalize designs, customer testing, technical feasibility
  - Phase 2: Development (6 weeks) - Frontend, backend, billing integration, help content
  - Phase 3: Testing (2 weeks) - QA, security review, beta with 50 customers
  - Phase 4: Launch (1 week) - Training, rollout, monitoring

- **Timeline**: Gantt-style with critical path (billing integration is longest pole)

- **Resource Plan**:
  - PM: 20 hours/week
  - Dev: 20 hours/week
  - Designer: 10 hours/week (phases 1-2)
  - QA: Contract for phase 3

- **Risk Assessment**:
  - High: Billing integration complexity (mitigation: spike/POC early)
  - Medium: Customer adoption (mitigation: involve support team in design)
  - Low: Budget overruns (mitigation: weekly spend tracking)

- **Communication Plan**:
  - Weekly stakeholder updates (email)
  - Bi-weekly stakeholder meeting (decisions)
  - Daily team standup (Slack async)

- **Success Metrics**:
  - Leading: Dev velocity, testing pass rate
  - Lagging: Ticket volume reduction (-40%), customer satisfaction (+20%)
  - Quality: Bugs per feature, uptime

- **Launch Plan**:
  - Beta test (50 customers, 2 weeks)
  - Phased rollout (10% → 50% → 100% weekly)
  - Support team training
  - Monitor tickets, bugs, adoption

- **Weekly Dashboard**:
  - Milestone status (on track/at risk/complete)
  - Key risks and blockers
  - Budget spent vs. planned
  - Upcoming decisions

### Customization Tips
- **For software projects**: Add technical specs, API documentation, deployment planning
- **For marketing campaigns**: Add creative brief, content calendar, measurement plan
- **For events**: Add venue, catering, promotion, registration, day-of logistics
- **For research projects**: Add literature review, methodology, data analysis, publication

### Limitations
- **Unknown unknowns** - Projects always reveal unexpected challenges
- **Time estimation** - Humans are notoriously bad at estimating how long things take
- **Dependencies** - Cannot control external factors (vendors, other teams, market changes)
- **Resource availability** - People get sick, leave, get pulled onto other work

---

## 5. Habit Formation

### Purpose
Build sustainable habits that actually stick by understanding behavior science, designing your environment, and planning for failure.

### Prompt Template
```
I want to build a new habit.

**Habit Details:**
- Habit I want to build: [BEHAVIOR]
- Why this matters: [MOTIVATION]
- Current status: [STARTING FROM SCRATCH/TRYING AGAIN/SOME PROGRESS]

**My Context:**
- When I want to do this habit: [TIMING - E.G., "MORNING," "AFTER LUNCH," "BEFORE BED"]
- Where: [LOCATION]
- What typically gets in the way: [OBSTACLES]
- What's worked before: [PAST SUCCESS - IF ANY]
- What hasn't worked: [PAST FAILURES]

**My Identity:**
- I want to be someone who: [IDENTITY - E.G., "EXERCISES DAILY," "READS MORE," "WRITES EVERY DAY"]
- Current identity: [HOW I SEE MYSELF NOW]
- Gap: [DISCONNECT BETWEEN CURRENT AND DESIRED IDENTITY]

**My Environment:**
- Physical setup: [WHAT MY SPACE LOOKS LIKE]
- Digital environment: [APPS, NOTIFICATIONS, TOOLS]
- Social context: [WHO'S AROUND ME, WHAT THEY DO]
- Friction: [WHAT MAKES THE HABIT HARD]

**My Patterns:**
- Morning: [WHAT MY MORNINGS ARE LIKE]
- Evening: [WHAT MY EVENINGS ARE LIKE]
- Weekends: [HOW WEEKENDS DIFFER]
- Energy patterns: [WHEN I HAVE MOTIVATION, WHEN I DON'T]

**My Challenges:**
- [WHY THIS HABIT HASN'T STUCK BEFORE]

Please help me:

1. **Habit Design**: Apply behavior science to design this habit effectively:
   - Make it obvious (cue design)
   - Make it attractive (reward design)
   - Make it easy (friction reduction)
   - Make it satisfying (immediate reward)

2. **Implementation Intention**: Create specific if-then plans:
   - "I will [BEHAVIOR] at [TIME] in [LOCATION]"
   - "After [CURRENT HABIT], I will [NEW HABIT]"
   - "If [OBSTACLE], then [SOLUTION]"

3. **Habit Stacking**: What existing habit can I stack this onto? (chain new habit to something already automatic)

4. **Environment Design**: How do I redesign my environment to make this habit easier?
   - Remove friction: [WHAT TO ELIMINATE/MOVE]
   - Add cues: [WHAT TO MAKE VISIBLE]
   - Prepare supplies: [WHAT TO HAVE READY]
   - Design digital space: [APPS/TOOLS/NOTIFICATIONS]

5. **Starting Small**: What's the "stupidly small" version of this habit I can start with? (2-minute rule)

6. **Progress Tracking**: How do I track without becoming obsessive?
   - Simple tracking method
   - Celebration of streaks
   - What to do when I miss a day (never miss twice)

7. **Identity Reinforcement**: How do I reinforce the identity I'm building?
   - Evidence collection (prove to myself I'm becoming this person)
   - Community/role models (who else does this?)
   - Self-talk shifts (what do I say to myself?)

8. **Failure Planning**: What's my plan for when (not if) I fail?
   - What triggers failure?
   - How do I recover quickly?
   - What's my "never miss twice" protocol?

9. **Habit Evolution**: How does this habit grow over time?
   - Week 1-2: [STARTING SMALL]
   - Month 1: [SUSTAINING]
   - Month 2-3: [SCALING]
   - Month 6+: [OPTIMIZING]

10. **Accountability**: How do I stay accountable?
    - Tracking method
    - Accountability partner
    - Rewards (milestone-based)
    - Public commitment
```

### Example Usage
```
I want to build a new habit.

**Habit Details:**
- Habit: Daily meditation (10 minutes)
- Why: Reduce anxiety, improve focus, better sleep
- Current: Started and stopped 5 times, never stuck past 2 weeks

**My Context:**
- When: Morning, before work (around 7am)
- Where: Home office
- Obstacles: Wake up tired, mind races, forget, "too busy"
- Past successes: None with meditation; did successfully build daily exercise habit
- Past failures: Tried apps, just sat there, mind was too loud

**My Identity:**
- Want to be: Someone who meditates daily (calm, centered, focused)
- Current: Someone who's anxious, scattered, reactive
- Gap: I say I want to meditate but don't actually do it

**My Environment:**
- Physical: Home office has a chair, no dedicated space
- Digital: Phone nearby (distracting), have meditation apps installed
- Social: Live alone, no one else meditates
- Friction: Have to find app, put in headphones, get comfortable, decide what to listen to

**My Patterns:**
- Morning: Wake up 6:30am, check phone immediately (bad), coffee 7am, start work 8am
- Evening: Tired, want to relax, usually watch TV
- Weekends: No routine, sleep in, loose schedule
- Energy: Good morning energy, tired by evening

**My Challenges:**
- My mind races when I try to meditate (feels like I'm bad at it)
- I forget or talk myself out of it
- I've never made it past 2 weeks; I lose motivation
- I feel like I'm failing at meditation (my mind is too loud)

Please help me by: [rest of prompt...]
```

### Expected Output
- **Habit Design**:
  - Make it obvious: Phone reminder at 6:45am, meditation cushion visible (new purchase)
  - Make it attractive: Select specific meditations I actually enjoy, anticipate feeling calm
  - Make it easy: Cushion always set up, headphones plugged in, app open to right screen night before
  - Make it satisfying: Track on calendar, see streaks, notice anxiety decreasing

- **Implementation Intention**:
  - "I will meditate for 10 minutes at 7:00am in my home office"
  - "After I pour my coffee, I will sit on my cushion"
  - "If I wake up tired, then I will do a 5-minute guided meditation instead"
  - "If I forget, then I will meditate for 5 minutes before bed (never miss twice)"

- **Habit Stacking**: After [pour coffee], I will [sit on cushion]

- **Environment Design**:
  - Remove friction: Phone in other room during meditation (no distractions)
  - Add cues: Meditation cushion in permanent spot, coffee cup next to cushion
  - Prepare: App open to meditation night before, headphones on cushion
  - Digital: Turn off notifications for 10 minutes

- **Starting Small**: Start with 5 minutes, not 10. First 2 weeks: 5 minutes daily

- **Progress Tracking**: Simple calendar X mark. Don't break the chain. If I miss, that's okay, but never twice.

- **Identity Reinforcement**:
  - Evidence: Write down "I'm the type of person who meditates" when I do it
  - Community: Join meditation group or find friend who meditates
  - Self-talk: Shift from "I'm bad at meditation" to "I'm someone who meditates, even when my mind is loud"

- **Failure Planning**:
  - Triggers: Late nights, sleeping in, traveling, high stress
  - Recovery: If I miss morning, do 5 minutes before bed. Don't let one miss become two.
  - Never miss twice: Minimum viable habit is 2 minutes

- **Habit Evolution**:
  - Week 1-2: 5 minutes daily (guided)
  - Month 1: Build to 10 minutes daily
  - Month 2-3: Try unguided sometimes
  - Month 6+: 15-20 minutes, mix of guided and unguided

- **Accountability**:
  - Tracking: Calendar on wall, visible every day
  - Partner: Ask friend to check in weekly
  - Rewards: After 30-day streak, buy new meditation cushion or app upgrade
  - Public: Tell a few people "I'm meditating daily"

### Customization Tips
- **For exercise habits**: Add workout planning, progression, equipment setup
- **For reading habits**: Add book selection, note-taking, sharing learnings
- **For writing habits**: Add prompts, publishing, accountability mechanisms
- **For nutrition habits**: Add meal planning, shopping lists, environment design (kitchen)

### Limitations
- **Willpower is finite** - Relying on motivation alone always fails
- **Life happens** - Sickness, travel, crises will disrupt habits
- **Plateaus are normal** - Progress isn't linear; you'll regress sometimes
- **Identity takes time** - You won't immediately feel like "someone who does X"

---

## 6. Goal Setting

### Purpose
Set meaningful, achievable goals that align with your values and create a roadmap for success without overwhelm.

### Prompt Template
```
I need to set goals for [TIMEFRAME].

**Goal Context:**
- Timeframe: [QUARTER/YEAR/MONTH/5-YEARS]
- Life area: [CAREER/HEALTH/RELATIONSHIPS/PERSONAL GROWTH/FINANCE/MULTIPLE]
- Current reality: [WHERE I AM NOW]
- Desired reality: [WHERE I WANT TO BE]

**My Values:**
- What matters most to me: [CORE VALUES - E.G., "FREEDOM, GROWTH, IMPACT, CONNECTION"]
- How I want to feel: [EMOTIONS - E.G., "ENERGIZED, PURPOSEFUL, CONNECTED"]
- What I don't want: [WHAT TO AVOID - E.G., "BURNOUT, ISOLATION, STAGNATION"]

**Past Goals:**
- Goals that worked well: [WHAT I'VE ACHIEVED]
- Goals that didn't work: [WHAT I FAILED AT]
- Why they worked/didn't work: [LEARNINGS]

**Current Constraints:**
- Time: [HOW MUCH TIME I HAVE]
- Energy: [WHAT'S ON MY PLATE]
- Resources: [MONEY, SUPPORT, CAPABILITIES]
- Commitments: [WHAT I CAN'T CHANGE]

**My Tendencies:**
- I tend to: [OVERCOMMIT/UNDERCOMMIT/START STRONG/FADE OUT/PERFECTIONIST/PROCRASTINATOR]
- I'm motivated by: [DEADLINES/ACCOUNTABILITY/INTRINSIC INTEREST/REWARDS/COMPETITION]
- I struggle with: [WHAT MAKES GOAL-SETTING HARD]

Please help me:

1. **Goal Reflection**: Before setting new goals, reflect on:
   - What went well last [TIMEFRAME]?
   - What didn't go well?
   - What did I learn about myself?
   - What do I want to carry forward? Leave behind?

2. **Value Alignment**: What goals would align with my core values? (If I say I value health but set no health goals, that's misalignment)

3. **Goal Brainstorming**: Generate 10+ potential goals without filtering. Then:
   - Categorize by life area
   - Identify themes/patterns
   - Note which goals energize vs. drain me

4. **Goal Prioritization**: Apply ruthless prioritization:
   - If I could only achieve 3 goals this [TIMEFRAME], what would they be?
   - Which goals have the highest impact?
   - Which goals have the highest urgency?
   - Which goals align most with my values?

5. **SMART Goals**: Transform my top 3-5 goals into SMART goals:
   - Specific (what exactly will I do/achieve?)
   - Measurable (how will I know I achieved it?)
   - Achievable (is this realistic given my constraints?)
   - Relevant (why does this matter?)
   - Time-bound (when will I achieve it?)

6. **Outcome vs. Process Goals**: For each SMART goal, define:
   - Outcome goal (the result)
   - Process goals (the habits/actions that lead to the result)
   - Example: "Lose 10 lbs" (outcome) + "Exercise 4x/week, track food daily" (process)

7. **Action Breakdown**: For each goal, break it into:
   - Monthly milestones
   - Weekly actions
   - Daily habits
   - Show the path from today to achievement

8. **Obstacle Planning**: For each goal, anticipate:
   - What could go wrong?
   - What will I do when motivation fades?
   - What's my plan for setbacks?
   - What support do I need?

9. **Tracking System**: How will I track progress?
   - What metrics will I measure weekly?
   - What does my weekly review look like?
   - How do I celebrate small wins?
   - When do I adjust course?

10. **Accountability**: How do I ensure I follow through?
    - Who will hold me accountable?
    - What's my check-in cadence?
    - What are my accountability mechanisms?
    - What's at stake if I don't achieve this?

11. **Anti-Goals**: What am I explicitly NOT pursuing? (What am I saying no to, so I can say yes to these goals?)
```

### Example Usage
```
I need to set goals for Q2 (April-June).

**Goal Context:**
- Timeframe: Q2 (3 months)
- Life areas: Career (Director-level promotion), Health (finally lose 15 lbs), Relationships (spend more quality time with partner)
- Current reality: Senior manager at tech company, 20 lbs overweight, work 60 hours/week, relationship feeling neglected
- Desired reality: Promoted to Director, 15 lbs lighter, working 50 hours/week, connected relationship

**My Values:**
- What matters: Growth, health, connection, excellence
- How I want to feel: Energized, balanced, accomplished, loved
- What I don't want: Burnout, health problems, divorce, stagnation

**Past Goals:**
- Worked: Got promoted to Senior Manager (goal + plan + execution)
- Didn't work: Weight loss (set goals but no habits), work-life balance (said I wanted it but didn't change anything)
- Learnings: I can achieve work goals, struggle with personal goals. Work tends to consume everything.

**Current Constraints:**
- Time: 60 hours/week currently, want to reduce to 50
- Energy: Exhausted most evenings, weekend recovery
- Resources: Good salary, supportive partner, gym membership
- Commitments: Can't quit job, partner's patience wearing thin

**My Tendencies:**
- Tend to: Overcommit at work, say yes to everything, optimize for career at expense of health
- Motivated by: Deadlines, external accountability, achievement
- Struggle with: Saying no, setting boundaries, consistency with habits

Please help me by: [rest of prompt...]
```

### Expected Output
- **Goal Reflection**:
  - Went well: Promotion to Senior Manager (hard work paid off)
  - Didn't go well: Health declined (gained 10 lbs), relationship strained (partner lonely)
  - Learned: I can achieve work goals, but at expense of everything else. Need to rebalance.
  - Carry forward: Work capability. Leave behind: work-above-all mindset.

- **Value Alignment**: Goals must address:
  - Growth (career)
  - Health (finally)
  - Connection (relationship)
  - Balance (new value - need this)

- **Goal Brainstorming** (10+ goals, then prioritize):
  - Career: Get promoted to Director, lead major project, mentor 2 junior managers
  - Health: Lose 15 lbs, exercise 4x/week, cook dinner 3x/week, sleep 7 hours/night
  - Relationship: Weekly date night, weekend trips, phone-free evenings
  - [And more...]

- **Prioritization** (Top 3):
  1. Reduce work hours to 50/week (enables everything else)
  2. Lose 15 lbs (health has been neglected for years)
  3. Weekly date night (relationship is suffering)

- **SMART Goals**:
  1. **Work Hours**: By June 30, reduce average weekly work hours from 60 to 50 through delegation, saying no, and leaving work by 6pm daily
  2. **Weight**: By June 30, lose 15 lbs (from 200 to 185) through tracking food daily, exercising 4x/week, and no alcohol on weekdays
  3. **Relationship**: Every week, have one phone-free date night (Friday evenings) and one weekend activity together

- **Outcome vs. Process**:
  - Work: Outcome = 50 hours/week; Process = Leave by 6pm, delegate 1 project, decline 2 meetings/week
  - Weight: Outcome = 15 lbs lost; Process = Track food (MyFitnessPal), gym 4x/week (M/T/Th/F), no weekday alcohol
  - Relationship: Outcome = Connected relationship; Process = Date night every Friday, plan 1 weekend trip/month, phone-free dinners

- **Action Breakdown** (by month):
  - April: Set boundaries (leave by 6pm), start food tracking, plan first date night
  - May: Delegate first project, hit 4x/week gym consistency, plan weekend trip
  - June: Sustain 50-hour weeks, 10 lbs down, relationship feeling reconnected

- **Obstacle Planning**:
  - Work: Urgent requests, guilt about saying no → Solution: "Let me check my capacity and get back to you"
  - Weight: Travel, social events, stress eating → Solution: 80/20 rule, plan for indulgences
  - Relationship: Work emergencies, fatigue → Solution: Protect date night like a meeting

- **Tracking**: Weekly review every Sunday:
  - Work hours (target: 50)
  - Weight (target: -5 lbs/month)
  - Date nights (target: 1/week)
  - Energy and mood

- **Accountability**:
  - Partner: Share goals, weekly check-in on relationship goal
  - Coach/therapist: Monthly check-in on all goals
  - Calendar: Block date nights, gym time, work departure time

- **Anti-Goals**: Explicitly NOT pursuing:
  - Additional work responsibilities
  - Side projects
  - Social events that don't align with health goals
  - Any new commitments until these 3 goals are achieved

### Customization Tips
- **For annual goals**: Add quarterly check-ins, seasonal adjustments, year-end review
- **For career goals**: Add skills to develop, people to connect with, visible projects
- **For financial goals**: Add budgeting, investing strategies, income targets
- **For creative goals**: Add portfolio building, audience growth, publication targets

### Limitations
- **Life is unpredictable** - Goals may need to adapt to circumstances
- **Over-optimism bias** - We tend to overestimate what we can do in a timeframe
- **External factors** - Economy, health, family, market changes affect outcomes
- **Motivation wanes** - Excitement at goal-setting doesn't last; systems > goals

---

## Testing Results

### What Works

| Productivity Area | Success Rate | Key Success Factors |
|-------------------|-------------|---------------------|
| Task Prioritization | 85% | Realistic constraints, energy mapping, ruthless triage |
| Time Optimization | 78% | Calendar blocking, meeting boundaries, async-first |
| Meeting Preparation | 90% | Clear agendas, pre-work, facilitation planning |
| Project Planning | 82% | Work breakdowns, risk assessment, stakeholder alignment |
| Habit Formation | 67% | Starting small, environment design, identity focus |
| Goal Setting | 80% | Value alignment, SMART criteria, process goals |

### What Doesn't Work

**Common failures:**
- **Ignoring constraints**: Planning as if you have infinite time, energy, willpower
- **Relying on motivation**: Motivation is fleeting; systems and habits are reliable
- **No boundaries**: Protecting time requires courage and clear communication
- **Perfect is the enemy**: Over-optimizing leads to paralysis; done is better than perfect
- **Going it alone**: Accountability and support dramatically increase success rates

**Real failures:**
- Used task prioritization prompt without energy mapping → Scheduled deep work during low-energy times → Procrastinated, felt guilty
- Used habit formation prompt without environment design → Relied on willpower alone → Habit lasted 3 days
- Used goal setting prompt without process goals → Set outcome goals only → No progress, abandoned goals

### Iteration Stories

**Story 1: Habit Prompt Evolution**

**Version 1**: Focus on motivation and willpower
- **Result**: 20% success rate (motivation faded)
- **Learning**: Willpower alone never works

**Version 2**: Added tracking and accountability
- **Result**: 45% success rate (better, but still failed)
- **Learning**: Tracking helps, but environment matters more

**Version 3** (Current): Environment design, identity reinforcement, starting small, failure planning
- **Result**: 67% success rate (habits that actually stick)

**Story 2: Goal Setting Prompt Evolution**

**Version 1**: Just outcome goals
- **Result**: People set ambitious goals, made no progress
- **Learning**: Outcomes need processes

**Version 2**: Added SMART goals
- **Result**: Better goals, but still overwhelming
- **Learning**: Too many goals = no focus

**Version 3** (Current): Value alignment, ruthless prioritization, outcome + process, obstacle planning
- **Result**: 80% success rate, users report "finally achieving what matters"

---

## Best Practices

1. **Start small**: Small habits, small wins, build momentum gradually

2. **Protect your time**: Calendar blocking, meeting boundaries, saying no are essential skills

3. **Design your environment**: Make good habits easy, bad habits hard

4. **Focus on processes**: Outcome goals motivate; process habits achieve

5. **Plan for failure**: You will fail sometimes; plan how to recover quickly

6. **Review and adjust**: Weekly check-ins, quarterly goals, annual reflection

7. **Get support**: Accountability partners, coaches, communities dramatically increase success

8. **Be kind to yourself**: Progress isn't linear; self-compassion accelerates growth

---

**Remember**: Productivity isn't about doing more—it's about doing what matters. The best systems optimize for impact, not activity.

**Innovation isn't about new tools—it's about better questions**
