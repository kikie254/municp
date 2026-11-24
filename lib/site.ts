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
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : "https://" + raw;
  return withProtocol.replace(/\/+$/, "");
}

export const site = {
  name: "Iten-Tambach Municipality",
  shortName: "Iten-Tambach",
  county: "County Government of Elgeyo Marakwet",
  republic: "Republic of Kenya",
  tagline: "Municipal information and public resources for residents and stakeholders.",
  url: resolveSiteUrl(),
  description:
    "Demonstration website prepared for institutional review. Not an approved official publication of Iten-Tambach Municipality or the County Government of Elgeyo Marakwet.",
  contactVerification: "pending" as "pending" | "confirmed",
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
      { label: "About the Municipality", href: "/about", description: "Municipal profile and statutory framework; adopted charter status pending confirmation" },
      { label: "Municipal Governance", href: "/governance", description: "The Municipal Board and administration" },
    ],
  },
  {
    label: "Governance",
    href: "/governance",
    children: [
      { label: "Governance Overview", href: "/governance", description: "Institutional roles and public accountability" },
      { label: "Documents and Resources", href: "/resources", description: "County-hosted documents; adoption status requires verification" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All Municipal Services", href: "/services", description: "Service topics and responsible-authority information" },
      { label: "Complaints and Feedback", href: "/feedback", description: "Read feedback and complaint information; online submissions are disabled by default" },
    ],
  },
  { label: "Projects", href: "/projects" },
  {
    label: "Public Participation",
    href: "/public-participation",
    children: [
      { label: "Participation Overview", href: "/public-participation", description: "Participation notices and reports issued by authorised offices" },
      { label: "Citizen Feedback", href: "/feedback", description: "Read feedback and complaint information; online submissions are disabled by default" },
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
  { label: "Municipal charter documents (status to verify)", href: "/resources?category=Municipal+Charter" },
  { label: "Development Plans", href: "/resources?category=Integrated+Development+Plans" },
  { label: "Investment Plans", href: "/resources?category=Investment+Plans" },
  { label: "Public Notices", href: "/news?filter=Public+Notices" },
  { label: "Financial Reports", href: "/resources?category=Budgets+and+Financial+Reports" },
  { label: "Grievance Redress", href: "/resources?category=Grievance+Redress+Documents" },
];

/**
 * ADMINISTRATION PREVIEW — SEPARATE FROM THE AUTHENTICATED ADMIN PORTAL
 * ---------------------------------------------------------------------
 * /admin-preview is a static, unauthenticated layout demonstration and is disabled by default.
 * The real /admin routes use Firebase Authentication, server-verified sessions and role-based
 * permissions. Do not expose /admin-preview as if it were the operational dashboard.
 *
 * NEXT_PUBLIC_ADMIN_PREVIEW=enabled only controls the static preview route; it does not grant
 * access to the authenticated admin portal.
 */
export const adminPreviewEnabled = process.env.NEXT_PUBLIC_ADMIN_PREVIEW === "enabled";

export const legalLinks = [
  { label: "Demonstration Data Notice", href: "/privacy" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Sitemap", href: "/sitemap-page" },
  ...(adminPreviewEnabled ? [{ label: "Administration Preview", href: "/admin-preview" }] : []),
];
