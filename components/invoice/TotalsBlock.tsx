'use client';

import { useAtomValue } from 'jotai';
import { totalsAtom } from '@/lib/atoms/derived';
import { currencyAtom, labelsAtom, secondaryColorAtom, showBlocksAtom } from '@/lib/atoms/settings';
import { formatMoney, formatTaxRate } from '@/lib/format';
import { SAMPLE_INVOICE } from '@/lib/sample-invoice';

type RowProps = {
  label: string;
  value: string;
  emphasize?: boolean;
  color?: string;
};

function Row({ label, value, emphasize, color }: RowProps) {
  return (
    <div
      className={
        emphasize
          ? 'mt-1 flex items-center justify-between gap-4 border-t border-gray-200 pt-2 font-semibold'
          : 'flex items-center justify-between gap-4 py-1.5 text-gray-600'
      }
      style={emphasize && color ? { color } : undefined}
    >
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

export function TotalsBlock() {
  const totals = useAtomValue(totalsAtom);
  const currency = useAtomValue(currencyAtom);
  const labels = useAtomValue(labelsAtom);
  const secondaryColor = useAtomValue(secondaryColorAtom);
  const show = useAtomValue(showBlocksAtom);

  return (
    <div className="mt-6 flex justify-end">
      <dl className="w-64 text-xs">
        <Row label={labels.subtotal} value={formatMoney(totals.subtotalMinor, currency)} />
        {show.discount ? (
          <Row label="Discount" value={`-${formatMoney(totals.discountMinor, currency)}`} />
        ) : null}
        {show.taxes ? (
          <Row
            label={`Tax (${formatTaxRate(SAMPLE_INVOICE.taxRatePermille)})`}
            value={formatMoney(totals.taxMinor, currency)}
          />
        ) : null}
        <Row
          label={labels.total}
          value={formatMoney(totals.totalMinor, currency)}
          emphasize
          color={secondaryColor}
        />
        {show.paymentMade ? (
          <Row
            label="Payment Made"
            value={`-${formatMoney(totals.paymentMadeMinor, currency)}`}
          />
        ) : null}
        <Row
          label={labels.balanceDue}
          value={formatMoney(totals.balanceDueMinor, currency)}
          emphasize
          color={secondaryColor}
        />
      </dl>
    </div>
  );
}
