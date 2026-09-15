'use client';

import { FileText, LayoutGrid, PaintBucket, type LucideIcon } from 'lucide-react';
import { Tabs } from 'radix-ui';
import type { StudioSection } from '@/lib/atoms/ui';

const SECTIONS: { value: StudioSection; label: string; Icon: LucideIcon }[] = [
  { value: 'general', label: 'General', Icon: PaintBucket },
  { value: 'content', label: 'Content', Icon: FileText },
  { value: 'layout', label: 'Layout', Icon: LayoutGrid },
];

export function SectionRail() {
  return (
    <Tabs.List
      aria-label="Settings sections"
      className="flex w-rail shrink-0 flex-col items-center gap-1 border-r border-border bg-surface-sunken py-2"
    >
      {SECTIONS.map(({ value, label, Icon }) => (
        <Tabs.Trigger
          key={value}
          value={value}
          title={label}
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-hover data-[state=active]:bg-surface data-[state=active]:text-ink"
        >
          <Icon className="size-4" />
        </Tabs.Trigger>
      ))}
    </Tabs.List>
  );
}
