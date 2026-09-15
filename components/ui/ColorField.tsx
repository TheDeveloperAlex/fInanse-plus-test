'use client';

import { useId, useState } from 'react';
import { Popover } from 'radix-ui';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { contrastRatio } from '@/lib/contrast';
import { formatContrastRatio } from '@/lib/format';
import styles from './ColorField.module.css';

const MIN_CONTRAST_ON_PAPER = 3;

type ColorFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  presets: string[];
};

export function ColorField({ id, value, onChange, label, presets }: ColorFieldProps) {
  const [open, setOpen] = useState(false);
  const inputId = useId();
  const contrast = contrastRatio(value, '#ffffff');
  const lowContrast = contrast < MIN_CONTRAST_ON_PAPER;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          id={id}
          type="button"
          aria-label={label}
          className={styles.swatch}
          style={{ backgroundColor: value }}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={8} align="end" className={styles.content}>
          <div className={styles.picker}>
            <HexColorPicker color={value} onChange={onChange} />
          </div>

          <label htmlFor={inputId} className="sr-only">
            {label} hex value
          </label>
          <HexColorInput
            id={inputId}
            color={value}
            onChange={onChange}
            prefixed
            className="mt-2 h-control w-full rounded-md border border-border bg-surface px-2.5 text-sm uppercase text-ink hover:border-border-strong focus-visible:border-border-strong"
          />

          {lowContrast ? (
            <p className="mt-2 text-[11px] text-danger">
              Low contrast on white paper ({formatContrastRatio(contrast)})
            </p>
          ) : null}

          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-label={`Preset ${preset}`}
                onClick={() => onChange(preset)}
                className={styles.preset}
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
