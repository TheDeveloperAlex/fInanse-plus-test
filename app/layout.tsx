import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ThemeHydrator } from '@/components/providers/ThemeHydrator';
import type { Theme } from '@/lib/atoms/ui';
import { THEME_COOKIE_NAME } from '@/lib/theme-cookie';
import './globals.css';

export const metadata: Metadata = {
  title: 'Invoice Template Studio',
  description: 'Настройка шаблона счёта с живым предпросмотром',
};

async function readTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  return cookieStore.get(THEME_COOKIE_NAME)?.value === 'dark' ? 'dark' : 'light';
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await readTheme();

  return (
    <html lang="en" data-theme={theme}>
      <body className="font-sans antialiased">
        <ThemeHydrator theme={theme}>{children}</ThemeHydrator>
      </body>
    </html>
  );
}
