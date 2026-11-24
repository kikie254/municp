export type DocumentCategory =
  | "Municipal Charter"
  | "Integrated Development Plans"
  | "Spatial Plans"
  | "Investment Plans"
  | "Budgets and Financial Reports"
  | "Environmental Documents"
  | "Policies and Guidelines"
  | "Public Participation Reports"
  | "Grievance Redress Documents"
  | "Other Official Publications";

export const documentCategories: DocumentCategory[] = [
  "Municipal Charter",
  "Integrated Development Plans",
  "Spatial Plans",
  "Investment Plans",
  "Budgets and Financial Reports",
  "Environmental Documents",
  "Policies and Guidelines",
  "Public Participation Reports",
  "Grievance Redress Documents",
  "Other Official Publications",
];

export type MunicipalDocument = {
  id: string;
  title: string;
  category: DocumentCategory;
  year: number;
  lastUpdated: string;
  fileSize: string;
  summary: string;
  fileUrl: string;
  /**
   * How far the record was checked against the file actually served by the County repository.
   * - "content-confirmed": the PDF opened and its opening pages matched the displayed title.
   *   This confirms the link resolves to the right document; it does not authenticate the file as
   *   an adopted instrument, nor does it grant redistribution rights.
   * - "file-only": the endpoint returned a real PDF whose size matches the declared size, but the
   *   document carries no machine-readable text, so the title could not be matched to the content.
   * - "source-page-only": no per-file endpoint could be confirmed; the record links to the official
   *   documents page instead of an unverified file.
   */
  verification: DocumentVerification;
  /** Plain-language note shown beside the status where the record needs municipal or county confirmation. */
  note?: string;
};

export type DocumentVerification = "content-confirmed" | "file-only" | "source-page-only";

/**
 * Every entry below was taken from the County Government of Elgeyo Marakwet's
 * official Iten Municipality documents page:
 * https://elgeyomarakwet.go.ke/iten-municipality-documents/
 * Titles, last-modified dates and file sizes are as published by the County.
 * Links resolve to the County's own download endpoint; files are not mirrored here.
 *
 * VERIFICATION PASS (Phase 1): every endpoint was requested over the network and every file opened.
 * 31 of 32 records return a real PDF whose size matches the published size; one record has no
 * confirmable per-file link and therefore points at the official documents page. Where a PDF could
 * be read as text, the opening pages were matched against the displayed title. A working link is
 * NOT proof that a document is the adopted instrument, and this file makes no such claim.
 */
