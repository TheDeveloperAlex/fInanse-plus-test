import type { Theme } from './atoms/ui';

export const THEME_COOKIE_NAME = 'its-theme';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function setThemeCookie(theme: Theme): void {
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}
