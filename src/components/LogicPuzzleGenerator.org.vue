<template>
  <div>
    <p>
      <label
        >縦:
        <input type="number" v-model.number="verticalCount" />
      </label>
    </p>
    <p>
      <label
        >横:
        <input type="number" v-model.number="horizontalCount" />
      </label>
    </p>
    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      @click="onClickCanvas"
      ref="Canvas"
    ></canvas>
    <p>
      <label>
        <textarea v-model="jsonData" readonly />
      </label>
    </p>
  </div>
</template>

<script>
import LogicPuzzleFrame from "./LogicPuzzleFrame";

class Cell {
  static changeState(cell, state) {
    return new this(cell.id, cell.x, cell.y, cell.w, cell.h, state);
  }

  constructor(id, x, y, w, h, state) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.state = state;
  }

  isChecked(pointX, pointY) {
    return (
      this.x <= pointX &&
      pointX <= this.x + this.w &&
      this.y <= pointY &&
      pointY <= this.y + this.h
    );
  }
}

export default {
  name: "LogicPuzzleGenerator",
  components: { LogicPuzzleFrame },
  data() {
    return {
      verticalCount: 5,
      horizontalCount: 5,
      canvasWidth: 300,
      canvasHeight: 300,
      margin: {
        x: 10,
        y: 10
      },
      hintSize: 20,
      canvas: null,
      // TODO: propsかなんかで渡したい
      cells: {}
    };
  },
  mounted() {
    this.canvas = this.$refs.Canvas;
    this.renderFrame();
    this.generateCells();
    this.renderCells();
    this.renderHint();
  },
  computed: {
    context() {
      if (!this.canvas || !this.canvas.getContext) {
        return null;
      }
      return this.canvas.getContext("2d");
    },
    cellSize() {
      const w =
        (this.canvas.width -
          (this.margin.x * 2 + this.verticalHintMaxCount * this.hintSize)) /
        this.horizontalCount;
      const h =
        (this.canvas.height -
          (this.margin.y * 2 + this.horizontalHintMaxCount * this.hintSize)) /
        this.verticalCount;
      return Math.min(w, h);
    },
    verticalData() {
      const data = [];
      for (let i = 0; i < this.verticalCount; i++) {
        const lineData = [];
        for (let j = 0; j < this.horizontalCount; j++) {
          const cell = this.cells[`${i}_${j}`];
          if (cell) {
            lineData.push(cell.state);
          }
        }
        data.push(lineData);
      }
      return data;
    },
    horizontalData() {
      const data = [];
      for (let i = 0; i < this.horizontalCount; i++) {
        const lineData = [];
        for (let j = 0; j < this.verticalCount; j++) {
          const cell = this.cells[`${j}_${i}`];
          if (cell) {
            lineData.push(cell.state);
          }
        }
        data.push(lineData);
      }
      return data;
    },
    verticalHint() {
      const hint = [];
      this.verticalData.forEach(lineData => {
        const lineHint = [];
        let prevState = 0;
        lineData.forEach(state => {
          if (state === 1) {
            if (prevState === 1) {
              lineHint[lineHint.length - 1] = lineHint[
                lineHint.length - 1
              ] += 1;
            } else {
              lineHint.push(1);
            }
          }
          prevState = state;
        });
        if (lineHint.length === 0) lineHint.push(0);
        hint.push(lineHint);
      });
      return hint;
    },
    horizontalHint() {
      const hint = [];
      this.horizontalData.forEach(lineData => {
        const lineHint = [];
        let prevState = 0;
        lineData.forEach(state => {
          if (state === 1) {
            if (prevState === 1) {
              lineHint[lineHint.length - 1] = lineHint[
                lineHint.length - 1
              ] += 1;
            } else {
              lineHint.push(1);
            }
          }
          prevState = state;
        });
        if (lineHint.length === 0) lineHint.push(0);
        hint.push(lineHint);
      });
      return hint;
    },
    verticalHintMaxCount() {
      return this.verticalCount / 2 + (this.verticalCount % 2);
    },
    horizontalHintMaxCount() {
      return this.horizontalCount / 2 + (this.horizontalCount % 2);
    },
    jsonData() {
      return JSON.stringify(this.cells);
    }
  },
  watch: {
    verticalCount() {
      this.onChangeSize();
    },
    horizontalCount() {
      this.onChangeSize();
    },
    canvasWidth() {
      this.canvas = null;
      this.$nextTick(() => {
        this.canvas = this.$refs.Canvas;
      });
    },
    canvasHeight() {
      this.canvas = null;
      this.$nextTick(() => {
        this.canvas = this.$refs.Canvas;
      });
    },
    jsonData() {
      this.renderFrame();
      // this.generateCells();
      this.renderCells();
      this.renderHint();
    }
  },
  methods: {
    onClickCanvas(event) {
      Object.keys(this.cells).forEach(cellId => {
        const cell = this.cells[cellId];
        if (cell.isChecked(event.offsetX, event.offsetY)) {
          this.onClickCell(cell);
        }
      });
    },
    onClickCell(cell) {
      const newCell = Cell.changeState(cell, cell.state === 1 ? 0 : 1);
      this.$set(this.cells, cell.id, newCell);
      this.renderCell(newCell);
    },
    onChangeSize() {
      this.renderFrame();
      this.renderHint();
      this.generateCells();
      // this.renderCells();
    },
    onClickCalc() {
      this.calc();
    },
    onClickClear() {
      // this.cells = this.defaultCells();
      this.paintCells(this.cells);
    },
    generateCells() {
      const mx = this.margin.x + this.horizontalHintMaxCount * this.hintSize;
      const my = this.margin.y + this.verticalHintMaxCount * this.hintSize;
      const cells = {};
      for (let i = 0; i < this.horizontalCount; i++) {
        for (let j = 0; j < this.verticalCount; j++) {
          const x = mx + this.cellSize * i;
          const y = my + this.cellSize * j;
          const state = 0;
          const cell = new Cell(
            `${i}_${j}`,
            x,
            y,
            this.cellSize,
            this.cellSize,
            state
          );
          cells[cell.id] = cell;
        }
      }
      this.cells = cells;
    },
    renderCells() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      Object.keys(this.cells).forEach(cellId => {
        this.renderCell(this.cells[cellId]);
      });
    },
    renderCell(cell) {
      this.clearRect(cell.x, cell.y, cell.w, cell.h);
      switch (cell.state) {
        case 1:
          this.fillRect(cell.x, cell.y, cell.w, cell.h);
          break;
        case 2:
          break;
        default:
          this.strokeRect(cell.x, cell.y, cell.w, cell.h);
          break;
      }
    },
    renderFrame() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const hintWidth = this.horizontalHintMaxCount * this.hintSize;
      const hintHeight = this.verticalHintMaxCount * this.hintSize;
      const mx = this.margin.x + hintWidth;
      const my = this.margin.y + hintHeight;
      const wx = mx + this.cellSize * this.horizontalCount;
      const wy = my + this.cellSize * this.verticalCount;
      this.context.strokeStyle = "black"; // TODO: DEBUG
      for (let i = 0; i < this.verticalCount + 1; i++) {
        this.strokeLine(mx, my + this.cellSize * i, wx, my + this.cellSize * i);
      }
      this.context.strokeStyle = "#494648"; // TODO: DEBUG
      for (let i = 0; i < this.horizontalCount + 1; i++) {
        this.strokeLine(my + this.cellSize * i, my, my + this.cellSize * i, wy);
      }
    },
    renderHint() {
      const mx = this.margin.x + this.horizontalHintMaxCount * this.hintSize;
      const my = this.margin.y + this.verticalHintMaxCount * this.hintSize;

      // 上側ヒントの表示
      this.context.textAlign = "center";
      for (let i = 0; i < this.horizontalCount; i++) {
        const hint = this.lPHints.vertical[i];
        if (!hint) continue;
        const reversed = hint.slice().reverse();
        for (let j = 0; j < this.verticalHintMaxCount; j++) {
          if (typeof reversed[j] === "undefined") continue;
          this.context.fillText(
            reversed[j],
            mx + this.cellSize * i + this.cellSize / 2,
            my - (this.hintSize * j + 8),
            this.hintSize
          );
        }
      }

      // 左側ヒントの表示
      this.context.textAlign = "center";
      for (let i = 0; i < this.verticalCount; i++) {
        const hint = this.lPHints.horizontal[i];
        if (!hint) continue;
        const reversed = this.horizontalHint[i].slice().reverse();
        for (let j = 0; j < this.horizontalHintMaxCount; j++) {
          if (typeof reversed[j] === "undefined") continue;
          this.context.fillText(
            reversed[j],
            my - (this.hintSize * j + 8),
            mx + this.cellSize * i + this.cellSize / 2,
            this.hintSize
          );
        }
      }
    },
    // defaultCells() {
    //   const cells = {};
    //   for (let hp = 1; hp <= this.inputData.horizontal.length; hp++) {
    //     for (let vp = 1; vp <= this.inputData.vertical.length; vp++) {
    //       const key = `${hp}_${vp}`;
    //       cells[key] = 0;
    //     }
    //   }
    //   return cells;
    // },
    clearRect(x, y, w, h) {
      this.context.clearRect(x, y, w, h);
    },
    strokeRect(x, y, w, h) {
      this.context.strokeRect(x, y, w, h);
    },
    fillRect(x, y, w, h) {
      this.context.fillRect(x, y, w, h);
    },
    strokeLine(x1, y1, x2, y2) {
      this.context.beginPath();
      this.context.moveTo(x1, y1);
      this.context.lineTo(x2, y2);
      this.context.stroke();
    },
    paintCells(currentCells, prevCells = {}) {
      Object.keys(currentCells).forEach(key => {
        if (currentCells[key] === prevCells[key]) return;
        const [hp, vp] = key.split("_");
        this.paintCell(hp, vp, currentCells[key]);
      });
    },
    paintCell(hp, vp, type = 1) {
      const x1 = this.margin.x + this.cellSize * (hp - 1);
      const y1 = this.margin.y + this.cellSize * (vp - 1);
      const w = this.cellSize;
      const h = this.cellSize;
      switch (type) {
        case 1:
          this.context.fillRect(x1, y1, w, h);
          break;
        case 2:
          this.context.beginPath();
          this.context.moveTo(x1, y1 + h);
          this.context.lineTo(x1 + w, y1);
          this.context.moveTo(x1, y1);
          this.context.lineTo(x1 + w, y1 + h);
          this.context.stroke();
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
canvas {
  border: 1px solid #aaa;
}
</style>
