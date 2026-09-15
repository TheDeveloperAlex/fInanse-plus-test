'use client';

import { Check, ChevronDown } from 'lucide-react';
import { Select as RadixSelect } from 'radix-ui';

export type SelectOption<Value extends string> = { value: Value; label: string };

type SelectProps<Value extends string> = {
  value: Value;
  onValueChange: (value: Value) => void;
  options: SelectOption<Value>[];
  id?: string;
  'aria-label'?: string;
};

export function Select<Value extends string>({
  value,
  onValueChange,
  options,
  id,
  ...rest
}: SelectProps<Value>) {
  return (
    <RadixSelect.Root
      value={value}
      onValueChange={(next) => {
        const match = options.find((option) => option.value === next);
        if (match) onValueChange(match.value);
      }}
    >
      <RadixSelect.Trigger
        id={id}
        className="flex h-control items-center justify-between gap-2 rounded-md border border-border bg-surface px-2.5 text-sm text-ink hover:border-border-strong focus-visible:border-border-strong data-[state=open]:border-border-strong"
        {...rest}
      >
        <RadixSelect.Value />
        <RadixSelect.Icon>
          <ChevronDown className="size-3.5 text-ink-subtle" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className="overflow-hidden rounded-md border border-border bg-surface shadow-lg"
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className="flex h-control cursor-pointer items-center justify-between gap-2 rounded-sm px-2.5 text-sm text-ink outline-none data-[highlighted]:bg-surface-hover"
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator>
                  <Check className="size-3.5" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
