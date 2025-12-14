export default class LPCellPoints {
  constructor({
    marginX,
    marginY,
    horizontalCount,
    verticalCount,
    cellSize,
    hintSize,
  }) {
    this.marginX = marginX;
    this.marginY = marginY;
    this.horizontalCount = horizontalCount;
    this.verticalCount = verticalCount;
    this.cellSize = cellSize;
    this.hintSize = hintSize;
  }

  get topHintMaxCount() {
    return Math.floor(this.verticalCount / 2 + (this.verticalCount % 2));
  }

  get leftHintMaxCount() {
    return Math.floor(this.horizontalCount / 2 + (this.horizontalCount % 2));
  }

  get points() {
    const points = {};
    const mx = this.marginX + this.leftHintMaxCount * this.hintSize;
    const my = this.marginY + this.topHintMaxCount * this.hintSize;
    for (let i = 0; i < this.horizontalCount; i++) {
      for (let j = 0; j < this.verticalCount; j++) {
        const cellId = `${i}_${j}`;
        const x = mx + this.cellSize * i;
        const y = my + this.cellSize * j;
        points[cellId] = {
          id: cellId,
          x: x,
          y: y,
          w: this.cellSize,
          h: this.cellSize
        };
      }
    }
    return points;
  }

  get cellIds() {
    return Object.keys(this.points);
  }

  get json() {
    return JSON.stringify(this.points);
  }

  getPoint(cellId) {
    return this.points[cellId] || null;
  }
}
