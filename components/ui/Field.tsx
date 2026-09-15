import type { ReactNode } from 'react';

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  /**
   * Reserve the message line's height even when empty, toggling only
   * `invisible`. For fields whose `error` flips on/off during typing
   * (e.g. a required-field check) — without this, the line's mount/unmount
   * shifts every field below it each keystroke (same class of bug as the
   * ColorField contrast warning). Fields that never pass hint/error don't
   * set this, so they stay exactly as compact as before.
   */
  reserveMessageSpace?: boolean;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, error, reserveMessageSpace, children }: FieldProps) {
  const message = error ?? hint;
  const NBSP = ' ';

  return (
    <div className="flex flex-col gap-1 py-2">
      <div className="flex min-h-control items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-xs font-medium text-ink-muted">
          {label}
        </label>
        <div className="shrink-0">{children}</div>
      </div>
      {message || reserveMessageSpace ? (
        <p
          className={`text-[11px] ${error ? 'text-danger' : 'text-ink-muted'} ${
            message ? '' : 'invisible'
          }`}
        >
          {message || NBSP}
        </p>
      ) : null}
    </div>
  );
}
