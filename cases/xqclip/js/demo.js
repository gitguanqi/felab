// The case runs inside a narrow iframe, so detect the pointer type instead of
// treating every viewport below 768px as touch-only.
if (typeof xqclip === 'function') {
  xqclip.prototype.checkMobile = function () {
    this.isMobile = window.matchMedia('(pointer: coarse)').matches;
    this.eventName = {
      start: 'pointerdown',
      move: 'pointermove',
      end: 'pointerup',
    };
    if (!this.resizeHandler) {
      this.resizeHandler = () => this.checkMobile();
    }
    window.onresize = this.resizeHandler;
  };
}

const downloadBtn = document.getElementById('download');
const changeBtn = document.getElementById('change');
const previewImg = document.getElementById('preview-img');
const clipError = document.getElementById('clip-error');
let currentClip = null;
let clip = null;

function showClipError(message) {
  clipError.textContent = message;
  clipError.hidden = false;
}

if (typeof xqclip === 'function') {
  clip = new xqclip({
    box: '.corp',
    boxWin: 300,
    boxHei: 300,
    url: './img/a1.jpg',
    pre: '#preview-img',
    scale: 16 / 16,
    showPos: true,
    scaleImg: true,
    onChange(data) {
      currentClip = data;
      clipError.hidden = true;
      downloadBtn.href = data.base64;
      downloadBtn.download = `xqclip-${Date.now()}.jpg`;
    },
  });
} else {
  showClipError('图片裁切组件加载失败，请刷新后重试。');
}

downloadBtn.addEventListener('click', function (event) {
  if (!currentClip?.base64) {
    event.preventDefault();
    showClipError('请先拖动裁剪区域生成图片。');
    return;
  }
  this.href = currentClip.base64;
  this.download = `xqclip-${Date.now()}.jpg`;
});

changeBtn.addEventListener('click', function () {
  if (!clip || !clip.replaceImg('./img/a2.png')) {
    showClipError('图片裁切组件不可用，无法切换图片。');
  }
});

window.addEventListener(
  'error',
  function (event) {
    if (event.target instanceof HTMLImageElement) {
      showClipError('案例图片加载失败，请刷新后重试。');
    }
  },
  true,
);

window.addEventListener('pagehide', function () {
  clip?.destroy();
});
