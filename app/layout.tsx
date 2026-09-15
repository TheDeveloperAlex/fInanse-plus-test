import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Invoice Template Studio',
  description: 'Настройка шаблона счёта с живым предпросмотром',
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem('its:theme');
    if (theme === 'dark' || theme === 'light') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
