import type { BlockKey, LabelKey, TemplateSettings } from './types';

export const DEFAULT_LABELS: Record<LabelKey, string> = {
  invoiceNumber: 'Invoice number',
  dateOfIssue: 'Date of Issue',
  dueDate: 'Due Date',
  billedTo: 'Billed To',
  subtotal: 'Subtotal',
  total: 'Total',
  balanceDue: 'Balance Due',
};

export const DEFAULT_SHOW_BLOCKS: Record<BlockKey, boolean> = {
  dueDate: true,
  billedTo: true,
  itemDescription: true,
  discount: true,
  taxes: true,
  paymentMade: true,
  terms: true,
  statement: true,
};

export const DEFAULTS: TemplateSettings = {
  name: 'Untitled template',

  branding: {
    primaryColor: '#2f6fed',
    secondaryColor: '#14161b',
    showLogo: true,
    logoDataUrl: null,
    logoSize: 'md',
    showAccentBar: true,
  },

  content: {
    heading: 'Invoice',
    labels: DEFAULT_LABELS,
    show: DEFAULT_SHOW_BLOCKS,
    terms: 'Payment is due within 14 days of the invoice date.',
    statement: 'Thank you for your business.',
  },

  layout: {
    font: 'sans',
    density: 'regular',
    headerAlign: 'left',
    currency: 'USD',
    dateFormat: 'us',
  },
};
