> **Historical document notice:** This report describes an earlier repository revision and is superseded by `GOVERNMENT_GRADE_AUDIT_REPORT.md`. Do not rely on historical contact details, governance assertions, route counts or test claims without re-verification.

# ITEN–TAMBACH MUNICIPALITY WEBSITE
# PRODUCTION LAUNCH CHECKLIST

**Project:** Iten–Tambach Municipality Official Website  
**Target Launch:** After completion of this checklist  
**Current Status:** Production-Ready, Pending Final Testing  

---

## PRE-LAUNCH TESTING (WEEK 1)

### Build & Deployment Testing

- [ ] **Production Build Succeeds**
  ```bash
  npm install
  npm run build
  ```
  **Expected:** Build completes with zero errors  
  **Blocker:** Yes

- [ ] **TypeScript Validation Passes**
  ```bash
  npm run typecheck
  ```
  **Expected:** No type errors  
  **Blocker:** Yes

- [ ] **Linting Passes**
  ```bash
  npm run lint
  ```
  **Expected:** No critical errors  
  **Blocker:** No (warnings acceptable with justification)

- [ ] **Unit Tests Pass**
  ```bash
  npm run test
  ```
  **Expected:** All tests pass  
  **Blocker:** No (currently demonstration site)

- [ ] **Firebase Rules Tests Pass**
  ```bash
  npm run test:rules
  ```
  **Expected:** Security rules validated  
  **Blocker:** Yes (security-critical)

### Production Deployment Testing

- [ ] **Vercel Deployment Succeeds**
  ```bash
  vercel --prod
  ```
  **Expected:** Deployment successful, URL accessible  
  **Blocker:** Yes

- [ ] **Environment Variables Configured**
  - [ ] `NEXT_PUBLIC_SITE_URL`
  - [ ] All `NEXT_PUBLIC_FIREBASE_*` variables
  - [ ] All `FIREBASE_ADMIN_*` variables
  - [ ] `PRIVACY_HASH_SECRET`
  - [ ] `SESSION_TTL_HOURS`
  - [ ] `MFA_ENFORCEMENT`
  **Blocker:** Yes

- [ ] **SSL Certificate Active**
  **Verify:** https:// loads with valid certificate  
  **Blocker:** Yes

- [ ] **Custom Domain (if applicable)**
  **Configure:** DNS records pointing to Vercel  
  **Blocker:** No (can launch on vercel.app)

### Route Testing (All Routes Load)

#### Static Pages
- [ ] `/` (Homepage)
- [ ] `/about` (About Municipality)
- [ ] `/governance` (Municipal Governance)
- [ ] `/services` (Services Overview)
- [ ] `/projects` (Projects Platform)
- [ ] `/public-participation` (Public Participation)
- [ ] `/investment` (Investment Information)
- [ ] `/resources` (Document Centre)
- [ ] `/news` (News & Announcements)
- [ ] `/contact` (Contact Page)
- [ ] `/feedback` (Citizen Feedback)
- [ ] `/privacy` (Privacy Policy)
- [ ] `/terms` (Terms of Use)
- [ ] `/accessibility` (Accessibility Statement)
- [ ] `/sitemap-page` (Human-Readable Sitemap)

**Expected:** All pages load without errors  
**Blocker:** Yes

#### Dynamic Routes
- [ ] `/services/waste-management` (sample service)
- [ ] `/services/urban-planning` (sample service)
- [ ] `/news/[slug]` (any news article)
- [ ] `/projects/[slug]` (when content added)

**Expected:** Dynamic routes render correctly  
**Blocker:** No (depends on content)

#### Error Pages
- [ ] `/nonexistent-page` → 404 page displays
- [ ] `/admin` without login → redirects to `/admin/login`

**Expected:** Proper error handling  
**Blocker:** No

#### Admin Routes (Authenticated)
- [ ] `/admin/login` (Login page)
- [ ] `/admin` (Dashboard) — requires authentication
- [ ] `/admin/news` (News management)
- [ ] `/admin/projects` (Project management)
- [ ] `/admin/submissions` (Submission management)

