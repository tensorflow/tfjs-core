import Vue from 'vue';

// tslint:disable-next-line:no-any
declare const Plotly: any;

// tslint:disable-next-line:no-default-export
export default Vue.extend({
  props: {data: Object},
  mounted() {
    const data = [{
      z: this.data.zData.map((x: number[]) => x.map(y => Math.log10(1 + y))),
      type: 'contour',
      // colorscale: [
      //   [0, 'rgb(245,147,34)'], [0.5, 'rgb(232, 234, 235)'],
      //   [1, 'rgb(8,119,189)']
      // ],
      // zmin: 0.2,
      // zmax: 1.5,
      showscale: false,
      ncontours: 20  // 500
    }];
    const layout = {
      title: 'Loss surface',
      autosize: false,
      showlegend: false,
      width: this.data.width,
      height: this.data.height,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
      }
    };
    const chartDiv = this.$el.querySelector('.svg-container');
    return Plotly.newPlot(chartDiv, data, layout, {displayModeBar: false});
  }
});
