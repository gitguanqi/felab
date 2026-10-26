import { expect, test } from '@playwright/test';

test('renders the shared case viewer in split mode', async ({ page }) => {
  /** @type {string[]} */
  const securityMessages = [];
  page.on('console', (message) => {
    if (/content security policy|blocked by CORS policy/i.test(message.text())) {
      securityMessages.push(message.text());
    }
  });
  await page.goto('/case/?cid=2010');

  await expect(page.locator('.case-title')).toHaveText('案例预览');
  await expect(page.getByRole('link', { name: '返回案例首页' })).toHaveAttribute('href', '../');
  await expect(page.locator('#case-app')).toHaveAttribute('data-layout', 'split');
  await expect(page.getByRole('button', { name: '同时显示代码和预览' })).toHaveCSS(
    'border-top-width',
    '0px',
  );
  await expect(page.getByRole('button', { name: '分享案例' })).toHaveCSS('border-top-width', '0px');
  await expect(page.locator('.code-panel')).toBeVisible();
  await expect(page.locator('.preview-panel')).toBeVisible();
  await expect(page.locator('#preview-frame')).toHaveAttribute('src', /\/cases\/xqclip\/$/);
  await expect(page.locator('#preview-frame')).toHaveAttribute('sandbox', /allow-same-origin/);
  await expect(page.locator('#preview-frame')).toHaveAttribute(
    'allow',
    /clipboard-read.*clipboard-write/,
  );
  await expect(
    page.frameLocator('#preview-frame').getByRole('heading', { name: 'XqClip图片裁切案例' }),
  ).toBeVisible();
  await expect(page.locator('#source-code')).toContainText(/<!doctype html>/i);
  await expect(page).toHaveURL(/\/case\/\?cid=2010$/);
  expect(securityMessages).toEqual([]);
});

test('returns to the catalog from the case title', async ({ page }) => {
  await page.goto('/case/?cid=2001');
  await page.getByRole('link', { name: '返回案例首页' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4011/');
});

test('switches between code, preview and split layouts without reloading the frame', async ({
  page,
}) => {
  await page.goto('/case/?cid=2001');
  const frame = page.locator('#preview-frame');
  await expect(frame).toHaveAttribute('src', /\/cases\/chart\/$/);
  const initialSource = await frame.getAttribute('src');

  await page.getByRole('button', { name: '仅显示代码' }).click();
  await expect(page.locator('#case-app')).toHaveAttribute('data-layout', 'code');
  await expect(page.locator('.code-panel')).toBeVisible();
  await expect(page.locator('.preview-panel')).toBeHidden();

  await page.getByRole('button', { name: '仅显示预览' }).click();
  await expect(page.locator('#case-app')).toHaveAttribute('data-layout', 'preview');
  await expect(page.locator('.code-panel')).toBeHidden();
  await expect(page.locator('.preview-panel')).toBeVisible();

  await page.getByRole('button', { name: '同时显示代码和预览' }).click();
  await expect(page.locator('#case-app')).toHaveAttribute('data-layout', 'split');
  await expect(page.locator('.code-panel')).toBeVisible();
  await expect(page.locator('.preview-panel')).toBeVisible();
  await expect(frame).toHaveAttribute('src', initialSource ?? '');
});

test('shows HTML, CSS and JS sources from local case assets', async ({ page }) => {
  await page.goto('/case/?cid=2010');
  await expect(page.locator('#source-code')).toContainText(/<!doctype html>/i);

  await page.getByRole('tab', { name: 'CSS' }).click();
  await expect(page.locator('#source-code')).toContainText('css/demo.css');
  await expect(page.locator('#source-code')).toContainText('vendor/css/xqclip.min.css');
  await expect(page.locator('#source-code')).toContainText('.clip-box');

  await page.getByRole('tab', { name: 'JS' }).click();
  await expect(page.locator('#source-code')).toContainText('js/demo.js');
  await expect(page.locator('#source-code')).toContainText('vendor/js/xqclip.min.js');
  await expect(page.locator('#source-code')).toContainText('xqclip');
});

test('shows an empty CSS state for cases with only inline styles', async ({ page }) => {
  await page.goto('/case/?cid=2001');
  await page.getByRole('tab', { name: 'CSS' }).click();
  await expect(page.locator('#source-empty')).toContainText('没有独立 CSS');
});

test('keeps source errors isolated from the live preview', async ({ page }) => {
  await page.route('**/cases/xqclip/css/demo.css', (route) => route.abort('failed'));
  await page.goto('/case/?cid=2010');
  await page.getByRole('tab', { name: 'CSS' }).click();
  await expect(page.locator('#source-code')).toContainText('Unable to load');
  await expect(page.locator('#preview-frame')).toBeVisible();
});

test('opens the share dialog with a QR code and copies the case link', async ({ page }) => {
  await page.goto('/case/?cid=2001');
  await page.getByRole('button', { name: '分享案例' }).click();

  const dialog = page.locator('#share-dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#share-url')).toHaveText(/\/case\/\?cid=2001$/);
  const qrHasPixels = await page.locator('#share-qr').evaluate((element) => {
    const canvas = /** @type {HTMLCanvasElement} */ (element);
    const context = canvas.getContext('2d');
    if (!context) {
      return false;
    }
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    return data.some((channel, index) => index % 4 !== 3 && channel < 128);
  });
  expect(qrHasPixels).toBe(true);

  await page.locator('#copy-link').click();
  await expect(page.locator('#copy-feedback')).toContainText('已复制案例链接');
});

test('rejects missing, malformed and non-case ids', async ({ page }) => {
  await page.goto('/case/');
  await expect(page.locator('#case-error')).toBeVisible();
  await expect(page.locator('#case-error-message')).toHaveText('案例参数无效');

  await page.goto('/case/?cid=1001');
  await expect(page.locator('#case-error')).toBeVisible();
  await expect(page.locator('#case-error-message')).toHaveText('该案例不支持统一预览');
});

test('plays the local qvideo media without third-party requests', async ({ page }) => {
  /** @type {string[]} */
  const externalRequests = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4011') {
      externalRequests.push(url.href);
    }
  });

  await page.goto('/case/?cid=4016');
  const frame = page.frameLocator('#preview-frame');
  const video = frame.locator('#qvideo');
  await expect
    .poll(() => video.evaluate((element) => /** @type {HTMLVideoElement} */ (element).readyState))
    .toBeGreaterThanOrEqual(2);
  await expect
    .poll(() => video.evaluate((element) => /** @type {HTMLVideoElement} */ (element).duration))
    .toBeGreaterThan(0);

  await frame.locator('.qvideo-play').click();
  await expect
    .poll(() => video.evaluate((element) => /** @type {HTMLVideoElement} */ (element).currentTime))
    .toBeGreaterThan(0);
  await frame.locator('.qvideo-play').click();

  expect(externalRequests).toEqual([]);
});