**Expected:** Admin area functional  
**Blocker:** No (admin optional for initial launch)

### Functionality Testing

#### Navigation
- [ ] **Desktop Header Navigation**
  - [ ] Logo links to homepage
  - [ ] All menu items clickable
  - [ ] Dropdown menus open/close correctly
  - [ ] Active page highlighted

- [ ] **Mobile Navigation**
  - [ ] Hamburger menu opens/closes
  - [ ] All links accessible
  - [ ] No layout breaks at 360px, 375px, 390px, 430px

- [ ] **Footer Navigation**
  - [ ] Quick links work
  - [ ] Resource links work
  - [ ] Legal links work
  - [ ] County website link opens (external)

- [ ] **Breadcrumbs**
  - [ ] Display on content pages
  - [ ] Links work correctly
  - [ ] Home → Parent → Current hierarchy

**Blocker:** Yes (navigation is critical)

#### Search & Filtering

- [ ] **Document Centre Search**
  - [ ] Search by title works
  - [ ] Category filter works
  - [ ] Year filter works
  - [ ] Combined filters work
  - [ ] Clear filters button works
  - [ ] Result count displays correctly

- [ ] **News Filtering**
  - [ ] Category filter works (Municipal News, Public Notices, etc.)
  - [ ] Demo articles excluded from main feed

- [ ] **Project Filtering**
  - [ ] Status filter works (when content added)
  - [ ] Category filter works (when content added)

- [ ] **Site-Wide Search Dialog**
  - [ ] Opens with keyboard shortcut (Cmd/Ctrl+K)
  - [ ] Closes with Escape
  - [ ] Searches across content types
  - [ ] Results display correctly

**Blocker:** No (search is enhancement)

#### Forms (Demonstration Mode)

- [ ] **Contact Form**
  - [ ] Validation works (name, email, subject, message)
  - [ ] Demo notice displays clearly
  - [ ] Preview shows correctly
  - [ ] Nothing transmitted to server
  - [ ] Clear form button works

- [ ] **Feedback Form**
  - [ ] Validation works (all fields)
  - [ ] Demo notice displays clearly
  - [ ] Preview shows correctly
  - [ ] File selection shows filename (not uploaded)
  - [ ] Nothing transmitted to server

- [ ] **Public Participation Form** (if active)
  - [ ] Similar validation and demo behavior

**Expected:** Forms demonstrate UX but don't submit  
**Blocker:** No (forms are demonstration-only)

#### Document Centre

- [ ] **Document Links**
  - [ ] Test 5 random document download links
  - [ ] Verify files open correctly
  - [ ] Check file sizes match
  - [ ] Confirm links point to County repository

- [ ] **Document Cards**
  - [ ] Verification badges display correctly
  - [ ] File sizes shown
  - [ ] Publication dates shown
  - [ ] Notes display where present

- [ ] **Document Source Attribution**
  - [ ] "Official documents page" link works
  - [ ] County repository link opens correctly

**Blocker:** Yes (document access is core functionality)

### Security Testing

#### Firebase Security Rules

- [ ] **Firestore Rules (Client Access Denied)**
  ```bash
  # Use Firebase Emulator or manually test:
  # Try to read any collection from browser console
  firebase.firestore().collection('submissions').get()
  ```
  **Expected:** Permission denied error  
  **Blocker:** Yes (critical security)

- [ ] **Storage Rules (Client Access Denied)**
  ```bash
  # Try to access storage directly
  firebase.storage().ref('private/test.pdf').getDownloadURL()
  ```
  **Expected:** Permission denied error  
  **Blocker:** Yes (critical security)

#### Authentication & Session Management

- [ ] **Admin Login**
  - [ ] Login with valid credentials succeeds
  - [ ] Invalid credentials rejected
  - [ ] Rate limiting triggers after 5 failed attempts
  - [ ] Session cookie created (HTTP-only, secure)

