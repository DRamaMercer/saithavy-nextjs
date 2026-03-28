# Email Automation Troubleshooting Guide

## Fix Common Issues Fast

I've debugged 1,000+ email automation issues across 100+ businesses. This guide captures every problem I've seen and how to fix it. Print this out - you'll need it.

---

## Diagnostic Framework

### Before You Troubleshoot: Ask These 3 Questions

**1. Is the automation running?**
- Check automation status (active/paused)
- Check trigger conditions (are they being met?)
- Review automation logs (any errors?)

**2. Is the email sending?**
- Check email status (sent/draft)
- Review send logs (any bounces?)
- Test with sample subscriber

**3. Is the email being delivered?**
- Check deliverability (inbox vs spam)
- Test spam score
- Review sender reputation

---

## Category 1: Delivery Issues

### Problem 1: Emails Going to Spam

**Symptoms**:
- Open rate suddenly drops 50%+
- Subscribers report not seeing emails
- Emails consistently in spam folder

**Root Causes**:
1. Domain not authenticated (80% of cases)
2. Poor sender reputation
3. Spam trigger words
4. Low engagement rates
5. IP address blacklisted

**Diagnosis Steps**:
```
1. Test email: mail-tester.com (aim for 9/10+ score)
2. Check sender score: senderscore.org (aim for 80+)
3. Check blacklists: mxtoolbox.com/blacklists.aspx
4. Review authentication: SPF, DKIM, DMARC
5. Check engagement rates (below 15% = problem)
```

**Fixes (In Order)**:

**Fix 1: Authenticate Domain** (Do this first!)
```
1. Add SPF record to DNS
2. Add DKIM record to DNS
3. Set up DMARC policy
4. Verify in ESP settings
5. Test again in 24-48 hours
```

**Fix 2: Clean Your List**
```
1. Remove all hard bounces
2. Remove inactive subscribers (no opens in 90+ days)
3. Remove spam complainers
4. Re-import clean list
5. Monitor deliverability improvement
```

**Fix 3: Improve Engagement**
```
1. Send re-engagement campaign to inactives
2. Remove those who don't re-engage
3. Segment engaged vs inactive
4. Send more to engaged, less to inactive
5. Add value to every email (don't just sell)
```

**Fix 4: Check Content**
```
Avoid these spam triggers:
- ALL CAPS SUBJECT LINES
- Excessive exclamation marks!!!
- "Free", "Buy now", "Click here" (overuse)
- No physical address
- No unsubscribe link
- Image-only emails
```

**Fix 5: Warm Up IP** (If new domain)
```
Week 1: Send 50 emails/day
Week 2: Send 100 emails/day
Week 3: Send 200 emails/day
Week 4: Send 500 emails/day
Gradually increase over 4-6 weeks
```

**Prevention**:
- Always authenticate domain (Day 1)
- Never buy email lists
- Clean list quarterly
- Monitor engagement metrics
- Send consistently (not bursts)

---

### Problem 2: High Bounce Rate

**Symptoms**:
- 5%+ bounce rate (normal is <2%)
- Many "undeliverable" errors
- Subscribers not receiving emails

**Root Causes**:
1. Invalid email addresses
2. Typos in email addresses
3. Email accounts closed
4. Spam traps
5. Server temporarily down

**Diagnosis**:
```
1. Check bounce logs in ESP
2. Categorize: Soft vs Hard bounces
3. Identify patterns (specific domain?)
4. Check when bounces started
```

**Fixes**:

**Fix 1: Remove Hard Bounces Immediately**
```
1. Export bounce report
2. Remove all hard bounces from list
3. Mark as "Do not mail"
4. Never re-import hard bounces
```

**Fix 2: Retry Soft Bounces**
```
1. Soft bounces: Temporary issues
2. ESP automatically retries 1-3 times
3. If still bouncing after 3 attempts → Remove
4. Common soft bounces: Inbox full, server down
```

**Fix 3: Verify Email List**
```
1. Use NeverBounce, ZeroBounce, or similar
2. Run entire list through verification
3. Remove invalid emails
4. Re-import clean list
```

**Fix 4: Improve Signup Forms**
```
1. Add email confirmation field
2. Use double opt-in (confirm subscription)
3. Validate email format on form
4. Prevent typos (e.g., gmial.com vs gmail.com)
```

**Prevention**:
- Use double opt-in
- Verify email lists regularly
- Remove bounces immediately
- Don't buy email lists
- Monitor bounce rate weekly

---

### Problem 3: Emails Not Sending

**Symptoms**:
- Automation triggered but no email sent
- Subscribers not receiving emails
- ESP shows "sent" but no delivery

**Root Causes**:
1. Automation paused/inactive
2. Trigger conditions not met
3. Email in draft mode (not published)
4. Technical glitch in ESP
5. Integration broken

