'use client';

import { useEffect, type ReactNode } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { resetHistoryAtom } from '@/lib/atoms/history';
import { isHydratedAtom, markHydratedAtom } from '@/lib/atoms/saved';
import { settingsMountTriggerAtom } from '@/lib/atoms/settings';
import { StudioSkeleton } from './StudioSkeleton';

type HydrationGateProps = {
  children: ReactNode;
};

export function HydrationGate({ children }: HydrationGateProps) {
  const [isHydrated, setHydrated] = useAtom(isHydratedAtom);
  const markHydrated = useSetAtom(markHydratedAtom);
  const resetHistory = useSetAtom(resetHistoryAtom);

  // useSetAtom never subscribes settingsAtom, so its atomWithStorage onMount
  // (the actual localStorage read) would otherwise only fire once TopBar/
  // StudioBody mount a lens of it — which happens AFTER this gate's own effect
  // below, since children stay unmounted behind `isHydrated` until then. This
  // subscription forces that mount first: React flushes effects for hooks
  // within one component in call order, so useAtomValue's internal mount
  // effect runs before the useEffect below in the same commit, and
  // markHydrated() below reads the real persisted draft instead of DEFAULTS.
  useAtomValue(settingsMountTriggerAtom);

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
