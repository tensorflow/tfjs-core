import * as Plotly from 'plotly.js';

export async function plot(zData: number[][]) {
  const data = [{z: zData, type: 'contour', showscale: false}];
  const layout = {
    title: 'Loss surface',
    autosize: false,
    showlegend: false,
    width: 300,
    height: 300,
    ncontours: 15,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
    }
  };
  // tslint:disable-next-line:no-any
  return Plotly.newPlot('chart', data as any, layout, {displayModeBar: false});
}
