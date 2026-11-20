import { z } from "zod";

/**
 * Server-side input validation.
 *
 * Every API route and server action parses untrusted input through one of these schemas. The client
 * may validate too (for a fast, accessible response), but the client result is never trusted.
 */
const name = z.string().trim().min(2, "Please enter your name.").max(120, "That name is too long.");
const email = z.string().trim().toLowerCase().email("Please enter a valid email address.").max(200);
const phone = z
  .string()
  .trim()
  .max(30)
  .refine((v) => v === "" || /^(\+?254|0)[\s-]?7\d{2}[\s-]?\d{3}[\s-]?\d{3}$/.test(v.replace(/\s/g, "")), "Please enter a valid Kenyan mobile number, for example 0712 345 678.")
  .optional()
  .transform((v) => (v === "" ? undefined : v));

export const submissionSchema = z.object({
  type: z.enum(["ENQUIRY", "FEEDBACK", "COMPLAINT", "SUGGESTION", "PARTICIPATION"]),
  name,
  email,
  phone,
  subject: z.string().trim().min(3, "Please select or enter a subject.").max(160),
  message: z.string().trim().min(20, "Please set out your message in at least 20 characters.").max(6000, "Please keep your message under 6000 characters."),
  location: z.string().trim().max(120).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm that you consent to your details being recorded." }) }),
  // Honeypot: real people never see or fill this field.
  website: z.string().max(0).optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const participationResponseSchema = z.object({
  opportunitySlug: z.string().trim().min(1),
  name,
  email,
  phone,
  organisation: z.string().trim().max(160).optional(),
  ward: z.string().trim().max(120).optional(),
  response: z.string().trim().min(20, "Please set out your response in at least 20 characters.").max(8000),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm that you consent to your submission being recorded." }) }),
  website: z.string().max(0).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter your email address.").max(254),
  password: z.string().min(1, "Enter your password.").max(1024),
});

export const newsSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(6, "A title is required.").max(200),
  slug: z.string().trim().max(80).optional(),
  category: z.enum(["Municipal News", "Public Notices", "Development Updates", "Community Activities", "Events"]),
  summary: z.string().trim().min(20, "Add a summary of at least 20 characters.").max(400),
  body: z.string().trim().min(40, "Add the article body.").max(40000),
  imagePath: z
    .string()
    .trim()
    .max(300)
    .regex(/^\/images\/[A-Za-z0-9._/-]*$/, "Use a path inside /images (for example /images/iten-town-aerial.webp).")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  imageAlt: z.string().trim().max(200).optional(),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(180).optional(),
  scheduledFor: z.string().trim().optional(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(6).max(200),
  slug: z.string().trim().max(80).optional(),
  category: z.enum(["Urban Infrastructure", "Environmental Initiatives", "Community Development", "Public Spaces", "Trade and Enterprise"]),
  projectStatus: z.enum(["Ongoing", "Completed", "Planned"]),
  location: z.string().trim().min(3, "A location is required.").max(180),
  summary: z.string().trim().min(20).max(400),
  description: z.string().trim().min(40).max(40000),
  objectives: z.string().trim().max(4000).optional(),
  budget: z.string().trim().max(80).optional(),
  startDate: z.string().trim().max(40).optional(),
  completionDate: z.string().trim().max(40).optional(),
  implementingAgency: z.string().trim().max(160).optional(),
  imagePath: z
    .string()
    .trim()
    .max(300)
    .regex(/^\/images\/[A-Za-z0-9._/-]*$/, "Use a path inside /images (for example /images/iten-town-aerial.webp).")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  imageAlt: z.string().trim().max(200).optional(),
});

export const noticeSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(6).max(200),
  slug: z.string().trim().max(80).optional(),
  category: z.string().trim().min(3).max(60),
  body: z.string().trim().min(20).max(20000),
  expiresAt: z.string().trim().optional(),
  documentId: z.string().trim().optional(),
});

export const documentSchema = z.object({
  title: z.string().trim().min(4, "A title is required.").max(200),
  category: z.string().trim().min(3).max(80),
  description: z.string().trim().min(10, "Add a short description.").max(1000),
  documentDate: z.string().trim().optional(),
});

export const participationSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(6).max(200),
  slug: z.string().trim().max(80).optional(),
  description: z.string().trim().min(20).max(20000),
  kind: z.enum(["Consultation", "Meeting", "Notice", "Survey"]),
  location: z.string().trim().max(200).optional(),
  instructions: z.string().trim().max(4000).optional(),
  opensAt: z.string().trim().optional(),
  closesAt: z.string().trim().optional(),
});

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["SUPER_ADMIN", "CONTENT_ADMIN", "PROJECT_ADMIN", "REVIEWER"]),
  password: z.string().optional(),
});

export const resetRequestSchema = z.object({ email: z.string().trim().toLowerCase().email() });
export const resetCompleteSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(12, "Use at least 12 characters."),
});

/** Flattens a ZodError into `{ field: message }` for accessible per-field display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
