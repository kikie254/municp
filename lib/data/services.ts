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
      "Information on land use, development planning and the frameworks that guide growth within Iten-Tambach Municipality.",
    detail: [
      "The Municipal Charter assigns the Municipality a role in preparing and implementing municipal plans and managing development within its boundaries. The Iten Integrated Spatial Plan (2015–2035) is listed in the County Government's document repository.",
      "Planning decisions must follow the applicable laws, approved plans and the responsibilities assigned to the relevant county and national offices. A general enquiry to the Municipality should not be treated as an application or approval.",
      "For a specific proposal, residents, landowners and developers should seek guidance from the responsible planning office before starting work. This website does not grant planning permission or replace professional planning advice.",
    ],
    icon: "planning",
  },
  {
    slug: "solid-waste-management",
    title: "Solid Waste Management",
    description:
      "The municipal policy and planning framework for waste collection, handling, transport and cleaner public spaces.",
    detail: [
      "The Municipality has published a Solid Waste Management Policy and a Solid Waste Management Plan dated March 2025. These documents set out the policy direction for managing waste across the municipal area.",
      "The plan considers the full waste-management process, from reducing waste and improving handling at source to collection, transport, recovery and final disposal. It also provides a framework for cooperation between public institutions, businesses and residents.",
      "For collection days and service arrangements in your neighbourhood, contact the municipal office.",
    ],
    icon: "waste",
  },
  {
    slug: "environmental-management",
    title: "Environmental Management",
    description:
      "Planning for environmental protection and climate resilience across the Municipality's highland, escarpment and valley landscapes.",
    detail: [
      "The Urban Climate Risk Profile describes the different physical environments within Iten-Tambach and the climate-related risks that need to be considered in local planning.",
      "Environmental management is closely linked to drainage, waste handling, protection of green spaces and responsible land use. The Municipality works within the wider framework of county and national environmental institutions.",
      "For regulatory approvals or enforcement matters, residents should contact the institution legally responsible for the specific issue.",
    ],
    icon: "environment",
  },
  {
    slug: "public-spaces",
    title: "Public Spaces",
    description:
      "The planning, upkeep and improvement of parks, green spaces and other shared areas within the municipal boundary.",
    detail: [
      "Parks and other public spaces provide places for recreation, community activity and everyday use. Their planning and maintenance form part of the functions set out in the Municipal Charter.",
      "Residents can help protect shared spaces by reporting damage, obstruction, illegal dumping or other concerns through the municipal feedback channel.",
      "Any opening hours, facility rules or maintenance schedules will be published when confirmed by the responsible office.",
    ],
    icon: "spaces",
  },
  {
    slug: "urban-infrastructure",
    title: "Urban Infrastructure Coordination",
    description:
      "Municipal responsibilities and coordination on urban roads, drainage, walkways, street lighting and public transport facilities.",
    detail: [
      "The Municipal Charter assigns the Municipality functions relating to urban roads, storm-water drainage, walkways, street lighting, traffic controls, parking facilities and bus and taxi stands within its boundaries.",
      "Infrastructure delivery also involves the County Government and, where relevant, national road agencies and other service providers. Responsibility depends on the location and the legal classification of the infrastructure.",
      "When reporting a fault or requesting information, include the street or area and a clear description of the issue. The responsible office can then be identified.",
    ],
    icon: "infrastructure",
  },
  {
    slug: "trade-and-business",
    title: "Trade and Business Environment",
    description:
      "Information for traders, entrepreneurs and businesses operating in Iten-Tambach and its surrounding neighbourhoods.",
    detail: [
      "Trade and small businesses are an important part of life in the Municipality. The Municipal Charter provides for the construction, maintenance and regulation of municipal markets and abattoirs, as well as the regulation of outdoor advertising.",
      "Business licensing, county fees and related approvals are governed by the applicable County laws and procedures. The responsible County office should be consulted for current requirements and charges.",
      "This website does not advertise plots, market stalls, licences or investment incentives as available. Such information should only be relied on when issued through an authorised public notice or official process.",
    ],
    icon: "trade",
  },
  {
    slug: "community-engagement",
    title: "Community Engagement",
    description:
      "Citizen fora, public notices and other formal opportunities for residents and stakeholders to contribute to municipal decisions.",
    detail: [
      "Public participation is part of municipal governance. Section 22 of the Urban Areas and Cities Act provides for Citizen Fora, and the County Government's document repository lists citizen fora calendars and participation reports from previous periods.",
      "Consultations may cover development planning, budgets, local priorities and service delivery. The subject, date, venue and submission period for each engagement should be taken from its published notice.",
      "The Municipality's published gender and inclusion frameworks provide further context for participation by women, young people, persons with disabilities and other groups.",
    ],
    icon: "community",
  },
  {
    slug: "development-information",
    title: "Development Information",
    description:
      "A central place to find municipal plans, policies, financial reports and public participation records.",
    detail: [
      "The document centre brings together records listed by the County Government, including the Municipal Charter, development and spatial plans, investment documents, financial statements, environmental publications and Citizen Fora reports.",
      "Use the document centre filters to browse publications by title, category and year.",
    ],
    icon: "information",
  },
];