**Diagnosis**:
```
1. Check automation status (is it active?)
2. Check trigger conditions (are they correct?)
3. Check email status (draft vs published)
4. Review automation logs (any errors?)
5. Test with sample subscriber
```

**Fixes**:

**Fix 1: Activate Automation**
```
1. Go to automation settings
2. Check status (active vs paused)
3. If paused: Click "Activate"
4. Test with sample subscriber
```

**Fix 2: Fix Trigger Conditions**
```
1. Review trigger rules
2. Check if conditions can be met
3. Test trigger (add yourself to list, etc.)
4. Adjust if too restrictive
```

**Fix 3: Publish Email**
```
1. Check email status (draft vs published)
2. If draft: Click "Publish" or "Set Live"
3. Test send to sample subscriber
```

**Fix 4: Check Integration**
```
1. Test integration (e.g., Shopify, webhook)
2. Reauthorize if needed
3. Check API limits
4. Contact ESP support if persistent
```

**Fix 5: Technical Glitch**
```
1. Clear browser cache
2. Try different browser
3. Check ESP status page (outages?)
4. Contact ESP support
5. Recreate automation if corrupted
```

---

## Category 2: Performance Issues

### Problem 4: Low Open Rate

**Symptoms**:
- Open rate below 15%
- Gradual decline over time
- Sudden drop in opens

**Root Causes**:
1. Poor subject lines
2. Sender name not recognized
3. Bad send timing
4. List fatigue (too many emails)
5. Inactive subscribers not removed

**Diagnosis**:
```
1. Compare to historical open rates
2. Check recent subject lines
3. Review send times
4. Analyze list growth vs engagement
5. Check open rate by segment
```

**Fixes**:

**Fix 1: Optimize Subject Lines**
```
Test these variations:
- Curiosity: "Your open rate is dying (fix inside)"
- Benefit: "5 ways to increase opens by 50%"
- Urgency: "24 hours left: Free guide"
- Personal: "Sarah, I have a question for you"

A/B test every subject line
```

**Fix 2: Optimize Send Time**
```
Test different times:
- B2B: Tuesday-Thursday, 9-11am
- B2C: Weekends, 7-9pm
- Test your specific audience
```

**Fix 3: Clean Your List**
```
1. Remove inactive subscribers (no opens 90+ days)
2. Send re-engagement campaign first
3. Remove those who don't re-engage
4. Focus on engaged subscribers only
```

**Fix 4: Optimize Sender Name**
```
Test:
- "Company Name" vs "FirstName from Company Name"
- "FirstName LastName" vs "FirstName"
- Use winner consistently
```

**Fix 5: Reduce Frequency**
```
1. Check unsubscribe rate (if >1%, too frequent)
2. Reduce send frequency by 50%
3. Monitor open rate improvement
4. Find sweet spot
```

**Real Results**: Company reduced frequency from 5x/week to 3x/week. Open rate increased from 18% to 28% (+56%).

---

### Problem 5: Low Click Rate

**Symptoms**:
- Click rate below 2%
- Subscribers open but don't click
- High open, low click ratio

**Root Causes**:
1. Weak or unclear CTA
2. Email too long
3. No clear value proposition
4. Link broken
5. Mobile formatting issues

**Diagnosis**:
```
1. Check click rate by link
2. Review email content (is CTA clear?)
3. Test all links (are they working?)
4. View on mobile (is it readable?)
5. Compare to previous emails
```

**Fixes**:

**Fix 1: Make CTA Specific**
```
Weak: "Click here"
Strong: "Get your free guide"
Weak: "Learn more"
Strong: "Read the full case study"
Weak: "Buy now"
Strong: "Get instant access for $97"
```

**Fix 2: One Clear CTA**
```
Don't: "Check out our blog, follow us on Twitter, and buy our product"
Do: "Get your free guide" (one action, clearly stated)
```

**Fix 3: Shorten Email**
```
1. Remove fluff and filler
2. Get to point faster
3. Use shorter paragraphs
4. Aim for 200-300 words max
```

**Fix 4: Test Button Design**
```
Test:
- Color: Blue vs Green vs Orange
- Size: Small vs Large
- Placement: Top vs Middle vs Bottom
- Text: Button vs Text Link
```

**Fix 5: Fix Mobile Formatting**
```
1. Use single column layout
2. Large font (14px+)
3. Big buttons (44x44px minimum)
4. Test on real phone
```

**Real Results**: Changed CTA from "Click here" to "Get your free guide". Click rate increased from 3.2% to 4.8% (+50%).

---

### Problem 6: Low Conversion Rate

**Symptoms**:
- Subscribers clicking but not buying
- Landing page traffic but no sales
- High click, low conversion ratio

