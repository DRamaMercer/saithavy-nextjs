# Automation Workflow Diagram Template

**Purpose:** Visual representation of automation flow for easy understanding and troubleshooting

**How to Use:**
1. Copy this template for each automation
2. Replace placeholder text with your specific steps
3. Use consistent symbols: [Trigger] → [Action] → [Decision] → [Output]
4. Share with team for alignment and onboarding

---

## Master Workflow Diagram Template

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATION WORKFLOW                          │
│                     [Automation Name]                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   TRIGGER    │────▶│   ACTION 1   │────▶│   DECISION   │
│              │     │              │     │              │
│ [Event that  │     │ [First step  │     │ [If/Then     │
│  starts the  │     │  after       │     │  logic       │
│  automation] │     │  trigger]    │     │  branch]     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                │
                    ┌───────────────────────────┼───────────────────┐
                    │                           │                   │
                    ▼                           ▼                   ▼
            ┌──────────────┐           ┌──────────────┐   ┌──────────────┐
            │   ACTION 2A  │           │   ACTION 2B  │   │   ACTION 2C  │
            │              │           │              │   │              │
            │ [Path A:     │           │ [Path B:     │   │ [Path C:     │
            │  Condition   │           │  Condition   │   │  Condition   │
            │  is TRUE]    │           │  is FALSE]   │   │  is ERROR]   │
            └──────────────┘           └──────────────┘   └──────────────┘
                    │                           │                   │
                    └───────────────────────────┼───────────────────┘
                                                │
                                                ▼
                                        ┌──────────────┐
                                        │   OUTPUT     │
                                        │              │
                                        │ [Final       │
                                        │  result or   │
                                        │  next step]  │
                                        └──────────────┘
```

---

## Simple Linear Workflow (No Branching)

**Example:** Lead Capture Automation

```
[Form Submitted] → [Validate Data] → [Check for Duplicates] → [Create Lead in CRM] → [Send Notification]
       ↓                  ↓                   ↓                      ↓                      ↓
   [Webhook]        [Email/Phone]      [Search CRM]          [Salesforce]            [Slack/Email]
   [Trigger]        [Format Check]     [Prevent Dups]        [New Record]           [Alert Rep]
```

**Steps:**
1. **Trigger:** User submits form on website
2. **Action 1:** Validate email format and phone number
3. **Action 2:** Search CRM for existing lead with same email
4. **Action 3:** If no duplicate, create new lead record
5. **Output:** Send Slack notification to sales team

**Tools:** Typeform → Zapier → Salesforce → Slack

---

## Branching Workflow (Decision Points)

**Example:** Invoice Generation with Approval

```
[Timesheet Approved] → [Calculate Total] → [Check Amount] ─────────────────┐
       ↓                     ↓                    │                        │
  [Harvest]            [Math Logic]           [Decision]                    │
  [Trigger]            [Hours × Rate]        [Threshold]                   │
                                                 │                        │
                            ┌────────────────────┼────────────────────┐   │
                            │                    │                    │   │
                            ▼                    ▼                    ▼   ▼
                     [Amount < $5K]      [Amount $5K-$25K]    [Amount > $25K]
                            │                    │                    │
                            ▼                    ▼                    ▼
                     [Auto-Approve]       [Manager Approval]   [CFO Approval]
                     [Send Invoice]           ↓                    ↓
                            │           [DocuSign Sign]      [DocuSign Sign]
                            └────────────────────┼────────────────────┘
                                                 │
                                                 ▼
                                          [Send to Client]
                                          [Email + Payment Link]
```

**Decision Points:**
- **Decision 1:** Invoice amount vs approval threshold
- **Path A:** <$5K = Auto-approve and send
- **Path B:** $5K-$25K = Manager approval required
- **Path C:** >$25K = CFO approval required

---

## Complex Multi-Step Workflow

**Example:** Email Auto-Responder with Behavior Tracking

```
[Lead Signs Up] → [Add to Email List] → [Send Email 1] → [Track Opens] → [Branch Based on Engagement]
       ↓                  ↓                   ↓               │                    │
  [Form Submit]    [Email Platform]    [Welcome Email]  [Analytics]          [Decision]
  [Trigger]        [Create Contact]    [Immediate]      [24 hrs later]       [Engaged?]
                                                                                │
                                                        ┌──────────────────────┼───────────────────┐
                                                        │                      │                   │
                                                        ▼                      ▼                   ▼
                                                [Opened Email]         [Did Not Open]    [Clicked Link]
                                                        │                      │                   │
                                                        ▼                      ▼                   ▼
                                                [Send Email 2A]       [Resend Email 1]   [Add to Hot Leads]
                                                [Case Study]          [New Subject]      [Notify Sales]
                                                        │                      │
                                                        └──────────────────────┼───────────────────┘
                                                                               │
                                                                               ▼
                                                                        [Continue Sequence]
                                                                        [Emails 3-6]