export const coreValues = [
  {
    name: "Accountable administration",
    description:
      "The Charter calls for the efficient and accountable management of municipal affairs, with public responsibilities exercised in accordance with the law.",
  },
  {
    name: "Resident participation",
    description:
      "Residents should have a meaningful opportunity to help determine local priorities and the services and regulatory arrangements that affect them.",
  },
  {
    name: "Responsible use of public resources",
    description:
      "The governance framework gives residents a role in scrutinising how public resources and authority are used.",
  },
  {
    name: "Coordinated development",
    description:
      "The Municipality is expected to pursue development opportunities, maintain public order and provide civic amenities that improve everyday life.",
  },
  {
    name: "Accessible public services",
    description:
      "The Charter provides for social services that meet residents' needs and are delivered to a high standard and at reasonable cost.",
  },
  {
    name: "Social cohesion",
    description:
      "The Municipality's statutory objects include strengthening civic responsibility and collective action across the community.",
  },
  {
    name: "Community well-being",
    description:
      "The Charter places the economic, social and environmental well-being of the municipal community at the centre of its purpose.",
  },
];

export const priorities = [
  {
    title: "Urban Infrastructure",
    description:
      "Planning and improving urban roads, drainage, walkways, public transport facilities and other infrastructure within the municipal mandate.",
    icon: "planning",
  },
  {
    title: "Land Use and Urban Planning",
    description:
      "Supporting coordinated development through municipal planning frameworks and responsible management of land use.",
    icon: "planning",
  },
  {
    title: "Waste and Environmental Management",
    description:
      "Putting the published waste-management framework into practice and taking account of the Municipality's climate risks.",
    icon: "environment",
  },
  {
    title: "Accountable Urban Governance",
    description:
      "Making municipal information accessible and providing opportunities for residents to take part in local decisions.",
    icon: "community",
  },
];

export type Forum = {
  title: string;
  area: string;
  status: "Scheduled" | "Sample listing";
  note: string;
};

/**
 * No current forum dates have been supplied for this website.
 * These entries remain visibly labelled as examples and must not be treated as event notices.
 */
export const forums: Forum[] = [
  {
    title: "Citizen Forum — Town Centre and Central Ward",
    area: "Iten town centre",
    status: "Sample listing",
    note: "Illustrative entry only. Check the published Citizen Fora Calendar for confirmed dates, venues and subjects.",
  },
  {
    title: "Citizen Forum — Trading and Business Community",
    area: "Market and trading areas",
    status: "Sample listing",
    note: "Illustrative entry only. This is not an announcement of a scheduled meeting.",
  },
  {
    title: "Citizen Forum — Community Inclusion",
    area: "Municipality-wide",
    status: "Sample listing",
    note: "Illustrative entry only. Participation arrangements should be taken from the relevant official notice.",
  },
];

export const faqs = [
  {
    question: "How do I raise a concern about waste collection or cleanliness?",
    answer:
      "Use the feedback form on this website to submit the details of your concern. A successful submission is recorded in the municipal system and receives a reference number. Keep that reference for any follow-up. If the form is unavailable, contact the municipal office using the details on the Contact page.",
  },
  {
    question: "Will a submission through this website reach the Municipality?",
    answer:
      "The feedback and enquiry forms submit information to the municipal system. When a submission is recorded successfully, the form displays a reference number. An acknowledgement email may not be sent if an email provider has not been configured for the website, so keep the reference shown on screen.",
  },
  {
    question: "Where can I find the Municipal Charter and development plans?",
    answer:
      "Open the Document Centre and search by title or category. The listings include the Municipal Charter, integrated development and spatial planning documents, investment plans, financial reports, environmental publications and Citizen Fora records. Each entry links to the County Government's document repository and includes a note where the file or its status needs confirmation.",
  },
  {
    question: "Who are the current members of the Municipal Board?",
    answer:
      "For the current Municipal Board membership list, contact the municipal office.",
  },
  {
    question: "How can I take part in public participation?",
    answer:
      "Look out for public notices and the Citizen Fora Calendar in the Document Centre. Each notice should state the subject, date, venue and how to submit your views. You can also use the public participation page to find published reports and current consultation opportunities.",
  },
  {
    question: "Can the Municipality confirm land availability or investment incentives?",
    answer:
      "For information about land availability, tax exemptions or investment incentives, contact the responsible County or national institution and follow the applicable approval process.",
  },
  {
    question: "Are the news items and projects on this website official?",
    answer:
      "Visit the News and Projects sections for municipal announcements and project information.",
  },
  {
    question: "How do I report an accessibility problem with this website?",
    answer:
      "Use the Contact page to report the page, device or assistive technology you were using and describe the difficulty you encountered.",
  },
];
