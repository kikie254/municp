"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-paper-line border-y border-paper-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-button-${i}`}
                className="flex w-full items-start justify-between gap-5 py-4 text-left"
              >
                <span className={`text-[14px] font-semibold leading-snug transition-colors ${isOpen ? "text-green-700" : "text-green-900"}`}>
                  {item.question}
                </span>
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border transition-colors ${isOpen ? "border-green-700 bg-green-700 text-white" : "border-paper-line text-green-800"}`}>
                  {isOpen ? <Minus className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-button-${i}`}
              hidden={!isOpen}
              className="pb-5 pr-10"
            >
              <p className="text-[13px] leading-[1.8] text-ink-soft">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
