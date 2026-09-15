'use client';

import type { CSSProperties } from 'react';
import { useAtomValue } from 'jotai';
import {
  densityAtom,
  fontAtom,
  headerAlignAtom,
  primaryColorAtom,
  secondaryColorAtom,
} from '@/lib/atoms/settings';
import type { DocumentFont } from '@/lib/types';
import { ItemsTable } from './ItemsTable';
import { PaperFooter } from './PaperFooter';
import { PaperHeader } from './PaperHeader';
import { PartiesBlock } from './PartiesBlock';
import { TotalsBlock } from './TotalsBlock';
import styles from './InvoicePaper.module.css';

const FONT_STACKS: Record<DocumentFont, string> = {
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', Times, serif",
  mono: "'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace",
};

type PaperCSSVariables = CSSProperties & {
  '--tpl-primary': string;
  '--tpl-secondary': string;
  '--tpl-font': string;
};

export function InvoicePaper() {
  const primaryColor = useAtomValue(primaryColorAtom);
  const secondaryColor = useAtomValue(secondaryColorAtom);
  const font = useAtomValue(fontAtom);
  const density = useAtomValue(densityAtom);
  const headerAlign = useAtomValue(headerAlignAtom);

  const paperStyle: PaperCSSVariables = {
    '--tpl-primary': primaryColor,
    '--tpl-secondary': secondaryColor,
    '--tpl-font': FONT_STACKS[font],
  };

  return (
    <div className={styles.paper} data-density={density} style={paperStyle}>
      <PaperHeader headerAlign={headerAlign} />
      <PartiesBlock />
      <ItemsTable />
      <TotalsBlock />
      <PaperFooter />
    </div>
  );
}
