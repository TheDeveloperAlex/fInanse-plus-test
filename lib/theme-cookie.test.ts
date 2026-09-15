import { afterEach, describe, expect, it } from 'vitest';
import { setThemeCookie, THEME_COOKIE_NAME } from './theme-cookie';

function clearCookies() {
  document.cookie.split(';').forEach((entry) => {
    const name = entry.split('=')[0]?.trim();
    if (name) {
      document.cookie = `${name}=; path=/; max-age=0`;
    }
  });
}

describe('setThemeCookie', () => {
  afterEach(() => {
    clearCookies();
  });

  it('writes the theme under the expected cookie name', () => {
    setThemeCookie('dark');

    expect(document.cookie).toContain(`${THEME_COOKIE_NAME}=dark`);
  });

  it('overwrites a previously written value', () => {
    setThemeCookie('dark');
    setThemeCookie('light');

    expect(document.cookie).toContain(`${THEME_COOKIE_NAME}=light`);
    expect(document.cookie).not.toContain(`${THEME_COOKIE_NAME}=dark`);
  });
});
