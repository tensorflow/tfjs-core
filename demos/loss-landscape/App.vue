<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <!-- Title -->
        <span class="mdl-layout-title">Visualizing the Landscape of Neural Nets</span>
        <!-- Add spacer, to align navigation to the right -->
        <div class="mdl-layout-spacer"></div>
        <!-- Navigation. We hide it in small screens. -->
        <nav class="mdl-navigation mdl-layout--large-screen-only">
          <a class="mdl-navigation__link" href="">Code</a>
          <a class="mdl-navigation__link" href="">Share</a>
        </nav>
      </div>
    </header>
    <div class="mdl-layout__drawer">
      <span class="mdl-layout-title">NN Landscape Explorer</span>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" href="">Nothing</a>
        <a class="mdl-navigation__link" href="">to</a>
        <a class="mdl-navigation__link" href="">See</a>
        <a class="mdl-navigation__link" href="">Here</a>
      </nav>
    </div>
    <main class="mdl-layout__content nnl-main">

      <aside class="mdl-components__nav mdl-shadow--4dp nnl-controls">
        <h2>Conditions</h2>
        <table>
          <tr>
            <td>Weight:</td>
            <td>
              <select ref="weightSelect" @change="changeWeightsInit">
                <option value="unit" selected>N(0, 1)</option>
                <option value="fan-in">N(0, fan-in)</option>
                <option value="fan-out">N(0, fan-out)</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Model:</td>
            <td>
              <select ref="modelTypeSelect" @change="changeModelType">
                <option value="fc" selected>Fully Connected</option>
                <option value="conv">Convolutional</option>
              </select>
            </td>
          </tr>
        </table>
        <p class="nnl-help-text">
          Make any change to these conditions to automatically run a new experiment.
        </p>
      </aside>

      <div v-if="loadingData" class="nnl-status">
          Loading data...
      </div>
      <div class="nnl-results" v-bind:class="{hidden: loadingData}">
        <table>
          <tr class="nnl-result" v-for="chartsData in charts" :key="chartsData.id">
            <th class="nnl-settings">
              <h3>Experiment #{{chartsData.id + 1}}</h3>
              <table>
                <tr>
                  <td>Weight:</td>
                  <td>{{chartsData.plots[0].weightInit}}</td>
                </tr>
                <tr>
                  <td>Model:</td>
                  <td>{{chartsData.plots[0].modelType}}</td>
                </tr>
                <tr>
                  <td>Final Loss:</td>
                  <td>{{chartsData.plots[chartsData.plots.length - 1].loss.toFixed(2)}}</td>
                </tr>
              </table>
            </th>
            <td>
              <div class="nnl-charts">
                <div class="nnl-chart" v-for="(plot, idx) in chartsData.plots" :key="idx">
                  <Plot :data="plot"></Plot>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div><!-- /nnl-results -->
    </main>
  </div>
</template>

<style>
.nnl-main {
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.nnl-controls {
  box-sizing: border-box;
  flex-shrink: 0;
  max-width: 300px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 36px;
}
.nnl-controls h2 {
  font-size: 24px;
  line-height: 1.2;
  margin: 0;
  padding: 0;
}
.nnl-controls table {
  border-collapse: collapse;
  font-weight: 300;
  margin: 12px 0;
}
.nnl-controls select {
  width: 100%;
}

.nnl-help-text {
  box-sizing: border-box;
  font-size: 12px;
  font-style: italic;
  font-weight: 300;
  line-height: 1.2;
  margin: 0;
  padding: 0;
}

.nnl-status {
  box-sizing: border-box;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 36px;
}

.nnl-results {
  box-sizing: border-box;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 36px;
}
.nnl-settings {
  text-align: left;
  vertical-align: top;
}
.nnl-settings h3 {
  font-size: 16px;
  margin: 0;
  padding: 0;
  line-height: 1.2;
}
.nnl-settings table {
  border-collapse: collapse;
  font-weight: 300;
  margin-top: 12px;
}
.nnl-settings td {
  padding-right: 12px;
  white-space: nowrap;
}
.nnl-charts {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 64px;
}
.nnl-chart {
  margin-right: 16px;
}
/*
html,
body {
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  display: flex;
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
*/
</style>

<script lang="ts" src="./app.ts"></script>
