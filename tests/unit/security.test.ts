import { describe, it, expect } from "vitest";
import { inspectUpload, sanitiseFileName } from "@/lib/security/upload";
import { submissionSchema } from "@/lib/validation/schemas";
import { slugify, publicReference, hashIp } from "@/lib/security/tokens";

/* inspectUpload(fileName, buffer) — signature verified against lib/security/upload.ts */
const pdf = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a, 0x25, 0x00]);
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
const exe = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);

describe("upload inspection", () => {
  it("accepts a real PDF", () => {
    expect(inspectUpload("minutes.pdf", pdf).ok).toBe(true);
  });

  it("accepts a real PNG", () => {
    expect(inspectUpload("photo.png", png).ok).toBe(true);
  });

  it("rejects an executable disguised as a PDF", () => {
    expect(inspectUpload("invoice.pdf", exe).ok).toBe(false);
  });

  it("rejects a disallowed extension", () => {
    expect(inspectUpload("run.sh", pdf).ok).toBe(false);
  });

  it("rejects an empty file", () => {
    expect(inspectUpload("empty.pdf", Buffer.alloc(0)).ok).toBe(false);
  });

  it("rejects a CSV containing embedded script", () => {
    expect(inspectUpload("data.csv", Buffer.from("<script>alert(1)</script>")).ok).toBe(false);
  });

  it("rejects a spreadsheet formula placed after the first 2 KB of a CSV", () => {
    const csv = Buffer.from("safe,row\n".repeat(400) + '=HYPERLINK("https://malicious.invalid","open")');
    expect(inspectUpload("late-formula.csv", csv).ok).toBe(false);
  });

  it("strips path traversal from file names", () => {
    const cleaned = sanitiseFileName("../../etc/passwd");
    expect(cleaned).not.toContain("..");
    expect(cleaned).not.toContain("/");
  });
});

describe("submission validation", () => {
  /* Server action converts the checkbox to a boolean before parsing (lib/actions/submissions.ts:40). */
  const valid = {
    type: "COMPLAINT", name: "Grace Jepkosgei", email: "grace@example.com", phone: "0712 345 678",
    subject: "Street lighting", message: "The street lights on the main road have been out for two weeks.",
    location: "Iten Central", consent: true, website: "",
  };

  it("accepts a complete submission", () => {
    expect(submissionSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a short message", () => {
    expect(submissionSchema.safeParse({ ...valid, message: "too short" }).success).toBe(false);
  });

  it("rejects a malformed email", () => {
    expect(submissionSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects a non-Kenyan phone number", () => {
    expect(submissionSchema.safeParse({ ...valid, phone: "+1 555 0100" }).success).toBe(false);
  });

  it("requires consent", () => {
    expect(submissionSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    expect(submissionSchema.safeParse({ ...valid, website: "http://spam.example" }).success).toBe(false);
  });
});

describe("token helpers", () => {
  it("slugifies titles", () => {
    expect(slugify("Iten–Tambach Market Upgrade 2026")).toBe("iten-tambach-market-upgrade-2026");
  });

  it("issues distinct public references", () => {
    const a = publicReference("ENQUIRY");
    const b = publicReference("ENQUIRY");
    expect(a).not.toBe(b);
    expect(a.startsWith("ITM-")).toBe(true);
  });

  it("hashes IP addresses irreversibly (32 hex chars, truncated sha256)", () => {
    const h = hashIp("197.248.1.1");
    expect(h).toBeDefined();
    expect(h).not.toContain("197.248");
    expect(h).toHaveLength(32);
  });
});