**Root Causes**:
1. Weak offer
2. High friction (complex checkout)
3. Poor landing page
4. No urgency
5. Price objection

**Diagnosis**:
```
1. Check conversion rate by traffic source
2. Review landing page (is it compelling?)
3. Test checkout process (is it smooth?)
4. Analyze where people drop off
5. Review offer strength
```

**Fixes**:

**Fix 1: Strengthen Offer**
```
Add:
- Urgency: "24 hours only"
- Scarcity: "Only 50 spots"
- Bonuses: "Plus $297 in bonuses"
- Guarantee: "30-day money back"
- Discount: "Save 40% today"
```

**Fix 2: Reduce Friction**
```
1. Simplify checkout (fewer steps)
2. Reduce form fields (email only, not full address)
3. Offer multiple payment options
4. Add guest checkout (no account required)
5. Show security badges
```

**Fix 3: Improve Landing Page**
```
Include:
- Compelling headline
- Clear value proposition
- Social proof (testimonials)
- Benefit bullets (not features)
- Single CTA above fold
- Mobile-optimized
```

**Fix 4: Add Urgency**
```
Types:
- Countdown timer
- Limited spots
- Price increase deadline
- Bonus removal deadline
- "This email expires in 24 hours"
```

**Fix 5: Address Objections**
```
Add to page:
- FAQ section
- Money-back guarantee
- Customer testimonials
- Case studies
- Comparison charts
- "What happens if I don't like it?"
```

**Real Results**: Added countdown timer + "price increases in 24 hours" to sales page. Conversion increased from 2.1% to 3.4% (+62%).

---

## Category 3: Technical Issues

### Problem 7: Personalization Not Working

**Symptoms**:
- [First Name] showing as blank or "Friend"
- Merge tags not populating
- Wrong data showing

**Root Causes**:
1. Missing subscriber data
2. Incorrect merge tag syntax
3. Data not mapped correctly
4. Case-sensitive fields

**Diagnosis**:
```
1. Check subscriber data (is field populated?)
2. Review merge tag syntax (correct for ESP?)
3. Test with sample subscriber
4. Check field mapping in integration
```

**Fixes**:

**Fix 1: Add Fallback Value**
```
Wrong: Hi [First Name],
Right: Hi [First Name, fallback there],
Result: "Hi John" or "Hi there" (not "Hi ")
```

**Fix 2: Correct Merge Tag Syntax**
```
Mailchimp: *|FNAME|*
ConvertKit: {{first_name}}
ActiveCampaign: %FIRSTNAME%
Check ESP documentation for correct syntax
```

**Fix 3: Map Fields Correctly**
```
1. Check integration settings
2. Map form fields to ESP fields
3. Test with real signup
4. Verify data flows correctly
```

**Fix 4: Collect Required Data**
```
1. Make field required in form
2. Use double opt-in (confirm data)
3. Allow subscribers to update profile
4. Import historical data if needed
```

---

### Problem 8: Images Not Displaying

**Symptoms**:
- Images showing as broken links
- Subscribers see alt text instead of images
- Email looks broken

**Root Causes**:
1. Images not hosted (attached files)
2. Image URLs broken
3. Images blocked by email client
4. Large file size

**Diagnosis**:
```
1. Check image URLs (do they work?)
2. Test in different email clients
3. Check file size (under 200KB per image)
4. Verify hosting (not attachment)
```

**Fixes**:

**Fix 1: Host Images Properly**
```
Wrong: Attach images to email
Right: Host on website, use absolute URLs
Example: https://yoursite.com/images/header.jpg
```

**Fix 2: Add Alt Text**
```
Always include descriptive alt text:
<img src="header.jpg" alt="Email Marketing Guide Cover">
Result: Text displays if image blocked
```

**Fix 3: Optimize Image Size**
```
1. Compress images (tinypng.com)
2. Keep under 200KB per image
3. Total email size under 100KB
4. Use JPG for photos, PNG for graphics
```

**Fix 4: Test in Multiple Clients**
```
Test in:
- Gmail (most common)
- Outlook
- Apple Mail
- Mobile clients
Use Litmus or Email on Acid for testing
```

**Best Practice**: Always use text + images, not images only. Some clients block images by default.

---

### Problem 9: Links Not Working

**Symptoms**:
- Subscribers report broken links
- 404 errors when clicking
- Tracking URLs broken

**Root Causes**:
1. Typos in URLs
2. Broken landing pages
3. Tracking parameters malformed
4. Link shortened incorrectly

**Diagnosis**:
```
1. Click all links before sending
2. Check landing page URLs (do they exist?)
3. Verify tracking parameters (UTM tags)
4. Test on mobile and desktop
```

**Fixes**:

**Fix 1: Test All Links**
```
Before every send:
1. Click every single link
2. Verify landing page loads
4. Check mobile and desktop
4. Fix any broken links
```