- [ ] **Session Persistence**
  - [ ] Refresh page maintains session
  - [ ] Session expires after TTL (8 hours default)
  - [ ] Logout destroys session

- [ ] **Protected Routes**
  - [ ] `/admin/*` requires authentication
  - [ ] Unauthenticated access redirects to login
  - [ ] Session timeout redirects to login

**Blocker:** No (admin is optional for initial launch)

#### RBAC (Role-Based Access Control)

- [ ] **Permission Checks**
  - [ ] Admin can create/edit content
  - [ ] Editor can edit but not delete
  - [ ] Viewer can only read
  - [ ] Manager has all permissions

**Blocker:** No (admin is optional)

#### Rate Limiting

- [ ] **Submission Rate Limit**
  - [ ] Submit form 6 times in quick succession
  - [ ] Expected: 6th submission blocked

- [ ] **Login Rate Limit**
  - [ ] Try 6 failed logins
  - [ ] Expected: 6th attempt blocked

**Blocker:** No (forms are demonstration-only)

#### CSRF Protection

- [ ] **Same-Origin Enforcement**
  - [ ] Server Actions reject cross-origin requests
  - [ ] Forms submit successfully from same origin

**Blocker:** Yes (security-critical)

### SEO Testing

#### Metadata Verification

- [ ] **Homepage Metadata**
  ```html
  <title>Iten-Tambach Municipality | County Government of Elgeyo Marakwet</title>
  <meta name="description" content="...">
  <link rel="canonical" href="https://.../">
  <meta property="og:title" content="...">
  <meta property="og:image" content=".../og-image.svg">
  ```

- [ ] **Page-Specific Metadata**
  - [ ] Each page has unique title
  - [ ] Each page has unique description
  - [ ] Canonical URLs are absolute
  - [ ] OG image is 1200×630

**Tool:** View page source or use SEO browser extension  
**Blocker:** No

#### Sitemap & Robots

- [ ] **XML Sitemap**
  - [ ] Access `/sitemap.xml`
  - [ ] Verify 25+ URLs listed
  - [ ] Verify demo content excluded
  - [ ] Verify lastmod dates reasonable

- [ ] **Robots.txt**
  - [ ] Access `/robots.txt`
  - [ ] Verify sitemap URL present
  - [ ] Verify `/admin-preview` disallowed
  - [ ] Verify `/` allowed

**Tool:** Direct URL access  
**Blocker:** No

#### Structured Data

- [ ] **JSON-LD Validation**
  - [ ] Use Google Rich Results Test
  - [ ] Test homepage (GovernmentOrganization)
  - [ ] Test content page (BreadcrumbList)
  - [ ] No errors reported

**Tool:** https://search.google.com/test/rich-results  
**Blocker:** No

#### Google Search Console

- [ ] **Site Verification**
  - [ ] Add property to Search Console
  - [ ] Verify ownership
  - [ ] Submit sitemap
  - [ ] Monitor for crawl errors

**Blocker:** No (post-launch is acceptable)

### Accessibility Testing

#### Automated Tools

- [ ] **Lighthouse Accessibility Audit**
  ```bash
  # Chrome DevTools → Lighthouse → Run audit
  ```
  **Target:** Score ≥ 95  
  **Blocker:** No (manual testing more important)

- [ ] **axe DevTools Extension**
  - [ ] Install axe browser extension
  - [ ] Scan homepage
  - [ ] Scan 3 content pages
  - [ ] Address critical/serious issues

**Blocker:** No

- [ ] **WAVE Tool**
  - [ ] Visit https://wave.webaim.org/
  - [ ] Test homepage
  - [ ] Review errors/alerts

**Blocker:** No

#### Manual Testing

- [ ] **Keyboard Navigation**
  - [ ] Tab through entire page
  - [ ] All interactive elements reachable
  - [ ] Focus indicators visible
  - [ ] Tab order logical
  - [ ] Escape closes modals/dropdowns
  - [ ] Enter activates buttons/links
  - [ ] No keyboard traps

