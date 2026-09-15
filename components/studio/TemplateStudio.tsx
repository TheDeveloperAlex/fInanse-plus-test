import { PreviewCanvas } from './PreviewCanvas';
import { SettingsWorkspace } from './SettingsWorkspace';
import { TopBar } from './TopBar';

export function TemplateStudio() {
  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <SettingsWorkspace />
        <PreviewCanvas />
      </div>
    </div>
  );
}
