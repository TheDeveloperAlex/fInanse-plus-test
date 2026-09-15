'use client';

import { useAtomValue } from 'jotai';
import { formatDate } from '@/lib/format';
import { SAMPLE_INVOICE } from '@/lib/sample-invoice';
import {
  dateFormatAtom,
  headingAtom,
  labelsAtom,
  logoDataUrlAtom,
  logoSizeAtom,
  showAccentBarAtom,
  showBlocksAtom,
  showLogoAtom,
} from '@/lib/atoms/settings';
import type { HeaderAlign, LogoSize } from '@/lib/types';
import styles from './InvoicePaper.module.css';

const LOGO_SIZE_PX: Record<LogoSize, number> = { sm: 28, md: 36, lg: 48 };

type PaperHeaderProps = { headerAlign: HeaderAlign };

export function PaperHeader({ headerAlign }: PaperHeaderProps) {
  const heading = useAtomValue(headingAtom);
  const labels = useAtomValue(labelsAtom);
  const showLogo = useAtomValue(showLogoAtom);
  const logoDataUrl = useAtomValue(logoDataUrlAtom);
  const logoSize = useAtomValue(logoSizeAtom);
  const showAccentBar = useAtomValue(showAccentBarAtom);
  const show = useAtomValue(showBlocksAtom);
  const dateFormat = useAtomValue(dateFormatAtom);

  const logoPx = LOGO_SIZE_PX[logoSize];

  return (
    <div>
      {showAccentBar ? <div className={styles.accentBar} /> : null}
      <div
        className={`flex items-start justify-between gap-6 ${
          headerAlign === 'right' ? 'flex-row-reverse' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          {showLogo && logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL логотипа, next/image не подходит (ADR-15)
            <img
              src={logoDataUrl}
              alt=""
              width={logoPx}
              height={logoPx}
              className="object-contain"
              style={{ width: logoPx, height: logoPx }}
            />
          ) : null}
          <h1 className="text-[32px] font-semibold leading-none text-gray-900">{heading}</h1>
        </div>

        <dl className="grid grid-cols-[auto_auto] gap-x-3 gap-y-1 text-right text-xs">
          <dt className="text-gray-500">{labels.invoiceNumber}</dt>
          <dd className="tabular-nums text-gray-900">{SAMPLE_INVOICE.invoiceNumber}</dd>
          <dt className="text-gray-500">{labels.dateOfIssue}</dt>
          <dd className="tabular-nums text-gray-900">
            {formatDate(SAMPLE_INVOICE.issueDate, dateFormat)}
          </dd>
          {show.dueDate ? (
            <>
              <dt className="text-gray-500">{labels.dueDate}</dt>
              <dd className="tabular-nums text-gray-900">
                {formatDate(SAMPLE_INVOICE.dueDate, dateFormat)}
              </dd>
            </>
          ) : null}
        </dl>
      </div>
    </div>
  );
}