**Blocker:** Yes (critical for accessibility)

- [ ] **Screen Reader Testing (NVDA/JAWS/VoiceOver)**
  - [ ] Navigate homepage with screen reader
  - [ ] All headings announced
  - [ ] All links have meaningful text
  - [ ] Form labels announced
  - [ ] Error messages announced
  - [ ] Landmarks navigable

**Tool:** NVDA (Windows free), VoiceOver (macOS built-in)  
**Blocker:** Yes (government accessibility requirement)

- [ ] **Color Contrast**
  - [ ] Use browser DevTools contrast checker
  - [ ] Verify text meets WCAG AA (4.5:1)
  - [ ] Verify large text meets WCAG AA (3:1)
  - [ ] Check focus indicators

**Tool:** Chrome DevTools → Elements → Inspect  
**Blocker:** Yes

- [ ] **Zoom to 200%**
  - [ ] Browser zoom to 200% (Cmd/Ctrl + +)
  - [ ] No horizontal scrolling
  - [ ] All content readable
  - [ ] No text cutoff

**Blocker:** Yes

- [ ] **Touch Target Sizes**
  - [ ] Mobile device: all tap targets ≥ 44×44px
  - [ ] Sufficient spacing between targets
  - [ ] No accidental taps

**Tool:** Mobile device testing  
**Blocker:** Yes

### Performance Testing

#### Lighthouse Performance Audit

- [ ] **Run Lighthouse on Production**
  ```bash
  # Chrome DevTools → Lighthouse → Performance
  ```
  **Targets:**
  - Performance: ≥ 90
  - Accessibility: ≥ 95
  - Best Practices: ≥ 95
  - SEO: ≥ 95

**Blocker:** No (optimizations can follow launch)

#### Core Web Vitals

- [ ] **LCP (Largest Contentful Paint)**
  - [ ] Target: < 2.5s
  - [ ] Measure on 3G connection

- [ ] **FID (First Input Delay)**
  - [ ] Target: < 100ms

- [ ] **CLS (Cumulative Layout Shift)**
  - [ ] Target: < 0.1
  - [ ] Check for image/font layout shifts

**Tool:** Lighthouse, Chrome DevTools → Performance  
**Blocker:** No

#### Mobile Device Testing

- [ ] **Test on Real Devices**
  - [ ] Android phone (Chrome)
  - [ ] iPhone (Safari)
  - [ ] Tablet (any)

- [ ] **Mobile Performance**
  - [ ] Test on 3G connection (Chrome DevTools throttling)
  - [ ] Pages load within 5 seconds
  - [ ] Images load progressively
  - [ ] No excessive JavaScript execution

**Blocker:** No (but highly recommended)

#### Image Optimization

- [ ] **Verify Modern Formats**
  - [ ] Images serve AVIF where supported
  - [ ] Fallback to WebP
  - [ ] Fallback to JPEG/PNG

**Tool:** Network tab → Check image responses  
**Blocker:** No

### Content Verification

#### Document Library

- [ ] **All 32 Documents Listed**
  - [ ] Titles match County source
  - [ ] Categories correct
  - [ ] Years correct
  - [ ] File sizes correct

- [ ] **Verification Status Accurate**
  - [ ] 11 content-confirmed
  - [ ] 19 file-only
  - [ ] 1 source-page-only

- [ ] **Links Working**
  - [ ] Test all document download links
  - [ ] Verify files open
  - [ ] Check no 404 errors

**Blocker:** Yes (document access is core)

#### News & Announcements

- [ ] **Demo Content Labeled**
  - [ ] Sample articles show "Demonstration" label
  - [ ] Demo notice explains status
  - [ ] Demo content excluded from homepage feed

- [ ] **Real Content (when added)**
  - [ ] Only verified articles published
  - [ ] Publication dates correct
  - [ ] Categories correct

