import * as dl from 'deeplearn';
import Vue from 'vue';
import {MnistData} from './data';
import * as model from './model';
import {WeightInit} from './model';
import Plot from './Plot.vue';

const TRAIN_STEPS = 50;

export type ChartData = {
  width: number,
  height: number,
  zData: number[][],
  loss: number,
  weightInit: string,
  modelType: string,
  iter: number
};

class State {
  weightSelect: HTMLSelectElement;
  data: MnistData;

  async init(vue: Vue) {
    this.weightSelect = vue.$refs.weightSelect as HTMLSelectElement;
    // tslint:disable-next-line:no-any
    this.data = (window as any).mnistData || await this.loadData();
  }

  private async loadData() {
    model.init();
    const data = new MnistData();
    await data.load();
    // tslint:disable-next-line:no-any
    (window as any).mnistData = data;
    return data;
  }
}

// tslint:disable-next-line:no-default-export
export default Vue.extend({
  data(): {
    charts: Array<{plots: ChartData[], id: number}>,
    loadingData: boolean,
    s: State,
    plotsId: number
  } {
    return {charts: [], loadingData: true, plotsId: 0, s: null};
  },
  async mounted() {
    this.s = new State();
    await this.s.init(this);
    this.loadingData = false;
    this.s.weightSelect.dispatchEvent(new Event('change'));
  },
  methods: {
    async disableUI() {
      this.s.weightSelect.disabled = true;
      await dl.util.nextFrame();
      await dl.util.nextFrame();
    },
    async enableUI() {
      this.s.weightSelect.disabled = false;
      await dl.util.nextFrame();
      await dl.util.nextFrame();
    },
    async changeWeightsInit(event: Event) {
      await this.disableUI();
      const selection = this.s.weightSelect.value as WeightInit;
      model.reinitWeights(selection);
      const zData = await model.computeLandscape(this.s.data);
      const n = Math.ceil(zData.length / 2);
      const loss = zData[n][n];
      const modelType = 'FC';
      const weightInit = getWeightInitString(selection);
      const iter = 0;
      const charts: {plots: ChartData[],
                     id: number} = {id: this.plotsId++, plots: []};
      this.charts.unshift(charts);
      charts.plots.push(
          {width: 150, height: 150, zData, loss, modelType, weightInit, iter});
      for (let i = 0; i < 4; i++) {
        charts.plots.push(await this.train());
      }

      await this.enableUI();
    },
    async train(): Promise<ChartData> {
      let start = performance.now();
      const [loss, iter] = await model.train(this.s.data, TRAIN_STEPS);
      console.log('training took', performance.now() - start, 'ms');
      start = performance.now();
      const zData = await model.computeLandscape(this.s.data);
      const modelType = 'FC';
      const weightInit =
          getWeightInitString(this.s.weightSelect.value as WeightInit);
      return {
        width: 150,
        height: 150,
        zData,
        loss,
        modelType,
        weightInit,
        iter
      };
    },
  },
  components: {Plot}
});

function getWeightInitString(weightInit: WeightInit): string {
  switch (weightInit) {
    case WeightInit.FAN_IN:
      return 'N(0, fan-in)';
    case WeightInit.FAN_OUT:
      return 'N(0, fan-out)';
    case WeightInit.UNIT:
      return 'N(0, 1)';
    default:
      throw new Error('Unknown weight init ' + weightInit);
  }
}
