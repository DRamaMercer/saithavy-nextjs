# SOP: Social Media Scheduling Automation

**SOP ID:** SOP-003
**Version:** 1.0
**Last Updated:** March 13, 2026
**Owner:** Content Marketing Manager
**Review Date:** September 13, 2026

---

## 📋 PURPOSE

**What this automation does:**
Automatically schedules and publishes content across multiple social media platforms (LinkedIn, Twitter/X, Facebook, Instagram) from a single content calendar, with platform-specific optimization, auto-hashtagging, and performance tracking.

**Business Impact:**
- Saves approximately 10 hours per week in manual posting
- Ensures consistent posting schedule (never miss a slot)
- Increases engagement by 40% (optimal timing per platform)
- Enables 1 month ahead content planning

**Success Metrics:**
- Posting consistency: 100% (all scheduled posts published)
- Time savings: 10+ hours per week reclaimed
- Engagement increase: 40% boost in interactions
- Cross-platform reach: 3x more impressions from same content

---

## 🎯 SCOPE

**In Scope:**
- Content scheduling for: LinkedIn, Twitter/X, Facebook, Instagram
- Post types: Text, images, links, carousels, video
- Platform-specific optimization (character limits, hashtags, mentions)
- Bulk scheduling (upload 30+ posts at once)
- Analytics tracking and reporting
- Content recycling (repost evergreen content)

