<template>
  <div id="app">
    <div class="buttons">
      <button :disabled="page === 'generator'" @click="onClickGeneratorButton">Generator</button>
      <button :disabled="page === 'analyzer'" @click="onClickAnalyzerButton">Analyzer</button>
    </div>
    <div v-show="page === 'generator'">
      <h1>LogicPuzzleGenerator</h1>
      <LogicPuzzleGenerator />
    </div>
    <div v-show="page === 'analyzer'">
      <h1>LogicPuzzleAnalyzer</h1>
      <LogicPuzzleAnalyzer />
    </div>
  </div>
</template>

<script>
import LogicPuzzleGenerator from "./components/LogicPuzzleGenerator";
import LogicPuzzleAnalyzer from "./components/LogicPuzzleAnalyzer";

export default {
  name: "App",
  components: {
    LogicPuzzleGenerator,
    LogicPuzzleAnalyzer
  },
  data() {
    return {
      page: "generator"
    };
  },
  methods: {
    onClickGeneratorButton() {
      this.page = 'generator'
    },
    onClickAnalyzerButton() {
      this.page = 'analyzer'
    },
  }
};
</script>

<style scoped>
  h1 {
    color: rgba(73,70,72,0.9);
  }
.buttons button {
  margin: 4px;
}
</style>
