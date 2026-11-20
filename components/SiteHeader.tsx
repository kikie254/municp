"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu, X, Search, ChevronDown, MessageSquare, Phone, ArrowUpRight,
} from "lucide-react";
import { adminPreviewEnabled, navigation, site } from "@/lib/site";
import { SearchDialog } from "./SearchDialog";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-green-900"
      >
        Skip to main content
      </a>

      {/* Utility bar */}
      <div className="bg-green-950 text-white">
        <div className="shell flex h-9 items-center justify-between gap-4">
          <p className="truncate text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/75">
            <Link href={site.countyWebsite} className="transition-colors hover:text-gold-300" target="_blank" rel="noopener noreferrer">
              {site.county}
            </Link>
            <span className="mx-2 text-white/25">|</span>
            <span>{site.republic}</span>
          </p>
          <div className="hidden items-center gap-5 text-[11px] font-medium text-white/70 md:flex">
            <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-300">
              <Phone className="h-3 w-3" aria-hidden="true" /> {site.contact.phoneDisplay}
            </a>
            <Link href="/news" className="transition-colors hover:text-gold-300">
              Public Notices
            </Link>
            <Link href={site.countyWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-gold-300">
              County Website <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className={`border-b border-paper-line bg-white transition-shadow duration-300 ${scrolled ? "shadow-[0_10px_30px_-24px_rgba(6,43,28,0.5)]" : ""}`}>
        <div className="shell flex items-center justify-between gap-3 py-3.5 md:py-4">
          <Link href="/" className="group flex min-w-0 items-center gap-3 md:gap-4" aria-label={`${site.name} home`}>
            <span className="relative block h-11 w-11 shrink-0 md:h-[58px] md:w-[58px]">
              <Image
                src="/brand/elgeyo-marakwet-crest.png"
                alt="Official crest of the County Government of Elgeyo Marakwet"
                fill
                priority
                sizes="58px"
                className="object-contain"
              />
            </span>
            <span className="min-w-0 border-l border-paper-line pl-3 md:pl-4">
              <span className="block truncate font-display text-[15px] font-extrabold uppercase leading-tight tracking-[0.055em] text-green-900 sm:text-[17px] md:text-[20px]">
                Iten-Tambach Municipality
              </span>
              <span className="mt-0.5 block text-[9px] font-semibold uppercase leading-tight tracking-[0.15em] text-ink-muted sm:text-[10px] md:text-[10.5px]">
                {site.county}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 w-10 items-center justify-center rounded-sm border border-paper-line text-green-800 transition-colors hover:border-green-700 hover:bg-green-50 md:flex"
              aria-label="Search this website"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            <Link href="/feedback" className="btn btn-gold hidden !py-3 !text-[12px] sm:inline-flex">
              <MessageSquare aria-hidden="true" /> Citizen Feedback
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-paper-line text-green-900 transition-colors hover:bg-green-50 lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-haspopup="dialog"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary navigation */}
      <nav aria-label="Primary" className="sticky top-0 z-40 hidden border-b border-green-950/40 bg-green-800 shadow-[0_6px_20px_-16px_rgba(0,0,0,0.7)] lg:block">
        <div className="shell flex items-stretch justify-between">
          <ul className="flex items-stretch">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const hasChildren = Boolean(item.children?.length);
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && setOpenMenu(item.label)}
                  onMouseLeave={() => hasChildren && setOpenMenu(null)}
                  // Keyboard support: opening on focus and closing when focus leaves the item keeps
                  // submenu links reachable by Tab, and Escape dismisses the submenu without trapping
                  // the user inside it.
                  onFocus={() => hasChildren && setOpenMenu(item.label)}
                  onBlur={(e) => {
                    if (!hasChildren) return;
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMenu(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && openMenu === item.label) {
                      setOpenMenu(null);
                      (e.currentTarget.querySelector("a") as HTMLElement | null)?.focus();
                    }
                  }}
                >
                  <Link
                    href={item.href}
                    data-active={active}
                    aria-current={active ? "page" : undefined}
                    aria-expanded={hasChildren ? openMenu === item.label : undefined}
                    aria-controls={hasChildren ? `submenu-${item.href.replace(/\W/g, "")}` : undefined}
                    className={`menu-underline relative flex h-[52px] items-center gap-1 px-3.5 text-[12.5px] font-semibold tracking-[0.045em] transition-colors xl:px-4 ${
                      active ? "text-white" : "text-white/85 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {hasChildren && <ChevronDown className="mt-0.5 h-3 w-3 opacity-70" aria-hidden="true" />}
                  </Link>

                  {hasChildren && openMenu === item.label && (
                    <div
                      id={`submenu-${item.href.replace(/\W/g, "")}`}
                      className="absolute left-0 top-full z-50 w-[310px] animate-scale-in border-t-2 border-gold-400 bg-white p-2 shadow-lift"
                    >
                      {item.children!.map((child) => (
                        <Link
                          key={child.href + child.label}
                          href={child.href}
                          className="block rounded-sm px-3 py-2.5 transition-colors hover:bg-green-50"
                        >
                          <span className="block text-[13px] font-semibold text-green-900">{child.label}</span>
                          {child.description && (
                            <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-muted">{child.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-[52px] w-12 items-center justify-center text-white/80 transition-colors hover:bg-green-700 hover:text-white"
              aria-label="Search this website"
            >
              <Search className="h-[17px] w-[17px]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
          className={`absolute inset-0 bg-green-950/60 backdrop-blur-[2px] transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-[380px] flex-col bg-white transition-transform duration-300 ease-smooth ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-paper-line bg-green-900 px-5 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/elgeyo-marakwet-crest.png"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <div>
                <p className="font-display text-[12.5px] font-bold uppercase leading-tight tracking-[0.08em] text-white">
                  Iten-Tambach
                </p>
                <p className="text-[9px] uppercase tracking-[0.14em] text-white/60">Municipality</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/20 text-white"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSearchOpen(true);
              }}
              className="mb-4 flex w-full items-center gap-2.5 border border-paper-line bg-paper-warm px-3.5 py-3 text-left text-[13px] text-ink-muted"
            >
              <Search className="h-4 w-4 text-green-700" aria-hidden="true" /> Search the website
            </button>

            <ul className="divide-y divide-paper-line">
              {navigation.map((item) => (
                <li key={item.label} className="py-0.5">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className={`block flex-1 py-3 text-[14px] font-semibold ${
                        isActive(item.href) ? "text-green-700" : "text-green-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                        aria-label={`Toggle ${item.label} submenu`}
                        aria-expanded={openMenu === item.label}
                        className="flex h-8 w-8 items-center justify-center text-ink-muted"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${openMenu === item.label ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </div>
                  {item.children && openMenu === item.label && (
                    <ul className="mb-2 space-y-1 border-l border-gold-400/70 pl-3.5">
                      {item.children.map((child) => (
                        <li key={child.href + child.label}>
                          <Link href={child.href} className="block py-1.5 text-[12.5px] text-ink-soft">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="py-0.5">
                <Link href="/feedback" className="block py-3 text-[14px] font-semibold text-green-900">
                  Complaints and Feedback
                </Link>
              </li>
              {/* Phase 1: the administration demonstration is withdrawn by default and is never
                  hardcoded into the mobile drawer. It appears only when a review build explicitly
                  enables it, matching the desktop/footer behaviour. */}
              {adminPreviewEnabled && (
                <li className="py-0.5">
                  <Link href="/admin-preview" className="block py-3 text-[14px] font-semibold text-green-900">
                    Administration Preview (demonstration)
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-2.5 border-t border-paper-line bg-paper-warm px-5 py-4">
            <Link href="/feedback" className="btn btn-gold w-full !py-3 !text-[12.5px]">
              <MessageSquare aria-hidden="true" /> Share Your Feedback
            </Link>
            <a
              href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 text-[12px] font-semibold text-green-800"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {site.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
