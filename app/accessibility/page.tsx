import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Accessibility features built into the Iten-Tambach Municipality website, the corrections made in this revision, and how to report a barrier.",
  alternates: { canonical: "/accessibility" },
};

/**
 * ACCESSIBILITY STATEMENT — NO CONFORMANCE CLAIM.
 *
 * The supplied build stated accessibility features as settled facts and implied conformance. No
 * independent accessibility audit (WCAG, or any other standard) has been performed on this site,
 * so no conformance level is claimed. The list below records what is implemented and what was
 * corrected in this phase; it is a statement of work done, not certification.
 */
const items = [
  {
    title: "Keyboard navigation and dropdown menus",
    text: "Navigation, filters, accordions, dialogs and forms are operable from a keyboard. Desktop dropdown menus previously opened only on mouse hover, which left submenu links unreachable without a mouse; they now also open on keyboard focus, expose aria-expanded and aria-controls, close when focus leaves the menu, and close on Escape with focus returned to the parent link.",
  },
  {
    title: "Mobile navigation controls",
    text: "The control that opens the mobile navigation has an accessible name, exposes its expanded state, and declares the dialog it controls. The drawer is a labelled modal dialog, it can be dismissed with Escape, and the page behind it does not scroll while it is open.",
  },
  {
    title: "Visible focus",
    text: "A high-contrast focus outline is defined for every focusable element, and a skip-to-content link is the first focusable item on the page.",
  },
  {
    title: "Structure and headings",
    text: "Pages use semantic landmarks and an ordered heading hierarchy, with one h1 per page. Breadcrumbs are marked up as a labelled list.",
  },
  {
    title: "Colour and contrast",
    text: "Body text is a dark neutral on light backgrounds, with deep green reserved for headings and navigation. Status is never communicated by colour alone: every sample, pending and verification label carries text.",
  },
  {
    title: "Forms and validation",
    text: "Every field has a visible, programmatically associated label. Required fields are marked in the label text, errors are announced with a role of alert, and invalid fields carry aria-invalid with a description that points to the error text. Focus moves to the first invalid field on submission.",
  },
  {
    title: "Images",
    text: "Content photographs carry descriptive alternative text describing what the image shows. Purely decorative images are marked aria-hidden with an empty alt attribute so that a screen reader does not announce them.",
  },
  {
    title: "Motion",
    text: "Animations are short transitions on scroll and hover. The prefers-reduced-motion preference is honoured site-wide: animation and transition durations are reduced to effectively zero and smooth scrolling is disabled.",
  },
  {
    title: "Text sizing and zoom",
    text: "Layouts are built from 360px upward and body copy is set at a comfortable reading size, so text remains legible when the browser is zoomed.",
  },
  {
    title: "Documents",
    text: "Municipal documents are published by the County Government as PDF files and some are scanned images without a text layer, which makes them harder to use with a screen reader. If a published file is not accessible to you, contact the municipal office and ask for the information in another form.",
  },
];

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        title="Accessibility"
        intro="This website is built to be usable by every resident, including people using assistive technology, keyboards and small screens. This page records what is implemented and what still needs testing."
        image="/images/highlands.jpg"
        imageAlt="Highland landscape with scattered settlement in Elgeyo Marakwet County"
        eyebrow="Inclusion"
        crumbs={[{ label: "Accessibility" }]}
      />
      <section className="bg-white py-14">
        <div className="shell max-w-3xl">
          <div className="border-l-[3px] border-gold-400 bg-gold-50 p-4">
            <p className="text-[12px] leading-[1.8] text-green-900">
              <strong className="font-semibold uppercase tracking-[0.07em]">No conformance level is claimed. </strong>
              This website has not been independently audited against WCAG or any other standard, so no conformance
              level is asserted. The items below describe implemented behaviour and the corrections made in this
              revision — they are a statement of work done, not a certificate.
            </p>
          </div>

          <dl className="mt-8 divide-y divide-paper-line border-y border-paper-line">
            {items.map((i) => (
              <div key={i.title} className="py-4">
                <dt className="font-display text-[13.5px] font-bold text-green-900">{i.title}</dt>
                <dd className="mt-1 text-[12.5px] leading-[1.85] text-ink-soft">{i.text}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 border border-paper-line bg-paper-warm p-5">
            <h2 className="font-display text-[12.5px] font-bold uppercase tracking-[0.07em] text-green-900">
              Still to be done before launch
            </h2>
            <ul className="mt-2.5 space-y-1.5 text-[12px] leading-relaxed text-ink-soft">
              <li>An independent accessibility audit against a defined standard, and publication of the result.</li>
              <li>Manual testing with a screen reader (NVDA, JAWS or VoiceOver) and with keyboard only.</li>
              <li>A confirmed accessibility contact route, once office contact details are confirmed.</li>
            </ul>
          </div>

          <p className="mt-6 text-[12px] leading-relaxed text-ink-muted">
            If you encounter a barrier on this website, please report it by writing to the municipal office at{" "}
            {site.contact.postal}, or visit the office in person at {site.contact.physical}.
          </p>
        </div>
      </section>
    </>
  );
}
