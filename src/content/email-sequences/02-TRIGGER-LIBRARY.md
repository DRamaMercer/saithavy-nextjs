# Email Automation Trigger Library

## Complete Guide to Automation Triggers

Triggers are the events that start your automated email sequences. I've built automations that generate 40%+ of revenue just from strategic trigger setup. Here's every trigger you'll ever need, organized by category.

---

## How to Use This Library

**Trigger Syntax**: `[Event] + [Condition] → [Action]`

**Example**: `User downloads lead magnet + Email not sent in 7 days → Send welcome sequence`

---

## Category 1: Signup & Subscription Triggers

### 1.1 Email List Signup
**Trigger**: New subscriber added to list
**Best For**: Welcome sequences
**Delay**: 0 minutes (immediate)
**ESP Support**: All

**Setup Steps**:
1. Create signup form in ESP
2. Set "Welcome sequence" as automation
3. Set trigger: "When someone subscribes to [List Name]"
4. Add condition: "If not already in sequence"

**Pro Tip**: Add a "source" tag based on signup (landing page, social, in-person) to send more targeted welcome emails.

**Real Results**: Welcome sequence with source-based segmentation increased conversion by 23%.

---

### 1.2 Lead Magnet Download
**Trigger**: User downloads specific resource
**Best For**: nurture sequences related to download topic
**Delay**: 0 minutes
**ESP Support**: All (requires download tracking)

**Setup Steps**:
1. Create landing page for lead magnet
2. Add email field before download
3. Tag subscriber with resource name
4. Trigger automation: "Tag added = [Resource Name]"
5. Send sequence related to that topic

**Advanced**: If user downloads multiple lead magnets, send sequence based on first download, then suggest related resources.

**Case Study**: Marketing automation company set up topic-based nurture sequences based on lead magnet downloaded. Result: 34% higher conversion than generic welcome sequence.

---

### 1.3 Webinar Registration
**Trigger**: User registers for webinar
**Best For**: Pre-event nurture, post-event follow-up
**Delay**: 0 minutes (confirmation), then time-based
**ESP Support**: All webinar platforms integrate

**Setup Steps**:
1. Connect webinar platform to ESP (Zapier works if no native integration)
2. Trigger: "Webinar registration = [Webinar Name]"
3. Send immediately: Confirmation email
4. Send 24h before: Reminder email
5. Send 1h before: Last-minute reminder
6. Send 24h after: Replay + offer email

**Pro Tip**: Send different follow-up sequence to attendees vs. no-shows.

**Real Example**:
- **Attended**: Send "Thanks for attending" + special offer for 24 hours
- **No-show**: Send "Here's the replay" + same offer (converts at 60% of attendee rate)

---

### 1.4 Quiz/Assessment Completion
**Trigger**: User completes quiz or assessment
**Best For**: Personalized recommendations
**Delay**: 0 minutes
**ESP Support**: Typeform, Google Forms, Interact, all integrate

**Setup Steps**:
1. Create quiz with Typeform or similar
2. Connect to ESP via Zapier or native integration
3. Map quiz results to subscriber fields/tags
4. Trigger: "Quiz completed = [Quiz Name]"
5. Segment by quiz result
6. Send personalized recommendations

**Advanced**: Send different product recommendations based on quiz answers.

**Case Study**: Fitness coach used "fitness goal quiz" to segment subscribers. Sent different workout recommendations based on goals (weight loss, muscle gain, endurance). Result: 41% higher click rate than generic emails.

---

### 1.5 Account Creation
**Trigger**: User creates account
**Best For**: Onboarding sequences
**Delay**: 0 minutes
**ESP Support**: Requires custom integration or webhook

**Setup Steps**:
1. Set up webhook on account creation
2. Send webhook data to ESP
3. Trigger: "Webhook received = account_created"
4. Start onboarding sequence

**Pro Tip**: Track account activation (first login, first action) to send targeted tips.

---

## Category 2: Purchase & Revenue Triggers

### 2.1 Purchase Made
**Trigger**: Customer completes purchase
**Best For**: Post-purchase sequence
**Delay**: 0 minutes
**ESP Support**: Most ESPs integrate with e-commerce platforms

