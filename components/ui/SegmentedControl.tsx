'use client';

import { ToggleGroup } from 'radix-ui';

export type SegmentedOption<Value extends string> = { value: Value; label: string };

type SegmentedControlProps<Value extends string> = {
  id?: string;
  value: Value;
  onValueChange: (value: Value) => void;
  options: SegmentedOption<Value>[];
  'aria-label': string;
};

export function SegmentedControl<Value extends string>({
  value,
  onValueChange,
  options,
  ...rest
}: SegmentedControlProps<Value>) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(next) => {
        // ToggleGroup emits '' when the active item is clicked again — ignore,
        // a segmented control always keeps exactly one option selected.
        const match = options.find((option) => option.value === next);
        if (match) onValueChange(match.value);
      }}
      className="inline-flex rounded-md border border-border bg-surface-sunken p-0.5"
      {...rest}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className="rounded-sm px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors data-[state=on]:bg-surface data-[state=on]:text-ink"
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
