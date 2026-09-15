'use client';

import { useAtom } from 'jotai';
import { Field } from '@/components/ui/Field';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/SegmentedControl';
import { Select, type SelectOption } from '@/components/ui/Select';
import {
  currencyAtom,
  dateFormatAtom,
  densityAtom,
  fontAtom,
  headerAlignAtom,
} from '@/lib/atoms/settings';
import type { Currency, DateFormat, Density, DocumentFont, HeaderAlign } from '@/lib/types';

const FONT_OPTIONS: SelectOption<DocumentFont>[] = [
  { value: 'sans', label: 'Sans' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Mono' },
];

const DENSITY_OPTIONS: SegmentedOption<Density>[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'regular', label: 'Regular' },
  { value: 'relaxed', label: 'Relaxed' },
];

const HEADER_ALIGN_OPTIONS: SegmentedOption<HeaderAlign>[] = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

const CURRENCY_OPTIONS: SelectOption<Currency>[] = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'PLN', label: 'PLN' },
];

const DATE_FORMAT_OPTIONS: SelectOption<DateFormat>[] = [
  { value: 'us', label: 'MM/DD/YYYY' },
  { value: 'eu', label: 'DD/MM/YYYY' },
  { value: 'iso', label: 'YYYY-MM-DD' },
];

export function LayoutSection() {
  const [font, setFont] = useAtom(fontAtom);
  const [density, setDensity] = useAtom(densityAtom);
  const [headerAlign, setHeaderAlign] = useAtom(headerAlignAtom);
  const [currency, setCurrency] = useAtom(currencyAtom);
  const [dateFormat, setDateFormat] = useAtom(dateFormatAtom);

  return (
    <div className="divide-y divide-border">
      <section className="py-3">
        <h2 className="text-[13px] font-semibold text-ink">Document</h2>
        <Field label="Font" htmlFor="doc-font">
          <Select id="doc-font" value={font} onValueChange={setFont} options={FONT_OPTIONS} />
        </Field>
        <Field label="Density" htmlFor="doc-density">
          <SegmentedControl
            id="doc-density"
            value={density}
            onValueChange={setDensity}
            options={DENSITY_OPTIONS}
            aria-label="Density"
          />
        </Field>
        <Field label="Header alignment" htmlFor="header-align">
          <SegmentedControl
            id="header-align"
            value={headerAlign}
            onValueChange={setHeaderAlign}
            options={HEADER_ALIGN_OPTIONS}
            aria-label="Header alignment"
          />
        </Field>
      </section>

      <section className="py-3">
        <h2 className="text-[13px] font-semibold text-ink">Formatting</h2>
        <Field label="Currency" htmlFor="currency">
          <Select
            id="currency"
            value={currency}
            onValueChange={setCurrency}
            options={CURRENCY_OPTIONS}
          />
        </Field>
        <Field label="Date format" htmlFor="date-format">
          <Select
            id="date-format"
            value={dateFormat}
            onValueChange={setDateFormat}
            options={DATE_FORMAT_OPTIONS}
          />
        </Field>
      </section>
    </div>
  );
}
