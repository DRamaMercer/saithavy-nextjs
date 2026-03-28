# Email Automation Workflow Mapping Templates

## Visual Email Journey Maps

### How to Use These Templates
These workflow maps visualize the complete customer email journey. Each node represents an email touchpoint, and arrows show triggers/conditions.

---

## Template 1: Welcome Sequence Map (5-7 Emails)

**Purpose**: Convert new subscribers into customers
**Average Duration**: 7-14 days
**Industry Benchmarks**: 35-50% open rate, 5-10% click rate

### Visual Journey Map

```
[User Signs Up]
        ↓
[Email 1: Immediate Welcome]
├─ Subject: "Welcome to [Brand] - Here's your gift"
├─ Goal: Deliver lead magnet + set expectations
└─ Trigger: Immediately (0 min)
        ↓
[Email 2: Value Positioning]
├─ Subject: "The [specific problem] most people face"
├─ Goal: Establish authority + agitate pain point
├─ Send: 24 hours after Email 1
└─ Trigger: Time-based (24h)
        ↓
[Email 3: Quick Win]
├─ Subject: "One thing you can do today"
├─ Goal: Get first small action
├─ Send: 48 hours after Email 2
└─ Trigger: Time-based (48h)
        ↓
[Email 4: Social Proof]
├─ Subject: "How [customer] achieved [result]"
├─ Goal: Case study + testimonials
├─ Send: 72 hours after Email 3
└─ Trigger: Time-based (72h)
        ↓
[Email 5: Soft Sell]
├─ Subject: "Ready to take the next step?"
├─ Goal: Introduce paid offer
├─ Send: 48 hours after Email 4
└─ Trigger: Time-based (48h)
        ↓
[Email 6: Objection Handling]
├─ Subject: "But what about [common objection]?"
├─ Goal: Address concerns + FAQ
├─ Send: 72 hours after Email 5
└─ Trigger: Time-based (72h)
        ↓
[Email 7: Final Push]
├─ Subject: "Last call for [special offer]"
├─ Goal: urgency + discount
├─ Send: 48 hours after Email 6
└─ Trigger: Time-based (48h)
        ↓
[Move to Nurture Sequence]
```

### Branching Logic

```
                    [User Signs Up]
                           ↓
                  [Opened Email 1?]
                     ↙         ↘
                   YES          NO
                   ↓             ↓
          [Email 2 after 24h]  [Reminder Email after 48h]
                                        ↓
                              [Opened Reminder?]
                                 ↙        ↘
                               YES        NO
                               ↓           ↓
                      [Merge to Email 2]  [Send SMS/DM]
```

### Real-World Example: SaaS Welcome Sequence

**Results**: 47% open rate, 8.2% conversion to paid

**Email 1 (Immediate)**:
- Subject: "Welcome to GrowthApp! Your free trial starts now"
- Content: Login credentials, quick start guide, 15-min setup video
- CTA: "Complete your profile"

**Email 2 (24h later)**:
- Subject: "The 3-Step Framework That Helped [Company] 2x Their Revenue"
- Content: Educational blog post, mini-case study
- CTA: "Read the full case study"

**Email 3 (48h later)**:
- Subject: "Try This: Set up your first campaign in 5 minutes"
- Content: Tutorial video, template download
- CTA: "Create your first campaign"

**Email 4 (72h later)**:
- Subject: "How [Customer] Saved 20 Hours Every Week"
- Content: Video testimonial, before/after metrics
- CTA: "See more success stories"

**Email 5 (48h later)**:
- Subject: "Your Trial Ends in 3 Days - Here's What You'll Miss"
- Content: Feature highlights, comparison with free tools
- CTA: "Upgrade now - save 20%"

**Conversion**: 8.2% of trial users upgraded to paid

---

## Template 2: Nurture Sequence Map (7-10 Emails)

**Purpose**: Build relationship with non-buyers
**Average Duration**: 30-45 days
**Industry Benchmarks**: 25-40% open rate, 3-6% click rate

### Visual Journey Map

