export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label" htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="ml-1 text-flag-red" aria-hidden="true">*</span>
        ) : (
          <span className="ml-1.5 text-[10px] font-normal normal-case tracking-normal text-ink-muted">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[11.5px] text-ink-muted">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-[11.5px] font-medium text-flag-red">
          {error}
        </p>
      )}
    </div>
  );
}
