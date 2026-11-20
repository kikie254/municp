"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Administration" className="lg:sticky lg:top-6 lg:self-start">
      <ul className="flex gap-1 overflow-x-auto border-b border-paper-line pb-2 lg:flex-col lg:overflow-visible lg:border-0 lg:pb-0">
        {items.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="shrink-0 lg:shrink">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block whitespace-nowrap border-l-[3px] px-3 py-2 text-[12.5px] font-medium transition-colors ${
                  active ? "border-gold-400 bg-white text-green-900 shadow-card" : "border-transparent text-ink-soft hover:bg-white/70 hover:text-green-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
