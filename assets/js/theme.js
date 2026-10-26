// @ts-check

(() => {
  const STORAGE_KEY = 'felab-theme';
  const DARK_QUERY = '(prefers-color-scheme: dark)';
  const root = document.documentElement;
  const colorSchemeQuery = window.matchMedia(DARK_QUERY);

  /**
   * @param {unknown} value
   * @returns {'light' | 'dark' | 'system' | null}
   */
  function normalizeThemeMode(value) {
    return value === 'light' || value === 'dark' || value === 'system' ? value : null;
  }

  /** @returns {'light' | 'dark' | 'system' | null} */
  function readStoredThemeMode() {
    try {
      return normalizeThemeMode(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  /**
   * @param {'light' | 'dark' | 'system'} mode
   * @param {boolean} prefersDark
   * @returns {'light' | 'dark'}
   */
  function resolveTheme(mode, prefersDark) {
    if (mode === 'light' || mode === 'dark') {
      return mode;
    }
    return prefersDark ? 'dark' : 'light';
  }

  /**
   * @param {'light' | 'dark' | 'system'} mode
   * @param {boolean} persist
   */
  function applyThemeMode(mode, persist) {
    root.dataset.themeMode = mode;
    root.dataset.theme = resolveTheme(mode, colorSchemeQuery.matches);

    if (persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // The selected theme still applies for the current page.
      }
    }

    syncThemeControls(mode);
  }

  /** @param {'light' | 'dark' | 'system'} mode */
  function syncThemeControls(mode) {
    const labels = {
      light: '浅色',
      dark: '深色',
      system: '跟随系统',
    };
    const label = `当前主题：${labels[mode]}，打开主题菜单`;

    for (const control of document.querySelectorAll('[data-theme-control]')) {
      if (!(control instanceof HTMLElement)) {
        continue;
      }

      const toggle = control.querySelector('[data-theme-toggle]');
      const menu = control.querySelector('[data-theme-menu]');
      if (toggle instanceof HTMLButtonElement) {
        toggle.setAttribute('aria-label', label);
        toggle.title = label;
        toggle.setAttribute('aria-expanded', String(menu instanceof HTMLElement && !menu.hidden));
      }

      for (const option of control.querySelectorAll('[data-theme-value]')) {
        if (!(option instanceof HTMLButtonElement)) {
          continue;
        }
        const isSelected = option.dataset.themeValue === mode;
        option.setAttribute('aria-checked', String(isSelected));
        option.tabIndex = isSelected ? 0 : -1;
      }
    }
  }

  /** @param {Element | null} source */
  function closeThemeMenu(source) {
    for (const control of document.querySelectorAll('[data-theme-control]')) {
      if (!(control instanceof HTMLElement)) {
        continue;
      }
      const menu = control.querySelector('[data-theme-menu]');
      const toggle = control.querySelector('[data-theme-toggle]');
      if (menu instanceof HTMLElement && !menu.hidden) {
        menu.hidden = true;
        if (toggle instanceof HTMLButtonElement) {
          toggle.setAttribute('aria-expanded', 'false');
          if (source instanceof Node && control.contains(source)) {
            toggle.focus();
          }
        }
      }
    }
  }

  const initialMode = normalizeThemeMode(readStoredThemeMode()) ?? 'system';
  applyThemeMode(initialMode, false);

  document.addEventListener('DOMContentLoaded', () => {
    const mode = normalizeThemeMode(root.dataset.themeMode) ?? 'system';
    syncThemeControls(mode);
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const option = target.closest('[data-theme-value]');
    if (option instanceof HTMLButtonElement) {
      const mode = normalizeThemeMode(option.dataset.themeValue);
      if (mode) {
        applyThemeMode(mode, true);
        closeThemeMenu(option);
      }
      return;
    }

    const toggle = target.closest('[data-theme-toggle]');
    if (toggle instanceof HTMLButtonElement) {
      const control = toggle.closest('[data-theme-control]');
      const menu = control?.querySelector('[data-theme-menu]');
      if (!(control instanceof HTMLElement) || !(menu instanceof HTMLElement)) {
        return;
      }

      const willOpen = menu.hidden;
      closeThemeMenu(null);
      menu.hidden = !willOpen;
      toggle.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) {
        const selected = menu.querySelector('[aria-checked="true"]');
        if (selected instanceof HTMLButtonElement) {
          selected.focus();
        }
      }
      return;
    }

    if (!target.closest('[data-theme-control]')) {
      closeThemeMenu(null);
    }
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const control = target instanceof Element ? target.closest('[data-theme-control]') : null;
    if (!(control instanceof HTMLElement)) {
      return;
    }

    const menu = control.querySelector('[data-theme-menu]');
    if (event.key === 'Escape' && menu instanceof HTMLElement && !menu.hidden) {
      event.preventDefault();
      closeThemeMenu(target instanceof Element ? target : null);
      return;
    }

    if (
      !(target instanceof HTMLButtonElement) ||
      !target.matches('[data-theme-value]') ||
      !(menu instanceof HTMLElement)
    ) {
      return;
    }

    const options = [...menu.querySelectorAll('[data-theme-value]')].filter(
      (option) => option instanceof HTMLButtonElement,
    );
    const currentIndex = options.indexOf(target);
    let nextIndex;
    if (event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % options.length;
    } else if (event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = options.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    if (nextIndex >= 0 && options[nextIndex] instanceof HTMLButtonElement) {
      options[nextIndex].focus();
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }
    applyThemeMode(normalizeThemeMode(event.newValue) ?? 'system', false);
  });

  colorSchemeQuery.addEventListener('change', (event) => {
    if (normalizeThemeMode(root.dataset.themeMode) !== 'system') {
      return;
    }
    root.dataset.theme = event.matches ? 'dark' : 'light';
  });
})();
