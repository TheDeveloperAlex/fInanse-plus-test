import type { ReactNode } from 'react';

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="py-4">
      <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}
