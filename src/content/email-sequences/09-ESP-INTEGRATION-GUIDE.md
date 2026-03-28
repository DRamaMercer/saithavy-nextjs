# ESP Integration Guide

## Connect with Every Major Email Platform

This guide shows you exactly how to integrate email automation with your existing tools. I've set up 100+ integrations across every major platform. Here's the complete playbook.

---

## Integration Overview

### What You Can Connect

**E-commerce Platforms**:
- Shopify
- WooCommerce
- BigCommerce
- Magento
- Squarespace Commerce
- Stripe
- Gumroad

**Website/CMS**:
- WordPress
- Squarespace
- Webflow
- Wix
- Shopify (as CMS)
- Custom sites

**Form Builders**:
- Typeform
- Gravity Forms
- Google Forms
- JotForm
- Formidable
- Custom HTML forms

**Webinar Platforms**:
- Zoom
- WebinarJam
- Demio
- GoToWebinar
- CrowdCast

**Course Platforms**:
- Teachable
- Thinkific
- Kajabi
- Podia
- LearnWorlds

**Payment Processors**:
- Stripe
- PayPal
- Square
- Authorize.net

**CRM/Sales**:
- Salesforce
- HubSpot
- Pipedrive
- Zoho CRM

**Automation Tools**:
- Zapier
- Make (formerly Integromat)
- Webhooks
- Custom API

---

## Quick Integration Decision Tree

```
What do you need to connect?

→ E-commerce store?
   → Shopify: Native integration (best)
   → WooCommerce: Use plugin or Zapier
   → Other: Use Zapier or webhook

→ Website signup forms?
   → WordPress: Use ESP plugin
   → Squarespace: Native integration
   → Webflow: Use embed form or Zapier
   → Custom: Use ESP embed form or webhook

→ Lead capture (Typeform, etc.)?
   → Native integration if available
   → Use Zapier if no native option

→ Course platform?
   → Native integration (Teachable, Thinkific, etc.)
   → Use Zapier for advanced

→ Everything else?
   → Use Zapier (connects anything)
```

---

## E-commerce Integrations

### Shopify + Klaviyo (Recommended)

**Why**: Best e-commerce email integration, powerful features

**Setup Steps**:
```
1. In Klaviyo: Go to Integrations → Shopify
2. Click "Connect Shopify"
3. Enter Shopify store URL
4. Log in to Shopify
5. Install Klaviyo app from Shopify App Store
6. Grant permissions (orders, customers, products)
7. Sync data (initial sync takes 5-30 minutes)
```

**What Syncs**:
- Customers (email, name, orders)
- Orders (products, revenue, dates)
- Products (names, prices, images)
- Cart activity (abandoned carts)

**Automations to Set Up**:
```
1. Welcome sequence (new customers)
2. Abandoned cart (browse and checkout)
3. Post-purchase (order confirm, shipping, review)
4. Win-back (inactive customers)
5. Product recommendations based on purchases
```

**Pro Tips**:
- Enable "Track cookie activity" for browse abandonment
- Set up "Placed Order" metric for segmentation
- Use "Started Checkout" trigger for abandoned cart
- Create segments for VIPs (3+ purchases, $500+ lifetime)

---

### Shopify + Mailchimp

**Setup Steps**:
```
1. In Mailchimp: Go to Integrations → Shopify
2. Click "Connect Shopify"
3. Enter Shopify store URL
4. Install Mailchimp app from Shopify
5. Grant permissions
6. Map data fields (email, first name, etc.)
7. Enable sync (orders, customers)
```

**Limitations**:
- Less advanced than Klaviyo
- Fewer e-commerce features
- Basic abandoned cart only

---

### WooCommerce + Mailchimp

**Setup Steps**:
```
1. Install Mailchimp for WooCommerce plugin
2. Activate plugin in WordPress
3. Connect Mailchimp account (API key)
4. Configure sync settings:
   - Sync customers who opt-in during checkout
   - Sync order data
   - Sync products
5. Test with test order
```

**Plugin Settings**:
```
- Enable newsletter signup at checkout
- Add interest groups (if applicable)
- Sync orders: Yes
- Sync products: Yes (for product recommendations)
```

---

### WooCommerce + ActiveCampaign

**Setup Steps**:
```
1. Install ActiveCampaign for WooCommerce plugin
2. Connect ActiveCampaign account (API URL and Key)
3. Configure sync:
   - Contact sync: Enable
   - Order sync: Enable
   - E-commerce customer tracking: Enable
4. Map fields (email, name, etc.)
5. Test with test order
```

