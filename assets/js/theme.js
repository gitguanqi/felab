// @ts-check

(() => {
  const STORAGE_KEY = 'felab-theme';
  const DARK_QUERY = '(prefers-color-scheme: dark)';
  const root = document.documentElement;
  const colorSchemeQuery = window.matchMedia(DARK_QUERY);

  /**
   * @param {unknown} value
   * @returns {'light' | 'dark' | null}
   */
  function normalizeTheme(value) {
    return value === 'light' || value === 'dark' ? value : null;
  }

  /** @returns {'light' | 'dark' | null} */
  function readStoredTheme() {
    try {
      return normalizeTheme(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  /**
   * @param {'light' | 'dark' | null} stored
   * @param {boolean} prefersDark
   * @returns {'light' | 'dark'}
   */
  function resolveTheme(stored, prefersDark) {
    return stored ?? (prefersDark ? 'dark' : 'light');
  }

  /**
   * @param {'light' | 'dark'} theme
   * @param {boolean} persist
   */
  function applyTheme(theme, persist) {
    root.dataset.theme = theme;

    if (persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // The selected theme still applies for the current page.
      }
    }

    syncThemeButtons(theme);
  }

  /** @param {'light' | 'dark'} theme */
  function syncThemeButtons(theme) {
    const isDark = theme === 'dark';
    const label = isDark ? '切换到浅色模式' : '切换到暗黑模式';
    for (const control of document.querySelectorAll('[data-theme-toggle]')) {
      if (!(control instanceof HTMLButtonElement)) {
        continue;
      }
      control.setAttribute('aria-pressed', String(isDark));
      control.setAttribute('aria-label', label);
      control.title = label;
    }
  }

  applyTheme(resolveTheme(readStoredTheme(), colorSchemeQuery.matches), false);

  document.addEventListener('DOMContentLoaded', () => {
    syncThemeButtons(root.dataset.theme === 'dark' ? 'dark' : 'light');
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const control = target.closest('[data-theme-toggle]');
    if (!(control instanceof HTMLButtonElement)) {
      return;
    }
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }
    const stored = normalizeTheme(event.newValue);
    if (stored) {
      applyTheme(stored, false);
    }
  });

  colorSchemeQuery.addEventListener('change', (event) => {
    if (readStoredTheme()) {
      return;
    }
    applyTheme(event.matches ? 'dark' : 'light', false);
  });
})();
