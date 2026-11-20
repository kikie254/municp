export type Service = {
  slug: string;
  title: string;
  description: string;
  detail: string[];
  icon:
    | "planning"
    | "waste"
    | "environment"
    | "spaces"
    | "infrastructure"
    | "trade"
    | "community"
    | "information";
};

export const services: Service[] = [
  {
    slug: "urban-planning",
    title: "Urban Planning and Development",
    description:
      "Information and guidance on planning within the municipality, development coordination and the frameworks that shape urban growth.",
    detail: [
      "The municipality contributes to the planning and coordination of urban development within its area, in line with the approved municipal framework and the Iten Integrated Spatial Plan (2015–2035).",
      "Residents, developers and businesses with a planning enquiry should contact the municipal office so that the enquiry can be directed to the correct office. Development approvals are issued by the responsible institutions under the applicable law.",
      "This page provides information only. It does not constitute planning permission, approval or professional planning advice.",
    ],
    icon: "planning",
  },
  {
    slug: "solid-waste-management",
    title: "Solid Waste Management",
    description:
      "Information on waste collection arrangements, responsible waste handling and the municipal framework for cleaner public spaces.",
    detail: [
      "Waste management is one of the most visible municipal responsibilities. The Municipality has published a Solid Waste Management Plan 2025 and a Municipal Policy on Waste Management, both available in the document centre.",
      "Residents and businesses are encouraged to follow the collection arrangements communicated by the municipality and to raise a concern through the feedback channels where a collection is missed or waste is dumped illegally.",
    ],
    icon: "waste",
  },
  {
    slug: "environmental-management",
    title: "Environmental Management",
    description:
      "Support for environmental protection, catchment care and resilience measures within the urban area.",
    detail: [
      "The Municipality's Urban Climate Risk Profile sets out climate-related risks affecting the urban area and informs the measures intended to strengthen resilience.",
      "Environmental management involves coordination with county and national agencies, community groups and development partners. Specific regulatory functions remain with the institutions legally mandated to perform them.",
    ],
    icon: "environment",
  },
  {
    slug: "public-spaces",
    title: "Public Spaces",
    description:
      "Upkeep, management and improvement of public spaces, green areas and places used by residents and visitors.",
    detail: [
      "Well-managed public spaces support health, trade and community life. The municipality works towards organised, accessible and clean public spaces within the urban area.",
      "Reports about the condition of a public space — damage, dumping, obstruction or safety concerns — can be raised through the complaints and feedback page.",
    ],
    icon: "spaces",
  },
  {
    slug: "urban-infrastructure",
    title: "Urban Infrastructure Coordination",
    description:
      "Coordination with county and national agencies on roads, drainage, lighting and other urban infrastructure.",
    detail: [
      "Infrastructure within the municipality is delivered by several institutions. The municipality's role includes coordination, planning input and communication with residents.",
      "Where an infrastructure concern falls outside the municipality's mandate, the enquiry will be directed to the responsible institution. The municipality does not publish service standards that have not been confirmed by the responsible agency.",
    ],
    icon: "infrastructure",
  },
  {
    slug: "trade-and-business",
    title: "Trade and Business Environment",
    description:
      "Information for traders, entrepreneurs and businesses operating within the municipality.",
    detail: [
      "Trading activity is central to the municipal economy. The municipality supports an organised business environment through planning, public space management and coordination with county trade functions.",
      "Business licensing and revenue functions are governed by county and national law. Enquiries about licences, fees or permits should be directed to the responsible office.",
    ],
    icon: "trade",
  },
  {
    slug: "community-engagement",
    title: "Community Engagement",
    description:
      "Forums, notices and channels through which residents and stakeholders take part in municipal decisions.",
    detail: [
      "The municipality publishes citizen fora calendars and quarterly citizen fora reports, and welcomes written submissions through the public participation page.",
      "Engagement is intended to be inclusive, with attention to the participation of youth, women, persons with disabilities and marginalised groups, consistent with the published gender frameworks.",
    ],
    icon: "community",
  },
  {
    slug: "development-information",
    title: "Development Information",
    description:
      "Access to municipal plans, project information, budgets and published reports.",
    detail: [
      "The document centre brings together the municipal charter, development plans, investment plans, financial statements, environmental documents, policies and participation reports.",
      "Where a document is hosted by the County Government, the listing links to the official source so that residents retrieve the authoritative version.",
    ],
    icon: "information",
  },
];