**Advanced Features**:
- Abandoned cart automation
- Browse abandonment (with tracking code)
- Post-purchase sequences
- Product recommendations
- Revenue tracking by contact

---

### Other E-commerce (Use Zapier)

**For**: BigCommerce, Magento, Squarespace Commerce, custom carts

**Setup Steps**:
```
1. Create Zapier account
2. Create new Zap
3. Trigger: "New Order in [Platform]"
4. Action: "Add/Update Subscriber in [ESP]"
5. Map fields:
   - Email → Email
   - Customer Name → First Name, Last Name
   - Order Total → Custom Field (if ESP supports)
   - Products → Tags or Custom Field
6. Test Zap
7. Turn on Zap
```

**Limitations**:
- Zapier costs ($20-$50/month for volume)
- Not real-time (5-15 minute delay)
- More complex setup than native integration

---

## Website/CMS Integrations

### WordPress + Any ESP (Plugin Method)

**Best Plugins by ESP**:
```
Mailchimp: Mailchimp for WordPress
ConvertKit: ConvertKit plugin
ActiveCampaign: ActiveCampaign plugin
Klaviyo: Klaviyo plugin
```

**Setup Steps (Generic)**:
```
1. Install ESP plugin from WordPress plugins
2. Activate plugin
3. Connect ESP account (API key)
4. Configure form settings:
   - Which list to add subscribers to
   - Double opt-in (recommended)
   - Form fields (name, email, etc.)
5. Add form to page/post/widget
6. Test signup
```

**Form Placement**:
```
- Sidebar widget (always visible)
- Below blog posts (high engagement)
- About/Contact page (interested visitors)
- Popup (exit intent or time-based)
- Landing page (dedicated signup)
```

---

### WordPress + Custom Forms (Webhook Method)

**For**: Custom forms, Gravity Forms, CF7, etc.

**Setup Steps**:
```
1. In ESP: Get webhook URL or setup instructions
   (Usually: Settings → Integrations → Webhooks)

2. In WordPress form:
   - Add webhook URL to form settings
   - Map form fields to ESP fields
   - Enable webhook on form submit

3. Test form submission
4. Verify subscriber appears in ESP
```

**Webhook Payload Format**:
```json
{
  "email": "subscriber@example.com",
  "first_name": "John",
  "last_name": "Smith",
  "tags": ["wordpress", "blog-subscriber"]
}
```

---

### Squarespace + Mailchimp

**Setup Steps**:
```
1. In Squarespace: Marketing → Mailchimp
2. Click "Connect Mailchimp Account"
3. Log in to Mailchimp
4. Grant permissions
5. Enable newsletter blocks
6. Add form block to page
7. Configure form (name, email fields)
8. Test signup
```

**Limitations**:
- Basic integration only
- No advanced segmentation
- Limited form customization

---

### Webflow + Any ESP

**Option 1: Native Embed** (Recommended)
```
1. In ESP: Get embed form code
2. In Webflow: Add Embed element
3. Paste ESP form code
4. Style to match Webflow design
5. Publish site
6. Test form
```

**Option 2: Zapier Integration**
```
1. Use Webflow forms
2. Create Zapier Zap
3. Trigger: New Form Submission in Webflow
4. Action: Add Subscriber in ESP
5. Map fields
6. Test and activate
```

---

## Form Builder Integrations

### Typeform + ConvertKit (Native)

**Setup Steps**:
```
1. In Typeform: Create form (must collect email)
2. Go to Connect → Integrations
3. Select ConvertKit
4. Log in to ConvertKit
5. Choose form/landing page to add subscribers to
6. Map email field
7. Enable integration
8. Test form submission
```

**Advanced**: Tag subscribers based on form answers

---

### Typeform + Any ESP (Zapier)

**Setup Steps**:
```
1. Create Zap in Zapier
2. Trigger: New Entry in Typeform
3. Action: Add/Update Subscriber in ESP
4. Map fields:
   - Email (from Typeform) → Email (ESP)
   - Name → Name
   - Other answers → Tags or Custom Fields
5. Test Zap
6. Turn on
```

**Pro Tip**: Use Zapier paths to segment based on Typeform answers (e.g., different tags for different quiz results).

---

### Google Forms + Any ESP (Zapier)

**Setup Steps**:
```
1. Create Google Form with email field
2. Create Zapier Zap
3. Trigger: New Response in Google Forms
4. Action: Add Subscriber in ESP
5. Map email field
6. Test Zap
7. Turn on
```

**Limitations**:
- Can't do double opt-in
- Manual data mapping
- Zapier costs for volume

---

## Webinar Platform Integrations

