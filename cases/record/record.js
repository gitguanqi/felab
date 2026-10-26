// @ts-check

const MIME_CANDIDATES = {
  audio: ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'],
  video: ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'],
};

class RecordingController {
  /**
   * @param {HTMLElement} root
   * @param {'audio' | 'video'} kind
   */
  constructor(root, kind) {
    this.kind = kind;
    this.status = this.requireElement(root, '[data-status]', HTMLElement);
    this.output = this.requireElement(root, '[data-output]', HTMLMediaElement);
    this.startButton = this.requireElement(root, '[data-start]', HTMLButtonElement);
    this.stopButton = this.requireElement(root, '[data-stop]', HTMLButtonElement);
    this.playButton = this.requireElement(root, '[data-play]', HTMLButtonElement);

    /** @type {MediaStream | null} */
    this.stream = null;
    /** @type {MediaRecorder | null} */
    this.recorder = null;
    /** @type {Blob[]} */
    this.chunks = [];
    /** @type {'idle' | 'requesting' | 'recording' | 'stopping'} */
    this.state = 'idle';
    /** @type {string} */
    this.objectUrl = '';

    this.startButton.addEventListener('click', () => {
      void this.start();
    });
    this.stopButton.addEventListener('click', () => this.stop());
    this.playButton.addEventListener('click', () => {
      void this.play();
    });

    this.updateControls();
  }

  /**
   * @template {Element} T
   * @param {Element} root
   * @param {string} selector
   * @param {new () => T} constructor
   * @returns {T}
   */
  requireElement(root, selector, constructor) {
    const element = root.querySelector(selector);
    if (!(element instanceof constructor)) {
      throw new Error(`Missing recording element: ${selector}`);
    }
    return element;
  }

  async start() {
    if (this.state !== 'idle') {
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof globalThis.MediaRecorder !== 'function') {
      this.setStatus('当前浏览器不支持媒体录制。', 'error');
      return;
    }

    this.state = 'requesting';
    this.setStatus(this.kind === 'audio' ? '正在请求麦克风权限…' : '正在请求摄像头权限…');
    this.updateControls();

    const permissionState = await this.readPermissionState();
    try {
      const constraints =
        this.kind === 'audio'
          ? { audio: true }
          : {
              audio: true,
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
            };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mimeType = this.findSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      this.stream = stream;
      this.recorder = recorder;
      this.chunks = [];
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      });
      recorder.addEventListener('stop', () => this.finishRecording(), { once: true });
      recorder.addEventListener(
        'error',
        () => {
          this.releaseStream();
          this.recorder = null;
          this.state = 'idle';
          this.setStatus('录制失败，请检查媒体设备后重试。', 'error');
          this.updateControls();
        },
        { once: true },
      );