**Out of Scope:**
- Content creation (that's SOP-006: Content Creation Workflow)
- Community engagement (replying to comments - manual process)
- Paid social media advertising (separate SOP)
- Real-time news/trend posting (done manually)

---

## 🛠️ PREREQUISITES

### Required Tools & Accounts
- **Buffer** or **Hootsuite**: Social media scheduling platform
- **Canva**: Design tool for images and graphics
- **Google Sheets** or **Airtable**: Content calendar
- **Bitly**: Link shortening and tracking
- **Zapier** or **Make (Integromat)**: Automation platform
- Platform accounts: LinkedIn Company Page, Twitter/X, Facebook Page, Instagram Business

### Technical Requirements
- API access for all social platforms
- Buffer Business plan or higher (for bulk scheduling)
- Canva Pro team account
- Google Sheets API access (for calendar integration)

### Permissions Needed
- **Social Platforms**: Admin access for posting
- **Buffer**: Account admin access
- **Canva**: Team admin for brand kit access
- **Google Sheets**: Edit access to content calendar

### Before You Begin
- [ ] Content calendar template is created in Google Sheets
- [ ] Brand voice guidelines are documented
- [ ] Optimal posting times are determined for each platform
- [ ] Hashtag library is compiled
- [ ] Visual assets are organized in Canva

---

## 🔄 WORKFLOW OVERVIEW

**Visual Description:**

```
[Content Calendar] → [Validate & Categorize] → [Optimize Per Platform] → [Schedule Posts] → [Publish] → [Track Performance]
        ↓                    ↓                        ↓                       ↓                ↓                ↓
    [Google Sheets]      [Filter Logic]          [Format/Resize]         [Buffer API]     [Auto-Post]      [Analytics]
```

**Process Flow:**
1. **Input:** Content team adds posts to Google Sheets calendar
2. **Validation:** Check for required fields, character limits, asset links
3. **Optimization:** Customize for each platform (hashtags, mentions, formatting)
4. **Scheduling:** Add to Buffer queue at optimal times
5. **Publishing:** Auto-post at scheduled times
6. **Tracking:** Collect engagement metrics and populate dashboard

**Integration Points:**
- Connects to: Google Sheets, Buffer, Canva, Bitly, Social platforms
- Data flows from: Sheets → Zapier → Buffer → Social Platforms → Analytics
- Dependencies: Content approval workflow, brand kit assets

---

## 📝 STEP-BY-STEP INSTRUCTIONS

### Step 1: Set Up Content Calendar
**Purpose:** Centralize all content planning and metadata

**Actions:**
1. Create Google Sheets calendar with these columns:
   - **Post ID**: Unique identifier (e.g., POST-2026-001)
   - **Scheduled Date**: When to publish
   - **Scheduled Time**: Time slot (or "auto-optimal")
   - **Platform(s)**: LinkedIn, Twitter, Facebook, Instagram (comma-separated)
   - **Content Type**: Text, Image, Link, Video, Carousel
   - **Post Text**: Main message (up to 280 for Twitter, 2200 for LinkedIn)
   - **Link URL**: Destination URL (if applicable)
   - **Image URL**: Link to Canva design (if applicable)
   - **Hashtags**: Platform-specific or use defaults
   - **Campaign**: Name of campaign/theme
   - **Status**: Draft, Approved, Scheduled, Published
   - **Notes**: Special instructions

2. Set up dropdown menus:
   - Platform(s): Multi-select dropdown
   - Content Type: Single-select dropdown
   - Status: Single-select dropdown with color coding

3. Add validation rules:
   - Scheduled Date: Must be future date
   - Post Text: Required field
   - Platform(s): At least one selected
   - Status: Cannot be "Published" without "Scheduled" first

4. Create additional tabs:
   - "Hashtag Library": Categorized hashtag lists
   - "Posting Times": Optimal times per platform
   - "Performance Log": Post-publish metrics

**Expected Result:**
Structured content calendar with all required metadata

**Time Estimate:** 2 hours initial setup

**Notes/Pro Tips:**
💡 Use Google Sheets "Protect ranges" to prevent accidental edits to published posts
💡 Add conditional formatting to color-code posts by status (Draft=yellow, Scheduled=blue, Published=green)

---

### Step 2: Create Automation Workflow
**Purpose:** Transform calendar entries into scheduled posts

**Actions:**
1. Create zap/scenario in Zapier/Make:
   - **Trigger**: "New Spreadsheet Row" in Google Sheets
   - **Filter**: Only when "Status" = "Approved"

2. Add validation step:
   - Check required fields: Post Text, Platform(s), Scheduled Date
   - Validate character limits:
     - Twitter/X: ≤ 280 chars (warn if > 260 for link space)
     - LinkedIn: ≤ 3000 chars (warn if > 2500 for engagement)
     - Facebook: ≤ 63206 chars (practically unlimited)
     - Instagram: ≤ 2200 chars
   - Validate image URLs: Must be publicly accessible (Canva published links)

3. Add platform-specific optimization:
   ```
   IF platform = "Twitter"
     THEN truncate to 280 chars
     AND add 2-3 hashtags from library
     AND shorten link via Bitly
   ELSE IF platform = "LinkedIn"
     THEN keep full text
     AND add 3-5 hashtags
     AND format with spacing (no more than 3 lines per paragraph)
     AND add company page mention
   ELSE IF platform = "Instagram"
     THEN truncate to 2200 chars
     AND add 10-15 hashtags
     AND add call-to-action in first line
   ```

4. Add hashtag auto-selection:
   - If "Hashtags" cell is empty: Auto-populate from campaign defaults
   - If "Hashtags" cell has values: Use those instead of defaults
   - Hashtag library: Organized by topic (e.g., #Marketing #Automation #SaaS)

**Expected Result:**
Automation that optimizes and validates content per platform

**Time Estimate:** 3 hours

**Decision Point:**
```
IF content_type = "Image" AND image_url is empty
  THEN skip this row
  AND send alert to content team: "Missing image for POST-XXX"
  AND add to "Missing Assets" tracker
ELSE IF content_type = "Link" AND link_url is empty
  THEN skip this row
  AND alert content team
ELSE
  THEN proceed to scheduling
```

---

### Step 3: Configure Platform-Specific Settings
**Purpose:** Optimize content for each social platform's best practices

**Actions:**
1. **LinkedIn Optimization:**
   - Character limit: 3000 (optimal: 1200-1500 for engagement)
   - Hashtags: 3-5 relevant hashtags (mix of broad and niche)
   - Mentions: Always mention company page (@[Company])
   - Formatting: Use line breaks, avoid walls of text
   - Links: Include in post text (LinkedIn auto-generates preview)
   - Media: Images should be 1200×627px (landscape)

2. **Twitter/X Optimization:**
   - Character limit: 280 (optimal: 240-260 to allow for retweets)
   - Hashtags: 1-2 hashtags max (more reduces engagement)
   - Mentions: Place @mentions at start or end (not middle)
   - Links: Shorten via Bitly for tracking
   - Media: Images should be 1600×900px (16:9 ratio)
   - Threads: If post > 280 chars, create thread automatically

3. **Facebook Optimization:**
   - Character limit: 63,206 (practically unlimited)
   - Hashtags: 2-3 hashtags (Facebook users ignore more)
   - Links: Place link first (algorithm prioritizes link posts)
   - Media: Images should be 1200×630px (og:image standard)
   - Engagement: End with question to encourage comments

4. **Instagram Optimization:**
   - Character limit: 2200
   - Hashtags: 10-15 (Instagram algorithm rewards them)
   - Mentions: Up to 20 @mentions allowed
   - Links: Only clickable in bio (use "Link in bio" in post)
   - Media: Images should be 1080×1080px (square) or 1080×1350px (portrait)
   - Carousel: Multiple images swipeable (engagement goldmine)

**Expected Result:**
Platform-optimized content ready for scheduling

**Time Estimate:** 2 hours

**Notes/Pro Tips:**
💡 Create platform-specific templates in the content calendar (e.g., "LinkedIn Long-Form", "Twitter Short")
💡 Use emoji sparingly on LinkedIn (1-2 per post max) but more on Instagram (5-10 is fine)

---

### Step 4: Schedule Posts in Buffer
**Purpose:** Queue content at optimal times for maximum reach

**Actions:**
1. Add "Create Post" action (Buffer API):
   - Map fields from Google Sheets to Buffer
   - Text: Optimized post text from Step 3
   - Profile: Select based on "Platform(s)" field
   - Schedule: Use "Scheduled Date" + "Scheduled Time" from calendar
   - Media: Attach image from Canva URL (if applicable)
   - Link: Add shortened Bitly link (if applicable)

2. Set up optimal posting times:
   - **LinkedIn**: Tuesday-Thursday, 8-10 AM or 5-6 PM
   - **Twitter/X**: Monday-Friday, 9-11 AM or 12-3 PM
   - **Facebook**: Wednesday, Thursday, Friday, 1-4 PM
   - **Instagram**: Monday, Tuesday, Friday, 11 AM-1 PM

3. Configure timezone handling:
   - All times in content calendar should be in company timezone (e.g., EST)
   - Automatically convert to target audience timezone if different
   - Use Buffer's "Optimal Timing" feature if "Scheduled Time" = "auto-optimal"

4. Add approval workflow:
   - IF post contains sensitive topics: Route to manager for approval
   - IF post is announcement or news: Route to PR team for review
   - IF post mentions partners: Route to partnership team

**Expected Result:**
Posts queued in Buffer ready for auto-publishing

**Time Estimate:** 1.5 hours

**Decision Point:**
```
IF scheduled_date is within 24 hours
  THEN schedule immediately
  AND notify content team: "Scheduled for [date/time]"
ELSE IF scheduled_date is > 1 month out
  THEN queue for later
  AND review again 2 weeks before posting
```

---

### Step 5: Publish & Track Performance
**Purpose:** Auto-publish posts and collect engagement metrics

**Actions:**
1. Enable auto-publishing in Buffer:
   - All platforms support auto-publish except Instagram (requires mobile notification)
   - For Instagram: Configure Buffer to send push notification to content team
   - Set up reminder: 5 minutes before scheduled time

2. Track published posts:
   - Trigger: "Post Published" webhook from Buffer
   - Action: Update Google Sheets "Status" to "Published"
   - Record: Actual publish date/time, Buffer post ID

3. Collect analytics:
   - **Trigger**: 24 hours after post publish
   - **Action**: Fetch metrics from Buffer Analytics API
   - **Metrics collected**:
     - Impressions (how many saw it)
     - Engagement rate (likes, comments, shares / impressions)
     - Click-through rate (link clicks / impressions)
     - Shares/Retweets
     - Comments

4. Populate performance dashboard:
   - Update "Performance Log" tab in Google Sheets
   - Calculate averages per platform, per campaign
   - Generate weekly report: Top 5 posts, worst 5 posts

5. Set up alerts:
   - IF engagement rate > 10%: Notify team (high performer)
   - IF engagement rate < 1%: Flag for review (underperforming)
   - IF negative comments detected: Alert community manager

**Expected Result:**
Automated publishing with comprehensive performance tracking

**Time Estimate:** 2 hours

**Notes/Pro Tips:**
💡 Buffer's analytics are free for 30 days - upgrade to Buffer Analyze for historical data
💡 Set up custom UTM parameters on all links to track traffic in Google Analytics

---

### Step 6: Implement Content Recycling
**Purpose:** Automatically repost evergreen content to extend reach

**Actions:**
1. Identify evergreen content:
   - Add "Evergreen" checkbox to content calendar
   - Criteria for evergreen: How-to guides, tips, statistics, quotes
   - Exclude: Time-sensitive news, product launches, timely announcements

2. Set up recycling rules:
   - **LinkedIn**: Repost after 90 days (different audience due to algorithm)
   - **Twitter/X**: Repost after 30 days (high content decay)
   - **Facebook**: Repost after 60 days
   - **Instagram**: Repost after 45 days (save to Highlights instead)

3. Add to automation:
   ```
   IF evergreen = TRUE
     AND status = "Published"
     AND days_since_publish >= recycling_period
     AND NOT already_recycled
   THEN
     create new row in calendar
     with scheduled_date = today + 7 days
     and status = "Draft"
     and mark original as "Recycled"
   ```

4. Track recycling performance:
   - Compare engagement of original vs recycled post
   - IF recycled post performs better: Adjust strategy
   - IF recycled post performs worse: Reduce frequency for that topic

**Expected Result:**
Extended content lifespan without manual rescheduling

**Time Estimate:** 1 hour

---

## 🔧 CONFIGURATION

### Settings & Parameters
| Parameter | Value | Description |
|-----------|-------|-------------|
| Content Approval Required | Yes | All posts must be approved before scheduling |
| Minimum Lead Time | 24 hours | Posts must be scheduled at least 24h in advance |
| Auto-Recycle Evergreen | Yes | Automatically repost evergreen content |
| Performance Alert Threshold | >10% or <1% | Engagement rates that trigger alerts |
| Maximum Hashtags | Platform-specific | LinkedIn: 5, Twitter: 2, Instagram: 15 |
| Default Timezone | EST | All times in company timezone |

### Customization Options
- **Posting times:** Adjust based on your audience analytics
- **Recycling frequency:** Modify based on content decay rates
- **Approval workflow:** Add additional reviewers for sensitive topics
- **Platform mix:** Add/remove platforms based on strategy

### Environment-Specific Settings
- **Development:** Test with Buffer's "Drafts" folder (don't publish)
- **Staging:** Use test social media accounts
- **Production:** Live accounts with real publishing

---

## 🧪 TESTING PROCEDURES

### Pre-Deployment Checklist
- [ ] Unit test completed: Post formatting per platform
- [ ] Integration test passed: End-to-end calendar → Buffer → publish
- [ ] User acceptance test approved by: Content Marketing Manager
- [ ] Performance benchmark met: < 5 minutes from calendar to Buffer
- [ ] Brand review completed: All posts on-brand

### Test Scenarios

**Scenario 1: Standard Multi-Platform Post**
1. **Input:**
   - Post text: "5 Ways Automation Saves Time - thread 🧵"
   - Platforms: LinkedIn, Twitter, Facebook
   - Content type: Thread (Twitter), Long-form (LinkedIn/FB)
   - Image: Blog post thumbnail
2. **Expected Output:**
   - LinkedIn: 1200-char post with 3 hashtags, company mention
   - Twitter: Thread of 5 tweets (1 intro + 4 content), 1-2 hashtags each
   - Facebook: Full post with link preview, 2 hashtags
   - All scheduled at optimal times
3. **Actual Output:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 2: Image-Only Instagram Post**
1. **Input:**
   - Post text: "Behind the scenes at our team retreat! 🎉"
   - Platform: Instagram only
   - Content type: Image (carousel of 5 photos)
   - Hashtags: #TeamCulture #RemoteWork #TechLife
2. **Expected Output:**
   - Instagram carousel with 5 images
   - Caption with text + 15 total hashtags (5 provided + 10 auto-added)
   - "Link in bio" CTA
   - Scheduled for Friday 11 AM (optimal Instagram time)
3. **Actual Output:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 3: Character Limit Validation**
1. **Input:**
   - Post text: 300-character message for Twitter
   - Platform: Twitter only
2. **Expected Behavior:**
   - Automation detects >280 char limit
   - Truncates to 275 chars
   - Adds "..." at end with link to full post
   - Alerts content team: "Twitter post truncated"
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 4: Evergreen Content Recycling**
1. **Input:**
   - Previous post: "10 Automation Tips" published 90 days ago
   - Evergreen checkbox: TRUE
   - Not yet recycled
2. **Expected Behavior:**
   - Automation detects eligible post for recycling
   - Creates new row in calendar
   - Scheduled date: 7 days from today
   - Status: "Draft" (requires review)
   - Original post marked "Recycled"
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

**Scenario 5: Missing Asset Detection**
1. **Input:**
   - Post with content_type = "Image"
   - image_url cell is empty
   - Status = "Approved"
2. **Expected Behavior:**
   - Automation validates image_url is required
   - Skips this row (does not schedule)
   - Sends alert: "Missing image for POST-XXX"
   - Adds to "Missing Assets" tracker sheet
   - Does NOT proceed to Buffer
3. **Actual Behavior:** [Test results]
4. **Status:** ✅ Pass / ❌ Fail

### Rollback Testing
- [ ] Rollback procedure tested: March 10, 2026
- [ ] Data integrity verified: No duplicate posts created
- [ ] Recovery time: 10 minutes (disable automation, manual posting)

---

## 🚨 ERROR HANDLING

### Common Errors & Solutions

| Error | Cause | Solution | Prevention |
|-------|-------|----------|------------|
| Post exceeds character limit | Text too long for platform | Auto-truncate with ellipsis + link | Pre-validate in calendar |
| Image URL not accessible | Canva link not published | Republish Canva design as public | Test image URLs before scheduling |
| Buffer API rate limit | Too many posts created at once | Throttle to 10 posts/minute | Batch schedule throughout day |
| Duplicate post scheduled | Calendar has duplicate rows | Check for existing post ID | Add deduplication step |
| Hashtag spam detection | Too many hashtags on LinkedIn | Limit to 5 max | Platform-specific hashtag limits |
| Timezone confusion | Scheduled in wrong timezone | Normalize all to company timezone | Document timezone clearly |

### Emergency Contacts
- **Primary:** Content Marketing Manager - content@company.com - (555) 345-6789
- **Secondary:** Social Media Specialist - social@company.com - (555) 456-7890
- **Escalation:** CMO - cmo@company.com - (555) 567-8901

### Failure Mode Analysis
**What happens when:**
- **Buffer API down:** Queue posts in Google Sheets, auto-sync when restored
- **Google Sheets sync fails:** Alert immediately, switch to manual Buffer scheduling
- **Image asset missing:** Skip post, alert content team, add to missing assets tracker
- **Character limit exceeded:** Auto-truncate with link to full content
- **Platform API changes:** Monitor Buffer changelog, adjust automation quickly

---

## 📊 MONITORING & MAINTENANCE

### Key Metrics to Track
| Metric | Target | Alert Threshold | Frequency |
|--------|--------|-----------------|-----------|
| Posting consistency | 100% | < 95% | Daily |
| Engagement rate | 3-5% | < 1% or > 10% | Weekly |
| Time saved vs manual | 10 hrs/week | < 8 hrs/week | Monthly |
| Cross-platform reach | 3x impressions | < 2x | Monthly |
| Post scheduling time | < 5 min | > 15 min | Per batch |
| API error rate | < 1% | > 5% | Hourly |

### Daily Maintenance Tasks
- [ ] Check for failed scheduled posts (5 minutes)
- [ ] Verify today's posts queued successfully (2 minutes)
- [ ] Monitor for negative comments requiring response (10 minutes)

### Weekly Maintenance Tasks
- [ ] Review top and bottom performing posts (30 minutes)
- [ ] Update hashtag library based on trending topics (15 minutes)
- [ ] Check evergreen content recycling queue (10 minutes)
- [ ] Adjust posting times based on analytics (15 minutes)
- [ ] Clean up failed or skipped posts (10 minutes)

### Monthly Maintenance Tasks
- [ ] Full audit of posting consistency (1 hour)
- [ ] Review and update optimal posting times (30 minutes)
- [ ] Analyze engagement trends by platform (1 hour)
- [ ] Update content calendar template based on feedback (30 minutes)
- [ ] Performance audit: automation speed and accuracy (1 hour)
- [ ] Brand voice review: Ensure all posts on-brand (1 hour)
- [ ] Retest automation with platform updates (2 hours)

### Maintenance Log
| Date | Task | Performed By | Notes |
|------|------|--------------|-------|
| March 13, 2026 | Initial deployment | Content Marketing | All tests passed |
| March 20, 2026 | Hashtag library update | Content Marketing | Added #AIautomation |
| April 1, 2026 | Posting times adjustment | Social Media Specialist | LinkedIn moved to 8 AM |
| April 15, 2026 | Evergreen recycling review | Content Marketing | Increased frequency to 60 days |

---

## 🔄 ROLLBACK PROCEDURE

**When to Rollback:**
- Posting failure rate > 20% for 1 day
- Significant brand voice inconsistency detected
- Platform API changes break automation
- Negative feedback from audience on automated posts

**Rollback Steps:**
1. **Immediate Action:** Turn off automation in Zapier/Make
2. **Notify:** Slack message to #content-team: "Social automation paused"
3. **Restore:**
   - Content team schedules posts directly in Buffer
   - Use content calendar as reference only
   - Manual publishing for all platforms
4. **Verify:**
   - Check last 5 posts published correctly
   - Confirm no duplicate posts scheduled
5. **Document:**
   - Log incident in "Content Incident Report"
   - Note root cause and prevention steps

**Rollback Time Estimate:** 10 minutes to disable, 5-10 hours/week for manual posting

**Post-Rollback Actions:**
- [ ] Investigate root cause with technical team
- [ ] Fix issue in development environment
- [ ] Re-test all scenarios with sample posts
- [ ] Update this SOP with lessons learned
- [ ] Gradual re-rollout: 1 platform per day, monitor closely

---

## 📚 REFERENCE MATERIALS

### Related SOPs
- [Content Creation Workflow](SOP-006): How content is created and approved
- [Community Engagement](SOP-011): Responding to comments and mentions
- [Crisis Communications](SOP-012): Handling PR issues on social media

### External Documentation
- [Buffer API Documentation](https://buffer.com/developers/api): Scheduling and publishing
- [Platform Best Practices](https://blog.buffer.com/social-media-marketing): Platform-specific tips
- [Hashtag Research Tools](https://hashtagify.me): Find trending hashtags

### Training Resources
- Video: "Setting Up Social Automation" (25 min) - Internal LMS
- Cheat Sheet: "Platform Character Limits & Best Practices" - Posted in #content-team
- Workshop: Monthly "Content Strategy Office Hours" - Last Wednesday of month

---

## 📝 CHANGE LOG

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | March 13, 2026 | Initial version | Content Marketing Manager |
|  |  |  |  |

---

## 💬 FEEDBACK & IMPROVEMENTS

**Got ideas to improve this automation?**
1. Document suggestion in "Content Automation Backlog" sheet
2. Test in development environment first
3. Submit for review at monthly content team meeting
4. Update this SOP after approval

**Continuous Improvement:**
- Last optimization: March 20, 2026 (added Instagram carousel support)
- Next scheduled review: April 15, 2026
- Optimization backlog: 3 items (TikTok integration, AI image generation, auto-responders)

---

## ✅ APPENDIX: EXAMPLE OUTPUTS

### Example 1: Multi-Platform Post
**Content Calendar Row:**
```
Post ID: POST-2026-045
Scheduled Date: 2026-03-15
Platform(s): LinkedIn, Twitter, Facebook
Content Type: Link
Post Text: "New blog: 10 Ways Automation Saves Time. Thread 🧵👇"
Link URL: https://company.com/blog/automation-time-savers
Hashtags: #Automation #Productivity #Tech
Status: Approved
```

**Published Output:**
- **LinkedIn**: "New blog post alert! 🚀

  We just published "10 Ways Automation Saves Time" and it's packed with actionable tips you can implement today.

  In this post, we cover:
  ✓ Automating lead capture
  ✓ Streamlining invoicing
  ✓ Scheduling social media
  ✓ And 7 more time-savers

  Read the full guide here: [link]

  Have you automated any repetitive tasks recently? Drop a comment below! 👇

  #Automation #Productivity #Tech #SaaS @[Company]"

- **Twitter**: Thread of 5 tweets, each 1-2 hashtags, < 280 chars

### Example 2: Performance Dashboard
**Weekly Report:**
```
Top Performing Posts (March 7-13, 2026):
1. "10 Automation Tips" (LinkedIn) - 12.5% engagement, 5.2K impressions
2. Team retreat photo carousel (Instagram) - 18.3% engagement, 8.1K impressions
3. Product launch thread (Twitter) - 9.1% engagement, 12K impressions

Underperforming Posts:
1. Generic industry news (Facebook) - 0.8% engagement, 800 impressions
2. Text-only tip (LinkedIn) - 1.2% engagement, 1.1K impressions

Action Items:
- More carousel content on Instagram (high engagement)
- Avoid generic news posts on Facebook
- Add images to all LinkedIn posts
```

---

## 🎓 NOTES FOR NEW USERS

**Critical Success Factors:**
1. **Plan content 2-4 weeks out:** Automation works best with a full content calendar
2. **Test image URLs:** Canva links must be published publicly or Buffer can't access them
3. **Monitor analytics closely:** What worked last month might not work this month
4. **Keep brand voice consistent:** Automation shouldn't sound robotic

**Common Mistakes to Avoid:**
- ❌ Scheduling all platforms at the same time (each has optimal times)
- ❌ Using all 30 hashtag slots on Instagram (looks spammy)
- ❌ Forgetting to check comments after posting (automation ≠ set-and-forget)
- ❌ Posting without reviewing (one bad post can damage brand)

**Best Practices:**
- ✅ Batch schedule: Create all next week's posts on Friday
- ✅ Use platform-specific formatting: What works on Twitter doesn't work on LinkedIn
- ✅ Include visuals: Posts with images get 2-3x more engagement
- ✅ Track everything: You can't improve what you don't measure

**Remember:** "Systems before willpower. Automate the boring, keep the human."