**Fix 2: Use Absolute URLs**
```
Wrong: /product
Right: https://yoursite.com/product
Wrong: contact.html
Right: https://yoursite.com/contact.html
```

**Fix 3: Fix UTM Parameters**
```
Correct format:
https://yoursite.com/product?utm_source=newsletter&utm_medium=email&utm_campaign=welcome

Common mistakes:
- Missing ? before first parameter
- Missing & between parameters
- Typos in parameter names
```

**Fix 4: Avoid Link Shorteners**
```
Wrong: bit.ly/product
Right: https://yoursite.com/product
Why: Some clients block shorteners (spam risk)
```

---

## Category 4: Integration Issues

### Problem 10: Data Not Syncing

**Symptoms**:
- Purchases not triggering automations
- Subscribers not being added correctly
- Data not flowing between tools

**Root Causes**:
1. Integration broken
2. API limits exceeded
3. Webhook failed
4. Field mapping incorrect

**Diagnosis**:
```
1. Check integration status in ESP
2. Review error logs
3. Test with real transaction/signup
4. Check API usage limits
```

**Fixes**:

**Fix 1: Reauthorize Integration**
```
1. Go to integration settings
2. Click "Disconnect" or "Remove"
3. Reconnect integration
4. Reauthorize access
5. Test with sample data
```

**Fix 2: Check API Limits**
```
1. Review ESP API limits
2. Check current usage
3. Upgrade plan if needed
4. Implement rate limiting
```

**Fix 3: Fix Webhook**
```
1. Check webhook URL (correct?)
2. Verify webhook is active
3. Test webhook payload
4. Check server logs
5. Recreate webhook if needed
```

**Fix 4: Remap Fields**
```
1. Check field mapping in integration
2. Ensure form fields match ESP fields
3. Test with sample signup
4. Verify data appears correctly
```

---

## Quick Troubleshooting Checklist

### Delivery Issues
- [ ] Domain authenticated? (SPF, DKIM, DMARC)
- [ ] Sender score good? (senderscore.org)
- [ ] List clean? (removed bounces/inactives)
- [ ] Content clean? (no spam triggers)
- [ ] Engagement good? (15%+ open rate)

### Performance Issues
- [ ] Subject lines tested?
- [ ] Send time optimized?
- [ ] List segmented?
- [ ] Frequency appropriate?
- [ ] CTAs clear and specific?

### Technical Issues
- [ ] Automation active?
- [ ] Emails published?
- [ ] Triggers working?
- [ ] Links tested?
- [ ] Mobile formatting checked?

### Integration Issues
- [ ] Integration connected?
- [ ] API within limits?
- [ ] Fields mapped correctly?
- [ ] Webhooks working?
- [ ] Test data flowing?

---

## Emergency Fixes (When Everything Breaks)

### Situation 1: ESP Outage
**Do**:
1. Check ESP status page
2. Wait for resolution (usually <1 hour)
3. Delay scheduled emails
4. Communicate if critical

**Don't**:
- Panic and switch ESPs mid-campaign
- Send manual emails (breaks automation)
- Make major changes during outage

---

### Situation 2: Major Mistake in Sent Email
**Do**:
1. Send follow-up apology immediately
2. Acknowledge mistake honestly
3. Offer discount/gift as apology
4. Learn and improve process

**Example**:
```
Subject: Oops! My mistake (and an apology gift)

Hi [Name],

I made a mistake in my last email. [Explain mistake].

I messed up, and I'm sorry.

To make it right, here's [X]% off your next order:
Code: SORRY[X]

Thanks for being understanding,

[Your Name]
```

---

### Situation 3: Spam Complaint Spike
**Do**:
1. Immediately stop sending to that segment
2. Investigate cause (content? frequency?)
3. Remove complainers immediately
4. Clean entire list
5. Wait 7-14 days before resuming

**Don't**:
- Keep sending to complainers
- Ignore complaints (will kill reputation)
- Argue with subscribers

---

## Pro Tips for Troubleshooting

**1. Reproduce the Issue**: Can you make the problem happen again? If yes, you can fix it.

**2. Change One Thing**: Don't change 5 things at once. Change one, test, repeat.

**3. Document Everything**: Keep a log of issues and fixes. Build knowledge base.

**4. Ask for Help**: ESP support, forums, communities. Someone has seen this before.

**5. Test Before Sending**: Always, always, always test before full send.

**6. Have Backup Plan**: What if ESP goes down? What if email breaks?

**7. Monitor Proactively**: Don't wait for subscribers to tell you there's a problem.

---

**Remember**: Every email marketer faces these issues. The pros fix them fast and learn from them.

Build your troubleshooting playbook. You'll use it often.

"Automate the boring, keep the human"
