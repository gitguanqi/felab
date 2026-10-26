const openButton = document.querySelector('#openBtn');
const shareHost = document.querySelector('#shareHost');
const demoStatus = document.querySelector('#demoStatus');
let widget = null;

function setStatus(message, tone = 'success') {
  if (!(demoStatus instanceof HTMLElement)) {
    return;
  }
  demoStatus.textContent = message;
  demoStatus.dataset.tone = tone;
}

if (
  typeof XqShare !== 'function' ||
  !(openButton instanceof HTMLButtonElement) ||
  !(shareHost instanceof HTMLElement)
) {
  setStatus('分享组件加载失败，请刷新后重试。', 'error');
  if (openButton instanceof HTMLButtonElement) {
    openButton.disabled = true;
  }
} else {
  try {
    widget = new XqShare({
      el: shareHost,
      type: 'pop',
      url: window.location.href,
      title: document.title,
      iconBase: './vendor/img/',
      onCopy(result) {
        setStatus(
          result.method === 'failed' ? '复制失败，请手动复制链接。' : '内容已复制',
          result.method === 'failed' ? 'error' : 'success',
        );
      },
      onShare(result) {
        setStatus(result.opened ? '分享窗口已打开' : '分享链接已处理');
      },
      onToggle(visible) {
        openButton.setAttribute('aria-expanded', String(visible));
      },
      onError(error) {
        setStatus(`分享失败：${error.code}`, 'error');
      },
    });

    openButton.addEventListener('click', () => {
      widget?.show();
    });
  } catch (error) {
    setStatus(error instanceof Error ? error.message : '分享组件初始化失败。', 'error');
    openButton.disabled = true;
  }
}

window.addEventListener('pagehide', () => {
  widget?.destroy();
});
