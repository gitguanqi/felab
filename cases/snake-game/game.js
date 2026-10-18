(() => {
  "use strict";

  const GRID_SIZE = 21;
  const CELL_SIZE = 30;
  const TICK_MS = 150;
  const START_LENGTH = 3;
  const SCORE_PER_FOOD = 10;
  const STORAGE_KEY = "snake-neon-high-score";
  const BOARD_PX = GRID_SIZE * CELL_SIZE;

  const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  const DIRECTION_CODES = {
    ArrowUp: "up",
    KeyW: "up",
    ArrowDown: "down",
    KeyS: "down",
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right",
  };

  const canvas = document.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreValue = document.querySelector("#scoreValue");
  const highScoreValue = document.querySelector("#highScoreValue");
  const pauseButton = document.querySelector("#pauseButton");
  const restartButton = document.querySelector("#restartButton");
  const overlay = document.querySelector("#overlay");
  const overlayTitle = document.querySelector("#overlayTitle");
  const overlayMessage = document.querySelector("#overlayMessage");
  const overlayButton = document.querySelector("#overlayButton");
  const statusText = document.querySelector("#statusText");

  const state = {
    status: "ready",
    snake: [],
    direction: DIRECTIONS.right,
    pendingDirection: null,
    food: null,
    score: 0,
    highScore: loadHighScore(),
    recordRun: false,
    timer: null,
    touchStart: null,
  };

  function loadHighScore() {
    try {
      return Math.max(0, Number.parseInt(localStorage.getItem(STORAGE_KEY), 10) || 0);
    } catch {
      return 0;
    }
  }

  function saveHighScore() {
    try {
      localStorage.setItem(STORAGE_KEY, String(state.highScore));
    } catch {
      // Storage may be unavailable when the page is opened from some sandboxed contexts.
    }
  }

  function sameCell(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function createSnake() {
    const center = Math.floor(GRID_SIZE / 2);
    return Array.from({ length: START_LENGTH }, (_, index) => ({
      x: center - index,
      y: center,
    }));
  }

  function spawnFood() {
    const occupied = new Set(state.snake.map((cell) => `${cell.x},${cell.y}`));
    const emptyCells = [];

    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        if (!occupied.has(`${x},${y}`)) {
          emptyCells.push({ x, y });
        }
      }
    }

    if (emptyCells.length === 0) {
      return null;
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  function configureCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(BOARD_PX * dpr);
    canvas.height = Math.round(BOARD_PX * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function clearGameTimer() {
    if (state.timer !== null) {
      window.clearInterval(state.timer);
      state.timer = null;
    }
  }

  function updateScore() {
    scoreValue.textContent = String(state.score);
    highScoreValue.textContent = String(state.highScore);
  }

  function updateControls() {
    if (state.status === "running") {
      pauseButton.textContent = "暂停";
      pauseButton.setAttribute("aria-label", "暂停游戏");
    } else if (state.status === "paused") {
      pauseButton.textContent = "继续";
      pauseButton.setAttribute("aria-label", "继续游戏");
    } else {
      pauseButton.textContent = "开始";
      pauseButton.setAttribute("aria-label", "开始游戏");
    }
  }

  function showOverlay() {
    overlay.classList.remove("is-hidden");
  }

  function hideOverlay() {
    overlay.classList.add("is-hidden");
  }

  function startGame() {
    clearGameTimer();
    state.status = "running";
    state.snake = createSnake();
    state.direction = DIRECTIONS.right;
    state.pendingDirection = null;
    state.score = 0;
    state.recordRun = false;
    state.food = spawnFood();
    hideOverlay();
    updateScore();
    updateControls();
    statusText.textContent = "游戏中";
    state.timer = window.setInterval(tick, TICK_MS);
    draw(performance.now());
  }

  function pauseGame() {
    if (state.status !== "running") {
      return;
    }

    clearGameTimer();
    state.status = "paused";
    updateControls();
    statusText.textContent = "已暂停";
    overlayTitle.textContent = "已暂停";
    overlayMessage.textContent = `当前得分 ${state.score}`;
    overlayButton.textContent = "继续";
    showOverlay();
    draw(performance.now());
  }

  function resumeGame() {
    if (state.status !== "paused") {
      return;
    }

    state.status = "running";
    hideOverlay();
    updateControls();
    statusText.textContent = "游戏中";
    state.timer = window.setInterval(tick, TICK_MS);
    draw(performance.now());
  }

  function togglePause() {
    if (state.status === "running") {
      pauseGame();
    } else if (state.status === "paused") {
      resumeGame();
    } else {
      startGame();
    }
  }

  function finishGame() {
    clearGameTimer();
    state.status = "over";
    updateControls();
    statusText.textContent = "游戏结束";
    overlayTitle.textContent = "游戏结束";
    overlayMessage.textContent = state.recordRun
      ? `本局得分 ${state.score}，刷新最高分`
      : `本局得分 ${state.score}`;
    overlayButton.textContent = "再玩一次";
    showOverlay();
    draw(performance.now());
  }

  function isOutside(cell) {
    return cell.x < 0 || cell.y < 0 || cell.x >= GRID_SIZE || cell.y >= GRID_SIZE;
  }

  function hitsBody(cell, willEat) {
    const body = willEat ? state.snake : state.snake.slice(0, -1);
    return body.some((part) => sameCell(part, cell));
  }

  function tick() {
    const nextDirection = state.pendingDirection || state.direction;
    const head = state.snake[0];
    const nextHead = { x: head.x + nextDirection.x, y: head.y + nextDirection.y };
    const willEat = state.food && sameCell(nextHead, state.food);

    state.direction = nextDirection;
    state.pendingDirection = null;

    if (isOutside(nextHead) || hitsBody(nextHead, willEat)) {
      finishGame();
      return;
    }

    if (willEat) {
      state.snake = [nextHead, ...state.snake];
      state.score += SCORE_PER_FOOD;
      if (state.score > state.highScore) {
        state.highScore = state.score;
        state.recordRun = true;
        saveHighScore();
      }
      updateScore();

      state.food = spawnFood();
      if (!state.food) {
        finishGame();
        return;
      }
    } else {
      state.snake = [nextHead, ...state.snake.slice(0, -1)];
    }

    draw(performance.now());
  }

  function handleDirection(name) {
    if (state.status === "paused") {
      resumeGame();
    }

    if (state.status === "ready" || state.status === "over") {
      startGame();
    }

    if (state.status !== "running") {
      return;
    }

    const next = DIRECTIONS[name];
    const base = state.pendingDirection || state.direction;
    if (next.x + base.x === 0 && next.y + base.y === 0) {
      return;
    }

    state.pendingDirection = next;
  }

  function handleKeyDown(event) {
    if (DIRECTION_CODES[event.code]) {
      event.preventDefault();
      handleDirection(DIRECTION_CODES[event.code]);
      return;
    }

    if (event.code === "Space" || event.code === "KeyP") {
      event.preventDefault();
      togglePause();
      return;
    }

    if (event.code === "KeyR") {
      event.preventDefault();
      startGame();
    }
  }

  function roundRectPath(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawBoard() {
    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#151a20" : "#12161b";
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    ctx.strokeStyle = "rgba(130, 150, 170, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < GRID_SIZE; i += 1) {
      ctx.moveTo(i * CELL_SIZE + 0.5, 0);
      ctx.lineTo(i * CELL_SIZE + 0.5, BOARD_PX);
      ctx.moveTo(0, i * CELL_SIZE + 0.5);
      ctx.lineTo(BOARD_PX, i * CELL_SIZE + 0.5);
    }
    ctx.stroke();
  }

  function drawFood(now) {
    if (!state.food) {
      return;
    }

    const pulse = 1 + Math.sin(now / 180) * 0.08;
    const x = state.food.x * CELL_SIZE + CELL_SIZE / 2;
    const y = state.food.y * CELL_SIZE + CELL_SIZE / 2;

    ctx.save();
    ctx.shadowColor = "rgba(255, 93, 115, 0.85)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#ff5d73";
    ctx.beginPath();
    ctx.arc(x, y, 10 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(x - 2, y - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSnake() {
    state.snake.forEach((segment, index) => {
      const inset = index === 0 ? 1.5 : 3;
      const isHead = index === 0;
      const x = segment.x * CELL_SIZE + inset;
      const y = segment.y * CELL_SIZE + inset;
      const size = CELL_SIZE - inset * 2;

      ctx.save();
      ctx.shadowColor = isHead ? "rgba(60, 242, 165, 0.9)" : "rgba(15, 159, 110, 0.55)";
      ctx.shadowBlur = isHead ? 16 : 10;
      ctx.fillStyle = isHead
        ? "#6cffc0"
        : index % 2 === 0
          ? "#2edc96"
          : "#1bbd7e";
      roundRectPath(x, y, size, size, 7);
      ctx.fill();
      ctx.restore();
    });

    drawEyes();
  }

  function drawEyes() {
    if (state.snake.length === 0) {
      return;
    }

    const head = state.snake[0];
    const x = head.x * CELL_SIZE + CELL_SIZE / 2;
    const y = head.y * CELL_SIZE + CELL_SIZE / 2;
    const direction = state.direction;

    let eyes;
    if (direction.x > 0) {
      eyes = [
        [x + 7, y - 6],
        [x + 7, y + 6],
      ];
    } else if (direction.x < 0) {
      eyes = [
        [x - 7, y - 6],
        [x - 7, y + 6],
      ];
    } else if (direction.y < 0) {
      eyes = [
        [x - 6, y - 7],
        [x + 6, y - 7],
      ];
    } else {
      eyes = [
        [x - 6, y + 7],
        [x + 6, y + 7],
      ];
    }

    ctx.fillStyle = "#07110c";
    eyes.forEach(([eyeX, eyeY]) => {
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 2.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function draw(now) {
    ctx.clearRect(0, 0, BOARD_PX, BOARD_PX);
    drawBoard();
    drawFood(now);
    drawSnake();
  }

  function renderLoop(now) {
    draw(now);
    window.requestAnimationFrame(renderLoop);
  }

  pauseButton.addEventListener("click", togglePause);
  restartButton.addEventListener("click", startGame);
  overlayButton.addEventListener("click", () => {
    if (state.status === "paused") {
      resumeGame();
    } else {
      startGame();
    }
  });

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("resize", configureCanvas);

  canvas.addEventListener(
    "touchstart",
    (event) => {
      event.preventDefault();
      const touch = event.changedTouches[0];
      state.touchStart = { x: touch.clientX, y: touch.clientY };
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchend",
    (event) => {
      event.preventDefault();
      if (!state.touchStart) {
        return;
      }

      const touch = event.changedTouches[0];
      const dx = touch.clientX - state.touchStart.x;
      const dy = touch.clientY - state.touchStart.y;
      state.touchStart = null;

      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) {
        return;
      }

      const name = Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up";
      handleDirection(name);
    },
    { passive: false }
  );

  state.snake = createSnake();
  state.food = spawnFood();
  configureCanvas();
  updateScore();
  updateControls();
  window.requestAnimationFrame(renderLoop);
})();