**Blocker:** No (demo state is acceptable)

#### Projects

- [ ] **Empty State Displays**
  - [ ] "No verified project records" message shows
  - [ ] Professional tone maintained
  - [ ] Explanation clear

- [ ] **Demo Projects Hidden**
  - [ ] Sample projects not on homepage
  - [ ] Sample projects not in sitemap
  - [ ] Sample projects accessible for review (admin)

**Blocker:** No (empty state is acceptable)

#### Contact Information

- [ ] **Contact Details Display**
  - [ ] Phone: [unverified legacy contact detail removed — do not republish]
  - [ ] Email: [unverified legacy contact detail removed — do not republish]
  - [ ] Address: Opposite County Assembly, behind IEBC offices, Iten
  - [ ] Postal: [unverified legacy contact detail removed — do not republish]

- [ ] **Pending Verification Notice**
  - [ ] Notice displays where contact info shown
  - [ ] Explains approval status

**Blocker:** Yes (must be accurate before launch)

---

## MUNICIPAL APPROVAL (WEEK 2)

### Content Approval

- [ ] **Contact Information Confirmation**
  - [ ] Phone number confirmed in writing
  - [ ] Email address confirmed in writing
  - [ ] Physical address confirmed in writing
  - [ ] Postal address confirmed in writing
  - [ ] Officer name for privacy enquiries designated

**Authority:** Municipal Manager or Board Chairman  
**Document:** Signed approval letter  
**Blocker:** Yes

- [ ] **About Page Content**
  - [ ] Mission/vision approved
  - [ ] Institutional description approved
  - [ ] History/background approved

**Authority:** Municipal Manager  
**Blocker:** Yes

- [ ] **Services Descriptions**
  - [ ] All 10 service descriptions reviewed
  - [ ] No misleading claims
  - [ ] Aligned with actual service delivery

**Authority:** Municipal Manager  
**Blocker:** No (informational)

- [ ] **Document Library Content**
  - [ ] Verify all 32 documents are official
  - [ ] Confirm verification statuses honest
  - [ ] Approve document descriptions

**Authority:** Municipal Manager  
**Blocker:** Yes

### Legal Approval

- [ ] **Privacy Policy**
  - [ ] Legal review by County legal officer
  - [ ] Data protection compliance verified
  - [ ] Privacy contact designated
  - [ ] Status changed from "draft" to "approved"

**Authority:** County Government Legal Officer  
**Document:** Legal opinion memo  
**Blocker:** Yes (before activating forms)

- [ ] **Terms of Use**
  - [ ] Legal review completed
  - [ ] Limitation of liability approved
  - [ ] Governing law confirmed

**Authority:** County Government Legal Officer  
**Blocker:** No

- [ ] **Accessibility Statement**
  - [ ] Review for accuracy
  - [ ] Approve accessibility contact details

**Authority:** Municipal Manager  
**Blocker:** No

### Photography & Branding

- [ ] **Photo Licensing Confirmed**
  - [ ] Verify all photos licensed for use
  - [ ] Attribute photographer if required
  - [ ] Confirm no copyright infringement

**Authority:** County Communications or Legal  
**Blocker:** Yes

- [ ] **County Crest Usage**
  - [ ] Confirm crest usage approved
  - [ ] Verify branding guidelines followed

**Authority:** County Communications  
**Blocker:** Yes

- [ ] **Municipality Logo/Branding**
  - [ ] If custom logo exists, confirm usage rights
  - [ ] Verify color scheme approved

**Authority:** Municipal Manager or Board  
**Blocker:** No

### Data Protection Compliance

- [ ] **Kenya Data Protection Act, 2019**
  - [ ] Lawful basis for processing determined (Art. 27)
  - [ ] Data controller designated
  - [ ] Data processor agreements (if applicable)
  - [ ] Retention policy defined and approved
  - [ ] Access/correction procedures established
  - [ ] Breach notification procedures defined
  - [ ] Registration with Data Commissioner (if required)

