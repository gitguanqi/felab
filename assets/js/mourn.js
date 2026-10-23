// @ts-check

(() => {
  const MOURNING_DATES = new Set(['7.7', '9.18', '9.30', '11.30', '12.13']);
  const SHANGHAI_UTC_OFFSET_MS = 8 * 60 * 60 * 1000;
  const shanghaiNow = new Date(Date.now() + SHANGHAI_UTC_OFFSET_MS);
  const dateKey = `${shanghaiNow.getUTCMonth() + 1}.${shanghaiNow.getUTCDate()}`;

  if (MOURNING_DATES.has(dateKey)) {
    document.documentElement.classList.add('mourning-mode');
  }
})();
