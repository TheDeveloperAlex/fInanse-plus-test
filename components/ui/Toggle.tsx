'use client';

import { Switch } from 'radix-ui';
import styles from './Toggle.module.css';

type ToggleProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
  'aria-label'?: string;
};

export function Toggle({ checked, onCheckedChange, id, disabled, ...rest }: ToggleProps) {
  return (
    <Switch.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={styles.root}
      {...rest}
    >
      <Switch.Thumb className={styles.thumb} />
    </Switch.Root>
  );
}
