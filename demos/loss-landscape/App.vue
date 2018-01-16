<template>
  <div id="container">
    <h1>Visualizing the landscape of neural nets</h1>
    <div v-if="loadingData" id="status">Loading data...</div>
    <div v-bind:class="{hidden: loadingData}">
      <div id="controls">
        <div class="control">
          <label>Weight initialization:</label>
          <select ref="weightSelect" @change="changeWeightsInit">
            <option value="unit" selected>N(0, 1)</option>
            <option value="fan-in">N(0, fan-in)</option>
            <option value="fan-out">N(0, fan-out)</option>
          </select>
        </div>
        <div class="control">
          <label>Model architecture:</label>
          <select ref="modelTypeSelect" @change="changeModelType">
            <option value="fc" selected>Fully Connected</option>
            <option value="conv">Convolutional</option>
          </select>
        </div>
      </div>
      <div id="all-charts">
        <div class="charts" v-for="chartsData in charts" :key="chartsData.id">
          <div class="chart" v-for="(plot, idx) in chartsData.plots" :key="idx">
            <Plot :data="plot"></Plot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
html,
body {
  display: flex;
  box-sizing: border-box;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
h1 {
  font-weight: 300;
  font-size: 40px;
}
#container {
  margin-top: 60px;
  margin-left: 60px;
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
}
#all-charts {
  display: flex;
  width: 100%;
  margin-top: 20px;
  flex-direction: column;
}
.charts {
  display: flex;
  border-bottom: 10px solid #eee;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 20px;
}
.chart {
  margin-right: 15px;
  margin-bottom: 15px;
}
.hidden {
  display: none;
}
#controls {
  width: 400px;
  display: flex;
  flex-direction: column;
}
.control {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
}
.control select {
  width: 200px;
  height: 20px;
}
</style>

<script lang="ts" src="./app.ts"></script>

