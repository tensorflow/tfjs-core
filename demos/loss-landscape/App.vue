<template>

<div id="container">
  <div id="status">Loading data...</div>
  <div id="message"></div>
  <div id="controls">
    <select id="weightInit">
        <option value="unit">Gaussian(0, 1)</option>
        <option value="fan-in">Gaussian with fan-in</option>
        <option value="fan-out">Gaussian with fan-out</option>
    </select>
  </div>
  <!-- Plotly chart will be drawn inside this DIV -->
  <div id="chart"></div>
</div>
</template>

<style>
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
#chart {
  width: 300px;
  height: 300px;
}
#container {
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
}
</style>

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script lang="ts" src="./app.ts"></script>

