<template>
  <div id="container">
    <h1>Visualizing the landscape of neural nets</h1>
    <div id="status">Loading data...</div>
    <div id="message"></div>
    <div id="controls">
      <select id="weight-init">
        <option value="unit">Gaussian(0, 1)</option>
        <option value="fan-in">Gaussian with fan-in</option>
        <option value="fan-out">Gaussian with fan-out</option>
      </select>
      <button id="train">Train</button>
    </div>
    <!-- Plotly chart will be drawn inside this DIV -->
    <div id="chart"></div>
  </div>
</template>

<style>
html,
body {
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
#chart {
  width: 300px;
  height: 300px;
}
#container {
  margin: 60px 60px;
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
}
</style>

<script lang="ts" src="./app.ts"></script>

