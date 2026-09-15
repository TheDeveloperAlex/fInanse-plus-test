'use client';

import { useAtom } from 'jotai';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/SegmentedControl';
import { mobileViewAtom, type MobileView } from '@/lib/atoms/ui';
import printStyles from '@/styles/print.module.css';
import { PreviewCanvas } from './PreviewCanvas';
import { SettingsWorkspace } from './SettingsWorkspace';

const MOBILE_VIEW_OPTIONS: SegmentedOption<MobileView>[] = [
  { value: 'settings', label: 'Settings' },
  { value: 'preview', label: 'Preview' },
];

export function StudioBody() {
  const [mobileView, setMobileView] = useAtom(mobileViewAtom);

  return (
    <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
      <div
        className={`flex justify-center border-b border-border bg-surface p-2 md:hidden ${printStyles.hideOnPrint}`}
      >
        <SegmentedControl
          value={mobileView}
          onValueChange={setMobileView}
          options={MOBILE_VIEW_OPTIONS}
          aria-label="View"
        />
      </div>

      <div className={mobileView === 'preview' ? 'hidden md:flex' : 'flex md:flex'}>
        <SettingsWorkspace />
      </div>

      <div
        className={`flex-1 overflow-hidden ${mobileView === 'settings' ? 'hidden md:flex' : 'flex md:flex'}`}
      >
        <PreviewCanvas />
      </div>
    </div>
  );
}
