export type LogoSize = 'sm' | 'md' | 'lg';
export type DocumentFont = 'sans' | 'serif' | 'mono';
export type Density = 'compact' | 'regular' | 'relaxed';
export type HeaderAlign = 'left' | 'right';
export type Currency = 'USD' | 'EUR' | 'PLN';
export type DateFormat = 'us' | 'eu' | 'iso';

export type LabelKey =
  | 'invoiceNumber'
  | 'dateOfIssue'
  | 'dueDate'
  | 'billedTo'
  | 'subtotal'
  | 'total'
  | 'balanceDue';

export type BlockKey =
  | 'dueDate'
  | 'billedTo'
  | 'itemDescription'
  | 'discount'
  | 'taxes'
  | 'paymentMade'
  | 'terms'
  | 'statement';

export type TemplateSettings = {
  name: string;

  branding: {
    primaryColor: string;
    secondaryColor: string;
    showLogo: boolean;
    logoDataUrl: string | null;
    logoSize: LogoSize;
    showAccentBar: boolean;
  };

  content: {
    heading: string;
    labels: Record<LabelKey, string>;
    show: Record<BlockKey, boolean>;
    terms: string;
    statement: string;
  };

  layout: {
    font: DocumentFont;
    density: Density;
    headerAlign: HeaderAlign;
    currency: Currency;
    dateFormat: DateFormat;
  };
};
