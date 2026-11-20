/**
 * Canonical origin of the deployed site.
 * Set NEXT_PUBLIC_SITE_URL in the hosting environment (see .env.example).
 * Falls back to Vercel's production domain, then to localhost for local development.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  // VERCEL_PROJECT_PRODUCTION_URL is the stable production domain. VERCEL_URL is deliberately
  // NOT used: it resolves to a per-deployment preview host, which must never reach canonical,
  // Open Graph or sitemap output.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const raw = explicit || (vercel ? `https://${vercel}` : "http://localhost:3000");
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

export const site = {
  name: "Iten-Tambach Municipality",
  shortName: "Iten-Tambach",
  county: "County Government of Elgeyo Marakwet",
  republic: "Republic of Kenya",
  tagline: "Building a better, cleaner, inclusive and vibrant municipality.",
  url: resolveSiteUrl(),
  description:
    "Iten-Tambach Municipality, County Government of Elgeyo Marakwet. Municipal services, public participation, official documents and announcements.",
  /**
   * CONTACT DETAILS — REMOVED PENDING WRITTEN CONFIRMATION.
   * Contact information has been removed until the Municipality provides verified contact details
   * in writing. The postal address is retained as it appears on County-published documents.
   * All phone numbers and email addresses have been removed.
   */
  contactVerification: "pending" as "pending" | "confirmed",
  contact: {
    office: "Iten Municipality Office",
    physical: "Opposite County Assembly, behind IEBC offices, Iten, Kenya",
    phone: null,
    phoneDisplay: null,
    email: null,
    postal: "P.O. Box 220-30700, Iten, Kenya",
  },
  countyWebsite: "https://elgeyomarakwet.go.ke/",
  documentSource: "https://elgeyomarakwet.go.ke/iten-municipality-documents/",
} as const;

export type NavChild = { label: string; href: string; description?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About the Municipality", href: "/about", description: "Mandate, vision, mission and core values" },
      { label: "Municipal Governance", href: "/governance", description: "The Board, Manager and administration" },
    ],
  },
  {
    label: "Governance",
    href: "/governance",
    children: [
      { label: "Governance Overview", href: "/governance", description: "Institutional structure and accountability" },
      { label: "Documents and Resources", href: "/resources", description: "Charter, plans, policies and reports" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All Municipal Services", href: "/services", description: "Urban management and service information" },
      { label: "Complaints and Feedback", href: "/feedback", description: "Raise a concern or share a suggestion" },
    ],
  },
  { label: "Projects", href: "/projects" },
  {
    label: "Public Participation",
    href: "/public-participation",
    children: [
      { label: "Participation Overview", href: "/public-participation", description: "Forums, notices and reports" },
      { label: "Citizen Feedback", href: "/feedback", description: "Channels for concerns and suggestions" },
    ],
  },
  { label: "Investment", href: "/investment" },
  { label: "Resources", href: "/resources" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Governance", href: "/governance" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Public Participation", href: "/public-participation" },
  { label: "Investment", href: "/investment" },
  { label: "Contact", href: "/contact" },
];

export const resourceLinks = [
  { label: "Municipal Charter", href: "/resources?category=Municipal+Charter" },
  { label: "Development Plans", href: "/resources?category=Integrated+Development+Plans" },
  { label: "Investment Plans", href: "/resources?category=Investment+Plans" },
  { label: "Public Notices", href: "/news?filter=Public+Notices" },
  { label: "Financial Reports", href: "/resources?category=Budgets+and+Financial+Reports" },
  { label: "Grievance Redress", href: "/resources?category=Grievance+Redress+Documents" },
];

/**
 * ADMINISTRATION PREVIEW — DISABLED BY DEFAULT (Phase 1)
 * -----------------------------------------------------
 * The screen is a static, unauthenticated layout demonstration. It holds no data and accepts no
 * input, but it is not an administration portal and must not be reachable as if it were one.
 *
 * Phase 1 removed the previous `?key=<value>` query-parameter gate: a secret in a URL is written
 * to browser history, proxy logs and Referer headers, and it implies an authentication system
 * that does not exist. In its place the entry point is withdrawn by default and can only be
 * re-enabled deliberately for a review build:
 *
 *   NEXT_PUBLIC_ADMIN_PREVIEW=enabled
 *
 * When the flag is absent (the default) the route 404s, the footer/sitemap/navigation entries are
 * not rendered, and nothing invites a visitor to look for an administration area. Genuine
 * administrative access requires server-side authentication, role-based authorisation and audit
 * logging, which is out of scope for this phase — see PHASE1_AUDIT_REPORT.md §Security.
 */
export const adminPreviewEnabled = process.env.NEXT_PUBLIC_ADMIN_PREVIEW === "enabled";

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Sitemap", href: "/sitemap-page" },
  ...(adminPreviewEnabled ? [{ label: "Administration Preview", href: "/admin-preview" }] : []),
];
