'use client';

import type { ReactNode } from 'react';
import { useHydrateAtoms } from 'jotai/utils';
import { themeAtom, type Theme } from '@/lib/atoms/ui';

type ThemeHydratorProps = {
  theme: Theme;
  children: ReactNode;
};

export function ThemeHydrator({ theme, children }: ThemeHydratorProps) {
  useHydrateAtoms([[themeAtom, theme]]);
  return <>{children}</>;
}