      recorder.start(250);
      this.state = 'recording';
      this.setStatus('正在录制…', 'recording');
      this.updateControls();
    } catch (error) {
      this.releaseStream();
      this.recorder = null;
      this.state = 'idle';
      this.setStatus(this.describeStartError(error, permissionState), 'error');
      console.warn(`[record:${this.kind}] getUserMedia failed`, error);
      this.updateControls();
    }
  }

  stop() {
    if (!this.recorder || this.recorder.state !== 'recording') {
      this.setStatus('当前没有正在进行的录制。');
      this.updateControls();
      return;
    }

    this.state = 'stopping';
    this.setStatus('正在结束录制…');
    this.updateControls();
    try {
      this.recorder.requestData();
    } catch {
      // Some browsers throw if the recorder became inactive between the guard and request.
    }
    this.recorder.stop();
  }

  async play() {
    if (!this.output.src) {
      this.setStatus('请先完成一段录制。', 'error');
      return;
    }

    try {
      this.output.currentTime = 0;
      await this.output.play();
    } catch {
      this.setStatus('播放失败，请使用媒体控件重试。', 'error');
    }
  }

  finishRecording() {
    const mimeType = this.recorder?.mimeType || this.chunks[0]?.type || '';
    const blob = new Blob(this.chunks, mimeType ? { type: mimeType } : undefined);
    this.releaseStream();
    this.recorder = null;
    this.state = 'idle';

    if (blob.size === 0) {
      this.setStatus('没有捕获到媒体数据，请重新录制。', 'error');
      this.updateControls();
      return;
    }

    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
    this.objectUrl = URL.createObjectURL(blob);
    this.output.src = this.objectUrl;
    this.output.load();
    this.setStatus(`录制完成 · ${this.formatSize(blob.size)}`, 'success');
    this.updateControls();
  }

  releaseStream() {
    for (const track of this.stream?.getTracks() ?? []) {
      track.stop();
    }
    this.stream = null;
  }

  updateControls() {
    this.startButton.disabled = this.state !== 'idle';
    this.stopButton.disabled = this.state !== 'recording';
    this.playButton.disabled = !this.output.src;
  }

  /** @param {string} message @param {'neutral' | 'recording' | 'success' | 'error'} [tone] */
  setStatus(message, tone = 'neutral') {
    this.status.textContent = message;
    this.status.dataset.tone = tone;
  }

  /** @returns {string} */
  findSupportedMimeType() {
    return MIME_CANDIDATES[this.kind].find((type) => MediaRecorder.isTypeSupported(type)) ?? '';
  }

  /** @returns {Promise<'granted' | 'prompt' | 'denied' | 'unknown'>} */
  async readPermissionState() {
    if (!navigator.permissions?.query) {
      return 'unknown';
    }

    const permissionNames = this.kind === 'audio' ? ['microphone'] : ['camera', 'microphone'];
    try {
      const states = await Promise.all(
        permissionNames.map(async (name) => {
          const result = await navigator.permissions.query({
            name: /** @type {PermissionName} */ (name),
          });
          return result.state;
        }),
      );
      if (states.includes('denied')) {
        return 'denied';
      }
      if (states.every((state) => state === 'granted')) {
        return 'granted';
      }
      return 'prompt';
    } catch {
      return 'unknown';
    }
  }

  /**
   * @param {unknown} error
   * @param {'granted' | 'prompt' | 'denied' | 'unknown'} permissionState
   */
  describeStartError(error, permissionState) {
    const name = error instanceof DOMException ? error.name : '';
    if (name === 'NotAllowedError') {
      if (!window.isSecureContext) {
        return '媒体录制需要 HTTPS 或 localhost，请更换安全地址后重试。';
      }
      if (permissionState === 'granted') {
        return this.kind === 'audio'
          ? '浏览器已允许麦克风，但系统隐私设置或设备仍拒绝访问。请检查 Windows 隐私和安全性中的麦克风权限。'
          : '浏览器已允许摄像头和麦克风，但系统隐私设置或设备仍拒绝访问。请检查 Windows 隐私和安全性中的摄像头与麦克风权限。';
      }
      if (permissionState === 'denied') {
        return this.kind === 'audio'
          ? '站点麦克风权限被浏览器拒绝，请在当前站点的权限设置中允许麦克风后重试。'
          : '站点摄像头或麦克风权限被浏览器拒绝，请在当前站点的权限设置中允许后重试。';
      }
      if (window.self !== window.top) {
        return '内嵌预览未获得媒体权限，请使用页面顶部的“在新窗口打开”后重试。';
      }
      return this.kind === 'audio'
        ? '麦克风访问被拒绝，请在浏览器站点权限中允许麦克风后重试。'
        : '摄像头或麦克风访问被拒绝，请在浏览器站点权限中允许后重试。';
    }
    if (name === 'NotFoundError') {
      return this.kind === 'audio' ? '未找到可用的麦克风。' : '未找到可用的摄像头或麦克风。';
    }
    if (name === 'NotReadableError') {
      return '媒体设备正被其他程序占用。';
    }
    if (name === 'SecurityError') {
      return '当前页面无法访问媒体设备，请使用 HTTPS 或 localhost。';
    }
    if (name === 'OverconstrainedError') {
      return '当前媒体设备不支持所需参数，请更换设备后重试。';
    }
    if (name === 'AbortError') {
      return '媒体设备启动被中断，请重新尝试。';
    }
    return '无法开始录制，请检查设备与浏览器权限。';
  }

  /** @param {number} bytes */
  formatSize(bytes) {
    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
}

const audioRoot = document.querySelector('[data-recorder="audio"]');
const videoRoot = document.querySelector('[data-recorder="video"]');
if (!(audioRoot instanceof HTMLElement) || !(videoRoot instanceof HTMLElement)) {
  throw new Error('Recording case markup is incomplete');
}

const audioController = new RecordingController(audioRoot, 'audio');
const videoController = new RecordingController(videoRoot, 'video');

const isEmbedded = window.self !== window.top;
for (const link of document.querySelectorAll('[data-standalone-link]')) {
  if (link instanceof HTMLElement) {
    link.hidden = !isEmbedded;
  }
}

window.addEventListener('pagehide', () => {
  audioController.stop();
  videoController.stop();
});
