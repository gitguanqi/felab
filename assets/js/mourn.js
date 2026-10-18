// @ts-check

const configuredScript = document.querySelector('script[data-mourn-dates]');
const configuredDates = configuredScript?.getAttribute('data-mourn-dates') ?? '7.7';
const memorialDates = new Set(
  configuredDates
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);
const now = new Date();
const dateKey = `${now.getMonth() + 1}.${now.getDate()}`;

if (memorialDates.has(dateKey)) {
  document.documentElement.classList.add('is-mourn');
}
