<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <!-- Title -->
        <span class="mdl-layout-title">Visualizing the landscape of neural nets</span>
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
    <main class="mdl-layout__content">
      <div class="page-content">
  
  
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
    </main>
  </div>
</template>

<style>
html, body {
  box-sizing: border-box;
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
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
