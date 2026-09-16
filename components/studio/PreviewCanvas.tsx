'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
import { InvoicePaper } from '@/components/invoice/InvoicePaper';
import { zoomAtom } from '@/lib/atoms/ui';
import printStyles from '@/styles/print.module.css';
import { CanvasToolbar, clampZoom, ZOOM_STEP } from './CanvasToolbar';

const PAPER_WIDTH_PX = 794;

export function PreviewCanvas() {
  const setZoom = useSetAtom(zoomAtom);
  const paperContainerRef = useRef<HTMLDivElement>(null);

  // Ширина контейнера за вычетом его собственных отступов — то, что реально
  // доступно бумаге для кнопки "Fit".
  const measureAvailableWidth = useCallback((): number | null => {
    const container = paperContainerRef.current;
    if (!container) return null;
    const style = getComputedStyle(container);
    const paddingLeft = parseFloat(style.paddingLeft);
    const paddingRight = parseFloat(style.paddingRight);
    return container.clientWidth - paddingLeft - paddingRight;
  }, []);

  // Кнопка "Fit" (CanvasToolbar) — единственный способ подогнать зум под
  // контейнер; никакого автоматического пересчёта при монтировании/ресайзе,
  // иначе ручной зум пользователя стирается при каждом изменении окна.
  const fitToContainerWidth = useCallback(() => {
    const available = measureAvailableWidth();
    if (available === null) return;
    setZoom(clampZoom(available / PAPER_WIDTH_PX));
  }, [measureAvailableWidth, setZoom]);

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
        ref={paperContainerRef}
        className={`flex flex-1 items-start justify-start overflow-auto p-4 md:p-8 ${printStyles.printSurface}`}
      >
        <InvoicePaper />
      </div>
      <CanvasToolbar onFitToWidth={fitToContainerWidth} />
    </div>
  );
}
