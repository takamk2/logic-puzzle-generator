import BaseAlgorithm from "./BaseAlgorithm";

export default class extends BaseAlgorithm {
  cellParams = {
    s: 1,
    c: "#ff912d"
  };

  constructor(direction, index, lPHints, lPCells) {
    super(direction, index, lPHints, lPCells);
  }

  execute() {
    if (Object.values(this.hintLine)[0] !== this.subCells.length) {
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
