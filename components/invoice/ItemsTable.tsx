'use client';

import { useAtomValue } from 'jotai';
import { currencyAtom, showBlocksAtom } from '@/lib/atoms/settings';
import { formatMoney } from '@/lib/format';
import { SAMPLE_INVOICE } from '@/lib/sample-invoice';

export function ItemsTable() {
  const currency = useAtomValue(currencyAtom);
  const show = useAtomValue(showBlocksAtom);

  return (
    <table className="mt-10 w-full border-collapse text-xs">
      <thead>
        <tr className="border-b border-gray-300 text-left text-gray-500">
          <th className="py-2 font-medium">Item</th>
          {show.itemDescription ? <th className="py-2 font-medium">Description</th> : null}
          <th className="py-2 text-right font-medium">Rate</th>
          <th className="py-2 text-right font-medium">Total</th>
        </tr>
      </thead>
      <tbody>
        {SAMPLE_INVOICE.lineItems.map((line) => (
          <tr key={line.item} className="border-b border-gray-100">
            <td className="py-2 text-gray-900">{line.item}</td>
            {show.itemDescription ? <td className="py-2 text-gray-500">{line.description}</td> : null}
            <td className="py-2 text-right tabular-nums text-gray-900">
              {formatMoney(line.rateMinor, currency)}
            </td>
            <td className="py-2 text-right tabular-nums text-gray-900">
              {formatMoney(line.rateMinor, currency)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