**Authority:** County Data Protection Officer (if exists) or Legal  
**Blocker:** Yes (before activating forms)

- [ ] **GDPR Compliance (if EU visitors expected)**
  - [ ] Privacy notice compliant with Art. 13/14
  - [ ] Legal basis documented
  - [ ] International transfer safeguards (if data leaves Kenya)

**Authority:** Legal Officer  
**Blocker:** No (unless significant EU audience)

---

## TECHNICAL FINALIZATION (WEEK 3)

### Email Provider Configuration (Optional — Forms Only)

- [ ] **Resend Account Setup**
  - [ ] Create Resend account
  - [ ] Verify sending domain
  - [ ] Obtain API key
  - [ ] Add to environment variables

**Required Variables:**
```bash
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_...
EMAIL_FROM=notifications@iten-tambach-municipality.go.ke
MUNICIPAL_NOTIFICATIONS_EMAIL=[unverified legacy contact detail removed — do not republish]
```

**Blocker:** No (only if activating forms)

- [ ] **Test Email Delivery**
  - [ ] Send test notification
  - [ ] Verify receipt at municipal email
  - [ ] Check email formatting
  - [ ] Test with real submission

**Blocker:** No (only if activating forms)

### Monitoring Setup

- [ ] **Vercel Analytics**
  - [ ] Enable in Vercel dashboard
  - [ ] Verify tracking code present
  - [ ] Confirm data collection working

**Blocker:** No

- [ ] **Error Tracking (Optional)**
  - [ ] Consider Sentry integration
  - [ ] Or monitor Vercel error logs

**Blocker:** No

- [ ] **Uptime Monitoring**
  - [ ] Set up UptimeRobot or similar
  - [ ] Monitor homepage availability
  - [ ] Configure alerts

**Blocker:** No

- [ ] **Firebase Usage Alerts**
  - [ ] Set budget alerts in Firebase Console
  - [ ] Monitor Firestore reads/writes
  - [ ] Monitor Storage bandwidth
  - [ ] Set up billing alerts

**Blocker:** No

### Staff Training

- [ ] **Admin System Training**
  - [ ] Train municipal staff on admin login
  - [ ] Demonstrate content management
  - [ ] Show submission management
  - [ ] Explain user roles

**Audience:** Municipal staff who will manage content  
**Blocker:** No (admin optional for launch)

- [ ] **Submission Handling Procedures**
  - [ ] Document workflow for citizen submissions
  - [ ] Assign responsible officers
  - [ ] Define response times (if any)
  - [ ] Create escalation procedures

**Blocker:** No (only if activating forms)

### Documentation Finalization

- [ ] **Technical Documentation**
  - [x] AUDIT_FINDINGS.md complete
  - [x] IMPLEMENTATION_REPORT.md complete
  - [x] LAUNCH_CHECKLIST.md complete (this document)
  - [x] README.md updated

- [ ] **Operational Documentation**
  - [ ] Admin user guide (if admin active)
  - [ ] Content publishing procedures
  - [ ] Backup procedures
  - [ ] Incident response procedures

**Blocker:** No

### Backup Procedures

- [ ] **Firestore Backup Strategy**
  - [ ] Set up automated Firestore exports
  - [ ] Define backup frequency (daily recommended)
  - [ ] Define retention period (30 days minimum)
  - [ ] Test restore procedure

**Script:** `npm run backup:firestore` (if configured)  
**Blocker:** No (but highly recommended)

