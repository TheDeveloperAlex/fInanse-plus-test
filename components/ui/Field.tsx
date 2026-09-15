import type { ReactNode } from 'react';

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <div className="flex min-h-control items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-xs font-medium text-ink-muted">
          {label}
        </label>
        <div className="shrink-0">{children}</div>
      </div>
      {error ? (
        <p className="text-[11px] text-danger">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-ink-subtle">{hint}</p>
      ) : null}
    </div>
  );
}
