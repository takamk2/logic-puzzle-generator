import BaseAlgorithm from "./BaseAlgorithm.js";

export default class extends BaseAlgorithm {
  cellParams = {
    s: 2,
    c: "#2562ff"
  };

  constructor(direction, index, lPHints, lPCells) {
    super(direction, index, lPHints, lPCells);
  }

  execute() {
    if (this.maxFixSize !== 0) {
      return;
    }

    for (let i = 0; i < this.subCells.length; i++) {
      const cellId = this.generateCellId(this.index, i);
      if (!this.lPCells.isFixed(cellId)) {
        this.lPCells.updateCell(cellId, this.cellParams);
      }
    }
  }
}
