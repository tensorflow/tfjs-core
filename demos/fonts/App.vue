<!-- Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================-->

<template>
<div>
  <demo-header name="Fonts Demo"></demo-header>
  <div class="app">
    <div class="presets">
      <div class="header sticky">
        <h3>Presets</h3>
        <FontChooser
          :model="model"
          v-on:select="changeSelected"
        />
      </div>
    </div>
    <!--  -->
    <div class="input">
      <div class="header">
        <h3>Basis Dimensions of Latent Space</h3>
      </div>
      <div ref="loading">Loading...</div>
      <div ref="basis" class="basis">
        <BasisDimensions
          :model="model"
          :modelData="modelData"
          :numSamples="numSamples"
          :selectedSample="selectedSample"
          :range="range"
          :vals="dimSliderVals"
          :width="width"
          v-on:select="changeSelected"
        />
      </div>
    </div>
    <!--  -->
    <div class="output">
      <div class="header sticky">
        <h3>Output</h3>
        <Alphabet
          :model="model"
          :sample="selectedSample"
        />
      </div>
    </div>
  </div>
  <demo-footer></demo-footer>
</div>
</template>

<script>
  import Vue from 'vue';

  import DemoFooter from '../footer.vue';
  import DemoHeader from '../header.vue';
  import BasisDimensions from './components/BasisDimensions.vue';
  import FontChooser from './components/FontChooser.vue';
  import Alphabet from './components/Alphabet.vue';
  import FontModel from './utils/FontModel.js';
  import {Array1D, NDArray, NDArrayMathCPU} from 'deeplearn';

  export default {
    components: {
      Alphabet,
      BasisDimensions,
      DemoFooter,
      DemoHeader,
      FontChooser,
    },
    data() {
      return {
        model: undefined,
        modelData: "A",
        numSamples: 9,
        range: 0.8,
        width: 400,
        dimSliderVals: [],
        selectedSample: undefined
      }
    },
    created: function() {
      window.addEventListener("resize", () => {
        this.resize();
      });
      let fonts = new FontModel();
      fonts.load(() => {
        fonts.init();
        this.$refs.loading.remove();
        this.model = fonts;
        this.range = fonts.range;
        this.resize();
      });
    },
    watch: {
      model: function(val) {
        console.log("model", val)
      }
    },
    methods: {
      resize: function() {
        const width = this.$refs.basis.getBoundingClientRect().width;
        this.width = width;
      },
      changeSelected: function(event) {
        // If this is the initial (default) selection and a URL hash was
        // provided then use the sample from the hash.
        console.log("changeSelected", event)
        if (event.isInitialSelection && window.location.hash) {
          this.parseUrlHash();
        } else {
          this.selectedSample = event.selectedSample
          this.updateHash();
        }
      },
      updateHash: function() {
        if (this.selectedSample) {
          const vals = this.selectedSample.getValues();
          const hashStr = '#' + Array.from(vals).map(
            val => parseFloat(val).toFixed(3))
            .join(',');
          history.replaceState(undefined, undefined, hashStr);
        }
      },
      parseUrlHash: function() {
        const hash = window.location.hash;
        const dimVals = hash.substring(1).split(',').map(val => +val);
        // Set the selected sample and initial dimension slider values based
        // on the provided URL hash.
        this.dimSliderVals = dimVals;
        this.selectedSample = Array1D.new(dimVals);
      }
    }

  }
</script>

<style scoped>
h3 {
  font-weight: 600;
  font-size: 18px;
  margin-top: 20px;
  border-top: 2px solid black;
  padding-top: 20px;
  line-height: 1em;
}
.app {
  line-height: 1.5em;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 3fr 2fr;
  grid-column-gap: 60px;
  position: relative;
}
.header {
  padding-top: 20px;
}
.sticky {
  position: -webkit-sticky;
  position: sticky;
  z-index: 100;
  top: 0;
}
.sliderlabel {
  font-size: 14px;
}
.slidervalue {
  border: none;
  font-size: 14px;
}
</style>
