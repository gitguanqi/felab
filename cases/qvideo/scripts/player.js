// @ts-check

class QVideo {
  /** @param {HTMLElement} root */
  constructor(root) {
    this.root = root;
    this.media = this.requireElement('video', HTMLVideoElement);
    this.progress = this.requireElement('.qvideo-progress', HTMLElement);
    this.currentProgress = this.requireElement('.qvideo-progress-current', HTMLElement);
    this.playButton = this.requireElement('.qvideo-play', HTMLButtonElement);
    this.reloadButton = this.requireElement('.qvideo-reload', HTMLButtonElement);
    this.startTime = this.requireElement('.qvideo-startTime', HTMLElement);
    this.endTime = this.requireElement('.qvideo-endTime', HTMLElement);
    this.volumeButton = this.requireElement('.qvideo-volume-btn', HTMLButtonElement);
    this.volumeProgress = this.requireElement('.qvideo-volume-progress', HTMLElement);
    this.volumeCurrent = this.requireElement('.qvideo-volume-progress-current', HTMLElement);
    this.fullscreenButton = this.requireElement('.qvideo-fullscreen-btn', HTMLButtonElement);
    this.loadingBox = this.requireElement('.qvideo-loading-box', HTMLElement);
    this.loadingSpinner = this.requireElement('.qvideo-loading', HTMLElement);
    this.errorMessage = this.requireElement('.qvideo-error', HTMLElement);

    this.bindEvents();
    this.setLoading(true);
    this.updateVolume(1);
  }

  /**
   * @template {Element} T
   * @param {string} selector
   * @param {new () => T} constructor
   * @returns {T}
   */
  requireElement(selector, constructor) {
    const element = this.root.querySelector(selector);
    if (!(element instanceof constructor)) {
      throw new Error(`Missing player element: ${selector}`);
    }
    return element;
  }

  bindEvents() {
    this.playButton.addEventListener('click', () => {
      void this.togglePlay();
    });
    this.reloadButton.addEventListener('click', () => {
      this.errorMessage.hidden = true;
      this.loadingSpinner.hidden = false;
      this.media.load();
      this.setLoading(true);
    });
    this.progress.addEventListener('click', (event) => this.seek(event));
    this.volumeButton.addEventListener('click', () => {
      this.media.muted = !this.media.muted;
      this.updateVolumeButton();
    });
    this.volumeProgress.addEventListener('click', (event) => this.changeVolume(event));
    this.fullscreenButton.addEventListener('click', () => {
      void this.toggleFullscreen();
    });

    this.media.addEventListener('loadedmetadata', () => {
      this.endTime.textContent = this.formatTime(this.media.duration);
    });
    this.media.addEventListener('timeupdate', () => this.updatePlayback());
    this.media.addEventListener('play', () => this.updatePlayState());
    this.media.addEventListener('pause', () => this.updatePlayState());
    this.media.addEventListener('waiting', () => this.setLoading(true));
    this.media.addEventListener('canplay', () => this.setLoading(false));
    this.media.addEventListener('playing', () => this.setLoading(false));
    this.media.addEventListener('error', () => this.showMediaError());
  }

  async togglePlay() {
    if (!this.media.paused) {
      this.media.pause();
      return;
    }

    try {
      await this.media.play();
    } catch {
      this.showMediaError('视频无法播放，请检查浏览器媒体支持。');
    }
  }

  updatePlayState() {
    const isPlaying = !this.media.paused && !this.media.ended;
    this.playButton.dataset.state = isPlaying ? 'playing' : 'paused';
    this.playButton.setAttribute('aria-label', isPlaying ? '暂停视频' : '播放视频');
  }

  updatePlayback() {
    const duration = Number.isFinite(this.media.duration) ? this.media.duration : 0;
    const percent = duration > 0 ? Math.min(this.media.currentTime / duration, 1) : 0;
    this.currentProgress.style.width = `${percent * 100}%`;
    this.startTime.textContent = this.formatTime(this.media.currentTime);
    this.endTime.textContent = this.formatTime(duration);
    this.updatePlayState();
  }

  /** @param {MouseEvent} event */
  seek(event) {
    const duration = Number.isFinite(this.media.duration) ? this.media.duration : 0;
    if (duration <= 0) {
      return;
    }
    const bounds = this.progress.getBoundingClientRect();
    const percent = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
    this.media.currentTime = duration * percent;
  }

  /** @param {MouseEvent} event */
  changeVolume(event) {
    const bounds = this.volumeProgress.getBoundingClientRect();
    const volume = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
    this.media.volume = volume;
    this.media.muted = volume === 0;
    this.updateVolume(volume);
  }

  /** @param {number} volume */
  updateVolume(volume) {
    const percent = Math.round(volume * 100);
    this.volumeCurrent.style.width = `${percent}%`;
    this.volumeProgress.setAttribute('aria-valuenow', String(percent));
    this.updateVolumeButton();
  }

  updateVolumeButton() {
    const isMuted = this.media.muted || this.media.volume === 0;
    this.volumeButton.dataset.state = isMuted ? 'muted' : 'on';
    this.volumeButton.setAttribute('aria-label', isMuted ? '取消静音' : '静音');
  }

  async toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await this.root.requestFullscreen();
      }
    } catch {
      this.showMediaError('当前浏览器不允许进入全屏模式。');
    }
  }

  /** @param {boolean} visible */
  setLoading(visible) {
    this.loadingBox.classList.toggle('show', visible);
    this.loadingBox.classList.toggle('hide', !visible);
    if (visible) {
      this.errorMessage.hidden = true;
      this.loadingSpinner.hidden = false;
    }
  }

  /** @param {string} [message] */
  showMediaError(message = '视频加载失败，请刷新后重试。') {
    this.loadingBox.classList.add('show');
    this.loadingBox.classList.remove('hide');
    this.loadingSpinner.hidden = true;
    this.errorMessage.textContent = message;
    this.errorMessage.hidden = false;
  }

  /** @param {number} seconds */
  formatTime(seconds) {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const remainder = safeSeconds % 60;
    return [hours, minutes, remainder].map((part) => String(part).padStart(2, '0')).join(':');
  }
}

Reflect.set(window, 'QVideo', QVideo);
