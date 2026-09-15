'use client';

import { useAtom } from 'jotai';
import { Tabs } from 'radix-ui';
import { activeSectionAtom, type StudioSection } from '@/lib/atoms/ui';
import { SectionRail } from './SectionRail';
import { SettingsPanel } from './SettingsPanel';

const SECTIONS: StudioSection[] = ['general', 'content', 'layout'];

function isStudioSection(value: string): value is StudioSection {
  return SECTIONS.some((section) => section === value);
}

export function SettingsWorkspace() {
  const [section, setSection] = useAtom(activeSectionAtom);

  return (
    <Tabs.Root
      value={section}
      onValueChange={(next) => {
        if (isStudioSection(next)) setSection(next);
      }}
      orientation="vertical"
      className="flex"
    >
      <SectionRail />
      <SettingsPanel />
    </Tabs.Root>
  );
}
