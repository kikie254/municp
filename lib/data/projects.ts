export type ProjectStatus = "Ongoing" | "Completed" | "Planned";

export type Project = {
  slug: string;
  title: string;
  category:
    | "Urban Infrastructure"
    | "Environmental Initiatives"
    | "Community Development"
    | "Public Spaces"
    | "Trade and Enterprise";
  status: ProjectStatus;
  location: string;
  summary: string;
  description: string[];
  objectives: string[];
  startDate: string;
  completionDate: string;
  budget: string;
  implementingAgency: string;
  image: string;
  imageAlt: string;
  relatedDocuments: { label: string; href: string }[];
};

/**
 * DEMONSTRATION CONTENT NOTICE
 * ----------------------------
 * The project records below are sample entries prepared for design and
 * presentation purposes. They are not confirmed municipal projects, and no
 * figure, contractor, date or completion claim in this file should be read as
 * an official government record. Replace them with verified project data
 * supplied by the Municipality before publication.
 */
export const projects: Project[] = [
  {
    slug: "urban-cleanliness-programme",
    title: "Municipal Cleanliness and Waste Collection Programme",
    category: "Environmental Initiatives",
    status: "Ongoing",
    location: "Iten town centre and surrounding neighbourhoods",
    summary:
      "A sample programme record describing coordinated street cleansing, waste collection scheduling and public education on cleaner public spaces.",
    description: [
      "This demonstration record illustrates how an ongoing municipal cleanliness programme could be presented to residents. It describes the kind of coordinated activity that a municipality typically undertakes: scheduled collection, street cleansing, upkeep of public spaces and community awareness on responsible waste handling.",
      "The municipality's published Solid Waste Management Plan 2025 and Municipal Policy on Waste Management set out the policy direction for waste management in Iten-Tambach. The documents are available in the municipal document centre and should be read alongside any project information.",
      "No service schedule, contractor, tonnage or expenditure figure is published in this demonstration record.",
    ],
    objectives: [
      "Support cleaner and better-organised public spaces",
      "Improve the consistency of waste collection information available to residents",
      "Encourage responsible waste handling by households and businesses",
    ],
    startDate: "Sample record — not an official start date",
    completionDate: "Sample record — ongoing",
    budget: "Not published in this demonstration dataset",
    implementingAgency: "Iten-Tambach Municipality (sample record)",
    image: "/images/market-development.jpg",
    imageAlt: "Aerial view of building activity and trading streets in a Kenyan highland town",
    relatedDocuments: [
      { label: "Solid Waste Management Plan 2025", href: "/resources?q=Solid+Waste+Management+Plan" },
      { label: "Municipal Policy on Waste Management", href: "/resources?q=Waste+Management" },
    ],
  },
  {
    slug: "urban-road-and-drainage-works",
    title: "Urban Road and Drainage Improvement Works",
    category: "Urban Infrastructure",
    status: "Ongoing",
    location: "Selected town-centre streets",
    summary:
      "A sample record illustrating how road surface, footpath and drainage improvement works are typically described to the public.",
    description: [
      "This demonstration entry shows the structure used to present urban infrastructure works: the scope of works, the streets affected, the way traffic and access are managed, and where residents can raise concerns while works are under way.",
      "In practice, road and drainage works within the municipality are delivered in coordination with the County Government of Elgeyo Marakwet and the relevant national agencies. The exact allocation of responsibility depends on the applicable legal and institutional mandate.",
      "No contract value, contractor or completion date is published in this demonstration record.",
    ],
    objectives: [
      "Improve walkability and circulation within the town centre",
      "Support better management of storm water during heavy rain",
      "Reduce disruption to traders and residents during works",
    ],
    startDate: "Sample record — not an official start date",
    completionDate: "Sample record — ongoing",
    budget: "Not published in this demonstration dataset",
    implementingAgency: "Coordinated with the County Government of Elgeyo Marakwet (sample record)",
    image: "/images/iten-hero.jpg",
    imageAlt: "Welcome arch at the entrance to Iten town on a tarmac road",
    relatedDocuments: [
      { label: "Iten Integrated Spatial Plan (2015–2035)", href: "/resources?q=Integrated+Spatial+Plan" },
    ],
  },
  {
    slug: "modern-market-trading-environment",
    title: "Modern Market and Trading Environment Improvements",
    category: "Trade and Enterprise",
    status: "Ongoing",
    location: "Iten town centre",
    summary:
      "A sample record showing how improvements to trading facilities and the business environment can be presented to traders and residents.",
    description: [
      "This demonstration record illustrates a project entry for improvements to the trading environment. Such work typically covers stall layout, access, sanitation, lighting and the management arrangements that keep a market clean and usable.",
      "Trading activity is central to the municipal economy. Any information published about market facilities should be confirmed with the Municipality and the County Government before it is relied upon.",
      "This record contains no verified figure, contractor or delivery claim.",
    ],
    objectives: [
      "Support a more organised and accessible trading environment",
      "Improve sanitation and waste handling within trading areas",
      "Strengthen communication with traders on facility management",
    ],
    startDate: "Sample record — not an official start date",
    completionDate: "Sample record — ongoing",
    budget: "Not published in this demonstration dataset",
    implementingAgency: "Iten-Tambach Municipality (sample record)",
    image: "/images/market-development.jpg",
    imageAlt: "Aerial view of a market construction site beside a busy town street",
    relatedDocuments: [
      { label: "Iten Municipality Investment Plan 2025/2026", href: "/resources?q=Investment+Plan" },
    ],
  },
  {
    slug: "public-space-upgrading",
    title: "Public Space and Green Area Upgrading",
    category: "Public Spaces",
    status: "Completed",
    location: "Town-centre public areas",
    summary:
      "A sample completed-project record demonstrating how finished public space works would be documented once verified information is available.",
    description: [
      "This entry demonstrates the layout used for a completed project record, including photographs, a description of the finished works and links to related documents.",
      "It is included purely to show the template. The Municipality has not confirmed the works described here, and the entry should be replaced with a verified record — including the actual scope, dates and any officially published cost — before publication.",
    ],
    objectives: [
      "Demonstrate the completed-project presentation template",
      "Show how before-and-after information can be published",
    ],
    startDate: "Sample record",
    completionDate: "Sample record — not a verified completion date",
    budget: "Not published in this demonstration dataset",
    implementingAgency: "Sample record — to be replaced with verified information",
    image: "/images/town-life.jpg",
    imageAlt: "Street scene in a Kenyan highland town with trees and roadside activity",
    relatedDocuments: [
      { label: "Iten Integrated Spatial Plan (2015–2035) Report", href: "/resources?q=Spatial+Plan+Report" },
    ],
  },
  {
    slug: "street-lighting-and-safety",
    title: "Street Lighting and Public Safety Improvements",
    category: "Urban Infrastructure",
    status: "Planned",
    location: "Priority town-centre routes",
    summary:
      "A sample planned-project record illustrating how future infrastructure priorities are listed before implementation begins.",
    description: [
      "This demonstration record shows how a planned intervention is presented: the intended outcome, the areas under consideration and the stage the proposal has reached.",
      "Planned entries are shown separately from ongoing and completed work so that residents can distinguish intention from delivery. Nothing in this entry should be read as an approved budget line or a committed works programme.",
    ],
    objectives: [
      "Illustrate the planned-project presentation format",
      "Distinguish forward planning from works already under way",
    ],
    startDate: "Sample record — planning stage",
    completionDate: "Sample record — not scheduled",
    budget: "Not published in this demonstration dataset",
    implementingAgency: "Sample record — subject to confirmation",
    image: "/images/town-centre.jpg",
    imageAlt: "Town centre street in Iten with shops and roadside activity",
    relatedDocuments: [
      { label: "Iten Municipality Investment Plan 2025/2026", href: "/resources?q=Investment+Plan" },
    ],
  },
  {
    slug: "climate-resilience-actions",
    title: "Urban Climate Resilience Actions",
    category: "Environmental Initiatives",
    status: "Planned",
    location: "Municipality-wide",
    summary:
      "A sample record linked to the published Urban Climate Risk Profile, illustrating how resilience actions can be presented.",
    description: [
      "The Municipality has published an Urban Climate Risk Profile, which assesses climate-related risks affecting the urban area. This sample record illustrates how follow-on resilience actions could be described on the website.",
      "The specific actions listed here are illustrative only. They are not an approved work programme, and should be replaced with measures confirmed by the Municipality.",
    ],
    objectives: [
      "Illustrate how climate resilience actions can be communicated",
      "Direct residents to the published Urban Climate Risk Profile",
    ],
    startDate: "Sample record — planning stage",
    completionDate: "Sample record — not scheduled",
    budget: "Not published in this demonstration dataset",
    implementingAgency: "Sample record — subject to confirmation",
    image: "/images/kerio-forest-road.jpg",
    imageAlt: "Aerial view of a winding road through forested escarpment near Iten",
    relatedDocuments: [
      { label: "Urban Climate Risk Profile", href: "/resources?q=Climate+Risk+Profile" },
    ],
  },
  {
    slug: "youth-and-women-enterprise-support",
    title: "Youth and Women Enterprise Support Initiative",
    category: "Community Development",
    status: "Ongoing",
    location: "Municipality-wide",
    summary:
      "A sample community-development record showing how enterprise support activity for youth, women and persons with disabilities can be presented.",
    description: [
      "This demonstration record illustrates a community development entry focused on enterprise support. Such initiatives typically involve training, market linkages, business information and coordination with county and national programmes.",
      "The Gender Engagement Framework and Gender Inclusion Framework published by the Municipality set out the institutional approach to inclusive engagement. Both documents are available in the document centre.",
      "No participant numbers, grants or funding amounts are published in this demonstration record.",
    ],
    objectives: [
      "Illustrate inclusive community development presentation",
      "Signpost the published gender frameworks",
    ],
    startDate: "Sample record — not an official start date",
    completionDate: "Sample record — ongoing",
    budget: "Not published in this demonstration dataset",
    implementingAgency: "Iten-Tambach Municipality (sample record)",
    image: "/images/public-engagement.jpg",
    imageAlt: "Public engagement meeting between officials and residents in an office",
    relatedDocuments: [
      { label: "Gender Engagement Framework 2026", href: "/resources?q=Gender+Engagement+Framework" },
      { label: "Gender Inclusion Framework", href: "/resources?q=Gender+Inclusion+Framework" },
    ],
  },
  {
    slug: "storm-water-drainage-study",
    title: "Storm Water Drainage Assessment",
    category: "Urban Infrastructure",
    status: "Planned",
    location: "Low-lying town-centre areas",
    summary:
      "A sample planning record demonstrating how a technical assessment stage would be documented.",
    description: [
      "This entry demonstrates how a feasibility or assessment stage can be published before construction is considered. It is included to show the template, not to report an approved study.",
      "Any drainage assessment commissioned by the Municipality would be published with its scope and findings once complete.",
    ],
    objectives: [
      "Demonstrate presentation of an assessment-stage record",
      "Illustrate how technical studies can be published alongside plans",
    ],
    startDate: "Sample record — assessment stage",
    completionDate: "Sample record — not scheduled",
    budget: "Not published in this demonstration dataset",
    implementingAgency: "Sample record — subject to confirmation",
    image: "/images/highlands.jpg",
    imageAlt: "Green highland valley with farmland and distant hills in Elgeyo Marakwet",
    relatedDocuments: [
      { label: "Iten Integrated Spatial Plan (2015–2035)", href: "/resources?q=Integrated+Spatial+Plan" },
    ],
  },
  {
    slug: "community-green-spaces",
    title: "Community Green Space and Tree Planting",
    category: "Public Spaces",
    status: "Ongoing",
    location: "Public land and institutional grounds",
    summary:
      "A sample record illustrating how tree planting and green space upkeep can be presented as a municipal initiative.",
    description: [
      "This demonstration entry shows how greening activity is typically described: the areas involved, the partners engaged and the maintenance arrangements that keep planted areas healthy.",
      "Tree planting and green space upkeep are commonly delivered with schools, community groups and development partners. Details of any such arrangement should be confirmed with the Municipality.",
    ],
    objectives: [
      "Illustrate presentation of a greening initiative",
      "Encourage community involvement in maintaining public green spaces",
    ],
    startDate: "Sample record — not an official start date",
    completionDate: "Sample record — ongoing",
    budget: "Not published in this demonstration dataset",
    implementingAgency: "Iten-Tambach Municipality (sample record)",
    image: "/images/conservation.jpg",
    imageAlt: "Forested hillside with indigenous trees under a blue sky in Elgeyo Marakwet",
    relatedDocuments: [
      { label: "Urban Climate Risk Profile", href: "/resources?q=Climate+Risk+Profile" },
    ],
  },
  {
    slug: "citizen-service-desk",
    title: "Municipal Citizen Service Desk",
    category: "Community Development",
    status: "Planned",
    location: "Iten Municipality Office",
    summary:
      "A sample record illustrating how a service-access improvement could be described to residents.",
    description: [
      "This demonstration entry illustrates how an improvement to service access would be presented, including what residents could expect and how the change would be communicated.",
      "It is a template entry only. The Municipality has not confirmed such a facility, and the record should be replaced or removed before publication.",
    ],
    objectives: [
      "Illustrate a service-access project record",
      "Demonstrate linkage between service information and feedback channels",
    ],
    startDate: "Sample record — planning stage",
    completionDate: "Sample record — not scheduled",
    budget: "Not published in this demonstration dataset",
    implementingAgency: "Sample record — subject to confirmation",
    image: "/images/community-forum.jpg",
    imageAlt: "Community forum with residents seated and listening to a presentation",
    relatedDocuments: [
      { label: "Grievance Redress Mechanism Structure", href: "/resources?q=Grievance+Redress" },
    ],
  },
];

/**
 * FILE-LEVEL VERIFICATION STATE
 * -----------------------------
 * Every record above is sample content. None is a confirmed municipal project, and no figure,
 * contractor, date or completion claim in this file is an official government record.
 * `publishedProjects` in lib/content.ts is therefore empty: nothing here is promoted into the
 * homepage, site search, sitemap or related-content surfaces. Replace these records with verified
 * municipal data and move them into the published collection to publish them.
 */
export const projectVerification = "demonstration" as const;

export const projectFilters = [
  "All projects",
  "Ongoing",
  "Completed",
  "Planned",
  "Urban Infrastructure",
  "Environmental Initiatives",
  "Community Development",
  "Public Spaces",
  "Trade and Enterprise",
] as const;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