test('records and replays audio and video with the local MediaRecorder', async ({ page }) => {
  /** @type {string[]} */
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.context().grantPermissions(['camera', 'microphone'], {
    origin: 'http://127.0.0.1:4011',
  });
  await page.goto('/case/?cid=2009');
  const frame = page.frameLocator('#preview-frame');
  await expect(frame.getByRole('heading', { name: 'H5 音视频录制' })).toBeVisible();
  await expect(frame.getByRole('link', { name: '在新窗口打开' })).toHaveAttribute('href', './');

  const audio = frame.locator('[data-recorder="audio"]');
  await audio.getByRole('button', { name: '开始音频' }).click();
  await expect(audio.locator('[data-status]')).toHaveText('正在录制…');
  await expect(audio.getByRole('button', { name: '结束音频' })).toBeEnabled();
  await page.waitForTimeout(700);
  await audio.getByRole('button', { name: '结束音频' }).click();
  await expect(audio.locator('[data-status]')).toContainText('录制完成');
  const audioOutput = audio.locator('audio');
  await expect(audioOutput).toHaveAttribute('src', /^blob:/);
  await expect(audio.getByRole('button', { name: '播放音频' })).toBeEnabled();
  await expect
    .poll(() =>
      audioOutput.evaluate((element) => /** @type {HTMLAudioElement} */ (element).readyState),
    )
    .toBeGreaterThanOrEqual(1);
  await audio.getByRole('button', { name: '播放音频' }).click();
  await expect
    .poll(() =>
      audioOutput.evaluate((element) => {
        const audioElement = /** @type {HTMLAudioElement} */ (element);
        return audioElement.currentTime > 0 || audioElement.ended;
      }),
    )
    .toBe(true);

  const video = frame.locator('[data-recorder="video"]');
  await video.getByRole('button', { name: '开始视频' }).click();
  await expect(video.locator('[data-status]')).toHaveText('正在录制…');
  await expect(video.getByRole('button', { name: '结束视频' })).toBeEnabled();
  await page.waitForTimeout(1_200);
  await video.getByRole('button', { name: '结束视频' }).click();
  await expect(video.locator('[data-status]')).toContainText('录制完成');
  const videoOutput = video.locator('video');
  await expect(videoOutput).toHaveAttribute('src', /^blob:/);
  await expect(video.getByRole('button', { name: '播放视频' })).toBeEnabled();
  await expect
    .poll(() =>
      videoOutput.evaluate((element) => /** @type {HTMLVideoElement} */ (element).readyState),
    )
    .toBeGreaterThanOrEqual(1);
  await video.getByRole('button', { name: '播放视频' }).click();
  await expect
    .poll(() =>
      videoOutput.evaluate((element) => {
        const videoElement = /** @type {HTMLVideoElement} */ (element);
        return videoElement.currentTime > 0 || videoElement.ended;
      }),
    )
    .toBe(true);

  await frame.locator('html').evaluate(() => {
    Object.defineProperty(navigator.permissions, 'query', {
      configurable: true,
      value: async () => ({ state: 'granted' }),
    });
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      configurable: true,
      value: async () => {
        throw new DOMException('denied', 'NotAllowedError');
      },
    });
  });
  await audio.getByRole('button', { name: '开始音频' }).click();
  await expect(audio.locator('[data-status]')).toContainText('Windows 隐私和安全性');

  expect(errors).toEqual([]);
});

