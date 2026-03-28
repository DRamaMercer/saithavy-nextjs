# Team Communication Audit

**Communication is relationship, not transmission.**

Most team problems are communication problems. This audit helps you diagnose communication breakdowns before they become cultural problems.

I've used this audit after learning the hard way that poor communication doesn't fix itself—it compounds.

## Table of Contents

1. [Communication Channel Assessment](#communication-channel-assessment)
2. [Information Flow Analysis](#information-flow-analysis)
3. [Bottleneck Identification](#bottleneck-identification)
4. [Improvement Roadmap](#improvement-roadmap)

---

## Communication Channel Assessment

Evaluate how your team communicates across different channels.

### Channel Inventory

List all communication channels your team uses:

#### Synchronous (Real-time)

| Channel | Purpose | Frequency | Participants | Notes |
|---------|---------|-----------|--------------|-------|
| Team standup | Daily sync | Daily | Whole team | Currently 30min, too long |
| 1:1 meetings | Development | Biweekly | Manager/Direct | 50% attendance rate |
| Ad-hoc calls | Urgent issues | As needed | Variable | No tracking |
| | | | | |

#### Asynchronous (Delayed)

| Channel | Purpose | Frequency | Participants | Notes |
|---------|---------|-----------|--------------|-------|
| Slack/Teams | Quick questions | Ongoing | Whole team | 24/7 expectations |
| Email | Formal comms | Weekly | Whole team | Poor response time |
| Project tool | Status updates | Weekly | Whole team | Rarely updated |
| Wiki/Docs | Knowledge | As needed | Whole team | Outdated |
| | | | | |

#### Documentation

| Channel | Purpose | Last Updated | Owner | Status |
|---------|---------|--------------|-------|--------|
| Process docs | Onboarding | 3 months ago | ??? | Outdated |
| Decision log | Context | Never | ??? | Doesn't exist |
| Meeting notes | Reference | Sporadic | Rotating | Inconsistent |
| | | | | |

### Channel Effectiveness Rating

For each channel, rate its effectiveness:

**Scale:** 1 (Ineffective) - 5 (Highly Effective)

#### Scoring Guide

**Score 5:** Channel achieves its purpose, team loves it, minimal friction
**Score 3-4:** Channel works but has room for improvement
**Score 1-2:** Channel creates more problems than it solves

#### Template

| Channel | Current Rating | Top Strength | Top Weakness | Improvement Opportunity |
|---------|----------------|--------------|--------------|------------------------|
| Team standup | 3/5 | Everyone aligned | Too long, low value | Try asynchronous format |
| Slack | 4/5 | Fast response | Always-on pressure | Set response time expectations |
| Email | 2/5 | Formal record | Poor response | Use for announcements only |
| | | | | |

### Channel Overlap Analysis

Identify where channels create confusion:

**Question:** Where are team members unsure which channel to use?

**Common Overlaps:**

- Slack vs. Email: When to use which?
- Meetings vs. Async: Could this be a doc instead?
- 1:1s vs. Team: Should this be 1:many?

**Template:** Map scenarios to channels

| Communication Scenario | Primary Channel | Backup Channel | Confusion Level |
|------------------------|-----------------|-----------------|-----------------|
| Urgent bug in production | Slack #urgent | Phone call | Low (clear) |
| Project status update | Standup | Project tool | High (unclear) |
| Feedback on work | 1:1 meeting | Ad-hoc call | Medium (varies) |
| | | | |

---

## Information Flow Analysis

Map how information actually moves through your team (not how you think it moves).

### Information Flow Diagram

Create a visual map of information flow:

```
Leadership → Team Lead → Individual Contributors → Customers
              ↓                  ↓
          Stakeholders      Cross-functional Partners
```

#### Template: Define Information Flows

**Type 1: Top-Down (Leadership → Team)**

| Information | Current Path | Frequency | Barriers | Effectiveness |
|-------------|--------------|-----------|----------|---------------|
| Strategy updates | All-hands meeting | Monthly | People miss it | 3/5 |
| Policy changes | Email announcement | As needed | Buried in inbox | 2/5 |
| Feedback on work | 1:1 meetings | Biweekly | Delayed | 4/5 |
| | | | | |

**Type 2: Bottom-Up (Team → Leadership)**

| Information | Current Path | Frequency | Barriers | Effectiveness |
|-------------|--------------|-----------|----------|---------------|
| Project status | Standup | Daily | Leadership absent | 2/5 |
| Problems/issues | Ad-hoc mentions | As needed | Fear of blame | 2/5 |
| Ideas/innovation | No formal path | Rare | No process | 1/5 |
| | | | | |

**Type 3: Peer-to-Peer (Team Member ↔ Team Member)**

| Information | Current Path | Frequency | Barriers | Effectiveness |
|-------------|--------------|-----------|----------|---------------|
| Knowledge sharing | Ad-hoc | As needed | Not documented | 2/5 |
| Work handoffs | Meetings | Per project | Inconsistent | 3/5 |
| Best practices | Word of mouth | Rare | Lost over time | 1/5 |
| | | | | |

**Type 4: Cross-Functional (Your Team ↔ Other Teams)**

| Information | Current Path | Frequency | Barriers | Effectiveness |
|-------------|--------------|-----------|----------|---------------|
| Requirements | Ad-hoc calls | As needed | No documentation | 2/5 |
| Dependencies | Email threads | Sporadic | Missed messages | 2/5 |
| Shared goals | No formal process | Rare | Different priorities | 1/5 |
| | | | | |

### Information Speed Analysis

**Critical Test:** How fast does critical information travel?

**Test Scenarios:**

1. **Production issue discovered**
   - Who knows first? [Usually: IC who finds it]
   - Who needs to know next? [Usually: Tech lead, PM, customers]
   - How long does it take? [Measure actual time]
   - Current: _______
   - Goal: _______

2. **Strategic direction change**
   - Who knows first? [Usually: Leadership]
   - Who needs to know? [Usually: Whole team]
   - How long until everyone knows? [Time measurement]
   - Current: _______
   - Goal: _______

3. **Team member departure**
   - Who knows first? [Usually: Manager + individual]
   - Who needs to know? [Usually: Team, stakeholders, customers]
   - How is it communicated? [Current process]
   - Current: _______
   - Goal: _______

### Information Accessibility Test

**Can team members find information they need without asking?**

**Test Questions:**

- [ ] Where do I find the latest project status?
- [ ] Where are team decisions documented?
- [ ] Where can I find process documentation?
- [ ] Where do I find team contact information?
- [ ] Where is the team calendar?
- [ ] Where do I find meeting notes from meetings I missed?
- [ ] Where do I find information about company benefits?
- [ ] Where do I find escalation paths?

**Score:** _____ / 8

**Interpretation:**
- 6-8: Good information accessibility
- 4-5: Room for improvement
- 0-3: Information is trapped in people's heads

---

## Bottleneck Identification

Find where communication gets stuck.

### Persona-Based Bottleneck Analysis

Interview key team members about their communication experience:

#### Template: Individual Interview

**Interview Questions:**

1. "What information do you need but don't get reliably?"
2. "What communication takes more time than it should?"
3. "What do you have to ask for repeatedly?"
4. "Where does communication break down for you?"
5. "What's the most frustrating communication experience you've had on this team?"
6. "If you could fix one communication problem, what would it be?"

#### Aggregate Findings

| Team Member | Key Bottleneck | Impact | Suggested Fix |
|-------------|----------------|--------|---------------|
| Alex | Doesn't get context from leadership | Work misaligned with strategy | Monthly all-hands with Q&A |
| Jordan | Information comes too late | Rushed decisions, mistakes | Earlier communication loop |
| Taylor | Doesn't know who to contact for X | Delays, frustration | Clear ownership document |
| | | | |

### Process Bottleneck Analysis

**Identify where processes create communication problems:**

#### Meeting Bottlenecks

| Meeting Type | Bottleneck | Impact | Fix |
|--------------|------------|--------|-----|
| Standup | Takes too long, low value | Wastes 5 hours/week | Go async, limit to 15 min |
| Retrospective | No follow-up on action items | Same problems repeat | Assign owners, track in public |
| Planning | Not all voices heard | Missed perspectives | Use silent writing, round robin |
| | | | |

#### Decision-Making Bottlenecks

| Decision Type | Bottleneck | Impact | Fix |
|---------------|------------|--------|-----|
| Technical decisions | Unclear who decides | Delayed, decisions revisited | RACI matrix for decisions |
| Prioritization | No clear criteria | Work misaligned | Publish prioritization framework |
| Hiring decisions | Too many interviewers | Slow process, candidate loss | Limit to 4-5 interviewers |
| | | | |

#### Documentation Bottlenecks

| Document Type | Bottleneck | Impact | Fix |
|---------------|------------|--------|-----|
| Meeting notes | No template, inconsistent | People miss meetings | Create template, rotate note-taker |
| Process docs | No owner, outdated | People don't trust docs | Assign owners, quarterly review |
| Project updates | In project tool, no one checks | People out of loop | Email summary weekly |
| | | | |

### Structural Bottlenecks

**Identify where org structure creates communication problems:**

#### Common Structural Bottlenecks

**Problem:** Too many layers
- **Symptom:** Information gets distorted as it passes through
- **Test:** Compare message from source to final recipient
- **Fix:** Flatten structure, skip-level meetings

**Problem:** Unclear ownership
- **Symptom:** "That's not my job" or finger-pointing
- **Test:** Ask "Who owns X?" and see if answers vary
- **Fix:** RACI matrix for all key work

**Problem:** Remote/in-person divide
- **Symptom:** Information flows differently for remote vs. in-person
- **Test:** Compare awareness of remote vs. in-person team members
- **Fix:** Remote-first communication (assume remote)

**Problem:** Time zone spread
- **Symptom:** Delayed decisions, async communication challenges
- **Test:** Measure decision latency across time zones
- **Fix:** Core hours, async-first culture, documented decisions

---

## Improvement Roadmap

Turn audit findings into action.

### Prioritization Matrix

Categorize issues by **Impact** vs. **Effort**:

| Issue | Impact | Effort | Priority | Quick Win? |
|-------|--------|--------|----------|------------|
| No decision log | High | Low | 🔴 Critical | ✅ Yes |
| Meetings too long | Medium | Low | 🟡 High | ✅ Yes |
| Outdated docs | Medium | High | 🟢 Medium | ❌ No |
| Response time expectations | High | Medium | 🔴 Critical | ❌ No |

**Priority Actions:**
1. **🔴 Critical (High Impact, Any Effort):** Start immediately
2. **🟡 High (Medium Impact, Low Effort):** Quick wins, do next
3. **🟢 Medium (Any Impact, High Effort):** Plan for next quarter
4. **⚪ Low (Low Impact, Any Effort):** De-prioritize

### 30-Day Quick Wins

**Week 1: Documentation**

- [ ] Create decision log template
- [ ] Document current meeting norms
- [ ] Publish communication channel guide
- [ ] Assign owners to all key documents

**Week 2: Meetings**

- [ ] Audit meeting calendar (cancel unnecessary meetings)
- [ ] Implement meeting templates
- [ ] Start async standup trial
- [ ] Publish meeting notes publicly

**Week 3: Channels**

- [ ] Set response time expectations for Slack/Email
- [ ] Create project update template
- [ ] Establish #urgent channel for true emergencies
- [ ] Document escalation paths

**Week 4: Feedback**

- [ ] Run team communication retrospective
- [ ] Implement one improvement suggestion from team
- [ ] Schedule quarterly communication audit
- [ ] Celebrate improvements made

### 90-Day Structural Changes

**Month 1: Foundation**

- Implement decision log
- Establish meeting norms
- Create channel guide
- Start async experiments

**Month 2: Process**

- Implement RACI for key decisions
- Create documentation review process
- Establish cross-functional communication rhythm
- Implement regular retrospectives

**Month 3: Culture**

- Measure communication satisfaction (survey)
- Reward good communication practices
- Address remaining bottlenecks
- Plan next quarter improvements

### Success Metrics

Track these metrics to measure improvement:

#### Quantitative Metrics

| Metric | Current | 30-Day Goal | 90-Day Goal | Status |
|--------|---------|-------------|-------------|--------|
| Meeting hours per week | 12 | 10 | 8 | |
| Email response time | 24 hrs | 12 hrs | 8 hrs | |
| Decision documentation rate | 0% | 50% | 90% | |
| Team communication score | 3/5 | 4/5 | 5/5 | |

#### Qualitative Metrics

**Survey Questions (quarterly):**

1. "I have the information I need to do my job" (Agree/Disagree)
2. "Communication on this team is clear and timely" (Agree/Disagree)
3. "I know where to find information without asking" (Agree/Disagree)
4. "Meetings are a good use of my time" (Agree/Disagree)
5. "My voice is heard in team decisions" (Agree/Disagree)

**Open-Ended Questions:**

- "What's one communication problem we still need to fix?"
- "What's working well in our team communication?"
- "What would make communication on this team better?"

---

## Sample Audit Results

Here's what a completed audit revealed for a real team:

### Key Findings

**Critical Issues:**
1. No decision documentation → decisions revisited repeatedly
2. Leadership updates trapped in 1:1s → inconsistent understanding
3. Meeting overload → 60% of calendar, low satisfaction

**Quick Wins Identified:**
1. Create decision log (effort: 1 day, impact: high)
2. Publish weekly leadership summary (effort: 2 hours/week, impact: high)
3. Implement no-meeting Wednesdays (effort: 0, impact: medium)

### Actions Taken

**Week 1:**
- Created decision log template
- Published communication channel guide
- Canceled 3 recurring meetings

**Week 2:**
- Started weekly leadership email summary
- Implemented async standup on Mondays
- Rotated meeting note-taker role

**Week 3:**
- Established #urgent channel for true emergencies
- Set response time expectations (Slack: same day, Email: 48 hours)
- Created RACI matrix for project decisions

**Week 4:**
- Ran team retrospective on communication
- Implemented team suggestion: meeting-free afternoons
- Celebrated progress: 25% reduction in meeting time

### Results After 90 Days

- Meeting hours: 12 → 7 per week
- Decision documentation: 0% → 85%
- Communication satisfaction: 3.2/5 → 4.4/5
- Team reported: "Less meeting fatigue, more focus time, better context"

---

**Your presence is your primary leadership tool.**

A communication audit isn't about finding problems—it's about investing in the team's shared understanding and alignment. Do the audit, involve the team in solutions, and watch communication transform from friction to flow.