```

---

## Workflow Diagram Symbols Reference

| Symbol | Meaning | Example |
|--------|---------|---------|
| `[Trigger]` | Event that starts automation | `[Form Submitted]` |
| `[Action]` | Step that performs work | `[Create Lead in CRM]` |
| `[Decision]` | Branch point based on condition | `[Check Amount]` |
| `[Output]` | Final result or deliverable | `[Send Invoice]` |
| `→` | Flow direction (next step) | Lead to next step |
| `↓` | Vertical flow (step down) | Action to next step |
| `│` | Parallel processing (multiple steps) | Simultaneous actions |
| `◀▶` | Integration/connection | System A talks to System B |

---

## Best Practices for Workflow Diagrams

### DO:
✅ Keep it simple (one page max)
✅ Use consistent terminology
✅ Include tool names (e.g., Salesforce, Zapier, Slack)
✅ Label all decision branches clearly
✅ Show error handling paths
✅ Include approximate time estimates
✅ Use color coding: Blue (normal), Red (error), Green (success)

### DON'T:
❌ Create overly complex diagrams (> 10 steps)
❌ Use jargon without explanation
❌ Skip decision points
❌ Forget error handling
❌ Make the diagram too small to read
❌ Use inconsistent symbols

---

## Example: Complete Workflow Diagram

**Automation:** Social Media Scheduling

```
┌─────────────────────────────────────────────────────────────┐
│         SOCIAL MEDIA SCHEDULING WORKFLOW                    │
└─────────────────────────────────────────────────────────────┘

[Content Added to Calendar]
        ↓
[Validation Check]
        │
        ├─→ [Missing Asset?]
        │        │
        │        ├─→ YES: [Alert Team] → [Skip Post]
        │        └─→ NO:  [Continue]
        │
        ↓
[Optimize Per Platform]
        │
        ├─→ LinkedIn: [Long-form, 3-5 hashtags]
        ├─→ Twitter: [Thread, 1-2 hashtags]
        ├─→ Facebook: [Link preview, 2-3 hashtags]
        └─→ Instagram: [Image, 10-15 hashtags]
        │
        ↓
[Schedule in Buffer]
        │
        ├─→ [Optimal Time Calculation]
        │       │
        │       ├─→ LinkedIn: Tue-Thu, 8-10 AM
        │       ├─→ Twitter: Mon-Fri, 9-11 AM
        │       └─→ Instagram: Mon, Tue, Fri, 11 AM-1 PM
        │
        ↓
[Publish at Scheduled Time]
        │
        ├─→ [Post Successful?] ──→ YES: [Update Status: Published]
        │                              │
        │                              ↓
        │                        [Track Performance]
        │                              │
        │                              ├─→ Opens, Clicks, Shares
        │                              └─→ Update Analytics Dashboard
        │
        └─→ NO: [Retry 3x] ──→ [Still Failed?]
                                     │
                                     └─→ [Alert Team + Log Error]
```

---

## How to Create Your Own Workflow Diagram

### Step 1: Identify the Trigger
- What event starts the automation?
- Examples: Form submit, webhook, schedule, API call

### Step 2: List All Actions
- What happens after the trigger?
- List every action in order
- Note the tool/system for each action

### Step 3: Find Decision Points
- Where does the workflow branch?
- What conditions determine the path?
- Examples: Amount threshold, data validation, engagement level

### Step 4: Define Outputs
- What is the final result?
- What notifications are sent?
- What data is stored or updated?

### Step 5: Add Error Handling
- What happens if a step fails?
- Are there retry attempts?
- Who gets notified of failures?

### Step 6: Create the Diagram
- Use text-based diagram (like this template)
- Or use visual tools: Lucidchart, Draw.io, Miro
- Include all steps, decisions, and outputs

### Step 7: Review and Test
- Walk through the diagram step by step
- Does it match the actual automation?
- Test with real data
- Update diagram as needed

---

## Workflow Diagram Tools

### Text-Based (Free & Simple)
- **Markdown/ASCII:** This template (easy, version-controlled)
- **Mermaid.js:** Code-based diagrams, renders in GitHub/GitLab

### Visual Tools (Freemium)
- **Draw.io (diagrams.net):** Free, open-source, saves to Google Drive
- **Lucidchart:** Professional, collaboration features, free tier available
- **Miro:** Collaborative whiteboard, great for team workshops

### Specialized Tools
- **Zapier Visual Builder:** Built-in workflow visualization
- **Make (Integromat):** Visual scenario builder with flowcharts
- **Microsoft Visio:** Enterprise diagramming (paid)

---

## Template Usage Checklist

When creating a workflow diagram for a new automation:

- [ ] Identify and document the trigger event
- [ ] List all sequential actions in order
- [ ] Mark all decision points (if/then branches)
- [ ] Define all possible outputs/results
- [ ] Include error handling paths
- [ ] Note the tool/system for each step
- [ ] Add time estimates for each step
- [ ] Review with stakeholders for accuracy
- [ ] Test diagram against actual automation
- [ ] Update diagram when automation changes

---

## Example: Error Handling Workflow

```
[Main Action]
      ↓
[Action Successful?] ──→ YES: [Continue to Next Step]
      │
      └─→ NO: [Log Error]
                  │
                  ├─→ [Is Retryable?]
                  │        │
                  │        ├─→ YES: [Retry Attempt 1]
                  │        │        │
                  │        │        ├─→ [Success?] ──→ YES: [Continue]
                  │        │        │
                  │        │        └─→ NO: [Retry Attempt 2]
                  │        │                 │
                  │        │                 └─→ [Success?] ──→ YES: [Continue]
                  │        │                          │
                  │        │                          └─→ NO: [Retry Attempt 3]
                  │        │                                   │
                  │        │                                   └─→ [Still Failed?]
                  │        │                                            │
                  │        └─→ NO: [Skip Retry] ─────────────────────────┘
                  │
                  ↓
            [Alert Team]
                  ↓
            [Log Incident]
                  ↓
            [Use Fallback]
            (e.g., manual process, cached data)
```

---

**Remember:** A good workflow diagram should be simple enough that a new team member can understand the automation in 5 minutes or less.
