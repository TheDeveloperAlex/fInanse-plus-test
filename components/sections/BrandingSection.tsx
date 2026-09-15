'use client';

import { useAtom } from 'jotai';
import { ColorField } from '@/components/ui/ColorField';
import { Field } from '@/components/ui/Field';
import { LogoUploader } from '@/components/ui/LogoUploader';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/SegmentedControl';
import { TextInput } from '@/components/ui/TextInput';
import { Toggle } from '@/components/ui/Toggle';
import {
  logoDataUrlAtom,
  logoSizeAtom,
  nameAtom,
  primaryColorAtom,
  secondaryColorAtom,
  showAccentBarAtom,
  showLogoAtom,
} from '@/lib/atoms/settings';
import { COLOR_PRESETS } from '@/lib/presets';
import type { LogoSize } from '@/lib/types';

const PRIMARY_PRESETS = COLOR_PRESETS.map((preset) => preset.primaryColor);
const SECONDARY_PRESETS = COLOR_PRESETS.map((preset) => preset.secondaryColor);

const LOGO_SIZE_OPTIONS: SegmentedOption<LogoSize>[] = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
];

export function BrandingSection() {
  const [name, setName] = useAtom(nameAtom);
  const [logoDataUrl, setLogoDataUrl] = useAtom(logoDataUrlAtom);
  const [showLogo, setShowLogo] = useAtom(showLogoAtom);
  const [logoSize, setLogoSize] = useAtom(logoSizeAtom);
  const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
  const [secondaryColor, setSecondaryColor] = useAtom(secondaryColorAtom);
  const [showAccentBar, setShowAccentBar] = useAtom(showAccentBarAtom);

  const nameError = name.trim().length === 0 ? 'Template name is required' : undefined;

  return (
    <div className="divide-y divide-border">
      <section className="py-3">
        <h2 className="text-[13px] font-semibold text-ink">General</h2>
        <Field label="Template name" htmlFor="template-name" error={nameError}>
          <TextInput
            id="template-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-40"
          />
        </Field>
      </section>

      <section className="py-3">
        <h2 className="text-[13px] font-semibold text-ink">Logo</h2>
        <div className="py-2">
          <LogoUploader value={logoDataUrl} onChange={setLogoDataUrl} />
        </div>
        <Field label="Show logo in document" htmlFor="show-logo">
          <Toggle id="show-logo" checked={showLogo} onCheckedChange={setShowLogo} />
        </Field>
        <Field label="Logo size" htmlFor="logo-size">
          <SegmentedControl
            id="logo-size"
            value={logoSize}
            onValueChange={setLogoSize}
            options={LOGO_SIZE_OPTIONS}
            aria-label="Logo size"
          />
        </Field>
      </section>

      <section className="py-3">
        <h2 className="text-[13px] font-semibold text-ink">Colors</h2>
        <Field label="Primary color" htmlFor="primary-color">
          <ColorField
            id="primary-color"
            value={primaryColor}
            onChange={setPrimaryColor}
            label="Primary color"
            presets={PRIMARY_PRESETS}
          />
        </Field>
        <Field label="Secondary color" htmlFor="secondary-color">
          <ColorField
            id="secondary-color"
            value={secondaryColor}
            onChange={setSecondaryColor}
            label="Secondary color"
            presets={SECONDARY_PRESETS}
          />
        </Field>
        <Field label="Accent bar" htmlFor="show-accent-bar">
          <Toggle id="show-accent-bar" checked={showAccentBar} onCheckedChange={setShowAccentBar} />
        </Field>
      </section>
    </div>
  );
}
