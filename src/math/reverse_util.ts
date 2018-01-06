export function cleanAxisParam(
    arr: number|number[], dims: number, c = 0): number[] {
  return [].concat(arr).map(ax => ax < 0 ? dims + ax : ax).map(ax => ax + c);
}
