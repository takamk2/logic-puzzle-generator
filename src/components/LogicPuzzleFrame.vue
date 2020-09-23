<template>
  <canvas
    :width="canvasWidth"
    :height="canvasHeight"
    @click="onClickCanvas"
    ref="Canvas"
  ></canvas>
</template>

<script>
// TODO: セルの色
// TODO: 5セルごとに太線
import LPCellPoints from "../models/LPCellPoints";

export default {
  name: "LogicPuzzleFrame",
  props: {
    canvasWidth: {
      type: Number,
      default: 300
    },
    canvasHeight: {
      type: Number,
      default: 300
    },
    /**
     * 縦セル数
     */
    verticalCount: {
      type: Number,
      default: 5
    },
    /**
     * 横セル数
     */
    horizontalCount: {
      type: Number,
      default: 5
    },
    lPCells: {
      type: Object,
      default: null
    },
    lPHints: {
      type: Object,
      default: null
    },
    cellIsShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      canvas: null,
      marginX: 10,
      marginY: 10,
      hintSize: 20
    };
  },
  mounted() {
    this.canvas = this.$refs.Canvas;
    this.render();
  },
  watch: {
    lPCells() {
      this.render();
    },
    lPHints() {
      this.render();
    },
    cellIsShow() {
      this.render();
    }
  },
  computed: {
    context() {
      if (!this.canvas || !this.canvas.getContext) {
        return null;
      }
      return this.canvas.getContext("2d");
    },
    lPCellPoints() {
      return new LPCellPoints({
        marginX: this.marginX,
        marginY: this.marginY,
        horizontalCount: this.horizontalCount,
        verticalCount: this.verticalCount,
        cellSize: this.cellSize,
        hintSize: this.hintSize
      });
    },
    topHintMaxCount() {
      return Math.floor(this.verticalCount / 2 + (this.verticalCount % 2));
    },
    leftHintMaxCount() {
      return Math.floor(this.horizontalCount / 2 + (this.horizontalCount % 2));
    },
    hintWidth() {
      return this.leftHintMaxCount * this.hintSize;
    },
    hintHeight() {
      return this.topHintMaxCount * this.hintSize;
    },
    leftSpaceWidth() {
      return this.marginX + this.hintWidth;
    },
    topSpaceHeight() {
      return this.marginY + this.hintHeight;
    },
    cellsWidth() {
      return this.cellSize * this.horizontalCount;
    },
    cellsHeight() {
      return this.cellSize * this.verticalCount;
    },
    cellSize() {
      const w = Math.floor(
        (this.canvas.width - this.marginX * 2 - this.hintWidth) /
          this.horizontalCount
      );
      const h = Math.floor(
        (this.canvas.height - this.marginY * 2 - this.hintHeight) /
          this.verticalCount
      );
      return Math.min(w, h);
    }
  },
  methods: {
    onClickCanvas(event) {
      this.lPCellPoints.cellIds.forEach(cellId => {
        const point = this.lPCellPoints.getPoint(cellId);
        if (this.isChecked(event.offsetX, event.offsetY, point)) {
          this.onClickCell(cellId);
        }
      });
    },
    onClickCell(cellId) {
      this.$emit("click-cell", cellId);
    },
    isChecked(offsetX, offsetY, point) {
      return (
        point.x <= offsetX &&
        offsetX <= point.x + point.w &&
        point.y <= offsetY &&
        offsetY <= point.y + point.h
      );
    },
    render() {
      this.resetCanvas();
      this.renderHints();
      this.renderCells();
      this.renderFrame();
    },
    resetCanvas() {
      this.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.fillRect(0, 0, this.canvas.width, this.canvas.height, {
        fillStyle: "#ffffff"
      });
    },
    renderFrame() {
      for (let i = 0; i < this.verticalCount + 1; i++) {
        const isFirstLine = i === 0;
        const isLastLine = i === this.verticalCount;
        const isSeparationLine = !isFirstLine && !isLastLine && i % 5 === 0;
        const lineWidth = isSeparationLine ? 2 : 1;
        const lineDash =
          isFirstLine || isLastLine || isSeparationLine ? [] : [1, 1];
        this.strokeLine(
          this.leftSpaceWidth,
          this.topSpaceHeight + this.cellSize * i,
          this.leftSpaceWidth + this.cellsWidth,
          this.topSpaceHeight + this.cellSize * i,
          { lineWidth, lineDash }
        );
      }
      for (let i = 0; i < this.horizontalCount + 1; i++) {
        const isFirstLine = i === 0;
        const isLastLine = i === this.horizontalCount;
        const isSeparationLine = !isFirstLine && !isLastLine && i % 5 === 0;
        const lineWidth = isSeparationLine ? 2 : 1;
        const lineDash =
          isFirstLine || isLastLine || isSeparationLine ? [] : [1, 1];
        this.strokeLine(
          this.leftSpaceWidth + this.cellSize * i,
          this.topSpaceHeight,
          this.leftSpaceWidth + this.cellSize * i,
          this.topSpaceHeight + this.cellsHeight,
          { lineWidth, lineDash }
        );
      }
    },
    renderHints() {
      if (!this.lPHints) {
        return;
      }

      this.context.textAlign = "center";

      // 上側ヒントの表示
      this.lPHints.vertical.forEach((line, i) => {
        const reversed = line.slice().reverse();
        reversed.forEach((hint, j) => {
          this.fillText(
            String(hint),
            this.leftSpaceWidth + this.cellSize * i + this.cellSize / 2,
            this.topSpaceHeight - (this.hintSize * j + 8),
            this.hintSize
          );
        });
      });

      // 左側ヒントの表示
      this.lPHints.horizontal.forEach((line, i) => {
        const reversed = line.slice().reverse();
        reversed.forEach((hint, j) => {
          this.fillText(
            String(hint),
            this.leftSpaceWidth - (this.hintSize * j + 8),
            this.topSpaceHeight + this.cellSize * i + this.cellSize / 2,
            this.hintSize
          );
        });
      });
    },
    renderCells() {
      if (!this.lPCells || !this.cellIsShow) {
        return;
      }

      this.lPCells.cellIds.forEach(cellId => {
        const cell = this.lPCells.getCell(cellId);
        this.renderCell(cell);
      });
    },
    renderCell(cell) {
      const point = this.lPCellPoints.getPoint(cell.id);
      if (!point) return;

      this.fillRect(point.x, point.y, point.w, point.h, {
        fillStyle: "#ffffff"
      });
      switch (cell.s) {
        case 1:
          this.fillRect(point.x, point.y, point.w, point.h, {
            fillStyle: cell.c
          });
          break;
        case 2:
          this.strokeNoPaint(point.x, point.y, point.w, point.h, {
            strokeStyle: cell.c,
          });
          break;
        default:
          // NOP
          break;
      }
    },
    clearRect(x, y, w, h) {
      this.context.clearRect(x, y, w, h);
    },
    fillText(text, x, y, size, options) {
      const _options = {
        fillStyle: "#000000",
        ...options
      };
      this.context.fillStyle = _options.fillStyle;
      this.context.fillText(text, x, y, size);
    },
    fillRect(x, y, w, h, options) {
      const _options = {
        fillStyle: "#000000",
        ...options
      };
      this.context.fillStyle = _options.fillStyle;
      this.context.fillRect(x, y, w, h);
    },
    strokeLine(x1, y1, x2, y2, options) {
      const _options = {
        lineWidth: 1,
        lineDash: [],
        strokeStyle: "#000000",
        ...options
      };
      this.context.lineWidth = _options.lineWidth;
      this.context.strokeStyle = _options.strokeStyle;
      this.context.setLineDash(_options.lineDash);
      this.context.beginPath();
      this.context.moveTo(x1, y1);
      this.context.lineTo(x2, y2);
      this.context.stroke();
    },
    strokeNoPaint(x, y, w, h, options) {
      this.strokeLine(x, y, x + w, y + h, options);
      this.strokeLine(x + w, y, x, y + h, options);
    }
  }
};
</script>

<style scoped></style>