### Zoom + Any ESP (Zapier)

**Setup Steps**:
```
1. Create Zap for registrations:
   Trigger: New Registrant in Zoom
   Action: Add/Update Subscriber in ESP
   Tag: "webinar-registrant"

2. Create Zap for attendees:
   Trigger: New Webinar Attendee in Zoom
   Action: Add Tag to Subscriber
   Tag: "webinar-attended"

3. Create automation in ESP:
   Trigger: Tag added = "webinar-registrant"
   Send: Confirmation email
   Send: Reminder email (24h before)
   Send: Last reminder (1h before)

4. Create post-webinar automation:
   Trigger: Tag added = "webinar-attended"
   Send: Replay link
   Send: Special offer
```

---

### Demio + ActiveCampaign (Native)

**Setup Steps**:
```
1. In Demio: Integrations → ActiveCampaign
2. Connect ActiveCampaign account
3. Enable automations:
   - On registration: Add to list
   - On attendance: Add tag
4. In ActiveCampaign: Create automations
5. Test with test registration
```

---

## Course Platform Integrations

### Teachable + ConvertKit (Native)

**Setup Steps**:
```
1. In Teachable: Settings → Integrations → Email
2. Select ConvertKit
3. Log in to ConvertKit
4. Enable student sync
5. Choose form for each course (if multiple)
6. Enable enrollment notifications
```

**Automations to Set Up**:
```
1. New student welcome sequence
2. Course progress-based emails
3. Completion certificate
4. Upsell other courses
```

---

### Thinkific + Mailchimp (Native)

**Setup Steps**:
```
1. In Thinkific: Settings → Email → Integrations
2. Connect Mailchimp
3. Map courses to Mailchimp lists
4. Enable student sync
5. Enable enrollment notifications
6. Test with test enrollment
```

---

### Kajabi + Any ESP (Kajabi Has Built-in Email)

**Note**: Kajabi has its own email system. Most Kajabi users use built-in email instead of external ESP.

**If you still want external ESP**:
```
1. Use Kajabi webhooks (advanced)
2. Or export subscribers and import to ESP
3. Or use Zapier: New Kajabi Purchase → Add to ESP
```

---

## Payment Processor Integrations

### Stripe + Any ESP (Webhook)

**Setup Steps**:
```
1. In Stripe: Developers → Webhooks → Add endpoint
2. Endpoint URL: Provided by ESP (check docs)
3. Events to send:
   - checkout.session.completed
   - customer.subscription.created
   - invoice.paid
4. In ESP: Configure webhook handling
5. Map Stripe data to ESP fields
6. Test with test charge
```

**Simpler Alternative**: Use Zapier
```
Trigger: New Charge in Stripe
Action: Add/Update Subscriber in ESP
Tag: "customer" or add to customer list
```

---

## Zapier Master Guide

### When to Use Zapier
- No native integration available
- Connecting 3+ tools (complex workflow)
- Custom logic needed
- Quick integration without coding

### Zapier Pricing
- **Free**: 100 tasks/month (very limited)
- **Starter**: $20/month, 750 tasks
- **Professional**: $50/month, 5,000 tasks
- **Team**: $400/month, 50,000 tasks

**Task Calculation**: Each automation action = 1 task. 100 subscribers = 100 tasks.

### Common Zap Templates

**Template 1: New Customer → ESP**
```
Trigger: New Order in Shopify
Action: Create/Update Subscriber in Mailchimp
Action: Add Tag: "customer"
Action: Add to List: "Customers"
```

**Template 2: Webinar Registrant → ESP**
```
Trigger: New Registrant in Zoom
Action: Create/Update Subscriber in ESP
Action: Add Tag: "webinar-[webinar-name]"
```

**Template 3: Survey Response → ESP**
```
Trigger: New Response in Typeform
Action: Create/Update Subscriber in ESP
Action: Add Tag: "[response-field-1]"
```

**Template 4: Purchase → Thank You Email**
```
Trigger: New Purchase in Stripe
Action: Send Transactional Email in ESP
Template: "Thank You"
```

### Zapier Best Practices

**1. Use Filters**
```
Only run Zap when conditions met:
- If: Order value > $100
- Then: Add to VIP segment
```

**2. Use Paths**
```
Branch logic based on data:
- If: Quiz result = "Type A"
  → Add Tag: "Type A"
- If: Quiz result = "Type B"
  → Add Tag: "Type B"
```

**3. Use Multi-Step Zaps**
```
Chain multiple actions:
1. New customer
2. Add to ESP
3. Send welcome email
4. Add to CRM
5. Slack notification to team
```