```
[Completed Welcome Sequence - Didn't Buy]
        ↓
[Email 1: New Value Angle]
├─ Subject: "Have you seen this [new insight]?"
├─ Goal: Re-engage with fresh perspective
└─ Trigger: 7 days post-welcome
        ↓
[Email 2: Behind the Scenes]
├─ Subject: "How we built [feature/product]"
├─ Goal: Transparency + build trust
└─ Trigger: 7 days later
        ↓
[Email 3: User-Generated Content]
├─ Subject: "Real users, real results"
├─ Goal: Social proof from community
└─ Trigger: 7 days later
        ↓
[Email 4: Educational Content]
├─ Subject: "Free guide: [topic]"
├─ Goal: Provide value without selling
└─ Trigger: 7 days later
        ↓
[Email 5: Interactive Element]
├─ Subject: "Quick poll: What's your biggest challenge?"
├─ Goal: Engagement + data collection
└─ Trigger: 5 days later
        ↓
[Email 6: Personalized Recommendation]
├─ Subject: "Based on your poll response..."
├─ Goal: Tailored content based on input
└─ Trigger: 3 days later (segmented)
        ↓
[Email 7: Soft Offer]
├─ Subject: "Whenever you're ready, here's 20% off"
├─ Goal: Low-pressure discount
└─ Trigger: 7 days later
        ↓
[Email 8: FAQ Email]
├─ Subject: "Top 10 questions about [product]"
├─ Goal: Address objections
└─ Trigger: 7 days later
        ↓
[Email 9: Limited Time Offer]
├─ Subject: "This expires Friday: [offer]"
├─ Goal: Scarcity + urgency
└─ Trigger: 5 days later
        ↓
[Email 10: Break-Up Email]
├─ Subject: "Should we close your file?"
├─ Goal: Last chance + list cleaning
└─ Trigger: 7 days later
        ↓
[Move to Re-engagement or Unsubscribe]
```

### Branching by Engagement

```
[Email 5: Poll Sent]
     ↓
[Did They Click?]
  ↙        ↘
YES        NO
 ↓          ↓
[Email 6:  [Email 6:
Personalized]  General Content]
     ↓            ↓
   [Merge to Email 7]
```

### Real-World Example: Course Creator Nurture

**Results**: 32% open rate, 4.1% conversion to course purchase

**Strategy**: Alternating value pitch + pure value emails

**Pattern**: Value email → Value email → Soft pitch → Value email → Stronger pitch

---

## Template 3: Launch Sequence Map (5-7 Emails)

**Purpose**: Product launch with urgency
**Average Duration**: 5-7 days
**Industry Benchmarks**: 45-60% open rate, 10-15% click rate

### Visual Journey Map

```
[Pre-Launch Waitlist]
        ↓
[Email 1: Cart Open - Day 1]
├─ Subject: "🚀 IT'S LIVE: [Product] is finally here"
├─ Goal: Announcement + early bird pricing
└─ Trigger: Cart opens
        ↓
[Email 2: Value Stack - Day 2]
├─ Subject: "Everything you get (it's a lot)"
├─ Goal: Breakdown of deliverables
└─ Trigger: 24h later
        ↓
[Email 3: Social Proof - Day 3]
├─ Subject: "[Number] people already grabbed it"
├─ Goal: FOMO + validation
└─ Trigger: 24h later
        ↓
[Email 4: Bonus Announcement - Day 4]
├─ Subject: "NEW: Fast action bonus added"
├─ Goal: Extra value + urgency
└─ Trigger: 24h later
        ↓
[Email 5: FAQ Email - Day 5]
├─ Subject: "Questions? We've got answers"
├─ Goal: Objection handling
└─ Trigger: 24h later
        ↓
[Email 6: Last Call - Day 6]
├─ Subject: "⏰ 24 hours left"
├─ Goal: Final urgency push
└─ Trigger: 24h later
        ↓
[Email 7: Cart Closing - Day 7]
├─ Subject: "Tonight at midnight..."
├─ Goal: Last chance
└─ Trigger: 24h later
        ↓
[Move to Post-Purchase or General List]
```

### Launch Sequence Branching

