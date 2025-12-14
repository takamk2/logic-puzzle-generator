import BaseAlgorithm from "./BaseAlgorithm.js";

export default class extends BaseAlgorithm {
  cellParams = {
    s: 2,
    c: "rgb(51,173,51)"
  };

  constructor(direction, index, lPHints, lPCells) {
    super(direction, index, lPHints, lPCells);
  }

  execute() {
    const hintLFixedList = Object.values(this.hintLine).filter(
      val => val !== 0
    );
    const cellLFixedList = this.line
      .reduce((res, status, i) => {
        if (i === 0) {
          res.push(0);
        }
        if (status !== 1) {
          res.push(0);
        } else {
          res[res.length - 1] += 1;
        }
        return res;
      }, [])
      .filter(data => data > 0);
    if (JSON.stringify(hintLFixedList) !== JSON.stringify(cellLFixedList)) {
      return;
    }
    for (let i = 0; i < this.subCells.length; i++) {
      const cellId = this.generateCellId(this.index, i);
      const cell = this.lPCells.getCell(cellId)
      if (cell.s === 0) {
        this.lPCells.updateCell(cellId, this.cellParams);
      }
    }
    // console.log(Object.values(this.hintLine).filter(val => val !== 0));
    // const data = this.line
    //   .reduce((res, status, i) => {
    //     if (i === 0) {
    //       res.push(0);
    //     }
    //     if (status !== 1) {
    //       res.push(0);
    //     } else {
    //       res[res.length - 1] += 1;
    //     }
    //     return res;
    //   }, [])
    //   .filter(data => data > 0);
    // console.log(data);
    // if (this.maxFixSize !== this.subCells.length) {
    //   return;
    // }
    //
    // let index = 0;
    // Object.values(this.hintLine).forEach((hint, i) => {
    //
    //
    //   if (i > 0) {
    //     console.log(index);
    //     const cellId = this.generateCellId(this.index, index);
    //     this.lPCells.updateCell(cellId, this.cellParams2);
    //     index += 1;
    //   }
    //   for (let j = 0; j < hint; j++) {
    //     console.log(index);
    //     const cellId = this.generateCellId(this.index, index);
    //     this.lPCells.updateCell(cellId, this.cellParams1);
    //     index += 1;
    //   }
    // });
  }
}
