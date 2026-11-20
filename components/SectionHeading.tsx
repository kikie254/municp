export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
      {eyebrow && (
        <p className={`eyebrow mb-3.5 ${light ? "eyebrow-light" : ""} ${align === "center" ? "justify-center" : ""}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-balance font-display text-[1.55rem] font-extrabold leading-[1.14] tracking-[-0.02em] sm:text-[1.9rem] md:text-[2.25rem] ${
          light ? "text-white" : "text-green-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-pretty text-[14.5px] leading-[1.8] ${light ? "text-white/65" : "text-ink-soft"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
