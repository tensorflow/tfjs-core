<template>
  <div class="plot">
    <div class="info">
      <div class="row">
        <div>Loss</div>
        <div>{{data.loss.toFixed(2)}}</div>
      </div>
      <div class="row">
        <div>Weight</div>
        <div>{{data.weightInit}}</div>
      </div>
      <div class="row">
        <div>Model</div>
        <div>{{data.modelType}}</div>
      </div>
      <div class="row">
        <div>Train iter</div>
        <div>{{data.iter}}</div>
      </div>
    </div>
    <div class="svg-container"></div>
  </div>
</template>
<style scoped>
.plot {
  border: 1px solid #ccc;
  border-radius: 5%;
  padding: 10px;
  width: 150px;
}
.info {
  margin-bottom: 10px;
  font-size: 10px;
  display: flex;
  flex-direction: column;
}
.row {
  color: #666;
  display: flex;
  justify-content: space-between;
}
.row :first-child {
  color: black;
}
</style>
<script lang="ts" src="./plot.ts"></script>
