import { Info } from "lucide-react";

export function DemoNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex gap-3 border border-gold-400/50 bg-gold-50 px-4 py-3.5">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
      <p className="text-[12.5px] leading-relaxed text-green-900">
        <strong className="font-semibold uppercase tracking-[0.08em]">Demonstration notice — </strong>
        {children ??
          "This website is a frontend-only demonstration. Your submission is validated and previewed on your own device, is not transmitted to, stored by or registered with the municipality, and does not create an official record. For matters requiring action, please visit the municipal office in person or write to P.O. Box 220-30700, Iten."}
      </p>
    </div>
  );
}
