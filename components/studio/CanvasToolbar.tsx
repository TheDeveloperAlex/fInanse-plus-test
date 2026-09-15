'use client';

import { useAtom } from 'jotai';
import { Minus, Plus, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
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
      <IconButton
        icon={Minus}
        label="Zoom out"
        onClick={() => setZoom(clampZoom(zoom - ZOOM_STEP))}
      />
      <span className="w-12 text-center text-xs tabular-nums text-ink-muted">
        {formatZoom(zoom)}
      </span>
      <IconButton
        icon={Plus}
        label="Zoom in"
        onClick={() => setZoom(clampZoom(zoom + ZOOM_STEP))}
      />
      <Button variant="ghost" className="ml-1" onClick={() => setZoom(1)}>
        Fit
      </Button>
      <IconButton icon={Printer} label="Print" className="ml-1" onClick={() => window.print()} />
    </div>
  );
}
