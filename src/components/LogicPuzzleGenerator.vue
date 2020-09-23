<template>
  <div>
    <p>
      <label
        >縦:
        <input type="number" v-model.number="verticalCount" />
      </label>
    </p>
    <p>
      <label
        >横:
        <input type="number" v-model.number="horizontalCount" />
      </label>
    </p>
    <p>
      <button @click="onClickShowButton">{{ cellIsShow ? 'セル非表示' : 'セル表示' }}</button>
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
    <dl>
      <dt>
        Hints:
      </dt>
      <dd>
        <textarea v-if="lPHints" v-model="lPHints.json" rows="5" cols="50" readonly />
      </dd>
      <dt>
        Cells:
      </dt>
      <dd>
        <textarea v-if="lPCells" v-model="lPCells.json" rows="5" cols="50"  readonly />
      </dd>
    </dl>
  </div>
</template>

<script>
import LogicPuzzleFrame from "./LogicPuzzleFrame";
import LPHints from "../models/LPHints";
import LPCells from "../models/LPCells";

export default {
  name: "LogicPuzzleGenerator",
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
    };
  },
  mounted() {
    this.lPCells = LPCells.empty(this.verticalCount, this.horizontalCount);
    this.lPHints = LPHints.createByLPCells(this.lPCells);
  },
  computed: {},
  watch: {
    verticalCount() {
      this.onChangeSize();
      this.lPCells = LPCells.empty(this.verticalCount, this.horizontalCount);
      this.lPHints = LPHints.createByLPCells(this.lPCells);
    },
    horizontalCount() {
      this.onChangeSize();
      this.lPCells = LPCells.empty(this.verticalCount, this.horizontalCount);
      this.lPHints = LPHints.createByLPCells(this.lPCells);
    },
    lPCells() {
      this.lPHints = LPHints.createByLPCells(this.lPCells);
    }
  },
  methods: {
    onChangeSize() {},
    onClickCell(cellId) {
      this.lPCells = this.lPCells.updateNextState(cellId);
    },
    onClickShowButton() {
      this.cellIsShow = !this.cellIsShow;
    },
  }
};
</script>
