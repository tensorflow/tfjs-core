<template>
  <div class="plot">
    <div class="svg-container"></div>
    <div class="info">
      <div class="iter">
        Iter: {{data.iter}}
      </div>
      <div class="loss">
        Loss: {{data.loss.toFixed(2)}}
      </div>
    </div>
  </div>
</template>
<style scoped>
.plot {
  display: flex;
  flex-direction: column;
  width: 100px;
}
.info {
  color: #666;
  display: flex;
  flex-direction: row;
  font-size: 10px;
  justify-content: space-between;
}
</style>
<script lang="ts" src="./plot.ts"></script>
