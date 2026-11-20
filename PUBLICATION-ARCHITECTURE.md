# Publication Architecture Documentation

**Project:** Iten-Tambach Municipality Website  
**Documentation Date:** 20 January 2026  
**Live URL:** https://iten-tambach-municipality.vercel.app/

## Executive Summary

The municipal website is a **static Next.js 15 application** with content managed through **TypeScript data modules**. There is **no CMS, no database, and no Firebase Firestore integration** in the current production deployment.

Content updates require:
1. Editing TypeScript files in `lib/data/`
2. Committing changes to the git repository
3. Triggering a new Vercel deployment

This architecture prioritizes **simplicity, version control, and developer auditability** over administrative ease-of-use.

---

## Content Storage Model

### Static TypeScript Data (Production)

All content currently lives in typed TypeScript modules:

| File | Content Type | Record Count | Status |
|------|--------------|--------------|--------|
| `lib/data/documents.ts` | Municipal documents | 32 | County Government sources |
| `lib/data/projects.ts` | Municipal projects | 10 | **Sample/demonstration** |
| `lib/data/news.ts` | News & announcements | 8 | **Sample/demonstration** |
| `lib/data/services.ts` | Service descriptions | 8 | Production content |
| `lib/data/pages.ts` | Static page content | 15+ | Production content |

**Key characteristics:**
- ✓ Version controlled via git
- ✓ Type-safe (TypeScript interfaces)
- ✓ No runtime database queries
- ✓ Compiled into the application bundle at build time
- ✓ Changes require redeployment

### Firebase Integration Status

Firebase configuration files exist in the codebase:

- `firestore.rules` — Total client deny posture
- `storage.rules` — Storage access rules
- `firebase.json` — Firebase project configuration
- Firebase Admin SDK credentials in environment variables

**However:** Firebase is **NOT actively used** in the current public website deployment.

The Firestore rules explicitly state:
> "The public website reads Firestore ONLY through server-rendered pages and route handlers using the Firebase Admin SDK"

Analysis of the production deployment shows:
- No client-side Firestore queries
- No Firebase storage uploads from public pages
- Document data served from static TypeScript, not Firestore collections
- Firebase infrastructure prepared but not activated

### Admin CMS Status

An admin preview interface exists at `/app/admin-preview/`, but:

1. **Disabled by default** in production (returns 404)
2. **Demonstration only** — not a functional CMS
3. Controlled by `NEXT_PUBLIC_ADMIN_PREVIEW` environment variable
4. Shows mock dashboard UI, not actual admin functions

From `README.md`:
> "`NEXT_PUBLIC_ADMIN_PREVIEW` = `disabled` removes `/admin-preview` (404) and its footer link from the public site"

The live deployment has this disabled.

---

## Publication Workflow (Current)

### Content Update Process

**Step 1: Edit TypeScript files**
```
lib/data/news.ts         → Add/edit news articles
lib/data/projects.ts     → Add/edit project records
lib/data/documents.ts    → Update document metadata
lib/data/services.ts     → Modify service descriptions
lib/data/pages.ts        → Update static page content
```

**Step 2: Verify changes locally**
```bash
npm ci              # Install dependencies
npm run typecheck   # TypeScript validation
npm run lint        # Code quality checks
npm run build       # Production build test
npm run dev         # Preview at http://localhost:3000
```

**Step 3: Commit and push to repository**
```bash
git add lib/data/news.ts
git commit -m "Add announcement: Public Forum Schedule Q1 2027"
git push origin main
```

**Step 4: Vercel automatically deploys**
- Detects git push to main branch
- Runs `npm ci && npm run build`
- Deploys to production URL
- Typically completes in 2-3 minutes

### Manual Deployment Trigger

From Vercel dashboard:
1. Navigate to project "iten-tambach-municipality"
2. Deployments tab
3. Click "Redeploy" on most recent deployment
4. Select "Use existing Build Cache" or "Rebuild"

---

## Authorization Model

### Public Access (No Authentication Required)

All public pages are accessible without login:
- Home page and navigation routes
- Service descriptions
- Document library (links to County PDFs)
- News and project pages (demonstration content)
- Contact and feedback forms

### Administrative Access (Not Implemented)

The codebase contains Firebase Authentication setup files, but:
- No login page exists in production
- No admin routes are protected
- `/admin-preview` returns 404 when `NEXT_PUBLIC_ADMIN_PREVIEW` is disabled
- Role-based access control (RBAC) code exists but is unused

From `firestore.rules`:
> "Every server-side function performs its own authorisation checks (lib/auth/session.ts, lib/auth/rbac.ts)"

These auth modules exist but are not invoked by any production route.

### Firebase Security Rules

**Firestore:** Total deny
```javascript
match /{document=**} {
  allow read, write: if false;
}
```

No client (authenticated or not) can access Firestore directly.

**Storage:** (Not reviewed in this verification)

---

## Content Approval Process

### Current State: No Approval Workflow

