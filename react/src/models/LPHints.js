export default class LPHints {
  static createByJson(hintsJson) {
    return new LPHints(JSON.parse(hintsJson));
  }

  static createByLPCells(lPCells) {
    const v = [];
    lPCells.vertical.forEach(lineData => {
      const lineHint = [];
      let prevState = 0;
      lineData.forEach(state => {
        if (state === 1) {
          if (prevState === 1) {
            lineHint[lineHint.length - 1] = lineHint[lineHint.length - 1] += 1;
          } else {
            lineHint.push(1);
          }
        }
        prevState = state;
      });
      if (lineHint.length === 0) lineHint.push(0);
      v.push(lineHint);
    });

    const h = [];
    lPCells.horizontal.forEach(lineData => {
      const lineHint = [];
      let prevState = 0;
      lineData.forEach(state => {
        if (state === 1) {
          if (prevState === 1) {
            lineHint[lineHint.length - 1] = lineHint[lineHint.length - 1] += 1;
          } else {
            lineHint.push(1);
          }
        }
        prevState = state;
      });
      if (lineHint.length === 0) lineHint.push(0);
      h.push(lineHint);
    });

    const hints = {
      v: v,
      h: h
    };
    return new LPHints(hints);
  }

  hints = [];

  constructor(hints) {
    this.hints = hints;
  }

  get vertical() {
    return this.hints["v"] || [];
  }

  get horizontal() {
    return this.hints["h"] || [];
  }

  get json() {
    return JSON.stringify(this.hints);
  }

  getVerticalLine(index) {
    return this.vertical[index].reduce((res, hint, i) => {
      return { ...res, [i]: hint };
    }, {});
  }

  getHorizontalLine(index) {
    return this.horizontal[index].reduce((res, hint, i) => {
      return { ...res, [i]: hint };
    }, {});
  }

  getVerticalMaxFixSize(index) {
    return this.vertical[index].reduce((res, hint, i) => {
      if (i > 0) {
        res += 1;
      }
      return res + hint;
    }, 0);
  }

  getHorizontalMaxFixSize(index) {
    return this.horizontal[index].reduce((res, hint, i) => {
      if (i > 0) {
        res += 1;
      }
      return res + hint;
    }, 0);
  }
}