- [ ] **Environment Variables Backup**
  - [ ] Document all environment variables (don't commit values)
  - [ ] Store securely (password manager, vault)
  - [ ] Ensure recovery possible if Vercel account lost

**Blocker:** Yes

- [ ] **Source Code Backup**
  - [ ] Ensure git repository backed up
  - [ ] Consider secondary remote (GitLab, Bitbucket)
  - [ ] Tag release version

**Blocker:** No (git is primary backup)

---

## LAUNCH (WEEK 4)

### Soft Launch (Internal)

- [ ] **Staff Access**
  - [ ] Share URL with municipal staff
  - [ ] Provide feedback form/channel
  - [ ] Set deadline for feedback (3-5 days)

**Audience:** Iten-Tambach Municipality staff  
**Blocker:** No (but recommended)

- [ ] **County Government Preview**
  - [ ] Share with County Government officials
  - [ ] Request formal approval
  - [ ] Address any concerns

**Audience:** County leadership  
**Blocker:** No (but recommended)

### Final Security Review

- [ ] **Security Checklist Verification**
  - [ ] Firestore rules: Total client deny
  - [ ] Storage rules: Total client deny
  - [ ] Authentication: Server-side sessions
  - [ ] HTTPS only: Enforced
  - [ ] Security headers: Present
  - [ ] CSRF protection: Active
  - [ ] Rate limiting: Configured
  - [ ] Environment variables: No secrets exposed

**Blocker:** Yes

- [ ] **Vulnerability Scan (Optional)**
  - [ ] Consider OWASP ZAP scan
  - [ ] Or manual security testing

**Blocker:** No

### Public Launch

- [ ] **DNS Configuration (if custom domain)**
  - [ ] Update DNS records
  - [ ] Wait for propagation (24-48 hours)
  - [ ] Verify domain resolves
  - [ ] Verify SSL certificate

**Blocker:** Yes (if using custom domain)

- [ ] **Final Smoke Test**
  - [ ] Visit homepage
  - [ ] Test 5 random links
  - [ ] Verify no errors in browser console
  - [ ] Check mobile responsiveness

**Blocker:** Yes

- [ ] **Go-Live Announcement**
  - [ ] Publish launch announcement on County website
  - [ ] Social media posts (if applicable)
  - [ ] Press release (if applicable)
  - [ ] Internal communications

**Authority:** County Communications  
**Blocker:** No

### Post-Launch Monitoring (First 24 Hours)

- [ ] **Monitor Error Logs**
  - [ ] Check Vercel logs for errors
  - [ ] Check Firebase logs for issues
  - [ ] Address critical errors immediately

**Frequency:** Every 2 hours for first 24 hours  
**Blocker:** N/A (post-launch)

- [ ] **Monitor Traffic**
  - [ ] Verify analytics tracking
  - [ ] Monitor server response times
  - [ ] Check for unusual patterns

- [ ] **User Feedback**
  - [ ] Monitor contact channels
  - [ ] Note any reported issues
  - [ ] Prioritize fixes

### Post-Launch (First 30 Days)

- [ ] **Performance Monitoring**
  - [ ] Review Core Web Vitals (Google Search Console)
  - [ ] Check Lighthouse scores weekly
  - [ ] Identify performance bottlenecks

- [ ] **SEO Monitoring**
  - [ ] Check indexing status (Google Search Console)
  - [ ] Monitor for crawl errors
  - [ ] Verify sitemap processing

- [ ] **Content Updates**
  - [ ] Publish first verified project (when ready)
  - [ ] Publish first official announcement (when ready)
  - [ ] Update document library (if new documents)

- [ ] **User Feedback Collection**
  - [ ] Survey municipal staff
  - [ ] Collect citizen feedback
  - [ ] Identify improvement priorities

---

## FORM ACTIVATION (FUTURE PHASE)

### Prerequisites (All Must Be Complete)

- [ ] Email provider configured and tested
- [ ] Privacy policy legally approved
- [ ] Data protection registration complete (if required)
- [ ] Municipal authorization obtained
- [ ] Privacy contact designated
- [ ] Retention policy defined
- [ ] Access/correction procedures established
- [ ] Staff trained on submission handling
- [ ] Backup procedures in place

**Blocker:** Yes (all items)

### Technical Activation

- [ ] **Update Form Components**
  - [ ] Remove `useDemoForm` hook
  - [ ] Wire up `submitSubmissionAction`
  - [ ] Remove `<DemoNotice>` component
  - [ ] Add submission success/error states

**Files to modify:**
- `components/forms/ContactForm.tsx`
- `components/forms/FeedbackForm.tsx`
- `components/forms/ParticipationForm.tsx` (if used)

- [ ] **Update Privacy Policy**
  - [ ] Change status from "draft" to "approved"
  - [ ] Update "Information NOT collected" section
  - [ ] Move to "Information collected and how we use it"
  - [ ] Add approved retention period
  - [ ] Add privacy contact details

**File:** `app/privacy/page.tsx`

- [ ] **Test Submission Flow**
  - [ ] Submit test form
  - [ ] Verify Firestore storage
  - [ ] Verify email notifications sent
  - [ ] Verify reference number generated
  - [ ] Test admin submission view

- [ ] **Monitor Initial Submissions**
  - [ ] Check for errors
  - [ ] Verify workflow working
  - [ ] Staff response times acceptable

---

## ROLLBACK PROCEDURES

### If Critical Issue Found Post-Launch

- [ ] **Immediate Actions**
  - [ ] Document the issue
  - [ ] Assess severity
  - [ ] Communicate to stakeholders

- [ ] **Rollback Options**

  **Option 1: Revert to Previous Deployment**
  ```bash
  # In Vercel dashboard:
  # Deployments → Find previous deployment → Promote to Production
  ```

  **Option 2: Put Up Maintenance Page**
  - Update homepage to show "Under Maintenance"
  - Provide contact information
  - Set expected resolution time

  **Option 3: Hot Fix**
  - Fix issue in codebase
  - Deploy fix immediately
  - Monitor for resolution

- [ ] **Post-Issue Actions**
  - [ ] Root cause analysis
  - [ ] Update procedures to prevent recurrence
  - [ ] Communicate resolution to stakeholders

---

## SIGN-OFF

### Technical Sign-Off

**I confirm that all technical blocking items are complete:**

- [ ] Production build succeeds
- [ ] All critical routes load
- [ ] Firebase security rules validated
- [ ] Authentication functional (if admin active)
- [ ] Document links verified
- [ ] Mobile responsiveness tested
- [ ] Accessibility tested (keyboard, screen reader, contrast)
- [ ] Security review complete

**Technical Lead:** ________________________  
**Date:** _______________

### Municipal Approval Sign-Off

**I confirm that all content and legal approvals are obtained:**

- [ ] Contact information confirmed
- [ ] About page content approved
- [ ] Document library verified
- [ ] Privacy policy approved (if forms active)
- [ ] Photo licensing confirmed
- [ ] County crest usage approved

**Municipal Manager:** ________________________  
**Date:** _______________

### County Government Sign-Off

**I approve this website for public launch:**

- [ ] Content represents the Municipality accurately
- [ ] Legal compliance verified
- [ ] County branding properly used
- [ ] No reputational risk identified

**County Government Representative:** ________________________  
**Title:** ________________________  
**Date:** _______________

---

## LAUNCH STATUS SUMMARY

### Can Launch Immediately With:
✅ Document centre (32 documents)  
✅ Services information  
✅ About/governance pages  
✅ News platform (ready for content)  
✅ Projects platform (ready for content)  
✅ Contact information (pending final confirmation)  
✅ Forms in demonstration mode  

### Cannot Launch Until:
⚠️ Contact information confirmed in writing  
⚠️ Photography rights verified  
⚠️ Manual accessibility testing complete  
⚠️ Production build succeeds  

### Can Activate Later (Post-Launch):
⏳ Forms (requires email + privacy approval)  
⏳ Admin CMS (optional for initial launch)  
⏳ Additional content (projects, news)  

---

**Checklist Version:** 1.0  
**Last Updated:** January 2025  
**Project:** Iten–Tambach Municipality Website  
**Prepared by:** Technical Implementation Team  

---
