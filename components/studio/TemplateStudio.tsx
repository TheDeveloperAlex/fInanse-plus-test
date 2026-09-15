import { InvoicePaper } from '@/components/invoice/InvoicePaper';

export function TemplateStudio() {
  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <header className="flex h-topbar shrink-0 items-center border-b border-border bg-surface px-4">
        TopBar
      </header>
      <div className="flex flex-1 overflow-hidden">
        <nav className="flex w-rail shrink-0 flex-col border-r border-border bg-surface-sunken" />
        <aside className="w-panel shrink-0 overflow-y-auto border-r border-border bg-surface" />
        <main className="flex flex-1 items-center justify-center overflow-auto p-8">
          <InvoicePaper />
        </main>
      </div>
    </div>
  );
}
