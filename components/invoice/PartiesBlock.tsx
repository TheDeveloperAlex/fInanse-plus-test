'use client';

import { useAtomValue } from 'jotai';
import { labelsAtom, showBlocksAtom } from '@/lib/atoms/settings';
import { SAMPLE_INVOICE } from '@/lib/sample-invoice';

export function PartiesBlock() {
  const labels = useAtomValue(labelsAtom);
  const show = useAtomValue(showBlocksAtom);

  return (
    <div className="mt-10 flex justify-between gap-8 text-xs">
      <div>
        <p className="font-medium text-gray-900">{SAMPLE_INVOICE.sender.name}</p>
        <p className="whitespace-pre-line text-gray-500">{SAMPLE_INVOICE.sender.address}</p>
      </div>
      {show.billedTo ? (
        <div className="text-right">
          <p className="text-gray-500">{labels.billedTo}</p>
          <p className="font-medium text-gray-900">{SAMPLE_INVOICE.billedTo.name}</p>
          <p className="whitespace-pre-line text-gray-500">{SAMPLE_INVOICE.billedTo.address}</p>
        </div>
      ) : null}
    </div>
  );
}