```
[Email 1: Cart Open]
        ↓
[Did They Purchase?]
  ↙         ↘
YES          NO
 ↓            ↓
[Post-Purchase]  [Email 2: Value Stack]
                      ↓
                 [Did They Click?]
                   ↙      ↘
                 YES        NO
                 ↓           ↓
            [Email 3:    [Email 3:
            Social Proof]  Different Angle]
```

### Real-World Example: Digital Product Launch

**Product**: $297 marketing course
**Results**: 52% open rate, 12.3% conversion, $47,000 revenue

**Email 1 Performance**:
- Open rate: 58%
- Click rate: 14%
- Conversion: 4.2%

**Key Success Factors**:
- Built 30-day waitlist pre-launch
- Used countdown timer in emails
- Added bonuses every 24 hours
- Posted live purchase counter

---

## Template 4: Re-engagement Sequence Map (3-5 Emails)

**Purpose**: Win back inactive subscribers
**Average Duration**: 14-21 days
**Industry Benchmarks**: 15-30% open rate, 2-5% click rate

### Visual Journey Map

```
[Inactive for 30+ Days]
        ↓
[Email 1: We Miss You]
├─ Subject: "Still there? [First Name]?"
├─ Goal: Emotional connection + check-in
└─ Trigger: 30 days inactive
        ↓
[Opened Email 1?]
  ↙         ↘
YES          NO
 ↓            ↓
[Email 2:  [Email 2:
What's New?]  Update Preferences]
  ↓            ↓
[Merge to   [Did They Engage?]
Main List]     ↙      ↘
              YES        NO
              ↓           ↓
          [Keep on     [Email 3:
          Main List]   Last Chance]
                            ↓
                       [Still No Engagement?]
                           ↙      ↘
                         YES        NO
                         ↓           ↓
                     [Remove     [Sunset to
                     from List]  Cleanup Segment]
```

### Re-engagement Decision Tree

```
[30 Days Inactive]
        ↓
[Send Email 1: "We Miss You"]
        ↓
[No Open for 7 Days?]
        ↓ YES
[Send Email 2: "Is this still relevant?"]
        ↓
[No Click for 7 Days?]
        ↓ YES
[Send Email 3: "Last chance to stay"]
        ↓
[No Action for 7 Days?]
        ↓ YES
[Unsubscribe - Remove from list]
```

### Real-World Example: E-commerce Re-engagement

**List Size**: 50,000 subscribers
**Inactive Subs**: 18,000 (36%)

**Email 1**: "Hey [Name], it's been a while"
- Subject: Personalized + friendly
- Content: "What have you been up to? Here's what you missed"
- Offer: 15% off code
- **Results**: 28% open rate, 4.2% click rate

**Email 2**: "Should we stay in touch?"
- Subject: Direct question
- Content: Preference center link
- **Results**: 22% open rate, 8.1% updated preferences

**Email 3**: "This is your last email from us"
- Subject: Urgent but not aggressive
- Content: "We're cleaning our list, confirm you want to stay"
- **Results**: 19% open rate, 3.2% confirmed

**Final Outcome**:
- Re-engaged: 3,200 subscribers (17.8% of inactive)
- Removed: 14,800 (cleaned list)
- Improved overall open rates by 12%

---

## Template 5: Post-Purchase Sequence Map (3-7 Emails)

**Purpose**: Customer onboarding + retention
**Average Duration**: 30-60 days
**Industry Benchmarks**: 50-70% open rate, 20-30% click rate

### Visual Journey Map

