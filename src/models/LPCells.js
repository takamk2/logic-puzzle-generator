import Copy from "../utils/Copy";

const UNKNOWN = 0;
const PAINT = 1;
const NO_PAINT = 2;

const STATE = [UNKNOWN, PAINT, NO_PAINT];

const Cell = {
  create: (params = {}) => {
    return {
      id: null,
      s: 0, // state
      c: "#000000", // color
      ...params
    };
  },

  nextState(cell) {
    cell.s = (cell.s + 1) % STATE.length;
  }
};

export default class LPCells {
  static empty(verticalCount, horizontalCount) {
    const cells = {};
    for (let i = 0; i < horizontalCount; i++) {
      for (let j = 0; j < verticalCount; j++) {
        const cellId = `${i}_${j}`;
        cells[cellId] = Cell.create({ id: cellId, s: UNKNOWN });
      }
    }
    return new LPCells(cells);
  }

  cells = {};

  constructor(cells) {
    this.cells = cells;
  }

  get cellIds() {
    return Object.keys(this.cells);
  }

  get verticalCount() {
    return (
      Math.max(...this.cellIds.map(cellId => Number(cellId.split("_")[0]))) + 1
    );
  }

  get horizontalCount() {
    return (
      Math.max(...this.cellIds.map(cellId => Number(cellId.split("_")[1]))) + 1
    );
  }

  get vertical() {
    const cells = [];
    for (let i = 0; i < this.verticalCount; i++) {
      const lineData = [];
      for (let j = 0; j < this.horizontalCount; j++) {
        const cell = this.cells[`${i}_${j}`];
        if (cell) {
          lineData.push(cell.s);
        }
      }
      cells.push(lineData);
    }
    return cells;
  }

  get horizontal() {
    const cells = [];
    for (let i = 0; i < this.horizontalCount; i++) {
      const lineData = [];
      for (let j = 0; j < this.verticalCount; j++) {
        const cell = this.cells[`${j}_${i}`];
        if (cell) {
          lineData.push(cell.s);
        }
      }
      cells.push(lineData);
    }
    return cells;
  }

  get totalCount() {
    return this.cellIds.length;
  }

  get fixedCount() {
    console.log(this.cells);
    return this.cellIds.reduce((res, id) => {
      const cell = this.getCell(id);
      if (cell.s !== UNKNOWN) {
        res += 1;
      }
      return res;
    }, 0);
  }

  get restCount() {
    return this.totalCount - this.fixedCount;
  }

  get score() {
    return {
      fixed: this.fixedCount,
      total: this.totalCount,
      rest: this.restCount,
    };
  }

  get json() {
    return JSON.stringify(this.cells);
  }

  updateNextState(cellId) {
    const copiedCells = Copy.deep(this.cells);
    const cell = copiedCells[cellId];
    const nextState = (cell.s + 1) % STATE.length;
    copiedCells[cellId] = Cell.create({ ...cell, s: nextState });
    cell.s = (cell.s + 1) % STATE.length;
    return new LPCells(copiedCells);
  }

  getCell(cellId) {
    return this.cells[this.cellIds.find(id => id === cellId)] || null;
  }

  updateCell(cellId, cellParams) {
    const cell = this.getCell(cellId);
    this.cells[cellId] = { ...cell, ...cellParams };
  }

  isFixed(cellId) {
    const cell = this.getCell(cellId);
    return cell.s !== UNKNOWN;
  }

  getVerticalLine(index) {
    return this.vertical[index];
  }

  getHorizontalLine(index) {
    return this.horizontal[index];
  }

  getTrimmedVerticalLine(index) {
    let startIndex = 0;
    const line = this.vertical[index];
    for (let i = 0; i < line.length; i++) {
      if (line[i] === 0) {
        break;
      }
      startIndex = i;
    }

    let endIndex = line.length - 1;
    for (let i = line.length - 1; i >= 0; i--) {
      if (line[i] === 0) {
        break;
      }
      endIndex = i;
    }

    return line.reduce((res, status, i) => {
      if (index >= startIndex && index <= endIndex) {
        return { ...res, [i]: status };
      } else {
        return res;
      }
    }, {});
  }

  getTrimmedHorizontalLine(index) {
    let startIndex = 0;
    const line = this.horizontal[index];
    for (let i = 0; i < line.length; i++) {
      if (line[i] === 0) {
        break;
      }
      startIndex = i;
    }

    let endIndex = line.length - 1;
    for (let i = line.length - 1; i >= 0; i--) {
      if (line[i] === 0) {
        break;
      }
      endIndex = i;
    }

    return line.reduce((res, status, i) => {
      if (index >= startIndex && index <= endIndex) {
        return { ...res, [i]: status };
      } else {
        return res;
      }
    }, {});
  }

  isVerticalLineFixed(index) {
    return this.vertical[index].every(hint => hint !== 0);
  }

  isHorizontalLineFixed(index) {
    return this.horizontal[index].every(hint => hint !== 0);
  }

  clone() {
    return new LPCells(JSON.parse(this.json));
  }
}
