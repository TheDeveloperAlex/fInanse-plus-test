import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { BUTTON_VARIANT_CLASSES } from './buttonVariants';
import { Tooltip } from './Tooltip';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  label: string;
};

export function IconButton({ icon: Icon, label, className = '', ...props }: IconButtonProps) {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        aria-label={label}
        className={`flex h-7 w-7 max-md:h-11 max-md:w-11 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${BUTTON_VARIANT_CLASSES.ghost} ${className}`}
        {...props}
      >
        <Icon className="size-3.5" />
      </button>
    </Tooltip>
  );
}