```
[Purchase Made]
        ↓
[Email 1: Immediate Confirmation]
├─ Subject: "Thanks for your order! #12345"
├─ Goal: Confirmation + what to expect
└─ Trigger: Immediately
        ↓
[Email 2: Delivery/Access]
├─ Subject: "Your order has shipped" OR "Access your course"
├─ Goal: Delivery confirmation + tracking
└─ Trigger: Shipment/Access granted
        ↓
[Email 3: Onboarding - Day 3]
├─ Subject: "Getting started with [product]"
├─ Goal: Setup guide + quick start
└─ Trigger: 3 days post-purchase
        ↓
[Email 4: Check-In - Day 7]
├─ Subject: "How's it going so far?"
├─ Goal: Support + prevent issues
└─ Trigger: 7 days post-purchase
        ↓
[Email 5: Tips & Tricks - Day 14]
├─ Subject: "5 ways to get more from [product]"
├─ Goal: Advanced usage + value reinforcement
└─ Trigger: 14 days post-purchase
        ↓
[Email 6: Review Request - Day 21]
├─ Subject: "Quick favor: Can you help us out?"
├─ Goal: Social proof + testimonials
└─ Trigger: 21 days post-purchase
        ↓
[Email 7: Upsell/Cross-Sell - Day 30]
├─ Subject: "Ready for the next level?"
├─ Goal: Additional purchase
└─ Trigger: 30 days post-purchase
        ↓
[Move to Customer Nurture]
```

### Post-Purchase Branching

```
[Email 3: Onboarding Sent]
        ↓
[Did They Complete Setup?]
  ↙           ↘
YES            NO
 ↓              ↓
[Email 5:    [Email 4:
Tips & Tricks]  Extra Support]
    ↓              ↓
[Email 6:   [Email 6:
Review]      Review - Delayed]
     ↓              ↓
   [Email 7: Upsell]
```

### Real-World Example: SaaS Post-Purchase

**Product**: Project management software
**Subscription**: $49/month

**Email 1 (Immediate)**: Order confirmation
**Email 2 (Immediate)**: Account setup link
**Email 3 (Day 3)**: "Create your first project" tutorial
**Email 4 (Day 7)**: "Need help? Reply to this email"
**Email 5 (Day 14)**: "5 advanced features you'll love"
**Email 6 (Day 21)**: "Review request - chance to win free year"
**Email 7 (Day 30)**: "Upgrade to Pro team plan - 20% off first year"

**Results**:
- Activation rate: 78% (vs 52% before sequence)
- Refund requests: Down 42%
- Upsell conversion: 12.3%
- NPS score: 72

---

## How to Create Your Own Workflow Map

### Step 1: Define Your Objective
- What do you want subscribers to do?
- How long should the sequence last?
- What's the success metric?

### Step 2: Map Touchpoints
- Start → [Email 1] → [Email 2] → ... → [Goal]
- Add decision points (opened/clicked/purchased)
- Note time delays between emails

### Step 3: Define Triggers
- Time-based: "48 hours after previous email"
- Action-based: "Clicked link but didn't purchase"
- Event-based: "Abandoned cart", "Downloaded lead magnet"

### Step 4: Add Branching Logic
- What if they don't open?
- What if they click but don't buy?
- What if they purchase early?

### Step 5: Test & Optimize
- Start with simple linear flow
- Add branches as you collect data
- Always A/B test key emails

### Mapping Tools I Recommend
- **Draw.io / Lucidchart**: Free, easy workflow diagrams
- **Miro**: Collaborative whiteboarding
- **MindMeister**: Mind mapping for brainstorming
- **ESP Workflow Builders**: Mailchimp, ConvertKit, ActiveCampaign

---

## Quick Reference: Workflow Maps

| Workflow Type | Emails | Duration | Open Rate | Click Rate | Conversion |
|--------------|--------|----------|-----------|------------|------------|
| Welcome      | 5-7    | 7-14 days| 35-50%    | 5-10%      | 5-15%      |
| Nurture      | 7-10   | 30-45 days| 25-40%  | 3-6%       | 2-8%       |
| Launch       | 5-7    | 5-7 days | 45-60%    | 10-15%     | 8-20%      |
| Re-engagement| 3-5    | 14-21 days| 15-30%   | 2-5%       | 1-3%       |
| Post-Purchase| 3-7    | 30-60 days| 50-70%   | 20-30%     | 10-25%     |

---

## Next Steps
1. Choose a workflow type based on your goal
2. Copy the visual map structure
3. Customize for your product/audience
4. Set up triggers in your ESP
5. Launch with a small test segment
6. Monitor metrics and optimize

---

**Remember**: These maps are starting points. The best workflow for your business will be unique. Start with the templates, then iterate based on your data.

"Automate the boring, keep the human"
