import type { InputHTMLAttributes } from 'react';

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className = '', ...props }: TextInputProps) {
  return (
    <input
      {...props}
      className={`h-control w-full rounded-md border border-border bg-surface px-2.5 text-sm text-ink placeholder:text-ink-subtle hover:border-border-strong focus-visible:border-border-strong disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}