export const documents: MunicipalDocument[] = [
  {
    id: "charter",
    title: "Iten Tambach Municipal Charter",
    category: "Municipal Charter",
    year: 2019,
    lastUpdated: "30 September 2019",
    fileSize: "831 KB",
    summary:
      "A County-hosted model-draft charter document concerning the proposed incorporation, objects, functions and governance arrangements of Iten-Tambach Municipality. Its adopted status has not been established.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=2273",
    verification: "content-confirmed",
    note:
      "Opening pages identify this as the Model Municipal Charter prepared under the World Bank Kenya Urban Support Programme. Confirm that this is the version adopted for Iten-Tambach before it is cited as the adopted charter.",
  },
  {
    id: "idep",
    title: "Iten-Tambach Municipality Integrated Development Plan (IDEP) 2025–2029",
    category: "Integrated Development Plans",
    year: 2026,
    lastUpdated: "12 March 2026",
    fileSize: "4.8 MB",
    summary:
      "The approved municipal integrated development plan setting out development priorities, programmes and the investment framework for the municipality.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6649",
    verification: "content-confirmed",
    note:
      "The file itself is titled “Integrated Development Plan (IDEP) 2025-2029”; the displayed title has been corrected to match the document.",
  },
  {
    id: "idep-annex",
    title: "Annex Review of the Integrated Development Plan",
    category: "Integrated Development Plans",
    year: 2024,
    lastUpdated: "29 November 2024",
    fileSize: "2.1 MB",
    summary:
      "Annexed review material supporting the municipality's integrated development planning framework.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4886",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "spatial-plan",
    title: "Iten Integrated Spatial Plan (2015–2035)",
    category: "Spatial Plans",
    year: 2024,
    lastUpdated: "27 November 2024",
    fileSize: "19.3 MB",
    summary:
      "The integrated spatial plan guiding land use, urban form and development coordination in Iten over the 2015–2035 plan period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4847",
    verification: "file-only",
    note:
      "The file served at this link is a single-page PDF of about 19 MB with no machine-readable text. Its content could not be matched to a full spatial plan. Requires county confirmation.",
  },
  {
    id: "spatial-plan-report",
    title: "Iten Integrated Spatial Plan (2015–2035) Report",
    category: "Spatial Plans",
    year: 2026,
    lastUpdated: "13 March 2026",
    fileSize: "27.8 MB",
    summary:
      "The supporting report to the Iten Integrated Spatial Plan, covering the analysis and proposals behind the plan.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6669",
    verification: "file-only",
    note:
      "A 127-page scanned PDF with no machine-readable text. The title is plausible for the file, but the content has not been text-verified.",
  },
  {
    id: "investment-plan-2025-2026",
    title: "Iten Municipality Investment Plan 2025/2026",
    category: "Investment Plans",
    year: 2026,
    lastUpdated: "11 March 2026",
    fileSize: "2.2 MB",
    summary:
      "The municipality's annual investment plan for the 2025/2026 financial year, setting out planned investments and financing priorities.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6643",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "investment-plan-2024-2025",
    title: "Iten Municipality Annual Investment Plan 2024–2025",
    category: "Investment Plans",
    year: 2024,
    lastUpdated: "29 November 2024",
    fileSize: "601.7 KB",
    summary:
      "The annual investment plan for the 2024–2025 period, outlining investment intentions and delivery priorities.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4888",
    verification: "content-confirmed",
  },
  {
    id: "financial-statements-2024",
    title: "Financial Statements — Iten Municipality 2024",
    category: "Budgets and Financial Reports",
    year: 2024,
    lastUpdated: "26 November 2024",
    fileSize: "1.2 MB",
    summary:
      "Published financial statements for Iten Municipality for the 2024 reporting period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4837",
    verification: "content-confirmed",
  },
  {
    id: "financial-statements-2023",
    title: "Financial Statements — Iten Municipality 2023",
    category: "Budgets and Financial Reports",
    year: 2023,
    lastUpdated: "26 November 2024",
    fileSize: "2.3 MB",
    summary:
      "Published financial statements for Iten Municipality for the 2023 reporting period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4843",
    verification: "content-confirmed",
  },
  {
    id: "solid-waste-plan",
    title: "Iten-Tambach Municipality Solid Waste Management Plan 2025",
    category: "Environmental Documents",
    year: 2025,
    lastUpdated: "13 March 2026",
    fileSize: "696.1 KB",
    summary:
      "The municipal solid waste management plan, covering waste generation, collection, disposal and the measures intended to improve cleanliness across the municipality.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6675",
    verification: "content-confirmed",
  },
  {
    id: "climate-risk-profile",
    title: "Iten-Tambach Municipality Urban Climate Risk Profile",
    category: "Environmental Documents",
    year: 2026,
    lastUpdated: "11 March 2026",
    fileSize: "1.6 MB",
    summary:
      "An assessment of climate-related risks affecting the urban area, intended to inform planning and resilience measures.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6641",
    verification: "content-confirmed",
  },
  {
    id: "waste-policy",
    title: "Municipal Policy on Waste Management",
    category: "Policies and Guidelines",
    year: 2026,
    lastUpdated: "13 March 2026",
    fileSize: "606.2 KB",
    summary:
      "The municipal policy framework for waste management, setting out policy direction and responsibilities for cleaner public spaces.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6673",
    verification: "content-confirmed",
  },
  {
    id: "gender-engagement-framework-2026",
    title: "Gender Engagement Framework for Iten Municipality 2026",
    category: "Policies and Guidelines",
    year: 2026,
    lastUpdated: "13 March 2026",
    fileSize: "466.8 KB",
    summary:
      "A framework for gender-responsive engagement in municipal planning and participation processes.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6667",
    verification: "content-confirmed",
  },
  {
    id: "gender-inclusion-framework",
    title: "Gender Inclusion Framework — Iten Municipality",
    category: "Policies and Guidelines",
    year: 2024,
    lastUpdated: "28 November 2024",
    fileSize: "6.8 MB",
    summary:
      "Framework document on gender inclusion in municipal programmes and community engagement.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4871",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "citizen-fora-calendar-2025-2026",
    title: "Citizen Fora Calendar — Public Notice 2025/2026",
    category: "Public Participation Reports",
    year: 2026,
    lastUpdated: "12 March 2026",
    fileSize: "450.7 KB",
    summary:
      "The published calendar of citizen fora for the 2025/2026 period, issued as a public notice.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6651",
    verification: "content-confirmed",
  },
  {
    id: "citizen-fora-q2-2025-2026",
    title: "Second Quarter Citizen Fora Report 2025–2026",
    category: "Public Participation Reports",
    year: 2026,
    lastUpdated: "11 March 2026",
    fileSize: "627 KB",
    summary:
      "Report on citizen fora held during the second quarter of the 2025–2026 period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6635",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "citizen-fora-q1-2025-2026",
    title: "First Quarter Citizen Fora Report 2025–2026",
    category: "Public Participation Reports",
    year: 2026,
    lastUpdated: "11 March 2026",
    fileSize: "1.1 MB",
    summary:
      "Report on citizen fora held during the first quarter of the 2025–2026 period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6633",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "citizen-fora-q4-2024-2025",
    title: "Fourth Quarter Citizen Fora Report 2024–2025",
    category: "Public Participation Reports",
    year: 2025,
    lastUpdated: "11 March 2026",
    fileSize: "702.7 KB",
    summary:
      "Report on citizen fora held during the fourth quarter of the 2024–2025 period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6629",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "citizen-fora-q3-2024-2025",
    title: "Third Quarter Citizen Fora Report 2024–2025",
    category: "Public Participation Reports",
    year: 2025,
    lastUpdated: "11 March 2026",
    fileSize: "461.5 KB",
    summary:
      "Report on citizen fora held during the third quarter of the 2024–2025 period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6627",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "citizen-fora-q2-2024-2025",
    title: "Second Quarter Citizen Fora Report 2024–2025",
    category: "Public Participation Reports",
    year: 2025,
    lastUpdated: "11 March 2026",
    fileSize: "728.5 KB",
    summary:
      "Report on citizen fora held during the second quarter of the 2024–2025 period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6625",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "citizen-fora-calendar-2024-2025",
    title: "Citizen Fora Calendar — Public Notice 2024/2025",
    category: "Public Participation Reports",
    year: 2024,
    lastUpdated: "11 March 2026",
    fileSize: "280 KB",
    summary:
      "The published calendar of citizen fora for the 2024/2025 period. The file is hosted by the County; open the official source page to retrieve it.",
    fileUrl: "https://elgeyomarakwet.go.ke/iten-municipality-documents/",
    verification: "source-page-only",
    note:
      "No per-file link could be confirmed for this record, so it opens the County’s official documents page rather than an unverified file.",
  },
  {
    id: "citizen-fora-q4-2023-2024",
    title: "Fourth Quarter Citizen Fora Report 2023–2024",
    category: "Public Participation Reports",
    year: 2024,
    lastUpdated: "28 November 2024",
    fileSize: "895.6 KB",
    summary:
      "Report on citizen fora held during the fourth quarter of the 2023–2024 period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4869",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "citizen-fora-q3-2023-2024",
    title: "Third Quarter Citizen Fora Report 2023–2024",
    category: "Public Participation Reports",
    year: 2024,
    lastUpdated: "28 November 2024",
    fileSize: "597.4 KB",
    summary:
      "Report on citizen fora held during the third quarter of the 2023–2024 period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4867",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "citizen-fora-q2-2023-2024",
    title: "Second Quarter Citizen Fora Report 2023–2024",
    category: "Public Participation Reports",
    year: 2024,
    lastUpdated: "28 November 2024",
    fileSize: "522.8 KB",
    summary:
      "Report on citizen fora held during the second quarter of the 2023–2024 period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4865",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "citizen-fora-q1-2024-2025",
    title: "First Quarter Citizen Fora Report 2024–2025",
    category: "Public Participation Reports",
    year: 2024,
    lastUpdated: "28 November 2024",
    fileSize: "660.5 KB",
    summary:
      "Report on citizen fora held during the first quarter of the 2024–2025 period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4863",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "citizen-fora-q1-2023-2024",
    title: "First Quarter Citizen Fora Report 2023–2024",
    category: "Public Participation Reports",
    year: 2024,
    lastUpdated: "28 November 2024",
    fileSize: "549.5 KB",
    summary:
      "Report on citizen fora held during the first quarter of the 2023–2024 period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4861",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "grm-log",
    title: "Grievance Redress Mechanism Log (Updated)",
    category: "Grievance Redress Documents",
    year: 2026,
    lastUpdated: "13 March 2026",
    fileSize: "2.7 MB",
    summary:
      "The municipality's updated grievance redress log, recording grievances received and the progress of redress action.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6681",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "grm-flow-chart",
    title: "Flow Chart — Grievance Redress Mechanism Structure",
    category: "Grievance Redress Documents",
    year: 2024,
    lastUpdated: "29 November 2024",
    fileSize: "143.3 KB",
    summary:
      "A one-page diagram showing how grievances move through the municipal grievance redress structure.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4884",
    verification: "content-confirmed",
  },
  {
    id: "board-minutes-highlights",
    title: "Highlights of Board Minutes 2024–2026",
    category: "Other Official Publications",
    year: 2026,
    lastUpdated: "11 March 2026",
    fileSize: "5 MB",
    summary:
      "Highlights drawn from the minutes of the Municipal Board covering the 2024–2026 period.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=6639",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "minutes-2023-2024",
    title: "Iten Municipality Minutes FY 2023–2024",
    category: "Other Official Publications",
    year: 2024,
    lastUpdated: "29 November 2024",
    fileSize: "1.7 MB",
    summary:
      "Municipal minutes for the 2023–2024 financial year as published by the County.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4890",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "public-notice-2024",
    title: "Public Notice 2024",
    category: "Other Official Publications",
    year: 2024,
    lastUpdated: "20 November 2024",
    fileSize: "252.3 KB",
    summary: "A public notice issued by the municipality in 2024.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4760",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
  {
    id: "public-notice-2023",
    title: "Public Notice 2023",
    category: "Other Official Publications",
    year: 2023,
    lastUpdated: "20 November 2024",
    fileSize: "258 KB",
    summary: "A public notice issued by the municipality in 2023.",
    fileUrl: "https://elgeyomarakwet.go.ke/?mdocs-file=4758",
    verification: "file-only",
    note:
      "A PDF is served at this link and its size matches the record, but the document has no machine-readable text, so the title could not be verified from the file.",
  },
];

export const documentYears = Array.from(new Set(documents.map((d) => d.year))).sort((a, b) => b - a);

export const featuredDocuments = [
  documents.find((d) => d.id === "charter")!,
  documents.find((d) => d.id === "idep")!,
  documents.find((d) => d.id === "spatial-plan")!,
  documents.find((d) => d.id === "investment-plan-2025-2026")!,
  documents.find((d) => d.id === "solid-waste-plan")!,
  documents.find((d) => d.id === "climate-risk-profile")!,
];
