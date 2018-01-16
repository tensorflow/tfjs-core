import Vue from 'vue';

// tslint:disable-next-line:no-any
declare const Plotly: any;

// tslint:disable-next-line:no-default-export
export default Vue.extend({
  props: {data: Object},
  mounted() {
    const data = [{z: this.data.zData, type: 'contour', showscale: false}];
    const layout = {
      title: 'Loss surface',
      autosize: false,
      showlegend: false,
      width: this.data.width,
      height: this.data.height,
      ncontours: 15,
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
