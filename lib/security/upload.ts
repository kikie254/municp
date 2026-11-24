import "server-only";

import { createHash } from "node:crypto";

/**
 * Upload validation rules.
 *
 * File bytes are stored in Firebase Cloud Storage (lib/services/storage.service.ts); this module
 * owns the validation that decides whether an upload is accepted at all. An attacker can rename
 * `payload.exe` to `report.pdf`, so the extension is checked against the actual leading bytes rather
 * than trusting the browser-supplied MIME type.
 */

export const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 10 * 1024 * 1024);

export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".xlsx", ".csv", ".jpg", ".jpeg", ".png", ".webp"] as const;

type Signature = { ext: string[]; mime: string; test: (b: Buffer) => boolean };

const SIGNATURES: Signature[] = [
  { ext: [".pdf"], mime: "application/pdf", test: (b) => b.subarray(0, 5).toString("latin1") === "%PDF-" },
  { ext: [".jpg", ".jpeg"], mime: "image/jpeg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: [".png"], mime: "image/png", test: (b) => b.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" },
  { ext: [".webp"], mime: "image/webp", test: (b) => b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP" },
  { ext: [".docx", ".xlsx"], mime: "application/vnd.openxmlformats-officedocument", test: (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04 },
];

export type UploadCheck =
  | { ok: true; mimeType: string; extension: string; checksum: string }
  | { ok: false; error: string };

export function inspectUpload(fileName: string, buffer: Buffer): UploadCheck {
  if (buffer.length === 0) return { ok: false, error: "The file is empty." };
  if (buffer.length > MAX_UPLOAD_BYTES) {
    return { ok: false, error: `The file exceeds the ${Math.round(MAX_UPLOAD_BYTES / 1048576)} MB limit.` };
  }
  const ext = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")).toLowerCase() : "";
  if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    return { ok: false, error: `Files of type "${ext || "(none)"}" are not accepted. Allowed: PDF, DOCX, XLSX, CSV, JPG, PNG, WEBP.` };
  }
  if (ext === ".csv") {
    // CSV has no signature. Reject binary content and any embedded markup that could be served back.
    const text = buffer.toString("utf8").replace(/^\uFEFF/, "");
    if (text.includes("\u0000")) return { ok: false, error: "The CSV file appears to contain binary data." };
    if (/<\s*script/i.test(text)) return { ok: false, error: "The CSV file contains embedded script content." };
    // ST-02 fix: a cell beginning with = + - @ (or TAB/CR) is spreadsheet formula injection — the
    // published file would be opened in Excel by citizens.
    if (/(^|[\r\n,])\s*["']?\s*[=+@-]/m.test(text)) {
      return { ok: false, error: "The CSV file contains spreadsheet formula content. Remove formulas before uploading." };
    }
    return { ok: true, mimeType: "text/csv", extension: ext, checksum: createHash("sha256").update(buffer).digest("hex") };
  }
  const match = SIGNATURES.find((s) => s.ext.includes(ext) && s.test(buffer));
  if (!match) return { ok: false, error: "The file content does not match its extension." };
  let mimeType = match.mime;
  if (match.mime.endsWith("openxmlformats-officedocument")) {
    mimeType = ext === ".docx"
      ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  return { ok: true, mimeType, extension: ext, checksum: createHash("sha256").update(buffer).digest("hex") };
}

import path from "node:path";

/** Strips directories, control characters and shell-significant characters from the display name. */
export function sanitiseFileName(fileName: string): string {
  const base = path.basename(fileName).replace(/[\u0000-\u001f<>:"/\\|?*]/g, "").trim();
  const cleaned = base.replace(/\s+/g, "-").replace(/[^A-Za-z0-9._-]/g, "");
  return cleaned.slice(0, 120) || "document";
}