test('opens the local xqshare panel and copies its URL', async ({ page }) => {
  /** @type {string[]} */
  const externalRequests = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4011') {
      externalRequests.push(url.href);
    }
  });
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
    origin: 'http://127.0.0.1:4011',
  });
  await page.goto('/case/?cid=4039');
  const frame = page.frameLocator('#preview-frame');

  await frame.getByRole('button', { name: '打开分享面板' }).click();
  const panel = frame.getByRole('dialog', { name: '分享' });
  await expect(panel).toBeVisible();
  await expect(panel.locator('[data-field="url"]')).toHaveValue(/\/cases\/xqshare\/$/);
  await expect(panel.locator('.xqshare-item')).toHaveCount(5);
  await expect
    .poll(() =>
      panel
        .locator('.xqshare-item img')
        .evaluateAll((images) =>
          images.every((image) => /** @type {HTMLImageElement} */ (image).naturalWidth > 0),
        ),
    )
    .toBe(true);

  await panel.getByRole('button', { name: '复制', exact: true }).first().click();
  await expect(frame.locator('#demoStatus')).toHaveText('内容已复制');
  await panel.getByRole('button', { name: '关闭', exact: true }).click();
  await expect(panel).toBeHidden();
  expect(externalRequests).toEqual([]);
});

test('pastes an image into the clip case and keeps a single listener', async ({ page }) => {
  await page.goto('/case/?cid=4035');
  const frame = page.frameLocator('#preview-frame');
  await frame.locator('#type').selectOption('img');

  /** @param {string} fill */
  const dispatchImagePaste = async (fill) => {
    await frame.locator('#content').evaluate((element, color) => {
      const transfer = new globalThis.DataTransfer();
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8">` +
        `<rect width="8" height="8" fill="${color}"/></svg>`;
      transfer.items.add(new File([svg], `${color}.svg`, { type: 'image/svg+xml' }));
      element.dispatchEvent(
        new globalThis.ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: transfer,
        }),
      );
    }, fill);
  };

  await dispatchImagePaste('red');
  await expect(frame.locator('#view img')).toHaveCount(1);
  await expect
    .poll(() =>
      frame.locator('#view img').evaluate((element) => {
        const image = /** @type {HTMLImageElement} */ (element);
        return [image.naturalWidth, image.naturalHeight];
      }),
    )
    .toEqual([8, 8]);

  await frame.locator('#type').selectOption('text');
  await frame.locator('#type').selectOption('img');
  await dispatchImagePaste('blue');
  await expect(frame.locator('#view img')).toHaveCount(1);
});

test('draws and crops the local xqclip image on a readable canvas', async ({ page }) => {
  await page.goto('/case/?cid=2010');
  const frame = page.frameLocator('#preview-frame');
  const canvas = frame.locator('.clip-canvas');

  await expect
    .poll(() =>
      canvas.evaluate((element) => {
        const imageCanvas = /** @type {HTMLCanvasElement} */ (element);
        const context = imageCanvas.getContext('2d');
        if (!context) {
          return false;
        }
        const pixel = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height).data;
        return pixel.some((channel, index) => index % 4 !== 3 && channel > 0);
      }),
    )
    .toBe(true);

  const area = frame.locator('.clip-img-area');
  await area.scrollIntoViewIfNeeded();
  const bounds = await area.boundingBox();
  expect(bounds).not.toBeNull();
  if (bounds) {
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await page.mouse.down();
    await page.mouse.move(bounds.x + bounds.width / 2 + 20, bounds.y + bounds.height / 2 + 20, {
      steps: 5,
    });
    await page.mouse.up();
  }

  await expect
    .poll(() => frame.locator('#preview-img').getAttribute('src'))
    .toMatch(/^data:image\/(?:jpe?g|png);base64,/);
  await expect(frame.locator('#download')).toHaveAttribute(
    'href',
    /^data:image\/(?:jpe?g|png);base64,/,
  );
  await frame.getByRole('button', { name: '切换图片' }).click();
  await expect(frame.locator('#clip-error')).toBeHidden();
});

test('keeps lyric local storage, fonts and console free of CORS errors', async ({ page }) => {
  /** @type {string[]} */
  const errors = [];
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /cors|content security policy|sandboxed|allow-same-origin/i.test(message.text())
    ) {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/case/?cid=4037');
  const frame = page.frameLocator('#preview-frame');
  await expect
    .poll(() => frame.locator('html').evaluate(() => globalThis.document.fonts.check('16px qm')))
    .toBe(true);
  await expect
    .poll(() =>
      frame.locator('html').evaluate(() => {
        localStorage.setItem('felab-preview-test', 'ok');
        return localStorage.getItem('felab-preview-test');
      }),
    )
    .toBe('ok');

  expect(errors).toEqual([]);
});
