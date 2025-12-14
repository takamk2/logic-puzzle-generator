import BaseAlgorithm from "./BaseAlgorithm.js";

export default class extends BaseAlgorithm {
  cellParams1 = {
    s: 1,
    c: "#ff7efd"
  };
  cellParams2 = {
    s: 2,
    c: "#ff7efd"
  };

  constructor(direction, index, lPHints, lPCells) {
    super(direction, index, lPHints, lPCells);
  }

  execute() {
    if (this.maxFixSize !== this.subCells.length) {
      return;
    }

    let index = 0;
    Object.values(this.hintLine).forEach((hint, i) => {
      if (i > 0) {
        const cellId = this.generateCellId(this.index, index);
        if (!this.lPCells.isFixed(cellId)) {
          this.lPCells.updateCell(cellId, this.cellParams2);
        }
        index += 1;
      }
      for (let j = 0; j < hint; j++) {
        const cellId = this.generateCellId(this.index, index);
        if (!this.lPCells.isFixed(cellId)) {
          this.lPCells.updateCell(cellId, this.cellParams1);
        }
        index += 1;
      }
    });
  }
}
