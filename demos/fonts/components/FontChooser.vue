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
  <div v-for="sample in samples" class="typeface" v-on:click="select(sample)">
    <div v-for="char in letters" class="character">
      <Sample
        :displayWidth="width"
        :displayHeight="width"
        :model="model"
        :modelData="char"
        :sample="sample"
      />
    </div>
    …
  </div>
</div>
</template>

<script>
import Sample from './Sample.vue';
import {
  serif, serifBold, sans, crispSerif, dotMatrix, casual
  } from '../utils/FontExamples.ts';

export default {
  components: {
    Sample
  },
  data() {
    return {
      width: 20,
      letters: "ABCDEF".split(""),
      samples: [crispSerif, serif, serifBold, sans,  dotMatrix, casual]
    }
  },
  props: {
    modelData: { type: String, default: "A" },
    sample: { default: () => {[]}},
    model: { }
  },
  watch: {
    model: function(val) {
      console.log("model", val);
      this.select(this.samples[0], true);
    }
  },
  methods: {
    select: function(sample, isInitialSelection) {
      console.log("click select")
      this.selectedSample = sample;
      this.$emit("select", {selectedSample: sample, isInitialSelection});
    }
  }
}
</script>

<style scoped>
  .typeface {
    cursor: pointer;
    opacity: 0.5;
  }
  .typeface.selected {
    border-left: 3px solid hsl(24, 100%, 50%);
    padding-left: 18px;
    opacity: 1;
  }
  .character {
    display: inline-block;
    position: relative;
    width: 17px;
    height: 17px;
    overflow: hidden;
  }
  .character > div {
    position: relative;
    left: -2px;
  }
</style>
