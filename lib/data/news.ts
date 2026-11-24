export type NewsCategory =
  | "Municipal News"
  | "Public Notices"
  | "Development Updates"
  | "Community Activities"
  | "Events";

export type NewsItem = {
  slug: string;
  title: string;
  category: NewsCategory;
  date: string;
  dateLabel: string;
  featured?: boolean;
  image: string;
  imageAlt: string;
  summary: string;
  body: string[];
  /** True for every record in this file: these are template articles, not municipal communications. */
  isSample: boolean;
};

/**
 * DEMONSTRATION CONTENT NOTICE
 * ----------------------------
 * Every article below is sample content written to demonstrate the news and
 * announcements templates. None of these items is an official municipal
 * announcement, notice or event. Replace this file with verified municipal
 * communications before publication.
 */
export const news: NewsItem[] = [
  {
    slug: "sample-municipal-cleanliness-drive",
    title: "Municipality outlines sample programme for cleaner public spaces",
    category: "Municipal News",
    date: "2026-11-04",
    dateLabel: "4 November 2026",
    featured: true,
    image: "/images/market-development.jpg",
    imageAlt: "Aerial view of a busy town street beside a construction site in a Kenyan highland town",
    summary:
      "A demonstration article showing how municipal cleanliness activity can be reported to residents, with emphasis on schedules, responsibilities and public cooperation.",
    body: [
      "This is a demonstration article prepared to show how municipal news is laid out on this website. It does not report an actual municipal announcement or event.",
      "In a verified version of this article, residents would find the practical information that matters most: which areas are covered, when collection takes place, who to contact when a collection is missed, and what households and businesses are asked to do to keep public spaces clean.",
      "Municipal cleanliness work is most effective when it is predictable. Clear, repeated communication of schedules — through this website, public notices and community forums — helps residents plan and reduces the accumulation of waste in public spaces.",
      "The Municipality's published Solid Waste Management Plan 2025 and Municipal Policy on Waste Management set out the policy direction for this area of work. Both are available in the municipal document centre.",
    ],
    isSample: true,
  },
  {
    slug: "sample-public-notice-citizen-fora",
    title: "Public notice: sample citizen forum calendar published for review",
    category: "Public Notices",
    date: "2026-10-27",
    dateLabel: "27 October 2026",
    featured: true,
    image: "/images/public-engagement.jpg",
    imageAlt: "Residents and officials in discussion during a community engagement meeting",
    summary:
      "A demonstration public notice illustrating how the municipality would publish a citizen forum calendar and invitation to residents.",
    body: [
      "This page demonstrates the format used for public notices. It is sample content and does not announce a real forum, date or venue.",
      "A genuine notice would state the purpose of the forum, the date, time and venue, the wards or areas invited, the language of proceedings, and any accessibility arrangements for persons with disabilities.",
      "The County Government document repository lists citizen fora calendars and reports from previous periods. Residents should rely on current public notices for confirmed dates, venues and submission details.",
      "Residents who wish to raise a matter ahead of a forum can use the feedback channels described on the complaints and feedback page.",
    ],
    isSample: true,
  },
  {
    slug: "sample-development-update-drainage",
    title: "Sample development update: drainage and footpath works explained",
    category: "Development Updates",
    date: "2026-10-15",
    dateLabel: "15 October 2026",
    image: "/images/iten-hero.jpg",
    imageAlt: "Welcome arch at the entrance to Iten town above a tarmac road",
    summary:
      "A demonstration update explaining how residents would be told about construction sequencing, access arrangements and channels for reporting concerns.",
    body: [
      "This demonstration update shows how infrastructure works would be communicated while they are under way. It is sample content only.",
      "Useful updates during works typically cover the sequence of construction, which streets or footpaths are affected, arrangements for traders and pedestrians, and where residents can report a problem.",
      "Where works are delivered with the County Government or a national agency, the notice should identify the implementing institution so that residents know who is accountable for delivery.",
      "No contractor, cost or completion date is stated in this demonstration article.",
    ],
    isSample: true,
  },
  {
    slug: "sample-community-tree-planting",
    title: "Sample community activity: residents join green space upkeep",
    category: "Community Activities",
    date: "2026-09-30",
    dateLabel: "30 September 2026",
    image: "/images/conservation.jpg",
    imageAlt: "Indigenous trees and forested hills under a bright sky in Elgeyo Marakwet",
    summary:
      "A demonstration community article on how partnerships for greening public spaces could be reported.",
    body: [
      "This demonstration article illustrates reporting on a community activity. It does not describe a real event.",
      "Community greening activity works best when maintenance is planned from the start: who waters and prunes young trees, how damage is reported, and which institution is responsible for follow-up.",
      "The Municipality's Urban Climate Risk Profile provides context on climate-related risks that green space and catchment protection help to address.",
    ],
    isSample: true,
  },
  {
    slug: "sample-investment-briefing",
    title: "Sample briefing: investment information and enquiry channels",
    category: "Municipal News",
    date: "2026-09-18",
    dateLabel: "18 September 2026",
    image: "/images/town-life.jpg",
    imageAlt: "Roadside trading and street activity in a Kenyan highland town",
    summary:
      "A demonstration article showing how the municipality would explain where investment information can be obtained and what enquiries can and cannot be answered.",
    body: [
      "This is sample content prepared for demonstration purposes.",
      "A verified briefing on investment would set out which documents are published, which office handles enquiries, and what information the municipality can and cannot provide — for example, that available land and any incentives would only be confirmed through official processes.",
      "The Iten Municipality Investment Plan 2025/2026 and the Iten Integrated Spatial Plan (2015–2035) are published documents that inform investment discussions.",
    ],
    isSample: true,
  },
  {
    slug: "sample-event-waste-awareness",
    title: "Sample event: household waste awareness session",
    category: "Events",
    date: "2026-09-05",
    dateLabel: "5 September 2026",
    image: "/images/community-forum.jpg",
    imageAlt: "Community members attending an indoor awareness session",
    summary:
      "A demonstration event listing showing the details residents would expect before attending.",
    body: [
      "This demonstration listing shows the format used for events. It is not a real event and no venue or date should be relied upon.",
      "A verified event listing would include the purpose, date, time, venue, organiser, contact person and any accessibility provisions.",
      "Event information on this website would normally be accompanied by a public notice in the document centre.",
    ],
    isSample: true,
  },
  {
    slug: "sample-public-notice-documents",
    title: "Public notice: sample document release announcement",
    category: "Public Notices",
    date: "2026-08-22",
    dateLabel: "22 August 2026",
    image: "/images/town-centre.jpg",
    imageAlt: "Town centre street with shops and pedestrians in Iten",
    summary:
      "A demonstration notice showing how newly published municipal documents would be announced.",
    body: [
      "This demonstration notice shows the structure used when the Municipality releases new documents. It is sample content.",
      "A verified notice would name each document, its category and the date of publication, and would link directly to the file on the official source.",
      "All documents referenced on this website are listed in the municipal document centre with their official source links.",
    ],
    isSample: true,
  },
  {
    slug: "sample-development-update-spatial-plan",
    title: "Sample explainer: how the spatial plan guides urban growth",
    category: "Development Updates",
    date: "2026-08-08",
    dateLabel: "8 August 2026",
    image: "/images/iten-town-aerial.jpg",
    imageAlt: "Elevated view of Iten town with trees, roads and surrounding hills",
    summary:
      "A demonstration explainer on how a spatial plan shapes land use decisions and what residents can expect from it.",
    body: [
      "This demonstration article explains, in general terms, how a spatial plan guides development. It is sample content produced for this website.",
      "The Iten Integrated Spatial Plan (2015–2035) is a published County document. It sets out proposals for land use, urban form and the coordination of development over the plan period.",
      "Residents with a specific planning enquiry should contact the municipal office using the details on the contact page rather than relying on general explanations.",
    ],
    isSample: true,
  },
];

export function getNews(slug: string) {
  return news.find((n) => n.slug === slug);
}

export const newsCategories: NewsCategory[] = [
  "Municipal News",
  "Public Notices",
  "Development Updates",
  "Community Activities",
  "Events",
];
