<template>
  <div class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">Pixi.js · Vue 3</p>
        <h1>移动端扫雷</h1>
        <p class="lead">
          触控友好的扫雷小玩具，使用 Pixi.js 绘制棋盘，点击翻开或切换到插旗模式挑战更高难度。
        </p>
      </div>
      <div class="status-card">
        <div class="status-row">
          <span class="label">状态</span>
          <span class="value" :class="status">{{ statusMessage }}</span>
        </div>
        <div class="status-row">
          <span class="label">剩余地雷</span>
          <span class="value">{{ remainingMines }}</span>
        </div>
        <div class="status-row">
          <span class="label">已翻开</span>
          <span class="value">{{ revealedCount }} / {{ totalCells }}</span>
        </div>
        <div class="actions">
          <button class="btn" type="button" @click="resetGame">重新开始</button>
          <button class="btn ghost" type="button" @click="toggleMode">
            当前模式：{{ modeLabel }}
          </button>
        </div>
      </div>
    </header>

    <section class="controls">
      <div class="control">
        <label for="rows">行数 (6 - 14)</label>
        <input id="rows" v-model.number="config.rows" type="range" min="6" max="14" />
        <div class="control-value">{{ config.rows }}</div>
      </div>
      <div class="control">
        <label for="cols">列数 (6 - 12)</label>
        <input id="cols" v-model.number="config.cols" type="range" min="6" max="12" />
        <div class="control-value">{{ config.cols }}</div>
      </div>
      <div class="control">
        <label for="mines">地雷数</label>
        <input
          id="mines"
          v-model.number="config.mines"
          type="range"
          :min="4"
          :max="config.rows * config.cols - 4"
        />
        <div class="control-value">{{ config.mines }}</div>
      </div>
    </section>

    <section class="board-wrapper">
      <div ref="canvasHost" class="canvas-host"></div>
      <p class="hint">单击翻开方块，切换到“插旗”模式标记可疑位置。</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch, computed } from "vue";
import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  revealed: boolean;
  flagged: boolean;
  neighborCount: number;
}

type GameStatus = "ready" | "playing" | "won" | "lost";

type InteractionMode = "reveal" | "flag";

const canvasHost = ref<HTMLDivElement | null>(null);
const app = ref<Application | null>(null);
const boardLayer = new Container();
const config = reactive({ rows: 10, cols: 8, mines: 12 });
const board = ref<Cell[][]>([]);
const status = ref<GameStatus>("ready");
const interactionMode = ref<InteractionMode>("reveal");
const boardSize = ref(360);
const minePlaced = ref(false);
const revealedCount = ref(0);

const totalCells = computed(() => config.rows * config.cols);
const remainingMines = computed(
  () => Math.max(config.mines - board.value.flat().filter((c) => c.flagged).length, 0)
);
const modeLabel = computed(() => (interactionMode.value === "reveal" ? "翻开" : "插旗"));
const statusMessage = computed(() => {
  switch (status.value) {
    case "won":
      return "🎉 胜利";
    case "lost":
      return "💥 炸弹";
    case "playing":
      return "进行中";
    default:
      return "准备中";
  }
});

const colorByCount: Record<number, number> = {
  1: 0x1c7ed6,
  2: 0x2b8a3e,
  3: 0xf08c00,
  4: 0xa61e4d,
  5: 0x0b7285,
  6: 0x364fc7,
  7: 0x5c940d,
  8: 0x0b7285,
};

const clampConfig = () => {
  config.rows = Math.min(14, Math.max(6, config.rows));
  config.cols = Math.min(12, Math.max(6, config.cols));
  const maxMines = config.rows * config.cols - 4;
  config.mines = Math.min(maxMines, Math.max(4, config.mines));
};

const resetGame = () => {
  clampConfig();
  minePlaced.value = false;
  status.value = "ready";
  revealedCount.value = 0;
  board.value = Array.from({ length: config.rows }, (_, row) =>
    Array.from({ length: config.cols }, (_, col): Cell => ({
      row,
      col,
      isMine: false,
      revealed: false,
      flagged: false,
      neighborCount: 0,
    }))
  );
  renderBoard();
};

