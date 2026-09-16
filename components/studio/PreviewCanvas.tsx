'use client';

import { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
import { InvoicePaper } from '@/components/invoice/InvoicePaper';
import { zoomAtom } from '@/lib/atoms/ui';
import printStyles from '@/styles/print.module.css';
import { CanvasToolbar, clampZoom, ZOOM_STEP } from './CanvasToolbar';

const PAPER_WIDTH_PX = 794;
const MIN_AUTO_FIT_ZOOM = 0.3;

function computeFitZoom(availableWidth: number): number {
  const fitted = Math.round((availableWidth / PAPER_WIDTH_PX) * 100) / 100;
  return Math.max(MIN_AUTO_FIT_ZOOM, Math.min(1, fitted));
}

export function PreviewCanvas() {
  const setZoom = useSetAtom(zoomAtom);
  const paperContainerRef = useRef<HTMLDivElement>(null);

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

  // UI-SPEC "Адаптив": подгоняем зум под реальную доступную ширину контейнера
  // превью, а не под ширину окна — в двухколоночном layout колонка превью может
  // быть уже 794px бумаги на любой ширине окна, не только "мобильной".
  useEffect(() => {
    function fitToContainerWidth() {
      const container = paperContainerRef.current;
      if (!container) return;
      const style = getComputedStyle(container);
      const paddingLeft = parseFloat(style.paddingLeft);
      const paddingRight = parseFloat(style.paddingRight);
      const available = container.clientWidth - paddingLeft - paddingRight;
      const fitZoom = computeFitZoom(available);
      // Не трогаем зум, если бумага и так помещается (fitZoom === 1) — иначе
      // ресайз окна на широком экране сбрасывал бы ручной зум пользователя.
      if (fitZoom < 1) {
        setZoom(fitZoom);
      }
    }
    fitToContainerWidth();
    window.addEventListener('resize', fitToContainerWidth);
    return () => window.removeEventListener('resize', fitToContainerWidth);
  }, [setZoom]);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div
        ref={paperContainerRef}
        className={`flex flex-1 items-start justify-center overflow-auto p-4 md:p-8 ${printStyles.printSurface}`}
      >
        <InvoicePaper />
      </div>
      <CanvasToolbar />
    </div>
  );
}
