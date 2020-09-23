<template>
  <div>
    <button @click="onClickCalc">計算</button>
    <button @click="onClickClear">クリア</button>
    <canvas :width="canvasWidth" :height="canvasHeight" ref="Canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: "LogicPuzzleGenerator",
  data() {
    return {
      canvasWidth: 200,
      canvasHeight: 200,
      margin: {
        x: 10,
        y: 10
      },
      canvas: null,
      // TODO: propsかなんかで渡したい
      cells: null,
      inputData: {
        vertical: [[5], [3], [2, 2], [4], [5]],
        horizontal: [[2, 2], [1, 3], [5], [2, 2], [3, 1]]
      }
    };
  },
  mounted() {
    this.canvas = this.$refs.Canvas;
    this.cells = this.defaultCells();
    this.paintCells(this.cells);
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
        (this.canvas.width - this.margin.x * 2) /
        this.inputData.horizontal.length;
      const h =
        (this.canvas.height - this.margin.y * 2) /
        this.inputData.vertical.length;
      return Math.min(w, h);
    }
  },
  watch: {
    canvas() {
      this.initFrame();
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
    cells() {}
  },
  methods: {
    onClickCalc() {
      this.calc();
    },
    onClickClear() {
      this.cells = this.defaultCells();
      this.paintCells(this.cells);
    },
    initFrame() {
      const mx = this.margin.x;
      const my = this.margin.y;
      const wx =
        this.margin.x + this.cellSize * this.inputData.horizontal.length;
      const wy = this.margin.y + this.cellSize * this.inputData.vertical.length;
      for (let i = 0; i < this.inputData.horizontal.length + 1; i++) {
        this.strokeLine(mx, my + this.cellSize * i, wx, my + this.cellSize * i);
      }
      for (let i = 0; i < this.inputData.vertical.length + 1; i++) {
        this.strokeLine(my + this.cellSize * i, my, my + this.cellSize * i, wy);
      }
    },
    defaultCells() {
      const cells = {};
      for (let hp = 1; hp <= this.inputData.horizontal.length; hp++) {
        for (let vp = 1; vp <= this.inputData.vertical.length; vp++) {
          const key = `${hp}_${vp}`;
          cells[key] = 0;
        }
      }
      return cells;
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
    },
    calc() {
      // eslint-disable-next-line no-constant-condition
      while(true) {
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
