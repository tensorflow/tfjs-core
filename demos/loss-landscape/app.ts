import * as dl from 'deeplearn';
import Vue from 'vue';
import {MnistData} from './data';
import {Model} from './model';
import {ModelType, WeightInit} from './model';
import Plot from './Plot.vue';

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
  modelTypeSelect: HTMLSelectElement;
  modelType: ModelType = ModelType.FC;
  weightInit: WeightInit = WeightInit.UNIT;
  data: MnistData;
  model: Model;
  NUM_PLOTS = 5;

  async init(vue: Vue) {
    this.weightSelect = vue.$refs.weightSelect as HTMLSelectElement;
    this.modelTypeSelect = vue.$refs.modelTypeSelect as HTMLSelectElement;
    // tslint:disable-next-line:no-any
    this.data = (window as any).mnistData || await this.loadDataOnce();
    // tslint:disable-next-line:no-any
    if ((window as any).model) {
      // tslint:disable-next-line:no-any
      (window as any).model.dispose();
    }
    this.model = new Model();
    // tslint:disable-next-line:no-any
    (window as any).model = this.model;
    this.model.init(this.data);
  }

  private async loadDataOnce() {
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
      this.s.modelTypeSelect.disabled = true;
      await dl.util.nextFrame();
      await dl.util.nextFrame();
    },
    async enableUI() {
      this.s.weightSelect.disabled = false;
      this.s.modelTypeSelect.disabled = false;
      await dl.util.nextFrame();
      await dl.util.nextFrame();
    },
    async changeWeightsInit(event: Event) {
      await this.disableUI();
      const selection = this.s.weightSelect.value as WeightInit;
      this.s.weightInit = selection;
      this.s.model.reinitWeights(selection);
      this.visualizeLandscape();
    },
    async changeModelType(event: Event) {
      await this.disableUI();
      const newModelType = this.s.modelTypeSelect.value as ModelType;
      this.s.modelType = newModelType;
      this.s.model.setModel(newModelType);
      this.visualizeLandscape();
    },
    async visualizeLandscape() {
      const charts: {plots: ChartData[],
                     id: number} = {id: this.plotsId++, plots: []};
      this.charts.unshift(charts);
      charts.plots.push(await this.computeChartData(0));
      for (let i = 0; i < this.s.NUM_PLOTS - 1; i++) {
        charts.plots.push(await this.train());
      }
      await this.enableUI();
    },
    async computeChartData(iter: number) {
      const start = performance.now();
      const zData = await this.s.model.computeLandscape();
      console.log('compute landscape took', performance.now() - start, 'ms');
      const n = Math.ceil(zData.length / 2);
      const loss = zData[n][n];
      return {
        width: 100,
        height: 100,
        zData,
        loss,
        modelType: this.s.modelType,
        weightInit: getWeightInitString(this.s.weightInit),
        iter
      };
    },
    async train(): Promise<ChartData> {
      const iter = await this.s.model.train();
      return this.computeChartData(iter);
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