export const coreValues = [
  {
    name: "Integrity",
    description:
      "Acting honestly and consistently, and holding the public interest above personal or sectional advantage in every municipal decision.",
  },
  {
    name: "Accountability",
    description:
      "Accepting responsibility for decisions, actions and resources, and being willing to explain them openly to residents.",
  },
  {
    name: "Transparency",
    description:
      "Making municipal information, plans and reports accessible so that residents can see how decisions are made and resources applied.",
  },
  {
    name: "Inclusivity",
    description:
      "Ensuring that youth, women, persons with disabilities, minorities and marginalised groups can take part in municipal life and decisions.",
  },
  {
    name: "Professionalism",
    description:
      "Applying competence, courtesy and consistency in service to the public, and respecting the law in all municipal business.",
  },
  {
    name: "Sustainability",
    description:
      "Managing the urban environment so that present needs are met without compromising the resources and opportunities available to future generations.",
  },
  {
    name: "Innovation",
    description:
      "Seeking better ways to plan, deliver and communicate municipal services, including through appropriate use of technology.",
  },
];

export const priorities = [
  {
    title: "Sustainable Urban Development",
    description:
      "Promoting organised urban growth through planning, responsible land use and coordinated development initiatives.",
    icon: "planning",
  },
  {
    title: "Environmental Sustainability",
    description:
      "Encouraging cleaner public spaces, responsible waste management and environmental protection.",
    icon: "environment",
  },
  {
    title: "Inclusive Community Development",
    description:
      "Promoting opportunities for residents, youth, women, persons with disabilities and other community groups.",
    icon: "community",
  },
  {
    title: "Transparent Governance",
    description:
      "Strengthening accountability, openness, public participation and responsible management of municipal affairs.",
    icon: "governance",
  },
];

export type Forum = {
  title: string;
  area: string;
  status: "Scheduled" | "Sample listing";
  note: string;
};

/**
 * No verified upcoming forum dates have been supplied for publication.
 * Listings below are therefore presented as sample formats, not confirmed events.
 */
export const forums: Forum[] = [
  {
    title: "Citizen Forum — Town Centre and Central Ward",
    area: "Iten town centre",
    status: "Sample listing",
    note: "Format illustration only. Dates and venues are published through official public notices.",
  },
  {
    title: "Citizen Forum — Trading and Business Community",
    area: "Market and trading areas",
    status: "Sample listing",
    note: "Format illustration only. Confirm dates through the municipal office or the published citizen fora calendar.",
  },
  {
    title: "Citizen Forum — Youth, Women and Persons with Disabilities",
    area: "Municipality-wide",
    status: "Sample listing",
    note: "Format illustration only, aligned with the published gender engagement framework.",
  },
];

export const faqs = [
  {
    question: "How do I raise a complaint about waste collection or cleanliness?",
    answer:
      "Use the feedback form on the complaints and feedback page to prepare and check the details of your concern, then raise it with the office directly by telephone or email, because a form submission is not transmitted to the Municipality. Contact details are shown on the contact page and are pending written confirmation.",
  },
  {
    question: "Is a submission through this website officially registered?",
    answer:
      "No. The forms on this site validate your entry in the browser and show a preview so that you can check it, but nothing is transmitted to, stored by or registered with the Municipality, and no reference number is issued. To raise a matter officially, contact the municipal office directly by telephone, email or in person.",
  },
  {
    question: "Where can I find the municipal charter and development plans?",
    answer:
      "The document centre lists the municipal charter, the integrated development plan, the Iten Integrated Spatial Plan (2015–2035), investment plans, financial statements, environmental documents, policies and participation reports. Each record links to the County Government's own repository and is labelled according to how far the file behind it was checked. Where no per-file link could be confirmed, the record opens the official documents page instead.",
  },
  {
    question: "Who sits on the Municipal Board?",
    answer:
      "The composition of the Board is described from the charter document published by the County — nine members, a five-year term, five members appointed competitively — and from the Urban Areas and Cities Act, 2011, as amended. The document served by the County is headed 'Model Municipal Charter', so the Municipality should confirm it is the version adopted for Iten-Tambach. This website does not name or picture any official, because verified names and photographs have not been supplied for publication.",
  },
  {
    question: "How can I take part in public participation?",
    answer:
      "Attend a citizen forum, respond to a published public notice, or write to the municipal office. The public participation page explains the channels and the reports that are published afterwards. The published citizen fora calendars and quarterly reports are available in the document centre.",
  },
  {
    question: "Can the municipality confirm land availability or investment incentives?",
    answer:
      "No confirmation is published on this website. Information about land, incentives or approvals can only be given through official processes by the responsible institutions. The investment page explains the published planning documents that inform enquiries but does not advertise available land, tax exemptions or guaranteed returns.",
  },
  {
    question: "Are the news items and projects on this website official?",
    answer:
      "No. News articles, project records and forum listings on this website are sample content, clearly labelled as such. They demonstrate how verified information will be presented once the Municipality supplies it, and they are excluded from the homepage promotional sections, site search and the XML sitemap.",
  },
  {
    question: "How do I report an accessibility problem with this website?",
    answer:
      "Please report the problem using the contact channels on the contact page, describing the page and what happened. The accessibility page records what is implemented, what was corrected in this revision, and what still requires independent testing.",
  },
];
