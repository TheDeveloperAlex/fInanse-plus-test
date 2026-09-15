'use client';

import { useAtom } from 'jotai';
import { Field } from '@/components/ui/Field';
import { TextArea } from '@/components/ui/TextArea';
import { TextInput } from '@/components/ui/TextInput';
import { Toggle } from '@/components/ui/Toggle';
import { headingAtom, labelsAtom, showBlocksAtom, statementAtom, termsAtom } from '@/lib/atoms/settings';
import type { BlockKey, LabelKey } from '@/lib/types';

const LABEL_FIELDS: { key: LabelKey; fieldLabel: string }[] = [
  { key: 'invoiceNumber', fieldLabel: 'Invoice number' },
  { key: 'dateOfIssue', fieldLabel: 'Date of Issue' },
  { key: 'dueDate', fieldLabel: 'Due Date' },
  { key: 'billedTo', fieldLabel: 'Billed To' },
  { key: 'subtotal', fieldLabel: 'Subtotal' },
  { key: 'total', fieldLabel: 'Total' },
  { key: 'balanceDue', fieldLabel: 'Balance Due' },
];

const BLOCK_FIELDS: { key: BlockKey; fieldLabel: string }[] = [
  { key: 'dueDate', fieldLabel: 'Due Date' },
  { key: 'billedTo', fieldLabel: 'Billed To' },
  { key: 'itemDescription', fieldLabel: 'Item description' },
  { key: 'discount', fieldLabel: 'Discount' },
  { key: 'taxes', fieldLabel: 'Taxes' },
  { key: 'paymentMade', fieldLabel: 'Payment Made' },
  { key: 'terms', fieldLabel: 'Terms & Conditions' },
  { key: 'statement', fieldLabel: 'Statement' },
];

const TERMS_MAX_LENGTH = 500;
const STATEMENT_MAX_LENGTH = 200;

export function ContentSection() {
  const [heading, setHeading] = useAtom(headingAtom);
  const [labels, setLabels] = useAtom(labelsAtom);
  const [show, setShow] = useAtom(showBlocksAtom);
  const [terms, setTerms] = useAtom(termsAtom);
  const [statement, setStatement] = useAtom(statementAtom);

  return (
    <div className="divide-y divide-border">
      <section className="py-3">
        <h2 className="text-[13px] font-semibold text-ink">Document</h2>
        <Field label="Heading" htmlFor="doc-heading">
          <TextInput
            id="doc-heading"
            value={heading}
            onChange={(event) => setHeading(event.target.value)}
            className="w-40"
          />
        </Field>
      </section>

      <section className="py-3">
        <h2 className="text-[13px] font-semibold text-ink">Labels</h2>
        {LABEL_FIELDS.map(({ key, fieldLabel }) => (
          <Field key={key} label={fieldLabel} htmlFor={`label-${key}`}>
            <TextInput
              id={`label-${key}`}
              value={labels[key]}
              onChange={(event) => setLabels({ ...labels, [key]: event.target.value })}
              className="w-40"
            />
          </Field>
        ))}
      </section>

      <section className="py-3">
        <h2 className="text-[13px] font-semibold text-ink">Visibility</h2>
        {BLOCK_FIELDS.map(({ key, fieldLabel }) => (
          <Field key={key} label={fieldLabel} htmlFor={`show-${key}`}>
            <Toggle
              id={`show-${key}`}
              checked={show[key]}
              onCheckedChange={(checked) => setShow({ ...show, [key]: checked })}
            />
          </Field>
        ))}
      </section>

      <section className="py-3">
        <h2 className="text-[13px] font-semibold text-ink">Terms &amp; Statement</h2>
        <div className="py-2">
          <label htmlFor="terms" className="text-xs font-medium text-ink-muted">
            Terms &amp; Conditions
          </label>
          <div className="mt-1.5">
            <TextArea
              id="terms"
              value={terms}
              maxLength={TERMS_MAX_LENGTH}
              onChange={(event) => setTerms(event.target.value)}
            />
          </div>
        </div>
        <div className="py-2">
          <label htmlFor="statement" className="text-xs font-medium text-ink-muted">
            Statement
          </label>
          <div className="mt-1.5">
            <TextArea
              id="statement"
              value={statement}
              maxLength={STATEMENT_MAX_LENGTH}
              onChange={(event) => setStatement(event.target.value)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
