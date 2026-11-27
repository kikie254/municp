/**
 * Canonical origin of the deployed site.
 * Set NEXT_PUBLIC_SITE_URL in the hosting environment (see .env.example).
 * VERCEL_PROJECT_PRODUCTION_URL is used as the stable fallback.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
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
  tagline: "A town of choice for sports, tourism and investment.",
  url: resolveSiteUrl(),
  description:
    "Information about Iten-Tambach Municipality, its statutory role, municipal services, public participation and development resources.",
  contactVerification: "confirmed" as "pending" | "confirmed",
  contact: {
    office: "Iten Municipality Office",
    physical: "Opposite County Assembly, behind IEBC offices, Iten, Kenya",
    phone: "+254726780634",
    phoneDisplay: "+254 726 780 634",
    email: "iten.municipality@gmail.com",
    postal: "P.O. Box 220-30700, Iten, Kenya",
    sourceUrl: "https://elgeyomarakwet.go.ke/office-of-the-municipal-manager/",
    mapQuery: "MGF4+3CF, Kapkessum Road, Iten, Kenya",
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
      { label: "About the Municipality", href: "/about", description: "History, statutory objects, vision and mission" },
      { label: "Municipal Governance", href: "/governance", description: "The Municipal Board and administration" },
    ],
  },
  {
    label: "Governance",
    href: "/governance",
    children: [
      { label: "Governance Overview", href: "/governance", description: "Institutional roles and public accountability" },
      { label: "Integrated Development Plan", href: "/development-plan", description: "IDeP priorities, programme estimates and implementation framework" },
      { label: "Documents and Resources", href: "/resources", description: "Charter, plans, policies and reports" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All Municipal Services", href: "/services", description: "Service areas and municipal responsibilities" },
      { label: "Complaints and Feedback", href: "/feedback", description: "Submit a concern or suggestion" },
    ],
  },
  { label: "Projects", href: "/projects" },
  {
    label: "Public Participation",
    href: "/public-participation",
    children: [
      { label: "Participation Overview", href: "/public-participation", description: "Citizen fora, notices and reports" },
      { label: "Citizen Feedback", href: "/feedback", description: "Submit concerns and suggestions" },
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
  { label: "Integrated Development Plan", href: "/development-plan" },
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
 * Administration preview is disabled by default. Genuine administration uses
 * authenticated server-side role checks and audit logging.
 */
export const adminPreviewEnabled = process.env.NEXT_PUBLIC_ADMIN_PREVIEW === "enabled";

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Sitemap", href: "/sitemap-page" },
  ...(adminPreviewEnabled ? [{ label: "Administration Preview", href: "/admin-preview" }] : []),
];