The TypeScript data model has no built-in approval mechanism:
- No draft/published state distinction
- No moderation queue
- No approval timestamps
- No "approved by" attribution

All content in `lib/data/` is **immediately live** after deployment.

### Institutional Approval Requirements

For an authorized officer to approve publication:

**Option 1: Git-based review (Current architecture supports this)**
1. Content editor creates git branch
2. Editor commits changes to branch
3. Editor opens Pull Request (PR) on GitHub/GitLab
4. **Authorized officer reviews PR**
5. Officer approves and merges to main
6. Vercel auto-deploys merged changes

This provides:
- ✓ Diff view of exactly what changed
- ✓ Comment threads for requested changes
- ✓ Merge approval by authorized account
- ✓ Full audit trail via git history

**Option 2: Firebase-backed CMS (Not implemented)**

Would require:
- Activating Firebase Admin SDK integration
- Building admin pages with authentication
- Implementing draft/published workflow
- Adding approval timestamp fields
- Connecting admin CMS to Firestore collections
- Modifying public pages to read from Firestore instead of TypeScript

This is **not the current architecture**.

### Recommended Approval Process (Institutional)

Given the current static architecture:

1. **Municipal staff** draft content updates in a git branch
2. **Technical editor** reviews TypeScript syntax and builds locally
3. **Municipal approver** (Town Manager or designated officer) reviews content in PR
4. **Approver merges** PR to trigger deployment
5. **Post-deployment verification** of live site

Approval authority is enforced through:
- GitHub/GitLab repository permissions
- Branch protection rules (require approval before merge)
- Merge access limited to authorized accounts

---

## Content Categories and Their Sources

### 1. Municipal Documents (32 records)
**Source:** County Government of Elgeyo Marakwet official repository  
**Storage:** `lib/data/documents.ts`  
**Approval:** County Government (original documents)  
**Municipal role:** Metadata curation, categorization  
**Update frequency:** As County publishes new documents  

Documents are **not hosted** by the municipality; only metadata and links are stored.

### 2. News & Announcements (8 records)
**Source:** DEMONSTRATION CONTENT  
**Storage:** `lib/data/news.ts`  
**Status:** All marked `isSample: true`  
**SEO:** `noindex, follow`  
**Approval required:** Every sample article must be replaced before launch  

Current content is explicitly labeled as non-official.

### 3. Municipal Projects (10 records)
**Source:** DEMONSTRATION CONTENT  
**Storage:** `lib/data/projects.ts`  
**Status:** All contain "sample record" disclaimers  
**SEO:** `noindex, follow`  
**Approval required:** Replace with verified municipal project data  

Budget figures, contractors, and timelines are explicitly marked as samples.

### 4. Service Descriptions (8 services)
**Source:** Municipal services information  
**Storage:** `lib/data/services.ts`  
**Status:** Production content  
**Approval required:** Review accuracy before launch  

Generic descriptions of municipal service areas.

### 5. Static Pages (About, Governance, Contact, etc.)
**Source:** Municipal information  
**Storage:** `lib/data/pages.ts` and individual page components  
**Status:** Mixed (some verified, some pending)  
**Approval required:** Municipal legal review of claims  

Includes mandate, vision, mission, board composition, contact details.

---

## Data Flow Diagrams

### Current Architecture: Static Data Flow

```
TypeScript Data Files (lib/data/*.ts)
    ↓
Next.js Build Process (npm run build)
    ↓
Static HTML + Server Components
    ↓
Vercel CDN
    ↓
Public User's Browser
```

**No database queries at runtime.**  
**No user-generated content.**  
**No session state.**

### Future Architecture: Firestore-Backed CMS (If Implemented)

```
Admin User → Firebase Auth → Admin Dashboard (authenticated)
    ↓
Draft Content → Firestore (drafts collection)
    ↓
Approval Action → Update status field to "published"
    ↓
Public Pages → Firebase Admin SDK (server-side)
    ↓
Read published content → Render server component
    ↓
Serve to public user
```

This would require:
- Admin authentication pages
- Firestore collection schema
- Published/draft status field
- Server-side data fetching
- Cache invalidation strategy

**This is NOT the current implementation.**

---

## Redeployment Requirements

### Content Changes Requiring Redeployment

Since all content is compiled at build time, these changes require redeployment:

- ✓ Adding/editing news articles
- ✓ Adding/editing project records
- ✓ Updating document metadata
- ✓ Modifying service descriptions
- ✓ Changing static page text
- ✓ Updating contact information
- ✓ Adding new routes or pages

### Changes NOT Requiring Redeployment

Very limited:
- County Government updating their own PDF files (URLs stay the same)
- External link destinations changing (if URL unchanged)

### Deployment Frequency Considerations

**Advantages of redeploy-required architecture:**
- Every change is version-controlled
- Rollback is trivial (redeploy previous commit)
- No runtime database dependencies
- Predictable performance (no query overhead)
- Lower operational complexity

