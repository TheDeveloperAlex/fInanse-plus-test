'use client';

import { useEffect, type ReactNode } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { resetHistoryAtom } from '@/lib/atoms/history';
import { isHydratedAtom, markHydratedAtom } from '@/lib/atoms/saved';
import { StudioSkeleton } from './StudioSkeleton';

type HydrationGateProps = {
  children: ReactNode;
};

export function HydrationGate({ children }: HydrationGateProps) {
  const [isHydrated, setHydrated] = useAtom(isHydratedAtom);
  const markHydrated = useSetAtom(markHydratedAtom);
  const resetHistory = useSetAtom(resetHistoryAtom);

  // Черновик из localStorage гидрируется в эффекте атома (jotai onMount), а не
  // во время рендера. Сразу после монтирования фиксируем его как "сохранённый"
  // и обрезаем историю — иначе первый Undo откатил бы к DEFAULTS (ADR-3). До
  // этого момента показываем skeleton, а не DEFAULTS как настоящие данные (ADR-19).
  useEffect(() => {
    markHydrated();
    resetHistory();
    setHydrated(true);
  }, [markHydrated, resetHistory, setHydrated]);

  if (!isHydrated) {
    return <StudioSkeleton />;
  }

  return <>{children}</>;
}
