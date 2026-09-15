export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger-ghost';

export const BUTTON_BASE_CLASSES =
  'rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40';

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-ink hover:opacity-90',
  secondary: 'border border-border bg-surface text-ink hover:bg-surface-hover',
  ghost: 'text-ink-muted hover:bg-surface-hover',
  'danger-ghost': 'text-danger hover:bg-danger/10',
};
