'use client';

import { Tabs } from 'radix-ui';
import { BrandingSection } from '@/components/sections/BrandingSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { LayoutSection } from '@/components/sections/LayoutSection';

export function SettingsPanel() {
  return (
    <div className="flex-1 overflow-y-auto border-r border-border bg-surface px-4 md:w-panel md:flex-none md:shrink-0">
      <Tabs.Content value="general" className="focus-visible:outline-none">
        <BrandingSection />
      </Tabs.Content>
      <Tabs.Content value="content" className="focus-visible:outline-none">
        <ContentSection />
      </Tabs.Content>
      <Tabs.Content value="layout" className="focus-visible:outline-none">
        <LayoutSection />
      </Tabs.Content>
    </div>
  );
}