const toggleMode = () => {
  interactionMode.value = interactionMode.value === "reveal" ? "flag" : "reveal";
};

const neighbors = (cell: Cell) => {
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  return dirs
    .map(([dr, dc]) => board.value[cell.row + dr]?.[cell.col + dc])
    .filter(Boolean) as Cell[];
};

const placeMines = (safeRow: number, safeCol: number) => {
  const available: Array<[number, number]> = [];
  for (let r = 0; r < config.rows; r += 1) {
    for (let c = 0; c < config.cols; c += 1) {
      if (Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1) continue;
      available.push([r, c]);
    }
  }

  for (let i = available.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }

  const picked = available.slice(0, config.mines);
  picked.forEach(([r, c]) => {
    board.value[r][c].isMine = true;
  });

  board.value.forEach((row) => {
    row.forEach((cell) => {
      if (!cell.isMine) {
        cell.neighborCount = neighbors(cell).filter((n) => n.isMine).length;
      }
    });
  });
  minePlaced.value = true;
};

const floodReveal = (start: Cell) => {
  const queue: Cell[] = [start];
  while (queue.length) {
    const cell = queue.shift();
    if (!cell || cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    revealedCount.value += 1;
    if (cell.neighborCount === 0) {
      neighbors(cell).forEach((n) => {
        if (!n.revealed && !n.isMine) queue.push(n);
      });
    }
  }
};

const revealCell = (cell: Cell) => {
  if (cell.flagged || cell.revealed || status.value === "lost" || status.value === "won") return;
  if (!minePlaced.value) {
    placeMines(cell.row, cell.col);
    status.value = "playing";
  }

  if (cell.isMine) {
    status.value = "lost";
    board.value.flat().forEach((c) => {
      if (c.isMine) c.revealed = true;
    });
    renderBoard();
    return;
  }

  floodReveal(cell);

  const safeCells = config.rows * config.cols - config.mines;
  if (revealedCount.value >= safeCells) {
    status.value = "won";
    board.value.flat().forEach((c) => {
      if (c.isMine) c.flagged = true;
    });
  } else if (status.value === "ready") {
    status.value = "playing";
  }
  renderBoard();
};

const toggleFlag = (cell: Cell) => {
  if (cell.revealed || status.value === "lost" || status.value === "won") return;
  cell.flagged = !cell.flagged;
  renderBoard();
};

const handleCellTap = (cell: Cell) => {
  if (interactionMode.value === "flag") {
    toggleFlag(cell);
  } else {
    revealCell(cell);
  }
};

const renderCell = (cell: Cell, cellSize: number) => {
  const tile = new Graphics();
  const padding = 2;
  tile.x = cell.col * cellSize + padding;
  tile.y = cell.row * cellSize + padding;
  const radius = Math.min(10, cellSize / 4);
  const visibleSize = cellSize - padding * 2;

  if (cell.revealed) {
    const fill = cell.isMine ? 0xff6b6b : 0xe9ecef;
    tile.beginFill(fill);
    tile.lineStyle(2, 0xd6d6d6);
    tile.drawRoundedRect(0, 0, visibleSize, visibleSize, radius);
    tile.endFill();

    if (cell.isMine) {
      const mine = new Graphics();
      mine.beginFill(0x212529);
      mine.drawCircle(visibleSize / 2, visibleSize / 2, visibleSize / 4);
      mine.endFill();
      tile.addChild(mine);
    } else if (cell.neighborCount > 0) {
      const color = colorByCount[cell.neighborCount] ?? 0x343a40;
      const text = new Text(String(cell.neighborCount), new TextStyle({
        fill: color,
        fontWeight: "bold",
        fontFamily: "'Inter', 'PingFang SC', sans-serif",
        fontSize: visibleSize * 0.55,
      }));
      text.anchor.set(0.5);
      text.x = visibleSize / 2;
      text.y = visibleSize / 2;
      tile.addChild(text);
    }
  } else {
    tile.beginFill(0x30475e);
    tile.lineStyle(2, 0x192734);
    tile.drawRoundedRect(0, 0, visibleSize, visibleSize, radius);
    tile.endFill();

    if (cell.flagged) {
      const flag = new Graphics();
      flag.beginFill(0xf94144);
      flag.moveTo(visibleSize * 0.25, visibleSize * 0.2);
      flag.lineTo(visibleSize * 0.75, visibleSize * 0.35);
      flag.lineTo(visibleSize * 0.25, visibleSize * 0.5);
      flag.closePath();
      flag.endFill();

      flag.lineStyle(3, 0xf8f9fa);
      flag.moveTo(visibleSize * 0.25, visibleSize * 0.18);
      flag.lineTo(visibleSize * 0.25, visibleSize * 0.8);
      tile.addChild(flag);
    }
  }

  tile.eventMode = "static";
  tile.cursor = "pointer";
  tile.on("pointertap", () => handleCellTap(cell));
  boardLayer.addChild(tile);
};

const renderBoard = () => {
  if (!app.value) return;
  boardLayer.removeChildren();
  const dimension = boardSize.value;
  const cellSize = dimension / config.cols;
  boardLayer.x = (app.value.screen.width - dimension) / 2;
  boardLayer.y = 12;

  board.value.flat().forEach((cell) => renderCell(cell, cellSize));
};

const resizeBoard = () => {
  if (!canvasHost.value || !app.value) return;
  const hostWidth = canvasHost.value.clientWidth;
  boardSize.value = Math.min(hostWidth - 16, 480);
  app.value.renderer.resize(hostWidth, boardSize.value + 40);
  renderBoard();
};

onMounted(() => {
  if (!canvasHost.value) return;
  app.value = new Application({
    backgroundColor: 0xf8f9fa,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
  });
  canvasHost.value.appendChild(app.value.view as HTMLCanvasElement);
  app.value.stage.addChild(boardLayer);
  resetGame();
  resizeBoard();
  window.addEventListener("resize", resizeBoard);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeBoard);
  app.value?.destroy(true);
});

