import { InvoicePaper } from '@/components/invoice/InvoicePaper';
import { SettingsWorkspace } from './SettingsWorkspace';

export function TemplateStudio() {
  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <header className="flex h-topbar shrink-0 items-center border-b border-border bg-surface px-4">
        TopBar
      </header>
      <div className="flex flex-1 overflow-hidden">
        <SettingsWorkspace />
        <main className="flex flex-1 items-center justify-center overflow-auto p-8">
          <InvoicePaper />
        </main>
      </div>
    </div>
  );
}
