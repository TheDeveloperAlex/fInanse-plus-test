import { HydrationGate } from './HydrationGate';
import { StudioBody } from './StudioBody';
import { TopBar } from './TopBar';

export function TemplateStudio() {
  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <HydrationGate>
        <TopBar />
        <StudioBody />
      </HydrationGate>
    </div>
  );
}
