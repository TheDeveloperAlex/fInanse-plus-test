import type { ButtonHTMLAttributes } from 'react';
import { BUTTON_VARIANT_CLASSES, type ButtonVariant } from './buttonVariants';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = 'secondary', className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-control max-md:min-h-11 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${BUTTON_VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
