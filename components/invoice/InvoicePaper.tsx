'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  densityAtom,
  fontAtom,
  headerAlignAtom,
  primaryColorAtom,
  secondaryColorAtom,
} from '@/lib/atoms/settings';
import { zoomAtom } from '@/lib/atoms/ui';
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

// A4 at 96dpi (UI-SPEC "Документ"); also the fixed width of .paper below.
export const PAPER_WIDTH_PX = 794;

export function InvoicePaper() {
  const primaryColor = useAtomValue(primaryColorAtom);
  const secondaryColor = useAtomValue(secondaryColorAtom);
  const font = useAtomValue(fontAtom);
  const density = useAtomValue(densityAtom);
  const headerAlign = useAtomValue(headerAlignAtom);
  const zoom = useAtomValue(zoomAtom);

  const paperRef = useRef<HTMLDivElement>(null);
  // transform: scale() doesn't shrink the layout box it's applied to, so without
  // this, PreviewCanvas's scrollable container always reserves the paper's full
  // unscaled 794x(natural height) box - leaving a "phantom" scrollable area past
  // whatever is actually visible any time zoom < 100%. Sizing this wrapper to the
  // scaled dimensions makes the scroll container's content size match what's
  // actually painted.
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);

  useEffect(() => {
    const node = paperRef.current;
    if (!node) return;
    const measure = () => setNaturalHeight(node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const paperStyle: PaperCSSVariables = {
    '--tpl-primary': primaryColor,
    '--tpl-secondary': secondaryColor,
    '--tpl-font': FONT_STACKS[font],
    transform: `scale(${zoom})`,
  };

  const viewportStyle: CSSProperties | undefined =
    naturalHeight === null
      ? undefined
      : { width: PAPER_WIDTH_PX * zoom, height: naturalHeight * zoom };

  return (
    <div className={styles.paperViewport} style={viewportStyle}>
      <div ref={paperRef} className={styles.paper} data-density={density} style={paperStyle}>
        <PaperHeader headerAlign={headerAlign} />
        <PartiesBlock />
        <ItemsTable />
        <TotalsBlock />
        <PaperFooter />
      </div>
    </div>
  );
}
