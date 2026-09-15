'use client';

import { useAtom } from 'jotai';
import { Minus, Plus, Printer } from 'lucide-react';
import { zoomAtom } from '@/lib/atoms/ui';
import { formatZoom } from '@/lib/format';
import printStyles from '@/styles/print.module.css';

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 1.5;
export const ZOOM_STEP = 0.1;

export function clampZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));
}

export function CanvasToolbar() {
  const [zoom, setZoom] = useAtom(zoomAtom);

  return (
    <div
      className={`flex h-10 max-md:h-14 shrink-0 items-center justify-center gap-1.5 border-t border-border bg-surface px-3 ${printStyles.hideOnPrint}`}
    >
      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => setZoom(clampZoom(zoom - ZOOM_STEP))}
        className="flex h-7 w-7 max-md:h-11 max-md:w-11 items-center justify-center rounded-md text-ink-muted hover:bg-surface-hover"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-12 text-center text-xs tabular-nums text-ink-muted">
        {formatZoom(zoom)}
      </span>
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => setZoom(clampZoom(zoom + ZOOM_STEP))}
        className="flex h-7 w-7 max-md:h-11 max-md:w-11 items-center justify-center rounded-md text-ink-muted hover:bg-surface-hover"
      >
        <Plus className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setZoom(1)}
        className="ml-1 rounded-md px-2.5 py-1 max-md:min-h-11 text-xs font-medium text-ink-muted hover:bg-surface-hover"
      >
        Fit
      </button>
      <button
        type="button"
        aria-label="Print"
        onClick={() => window.print()}
        className="ml-1 flex h-7 w-7 max-md:h-11 max-md:w-11 items-center justify-center rounded-md text-ink-muted hover:bg-surface-hover"
      >
        <Printer className="size-3.5" />
      </button>
    </div>
  );
}
