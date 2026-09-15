import type { TextareaHTMLAttributes } from 'react';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  maxLength?: number;
};

export function TextArea({ className = '', maxLength, value, ...props }: TextAreaProps) {
  const length = typeof value === 'string' ? value.length : 0;

  return (
    <div className="flex flex-col gap-1">
      <textarea
        {...props}
        value={value}
        maxLength={maxLength}
        className={`min-h-20 w-full resize-none rounded-md border border-border bg-surface px-2.5 py-2 text-sm text-ink placeholder:text-ink-subtle hover:border-border-strong focus-visible:border-border-strong ${className}`}
      />
      {maxLength ? (
        <span className="self-end text-[11px] text-ink-muted">
          {length}/{maxLength}
        </span>
      ) : null}
    </div>
  );
}
