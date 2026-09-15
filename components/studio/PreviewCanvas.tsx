'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { InvoicePaper } from '@/components/invoice/InvoicePaper';
import { zoomAtom } from '@/lib/atoms/ui';
import printStyles from '@/styles/print.module.css';
import { CanvasToolbar, clampZoom, ZOOM_STEP } from './CanvasToolbar';

const MOBILE_BREAKPOINT_PX = 768;
const PAPER_WIDTH_PX = 794;
const MOBILE_HORIZONTAL_PADDING_PX = 32;
const MIN_AUTO_FIT_ZOOM = 0.3;

function computeFitZoom(): number {
  const available = window.innerWidth - MOBILE_HORIZONTAL_PADDING_PX;
  const fitted = Math.round((available / PAPER_WIDTH_PX) * 100) / 100;
  return Math.max(MIN_AUTO_FIT_ZOOM, Math.min(1, fitted));
}

export function PreviewCanvas() {
  const setZoom = useSetAtom(zoomAtom);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setZoom((current) => clampZoom(current + ZOOM_STEP));
      } else if (event.key === '-') {
        event.preventDefault();
        setZoom((current) => clampZoom(current - ZOOM_STEP));
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setZoom]);

  // UI-SPEC "Адаптив" < 768px: бумага по умолчанию вписывается в ширину экрана.
  useEffect(() => {
    function fitToWidthIfMobile() {
      if (window.innerWidth < MOBILE_BREAKPOINT_PX) {
        setZoom(computeFitZoom());
      }
    }
    fitToWidthIfMobile();
    window.addEventListener('resize', fitToWidthIfMobile);
    return () => window.removeEventListener('resize', fitToWidthIfMobile);
  }, [setZoom]);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div
        className={`flex flex-1 items-start justify-center overflow-auto p-4 md:p-8 ${printStyles.printSurface}`}
      >
        <InvoicePaper />
      </div>
      <CanvasToolbar />
    </div>
  );
}