**Setup Steps**:
1. Connect shop (Shopify, WooCommerce, etc.) to ESP
2. Trigger: "Purchase made in [Store]"
3. Send immediately: Order confirmation
4. Trigger on fulfillment: Shipping confirmation
5. Trigger after delivery: Review request

**Advanced**:
- Send different sequence based on purchase amount
- Upsell related products 7 days post-purchase
- Send VIP sequence for high-value customers

**Real Results**: Post-purchase sequence with personalized upsells increased LTV by 18%.

---

### 2.2 Abandoned Cart
**Trigger**: Items added to cart but no purchase
**Best For**: Recovery emails
**Delay**: 1-4 hours
**ESP Support**: Most e-commerce platforms + ESPs

**Setup Steps**:
1. Enable cart tracking in your platform
2. Trigger: "Cart abandoned for 1 hour"
3. Send recovery email with product images
4. Follow up 24h later if no purchase
5. Final email 48h later with discount

**Pro Tip**: Include cart expiration to create urgency. "Your cart expires in 24 hours" (even if it doesn't actually expire).

**A/B Test Results**:
- **Email 1 (1h delay)**: 8% recovery rate
- **Email 2 (24h delay)**: 4% recovery rate
- **Email 3 (48h delay + 10% off)**: 6% recovery rate

**Total Recovery**: 18% of abandoned carts recovered

---

### 2.3 Abandoned Checkout
**Trigger**: Started checkout but didn't complete
**Best For**: Friction reduction
**Delay**: 30 minutes
**ESP Support**: E-commerce platforms

**Setup Steps**:
1. Trigger: "Reached checkout page but no purchase in 30 min"
2. Send email: "Having trouble checking out?"
3. Include support contact
4. Link back to cart (preserve items)

**Pro Tip**: If user abandoned at payment step, mention alternative payment methods or payment plan availability.

**Case Study**: Added "Having trouble?" email for checkout abandoners. 22% replied with issues (mostly payment problems). Support responses recovered 12% of these sales.

---

### 2.4 First Purchase
**Trigger**: Customer's first purchase
**Best For**: New customer onboarding
**Delay**: 0 minutes (triggered by purchase)
**ESP Support**: All with purchase tracking

**Setup Steps**:
1. Trigger: "First purchase made"
2. Add tag: "First-time customer"
3. Send new customer welcome sequence
4. Include: Thank you, setup guide, support contact

**Advanced**:
- Send different sequence based on first product purchased
- Cross-sell complementary products after 14 days
- Enroll in VIP program after 3 purchases

---

### 2.5 High-Value Purchase
**Trigger**: Purchase above threshold
**Best For**: VIP treatment
**Delay**: 0 minutes
**ESP Support**: All with purchase tracking + conditional logic

**Setup Steps**:
1. Set threshold (e.g., $500+)
2. Trigger: "Purchase total > $500"
3. Add tag: "VIP Customer"
4. Send personal thank you from founder
5. Include: Priority support, special perks

**Case Study**: B2B software company sent personal video from founder for $5k+ purchases. Result: 94% retention rate (vs 68% for non-VIPs), 31% upsell rate.

---

### 2.6 Repeat Purchase
**Trigger**: Customer buys again
**Best For**: Loyalty programs, LTV increase
**Delay**: 0 minutes
**ESP Support**: All with purchase tracking

**Setup Steps**:
1. Trigger: "Second purchase made"
2. Add tag: "Repeat Customer"
3. Send: "Thanks for coming back" + loyalty program invite
4. Trigger: "5th purchase" → Send "You're now a VIP"
5. Trigger: "10th purchase" → Send surprise gift

**Pro Tip**: Track purchase frequency to predict when customers are likely to buy again. Send reminder email at optimal time.

---

### 2.7 Subscription Renewal
**Trigger**: Subscription renewing soon
**Best For**: Retention, reduce churn
**Delay**: 7-14 days before renewal
**ESP Support**: Recurring payment platforms

**Setup Steps**:
1. Trigger: "Subscription renewal in 14 days"
2. Send email: "Your subscription renews soon"
3. Include: Benefits, how to cancel (builds trust)
4. Trigger: "Subscription renewed" → Send thank you
5. Trigger: "Subscription cancelled" → Send win-back

**Pro Tip**: Send "We noticed you cancelled" email with alternative (downgrade plan, pause subscription).

**Real Results**: Adding "how to cancel" link increased renewals by 7% (builds trust, reduces friction).

---

## Category 3: Engagement Triggers

### 3.1 Email Open
**Trigger**: Subscriber opens email
**Best For**: Lead scoring, dynamic content
**Delay**: N/A (instant)
**ESP Support**: Advanced ESPs (ActiveCampaign, HubSpot, etc.)

**Setup Steps**:
1. Trigger: "Email opened = [Email Name]"
2. Action: Add +5 points to lead score
3. OR trigger: "Opens 3+ emails in 30 days" → Move to "engaged" segment

**Advanced**:
- Open welcome email → Send next email sooner
- Open sales email → Follow up in 2 days
- No open in 30 days → Move to re-engagement sequence

---

### 3.2 Email Click
**Trigger**: Subscriber clicks link
**Best For**: Interest-based segmentation
**Delay**: 0 minutes
**ESP Support**: All ESPs

**Setup Steps**:
1. Trigger: "Clicked link = [URL or link name]"
2. Add tag based on click: "Interested in [Topic]"
3. Add to segment: "[Topic] Interest"
4. Send follow-up with related content

**Pro Tip**: Use link clicks to build detailed interest profiles. Clicked "pricing" link? Send discount. Clicked "case studies" link? Send more social proof.

**Case Study**: SaaS company tracked link clicks to identify buying intent. Clicked "pricing" or "demo" = Sales outreach. Result: 34% higher close rate.

---

### 3.3 No Engagement (Inactivity)
**Trigger**: No opens/clicks for X days
**Best For**: Re-engagement, list cleaning
**Delay**: 30, 60, 90 days
**ESP Support**: All ESPs

**Setup Steps**:
1. Trigger: "No email open in 30 days"
2. Send re-engagement email #1
3. Trigger: "No open in 60 days total"
4. Send re-engagement email #2
5. Trigger: "No open in 90 days total"
6. Send final "last chance" email
7. Trigger: "No action on final email"
8. Unsubscribe or move to "suppressed" list

**Pro Tip**: Don't delete unsubscribers—move to separate list so you don't pay for them but keep data for analytics.

---

### 3.4 Website Visit
**Trigger**: User visits specific page
**Best For**: Intent-based marketing
**Delay**: 1-24 hours
**ESP Support**: ESPs with website tracking (requires tracking code)

**Setup Steps**:
1. Install ESP tracking code on website
2. Trigger: "Visited page = /pricing"
3. Send: "Questions about pricing?" email 2 hours later
4. OR trigger: "Visited 5+ pages in 7 days"
5. Send: "Ready to talk?" sales outreach

**Advanced**: Track page visits to build lead scoring. Pricing page visit = +20 points. Case studies page = +10 points.

**Case Study**: Marketing agency tracked website visits. Sent personalized email when prospect visited pricing page. Result: 28% response rate, 12% converted to clients.

---

### 3.5 Content Consumption
**Trigger**: User reads specific content
**Best For**: Nurture based on interests
**Delay**: 0 minutes
**ESP Support**: Requires CMS integration

**Setup Steps**:
1. Connect blog/CMS to ESP
2. Trigger: "Read article = [Topic]"
3. Add tag: "Interest: [Topic]"
4. Send related content 7 days later

**Pro Tip**: Send "You might also like" email after user reads 3+ articles on same topic.

---

### 3.6 Video View
**Trigger**: User watches video
**Best For**: Engagement-based follow-up
**Delay**: 0 minutes
**ESP Support**: Video platforms (Wistia, Vidyard) + ESP

**Setup Steps**:
1. Use video platform with email capture
2. Trigger: "Watched 50%+ of video"
3. Send: "Want to go deeper?" email with related content
4. OR trigger: "Watched 100% of video"
5. Send: "You're all caught up" + next steps

**Pro Tip**: Send different emails based on how much of video they watched. 25% = beginner content. 75% = advanced content.

---

## Category 4: Behavioral Triggers

### 4.1 Product View
**Trigger**: User views specific product
**Best For**: Product recommendations
**Delay**: 2-4 hours
**ESP Support**: E-commerce platforms + ESP

**Setup Steps**:
1. Enable product view tracking
2. Trigger: "Viewed product = [Product Name]"
3. Send: "Still thinking about [Product]?" email
4. Include: Product details, reviews, urgency

**Pro Tip**: Send "Similar products you might like" if viewed product is out of stock.

**A/B Test**: Viewed product email sent after 2 hours vs 24 hours. Result: 2 hours = 8% conversion, 24 hours = 3% conversion. Send sooner.

---

### 4.2 Search Query
**Trigger**: User searches specific terms
**Best For**: Personalized recommendations
**Delay**: 0 minutes
**ESP Support**: E-commerce platforms

**Setup Steps**:
1. Track on-site search queries
2. Trigger: "Searched for = [Keyword]"
3. Send: "Top results for [Keyword]" email
4. Include: Products matching search, related items

**Case Study**: E-commerce store sent "You searched for [X]" emails with product recommendations. Result: 12% conversion rate, 34% higher than browse abandonment emails.

---

### 4.3 Wishlist Addition
**Trigger**: User adds item to wishlist
**Best For**: Back-in-stock, price drop alerts
**Delay**: 0 minutes (alert), or periodic
**ESP Support**: E-commerce platforms

**Setup Steps**:
1. Trigger: "Added to wishlist = [Product]"
2. Send: "Saved for later" confirmation
3. Trigger: "Price drop on wished item"
4. Send: "Price dropped on [Product]" alert
5. Trigger: "Back in stock = [Product]"
6. Send: "Your wished item is back" email

**Real Results**: Wishlist price drop emails had 22% conversion rate (vs 4% for promotional emails).

---

### 4.4 Form Submission
**Trigger**: User submits form
**Best For**: Lead nurturing, sales handoff
**Delay**: 0 minutes
**ESP Support**: All ESPs + form builders

**Setup Steps**:
1. Connect form to ESP (Zapier if needed)
2. Trigger: "Form submitted = [Form Name]"
3. Send: "Thanks for reaching out" email
4. Notify sales team (if qualified lead)
5. Add to nurture sequence

**Advanced**: Route to different sequences based on form answers.

**Case Study**: B2B company used "qualification form" to route leads. High budget = Sales outreach. Low budget = Self-serve nurture. Result: 42% increase in qualified meetings.

---

### 4.5 Support Ticket Created
**Trigger**: User submits support request
**Best For**: Customer retention, satisfaction
**Delay**: 0 minutes
**ESP Support**: Help desk software + ESP integration

**Setup Steps**:
1. Connect help desk to ESP
2. Trigger: "Ticket created = [User]"
3. Send: "We received your request" email
4. Trigger: "Ticket resolved"
5. Send: "Did we solve your problem?" feedback email
6. Trigger: "Negative feedback"
7. Send: "Sorry we missed the mark" from manager

**Pro Tip**: Send "How's it going?" email 7 days after positive support interaction to reinforce good experience.

---

### 4.6 Feature Usage
**Trigger**: User uses specific feature
**Best For**: Product adoption, upsell
**Delay**: 1-7 days
**ESP Support**: Requires product analytics + ESP

**Setup Steps**:
1. Track feature usage in product
2. Send data to ESP via webhook/API
3. Trigger: "Used feature = [Feature Name]"
4. Send: "Pro tip: Get more from [Feature]" email
5. OR trigger: "Used 5+ features"
6. Send: "You're a power user" + advanced tips

**Case Study**: SaaS company sent targeted tips when users used advanced features. Result: 34% increase in feature adoption, 18% reduction in churn.

---

## Category 5: Time-Based Triggers

### 5.1 Date/Time Triggers
**Trigger**: Specific date/time
**Best For**: Limited-time offers, events
**Delay**: N/A (scheduled)
**ESP Support**: All ESPs

**Setup Steps**:
1. Create automation with date trigger
2. Set: "Send on [Date] at [Time]"
3. Add condition: "If subscriber is in [Segment]"

**Use Cases**:
- Holiday promotions
- Event reminders
- Course content drips
- Membership renewals

---

### 5.2 Anniversary Triggers
**Trigger**: Time since signup/purchase
**Best For**: Retention, loyalty
**Delay**: Yearly
**ESP Support**: All ESPs

**Setup Steps**:
1. Trigger: "1 year since first purchase"
2. Send: "Happy anniversary!" email with special offer
3. OR trigger: "30 days since signup"
4. Send: "How's your first month going?" email

**Case Study**: Subscription box company sent "1 year anniversary" email with 20% off. Result: 67% open rate, 34% conversion.

---

### 5.3 Drip Sequence Triggers
**Trigger**: Previous email sent
**Best For**: Content sequences
**Delay**: Defined interval
**ESP Support**: All ESPs

**Setup Steps**:
1. Create sequence with multiple emails
2. Set: "Send Email 2, 7 days after Email 1"
3. Set: "Send Email 3, 7 days after Email 2"
4. Continue until sequence complete

**Pro Tip**: Add conditions like "Wait until previous email is opened" to prevent spamming unengaged subscribers.

---

### 5.4 Time in Stage
**Trigger**: Time in lifecycle stage
**Best For**: Lifecycle marketing
**Delay**: Based on stage rules
**ESP Support**: Advanced ESPs with lifecycle stages

**Setup Steps**:
1. Define lifecycle stages (lead, MQL, SQL, customer)
2. Trigger: "In 'lead' stage for 30 days"
3. Send: "Ready for the next step?" email
4. Trigger: "In 'MQL' stage for 14 days"
5. Send: "Let's talk" sales handoff

**Pro Tip**: Automatically move stages based on behavior. Clicked "pricing" = Move to MQL. Requested demo = Move to SQL.

---

## Category 6: External Event Triggers

### 6.1 Weather Trigger
**Trigger**: Local weather conditions
**Best For**: Location-based offers
**Delay**: Real-time
**ESP Support**: Specialized tools (Adestra, etc.)

**Use Cases**:
- Retail: "It's going to rain - here's a coat"
- Restaurant: "Cold day? Warm up with our soup"
- Travel: "Snow forecast? Book a ski trip"

**Case Study**: Clothing retailer used weather triggers. "Cold week ahead" email with coat recommendations. Result: 28% higher conversion than regular promotional emails.

---

### 6.2 Stock Market Trigger
**Trigger**: Market movement
**Best For**: Finance/investment offers
**Delay**: Real-time
**ESP Support**: Custom integration

**Use Cases**:
- "Market down? Here's a safe haven"
- "Tech stocks up? Check out these picks"

---

### 6.3 Sports Event Trigger
**Trigger**: Game outcome
**Best For**: Sports merchandise, betting
**Delay**: Immediately after game
**ESP Support**: Custom integration

**Use Cases**:
- "Your team won! Get the championship gear"
- "Tough loss - here's something to cheer you up"

**Case Study**: Sports store sent game-result emails within 5 minutes of game end. "They won! Get the jersey" email. Result: 42% open rate, 18% conversion.

---

### 6.4 Social Media Trigger
**Trigger**: Social activity
**Best For**: Social selling
**Delay**: 1-24 hours
**ESP Support**: Social media tools + ESP

**Setup Steps**:
1. Monitor brand/competitor mentions
2. Trigger: "Mentioned [Brand] on Twitter"
3. Send: "Thanks for the shoutout!" email
4. OR trigger: "Competitor mentioned negatively"
5. Send: "Not happy with [Competitor]? Try us"

---

## Category 7: Advanced Conditional Triggers

### 7.1 Lead Score Threshold
**Trigger**: Lead score reaches threshold
**Best For**: Sales handoff
**Delay**: 0 minutes
**ESP Support**: ESPs with lead scoring

**Setup Steps**:
1. Set up lead scoring rules
2. Trigger: "Lead score ≥ 50"
3. Send: "You're a VIP" email
4. Notify sales team
5. Move to "Hot Lead" segment

**Scoring Example**:
- Email open: +1
- Email click: +3
- Website visit: +5
- Pricing page: +10
- Demo request: +20

**Threshold**: 50+ = Sales outreach

---

### 7.2 List Membership Change
**Trigger**: Added/removed from list
**Best For**: Lifecycle automation
**Delay**: 0 minutes
**ESP Support**: All ESPs

**Setup Steps**:
1. Trigger: "Added to 'Customer' list"
2. Remove from 'Lead' list
3. Start customer onboarding sequence
4. Trigger: "Removed from 'Customer' list"
5. Send win-back sequence

---

### 7.3 Field Value Change
**Trigger**: Subscriber field updates
**Best For**: Personalization
**Delay**: 0 minutes
**ESP Support**: Advanced ESPs

**Setup Steps**:
1. Trigger: "Job title changed to 'Manager'"
2. Send: "Resources for managers" email
3. OR trigger: "Company size changed to '100+'"
4. Send: "Enterprise plan" email

**Pro Tip**: Use field changes to update lead score. Job title = "Director" → +10 points.

---

### 7.4 Tag Combination
**Trigger**: Multiple tags present
**Best For**: Advanced segmentation
**Delay**: 0 minutes
**ESP Support**: ESPs with tag-based logic

**Setup Steps**:
1. Trigger: "Has tags 'Downloaded ebook' AND 'Attended webinar'"
2. Send: "Ready to go deeper?" email with course offer
3. OR trigger: "Has tags 'Clicked pricing' AND 'Visited demo page'"
4. Send: "Let's book your demo" sales outreach

**Case Study**: B2B company used tag combinations. "Has 'Competitor' tag AND 'Visited pricing'" = Send competitor comparison. Result: 28% conversion vs 12% for generic sales email.

---

## Quick Reference: Trigger Performance

| Trigger Type | Avg Open Rate | Avg Click Rate | Best Use |
|-------------|---------------|----------------|----------|
| Welcome signup | 45-55% | 8-12% | List building |
| Purchase made | 60-75% | 25-35% | Post-purchase |
| Abandoned cart | 35-45% | 8-15% | Revenue recovery |
| Webinar reg | 55-70% | 20-30% | Event attendance |
| Re-engagement | 15-30% | 3-8% | List hygiene |
| Website visit | 30-40% | 10-15% | Sales acceleration |

---

## Setup Checklist

For Each Trigger:
- [ ] Define trigger event clearly
- [ ] Set appropriate delay
- [ ] Create email content
- [ ] Add conditional logic (if/else)
- [ ] Test with sample subscriber
- [ ] Launch to small segment
- [ ] Monitor metrics for 7 days
- [ ] Optimize based on data
- [ ] Roll out to full list

---

## Pro Tips

**1. Stack Triggers**: Combine multiple triggers. "Clicked pricing link" + "Visited 3+ times" = High-intent lead.

**2. Add Delays**: Don't send immediately for everything. 2-4 hour delay feels more human for non-urgent triggers.

**3. Use Suppression**: Don't trigger if recent action. "If purchased in 7 days, don't send promo email."

**4. Test Everything**: Triggers can break. Test new automations with real data before full launch.

**5. Document Logic**: Create trigger map so team understands automation flow.

---

## Common Mistakes

**1. Too Many Triggers**: Don't send email for every action. Group related behaviors.

**2. No Frequency Caps**: Set max 1 email per day per subscriber to avoid spam complaints.

**3. Ignoring Context**: Don't send "Welcome to the family" if they've been a customer for 2 years.

**4. No Exit Conditions**: Always have a way out. "If purchased, don't send abandoned cart."

**5. Forgetting Mobile**: 50%+ opens on mobile. Ensure trigger emails work on small screens.

---

**Remember**: The best trigger is the one that's relevant to where the customer is in their journey. Start with basic triggers, then layer in advanced logic as you collect data.

"Automate the boring, keep the human"