watch(
  () => [config.rows, config.cols, config.mines],
  () => {
    resetGame();
  }
);
</script>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  font-family: "Inter", "PingFang SC", system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

.hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
}

@media (min-width: 780px) {
  .hero {
    grid-template-columns: 1.3fr 1fr;
  }
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 4px;
  font-size: 12px;
}

h1 {
  font-size: 28px;
  margin: 0;
  color: #0f172a;
}

.lead {
  margin: 8px 0 0;
  color: #475569;
  line-height: 1.6;
}

.status-card {
  background: linear-gradient(135deg, #1d3557, #0b1b2b);
  border-radius: 16px;
  padding: 16px;
  color: #e2e8f0;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.status-row:last-child {
  border-bottom: none;
}

.label {
  color: #cbd5e1;
  font-size: 14px;
}

.value {
  font-weight: 700;
  font-size: 16px;
}

.value.won {
  color: #5eead4;
}

.value.lost {
  color: #fca5a5;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.btn {
  border: none;
  background: #f59e0b;
  color: #0b1b2b;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  flex: 1;
  min-width: 140px;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn:active {
  transform: translateY(1px);
}

.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  margin-bottom: 12px;
}

.control {
  display: grid;
  grid-template-columns: 1fr 60px;
  align-items: center;
  column-gap: 10px;
}

.control label {
  grid-column: 1 / -1;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.control input[type="range"] {
  width: 100%;
}

.control-value {
  text-align: right;
  font-weight: 700;
  color: #0f172a;
}

.board-wrapper {
  background: #0b1b2b;
  border-radius: 20px;
  padding: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
}

.canvas-host {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.hint {
  color: #cbd5e1;
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
}
</style>
