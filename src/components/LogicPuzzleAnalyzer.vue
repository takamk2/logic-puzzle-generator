<template>
  <div>
    <dl>
      <dt>
        Import hints JSON:
      </dt>
      <dd>
        <textarea v-model="hintsJson" rows="5" cols="50" />
      </dd>
    </dl>
    <p>
      <button @click="onClickAnalyze">解析</button>
    </p>
    <p>
      <button @click="onClickClear">クリア</button>
    </p>
    <LogicPuzzleFrame
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
      :vertical-count="verticalCount"
      :horizontal-count="horizontalCount"
      :l-p-hints="lPHints"
      :l-p-cells="lPCells"
      :cell-is-show="cellIsShow"
      @click-cell="onClickCell"
    />
  </div>
</template>

<script>
import LogicPuzzleFrame from "./LogicPuzzleFrame";
import LPHints from "../models/LPHints";
import LPCells from "../models/LPCells";

import algoPatterns from "../algorithm/patterns";

export default {
  name: "LogicPuzzleAnalyzer",
  components: {
    LogicPuzzleFrame
  },
  data() {
    return {
      verticalCount: 5,
      horizontalCount: 5,
      canvasWidth: 500,
      canvasHeight: 500,
      margin: {
        x: 10,
        y: 10
      },
      hintSize: 20,
      lPHints: null,
      lPCells: null,
      cellIsShow: true,
      hintsJson: ""
    };
  },
  mounted() {
    this.lPCells = LPCells.empty(this.verticalCount, this.horizontalCount);
    this.lPHints = LPHints.createByLPCells(this.lPCells);
  },
  watch: {
    verticalCount() {
      this.lPCells = LPCells.empty(this.verticalCount, this.horizontalCount);
      this.lPHints = LPHints.createByLPCells(this.lPCells);
    },
    horizontalCount() {
      this.lPCells = LPCells.empty(this.verticalCount, this.horizontalCount);
      this.lPHints = LPHints.createByLPCells(this.lPCells);
    },
    hintsJson() {
      const lPHints = LPHints.createByJson(this.hintsJson);
      this.verticalCount = lPHints.horizontal.length; // NOTE: verticalCountはhorizontal.length
      this.horizontalCount = lPHints.vertical.length; // NOTE: horizontalCountはvertical.length
      this.$nextTick(() => {
        this.lPHints = lPHints;
      });
    },
  },
  methods: {
    onClickAnalyze() {
      this.analyze();
      // // const lPHints = LPHints.createByJson(this.hintsJson);
      // // this.verticalCount = lPHints.horizontal.length; // NOTE: verticalCountはhorizontal.length
      // // this.horizontalCount = lPHints.vertical.length; // NOTE: horizontalCountはvertical.length
      // this.$nextTick(() => {
      //   // this.lPHints = lPHints;
      //   this.analyze();
      // });
    },
    onClickClear() {
      this.lPCells = LPCells.empty(this.verticalCount, this.horizontalCount);
    },
    onClickCell(cellId) {
      this.lPCells = this.lPCells.updateNextState(cellId);
    },
    async analyze() {
      let lPCells = this.lPCells.clone();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const beforeLPCells = lPCells.clone();
        for (let i = 0; i < lPCells.vertical.length; i++) {
          algoPatterns.forEach(algo =>
            algo("vertical", i, this.lPHints, lPCells)
          );
          if (lPCells.isVerticalLineFixed(i)) {
            this.onAnalyzing(lPCells);
            continue;
          }
        }
        for (let i = 0; i < lPCells.horizontal.length; i++) {
          algoPatterns.forEach(algo =>
            algo("horizontal", i, this.lPHints, lPCells)
          );
          if (lPCells.isHorizontalLineFixed(i)) {
            this.onAnalyzing(lPCells);
            continue;
          }
        }

        if (beforeLPCells.json === lPCells.json) {
          break;
        }
      }
      this.onAnalyzeFinish(lPCells);
    },
    onAnalyzing(lPCells) {
      this.lPCells = lPCells;
    },
    onAnalyzeFinish(lPCells) {
      // alert(lPCells.score);
      alert(
        `total: ${lPCells.totalCount}, fixed: ${lPCells.fixedCount}, rest: ${lPCells.restCount}`
      );
      console.log(lPCells.score);
    }
  }
};
</script>
