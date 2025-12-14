export default class BaseAlgorithm {

  constructor(direction, index, lPHints, lPCells) {
    this.direction = direction;
    this.index = index;
    this.lPHints = lPHints;
    this.lPCells = lPCells;
  }

  execute() {
    // Please Override
    return this.lPCells;
  }

  get hintLine() {
    switch (this.direction) {
      case "vertical":
        return this.lPHints.getVerticalLine(this.index);
      case "horizontal":
        return this.lPHints.getHorizontalLine(this.index);
      default:
        return null;
    }
  }

  get mainCells() {
    switch (this.direction) {
      case "vertical":
        return this.lPCells.vertical;
      case "horizontal":
        return this.lPCells.horizontal;
      default:
        return [];
    }
  }

  get subCells() {
    switch (this.direction) {
      case "vertical":
        return this.lPCells.horizontal;
      case "horizontal":
        return this.lPCells.vertical;
      default:
        return [];
    }
  }

  get maxFixSize() {
    switch (this.direction) {
      case "vertical":
        return this.lPHints.getVerticalMaxFixSize(this.index);
      case "horizontal":
        return this.lPHints.getHorizontalMaxFixSize(this.index);
      default:
        return 0;
    }
  }

  get line() {
    switch (this.direction) {
      case "vertical":
        return this.lPCells.getVerticalLine(this.index);
      case "horizontal":
        return this.lPCells.getHorizontalLine(this.index);
      default:
        return 0;
    }
  }


  generateCellId(mainIndex, subIndex) {
    return this.direction === "vertical"
      ? `${mainIndex}_${subIndex}`
      : `${subIndex}_${mainIndex}`;
  }
}