**Disadvantages:**
- 2-3 minute deployment time per update
- Requires git/GitHub knowledge
- No instant "publish now" button for non-technical staff
- High-frequency updates (multiple per day) are awkward

**Suitability for municipal use case:**

Municipal websites typically update:
- **News/announcements:** 1-3 times per week
- **Project records:** 1-2 times per month
- **Document metadata:** When County publishes (sporadic)
- **Static pages:** Rarely (quarterly or less)

A 2-3 minute deployment delay is **acceptable** for this frequency.

---

## Security Verification

### No Public Write Access

Current security posture:
- ✓ Public users cannot create content
- ✓ Public users cannot edit content
- ✓ Public users cannot delete content
- ✓ All content is read-only from TypeScript files
- ✓ Feedback form submissions (if implemented) would need server-side validation

### Firebase Rules: Total Deny Posture

From `firestore.rules`:
```
match /{document=**} {
  allow read, write: if false;
}
```

**Interpretation:**
- No browser (authenticated or not) can access Firestore
- All Firestore access must go through Firebase Admin SDK (server-side)
- Client-side JavaScript cannot query or mutate data

**Status:** ✓ SECURE  
**Caveat:** Firestore is not used in production, so this is preventive hardening

### Admin Routes: Disabled in Production

`/admin-preview` returns HTTP 404 when `NEXT_PUBLIC_ADMIN_PREVIEW` != "enabled"

**Status:** ✓ SECURE (no admin interface exposed)

### Server Actions and API Routes

(Not comprehensively reviewed in this verification)

Files exist in:
- `app/api/` — API route handlers
- `lib/actions/` — Server Actions

These would need individual security review if they process user input.

---

## Recommendations

### For Informational Launch (Current Architecture)

**APPROVE** the static TypeScript architecture for:
- ✓ Document library (metadata only, links to County)
- ✓ Static pages (About, Governance, Services, Contact)
- ✓ Municipal vision, mission, values

**DO NOT PUBLISH** until:
- ✗ All sample news articles replaced or removed
- ✗ All sample project records replaced or removed
- ✗ Contact details verified
- ✗ Municipal approver designated and trained on git PR approval

### For Future Enhancement (Optional)

If the municipality requires:
- Frequent content updates (daily)
- Non-technical staff publishing directly
- Draft/approval workflow in a web UI

Then consider:
1. Activating Firebase Firestore integration
2. Building admin CMS with authentication
3. Implementing publish/draft workflow
4. Training staff on web-based content editor

**Estimated effort:** 2-4 weeks of development + testing

**Cost:** Low (Firebase free tier likely sufficient)

**Risk:** Increased operational complexity, requires ongoing maintenance

### For Current Static Architecture

**Advantages to keep:**
- Version control = full audit trail
- Git history = rollback capability
- No database = no runtime failures
- TypeScript = compile-time validation
- Simple hosting = lower costs

**Process improvements:**
1. Document git workflow for municipal staff
2. Create content templates for news/projects
3. Establish PR approval checklist
4. Train designated approver on GitHub PR reviews

---

## Appendix: Key File Locations

### Content Data
```
lib/data/documents.ts    → 32 County document records
lib/data/news.ts         → 8 sample news articles
lib/data/projects.ts     → 10 sample project records
lib/data/services.ts     → 8 service descriptions
lib/data/pages.ts        → Static page content
```

### Configuration
```
package.json             → Dependencies and scripts
next.config.mjs          → Next.js configuration
.env.local               → Local environment variables (not in git)
.env.example             → Environment variable template
```

### Firebase Setup (Dormant)
```
firestore.rules          → Total deny rules
storage.rules            → Storage access rules
firebase.json            → Firebase project config
lib/firebase/            → Firebase SDK wrappers (unused in production)
```

### Admin Interface (Disabled)
```
app/admin-preview/       → Demo admin dashboard (404 in production)
lib/auth/                → Auth and RBAC modules (unused)
```

### Deployment
```
.vercel/                 → Vercel deployment metadata
vercel.json              → Vercel configuration (if exists)
.github/workflows/       → GitHub Actions (if exists)
```

---

## Conclusion

The Iten-Tambach Municipality website operates as a **static Next.js application with TypeScript-based content management**. 

There is:
- **No active CMS**
- **No database queries at runtime**
- **No Firebase Firestore integration in production**
- **No user authentication system**

Content updates require editing TypeScript files, committing to git, and triggering a Vercel redeployment.

This architecture is:
- ✓ Secure (no public write access)
- ✓ Auditable (git history)
- ✓ Simple (no database dependencies)
- ✓ Suitable for low-frequency updates

Institutional approval should be implemented through **git Pull Request workflows** with designated approvers holding merge permissions.

---

**Documentation completed:** 20 January 2026  
**Verified against:** Production deployment at iten-tambach-municipality.vercel.app  
**Source code inspection:** Commit history, `lib/data/` modules, Firebase rules, admin routes