**4. Test Everything**
```
- Test with real data (not sample)
- Test edge cases (empty fields, special characters)
- Monitor first 50 Zaps for errors
```

---

## Webhook Integration Guide

### What is a Webhook?
Webhooks are automated messages sent from apps when something happens. They're real-time (unlike Zapier's polling).

### When to Use Webhooks
- Real-time data sync needed
- High volume (Zapier too expensive)
- Custom integration needed
- Developer resources available

### Setup Steps

**Step 1: Get Webhook URL from ESP**
```
In ESP: Settings → Integrations → Webhooks
Create new webhook → Get URL
Example: https://your-esp.com/webhooks/abc123
```

**Step 2: Configure Sending Platform**
```
In sending app (Stripe, custom site, etc.):
- Add webhook URL
- Choose events to send
- Set authentication (if required)
```

**Step 3: Handle Webhook in ESP**
```
In ESP:
- Configure webhook listener
- Map incoming data to subscriber fields
- Set up automation trigger
```

**Step 4: Test Webhook**
```
- Send test event from source platform
- Verify webhook received in ESP
- Check subscriber data mapped correctly
- Test automation triggers
```

### Webhook Payload Example

**From Stripe (Charge Succeeded)**:
```json
{
  "event": "charge.succeeded",
  "data": {
    "email": "customer@example.com",
    "amount": 9900,
    "currency": "usd",
    "customer_id": "cus_12345"
  }
}
```

**ESP Processing**:
```
1. Receive webhook
2. Parse JSON
3. Extract email: customer@example.com
4. Extract amount: $99.00
5. Find or create subscriber
6. Add tag: "customer"
7. Update field: total_purchases += $99
8. Trigger automation: Post-purchase sequence
```

---

## Integration Testing Checklist

### For Every Integration:
- [ ] Connection successful (API key, OAuth, etc.)
- [ ] Test data flows (signup, purchase, etc.)
- [ ] Fields map correctly (email, name, etc.)
- [ ] Automation triggers work
- [ ] Real-time or acceptable delay?
- [ ] Error handling configured
- [ ] Tested with edge cases (empty fields, special chars)
- [ ] Monitored first 50 transactions
- [ ] Documentation created
- [ ] Team trained

---

## Common Integration Issues

### Issue 1: API Rate Limits
**Symptom**: Integration stops working after X transactions

**Fix**:
- Check ESP API limits
- Upgrade ESP plan if needed
- Implement batching (send in batches, not 1-by-1)
- Use webhooks instead of polling (Zapier)

---

### Issue 2: Data Not Syncing
**Symptom**: Transactions happen but no data in ESP

**Fix**:
- Check integration status (is it active?)
- Reauthorize connection
- Check API keys (did they expire?)
- Review error logs
- Test with sample transaction

---

### Issue 3: Duplicate Subscribers
**Symptom**: Same subscriber added multiple times

**Fix**:
- Use "Create or Update" action (not just "Create")
- Enable email deduplication in ESP
- Check integration settings (update existing contacts)

---

### Issue 4: Delayed Data
**Symptom**: Hours between action and data appearing in ESP

**Fix**:
- Zapier: Normal (5-15 min delay)
- Native integrations: Should be real-time (check logs)
- Webhooks: Should be instant (check configuration)

---

## Quick Reference: Integration Priority

**Must-Have Integrations** (Day 1):
1. E-commerce platform (orders, customers)
2. Website signup forms
3. Payment processor (Stripe, etc.)

**Should-Have Integrations** (Week 1):
4. Webinar platform
5. Course platform (if applicable)
6. CRM (if B2B sales)

**Nice-to-Have Integrations** (Month 1):
7. Social media (not critical for email)
8. Analytics (Google Analytics, etc.)
9. Project management (internal)

---

## Pro Tips

**1. Native Over Zapier**: Always use native integration if available. More reliable, faster, cheaper.

**2. Test Real Transactions**: Don't just test with sample data. Make real purchase, verify data flows.

**3. Monitor First 50**: Watch first 50 transactions like a hawk. Most issues show up immediately.

**4. Document Everything**: Screenshot settings, save API keys in password manager, write SOPs.

**5. Plan for Scale**: Will Zapier pricing work when you have 10,000 transactions/month? Plan ahead.

**6. Error Handling**: What happens if webhook fails? Set up retry logic and notifications.

**7. Gradual Rollout**: Test with 10% of traffic, then 50%, then 100%. Catch issues early.

---

**Remember**: Integrations are the backbone of your automation system. Take time to set them up right.

Test everything. Document settings. Monitor closely.

"Automate the boring, keep the human"
