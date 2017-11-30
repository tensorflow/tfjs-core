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
<div ref="container" class="container" v-on:click="select">
  <div
    class="tray"
    :style="{height: height + 'px'}"

  >
    <span
      v-for="(sample, key, i) in samples"
      :style="{position: 'absolute', left: sample.position + 'px'}"
    >
      <Sample
        :displayWidth="sampleWidth"
        :displayHeight="sampleWidth"
        :model="model"
        :character="modelData"
        :sample="sample.sample"
      />
    </span>
    <div
      ref="selectedReticle"
      class="reticle selected"
      :style="{left: selectedX + 'px', height: height + 6 + 'px'}"
    >
      <div class="label">{{format(selectedValue)}}</div>
    </div>
  </div>
  <Axis :min="extent[0]" :max="extent[1]" :width="width"/>
</div>
</template>

<script>
import Sample from './Sample.vue';
import Axis from './XAxis.vue';
import utils from '../utils/Utils.ts';
import {range} from 'd3-array';
import {format} from 'd3-format';
// import {drag} from 'd3-drag';
import {scaleLinear, scaleBand} from 'd3-scale';
import {Scalar, Array1D, NDArrayMathCPU} from 'deeplearn';

const math = new NDArrayMathCPU(false);

export default {
  components: {Sample, Axis},
  data() {
    return {
      interpolate: scaleLinear(),
      position: scaleLinear(),
      bandScale: scaleBand(),
      formatter: format(",.3f")
    }
  },
  props: {
    modelData: { type: String, default: "A" },
    model: { },
    numSamples: { type: Number, default: 9 },
    width: { type: Number, default: 200 },
    initialValue: { type: Number, default: 1},
    selectedSample: { default: () => {[]}},
    direction: { default: () => {[]}},
    numSamples: { type: Number, default: 5 },
    range: { type: Number, default: 1 },

  },
  computed: {
    extent: function() { return [-this.range, this.range]; },
    dimensions: function() { return this.model ? this.model.dimensions : 0; },
    zero: function() { return Array1D.zeros([this.dimensions]); },
    hoverScale: function() { return this.interpolate.domain([0, this.width]).range(this.extent); },
    bands: function() { return this.bandScale.domain(range(this.numSamples)).range([0, this.width]); },
    pos: function() { return this.position.domain([0, this.numSamples - 1]).range(this.extent); },
    sampleWidth: function() { return this.bands.bandwidth(); },
    height: function() { return this.sampleWidth; },
    unitDirection: function() {
      let length = math.sum(math.multiply(this.direction, this.direction));
      return math.divide(this.direction, length);
    },
    selectedScalar: function() {
      if (this.selectedSample) {
        return math.dotProduct(this.unitDirection, this.selectedSample);
      } else {
        return 0;
      }
    },
    selectedValue: function() {
      if (this.selectedScalar) {
        return this.selectedScalar.getValues()[0]
      } else {
        return 0;
      }
    },
    selectedX: function() { return this.hoverScale.invert(this.selectedValue); },
    samples: function() {
      let samples = [];
      if (this.selectedSample) {
        for (var i = 0; i < this.numSamples; i++) {
          let delta = math.sub(Scalar.new(this.pos(i)), this.selectedScalar);
          let newSample = math.add(math.multiply(this.unitDirection, delta), this.selectedSample);
          samples.push({
            sample: newSample,
            position: this.bands(samples.length)
          });
        }
      }
      return samples;
    }
  },
  created() {
    this.resize();
    // if (this.initialValue) {
    //   this.selectedValue = initialValue;
    // }
  },
  methods: {
    format: function(val) {
      return this.formatter(val);
    },
    resize: function() {
      if (this.$refs.container) {
        this.width = this.$refs.container.getBoundingClientRect().width;
      }
    },
    select: function(event) {
      const value = this.hoverScale(event.offsetX)
      let delta = math.sub(Scalar.new(value), this.selectedScalar);
      let newSample = math.add(math.multiply(this.unitDirection, delta), this.selectedSample);
      this.$emit("select", {selectedSample: newSample});
    }
  }
}
</script>

<style scoped>
div.container {
  width: 100%;
}
div.tray {
  position: relative;
  width: 100%;
}
div.mouse {
  position: absolute;
  height: 60px;
  width: 100%;
  background: white
}
div.tray > * {
  pointer-events: none;
}
.reticle {
  height: calc(100% + 6px);
  position: absolute;
  width: 3px;
  border-radius: 2px;
  /*border: 1px solid black;*/
  background-color: rgb(255, 100, 0);
  z-index: 1;
}
.reticle .label {
  background-color: rgb(255, 100, 0);
  color: white;
  padding: 2px;
  border-radius: 4px;
  font-size: 9px;
  line-height: 9px;
  text-align: center;
  width: 30px;
  position: absolute;
  left: -16px;
  bottom: -13px;
}
.hover.reticle {
  border-color:rgba(0, 0, 0, 0.3);
}
.selected.reticle {
  border-color: rgba(0, 0, 0, 0.8);
}
</style>
