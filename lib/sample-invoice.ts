export type InvoiceLineItem = {
  item: string;
  description: string;
  rateMinor: number;
};

export type SampleInvoice = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  sender: { name: string; address: string };
  billedTo: { name: string; address: string };
  lineItems: InvoiceLineItem[];
  /** ADR-13: демо-константа, не настраивается через панель настроек. */
  discountMinor: number;
  /** ADR-13: ставка налога в промилле (800 = 8.00%), демо-константа. */
  taxRatePermille: number;
  paymentMadeMinor: number;
};

export const SAMPLE_INVOICE: SampleInvoice = {
  invoiceNumber: 'INV-2026-0142',
  issueDate: '2026-09-01',
  dueDate: '2026-09-15',
  sender: {
    name: 'Acme Studio LLC',
    address: '221B Baker Street, London, UK',
  },
  billedTo: {
    name: 'Northwind Traders',
    address: '742 Evergreen Terrace, Springfield, USA',
  },
  lineItems: [
    { item: 'Brand identity package', description: 'Logo, colour system, type scale', rateMinor: 180000 },
    { item: 'Website redesign', description: 'Marketing site, 6 pages', rateMinor: 320000 },
    { item: 'Design system handoff', description: 'Component library documentation', rateMinor: 95000 },
  ],
  discountMinor: 25000,
  taxRatePermille: 80,
  paymentMadeMinor: 100000,
};
