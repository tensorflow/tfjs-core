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
        :visible="visible"
      />
    </div>
    <span class="ellipse">…</span>
  </div>
  <button v-on:click="save">Save current sample</button>
</div>
</template>

<script>
import Sample from './Sample.vue';
import {
  serif, serifBold, serifLight, sansLight, crispSerif, dotMatrix, casual, serifBlackItalic, serifItalic, square
  } from '../utils/FontExamples';

export default {
  components: {
    Sample
  },
  data() {
    return {
      width: 20,
      visible: true,
      letters: "ABCDEFG".split("")
    }
  },
  props: {
    modelData: { type: String, default: "A" },
    selectedSample: { },
    model: { },
    samples: { type: Array, default: () => [crispSerif, serifItalic, serifBlackItalic, sansLight, casual, dotMatrix] }
  },
  watch: {
    model: function(val) {
      this.select(this.samples[0], true);
    }
  },
  methods: {
    select: function(sample, isInitialSelection) {
      this.$emit("select", {selectedSample: sample, isInitialSelection});
    },
    save: function() {
      this.samples.push(this.selectedSample);
    }
  }
}
</script>

<style scoped>
.typeface {
  cursor: pointer;
  opacity: 0.5;
  margin: 3px 0;
  padding: 3px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  line-height: 17px;
}
button {
  margin-top: 20px;
}
.ellipse {
  position: relative;
  top: -3px;
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
