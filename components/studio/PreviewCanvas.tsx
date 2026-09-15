'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { InvoicePaper } from '@/components/invoice/InvoicePaper';
import { zoomAtom } from '@/lib/atoms/ui';
import printStyles from '@/styles/print.module.css';
import { CanvasToolbar, clampZoom, ZOOM_STEP } from './CanvasToolbar';

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

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div
        className={`flex flex-1 items-start justify-center overflow-auto p-8 ${printStyles.printSurface}`}
      >
        <InvoicePaper />
      </div>
      <CanvasToolbar />
    </div>
  );
}
