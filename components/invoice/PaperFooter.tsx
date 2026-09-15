'use client';

import { useAtomValue } from 'jotai';
import { showBlocksAtom, statementAtom, termsAtom } from '@/lib/atoms/settings';

export function PaperFooter() {
  const show = useAtomValue(showBlocksAtom);
  const terms = useAtomValue(termsAtom);
  const statement = useAtomValue(statementAtom);

  return (
    <div className="mt-10 space-y-4 border-t border-gray-200 pt-4 text-[11px] text-gray-500">
      {show.terms ? (
        <div>
          <p className="font-medium text-gray-700">Terms &amp; Conditions</p>
          <p className="whitespace-pre-line">{terms}</p>
        </div>
      ) : null}
      {show.statement ? (
        <div>
          <p className="font-medium text-gray-700">Statement</p>
          <p className="whitespace-pre-line">{statement}</p>
        </div>
      ) : null}
      <div className="flex items-center justify-between pt-2 text-gray-400">
        <span>Accept payment methods</span>
        {/* Визуальная заглушка из docs/PLAN.md §10 — без BlockKey и без обработчика клика */}
        <span className="cursor-default select-none underline decoration-dotted">Manage</span>
      </div>
    </div>
  );
}
