import * as util from './util';
var FORMAT_LIMIT_NUM_VALS = 20;
var FORMAT_NUM_FIRST_LAST_VALS = 3;
var FORMAT_NUM_SIG_DIGITS = 7;
export function tensorToString(t, verbose) {
    var vals = t.dataSync();
    var padPerCol = computeMaxSizePerColumn(t);
    var valsLines = subTensorToString(vals, t.shape, t.strides, padPerCol);
    var lines = ['Tensor'];
    if (verbose) {
        lines.push("  dtype: " + t.dtype);
        lines.push("  rank: " + t.rank);
        lines.push("  shape: [" + t.shape + "]");
        lines.push("  values:");
    }
    lines.push(valsLines.map(function (l) { return '    ' + l; }).join('\n'));
    return lines.join('\n');
}
function computeMaxSizePerColumn(t) {
    var vals = t.dataSync();
    var n = t.size;
    var numCols = t.strides[t.strides.length - 1];
    var padPerCol = new Array(numCols).fill(0);
    if (t.rank > 1) {
        for (var row = 0; row < n / numCols; row++) {
            var offset = row * numCols;
            for (var j = 0; j < numCols; j++) {
                padPerCol[j] =
                    Math.max(padPerCol[j], valToString(vals[offset + j], 0).length);
            }
        }
    }
    return padPerCol;
}
function valToString(val, pad) {
    return util.rightPad(parseFloat(val.toFixed(FORMAT_NUM_SIG_DIGITS)).toString(), pad);
}
function subTensorToString(vals, shape, strides, padPerCol, isLast) {
    if (isLast === void 0) { isLast = true; }
    var size = shape[0];
    var rank = shape.length;
    if (rank === 0) {
        return [vals[0].toString()];
    }
    if (rank === 1) {
        if (size > FORMAT_LIMIT_NUM_VALS) {
            var firstVals = Array.from(vals.subarray(0, FORMAT_NUM_FIRST_LAST_VALS));
            var lastVals = Array.from(vals.subarray(size - FORMAT_NUM_FIRST_LAST_VALS, size));
            return [
                '[' + firstVals.map(function (x, i) { return valToString(x, padPerCol[i]); }).join(', ') +
                    ', ..., ' +
                    lastVals
                        .map(function (x, i) { return valToString(x, padPerCol[size - FORMAT_NUM_FIRST_LAST_VALS + i]); })
                        .join(', ') +
                    ']'
            ];
        }
        return [
            '[' +
                Array.from(vals).map(function (x, i) { return valToString(x, padPerCol[i]); }).join(', ') +
                ']'
        ];
    }
    var subshape = shape.slice(1);
    var substrides = strides.slice(1);
    var stride = strides[0];
    var lines = [];
    if (size > FORMAT_LIMIT_NUM_VALS) {
        for (var i = 0; i < FORMAT_NUM_FIRST_LAST_VALS; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, substrides, padPerCol, false));
        }
        lines.push('...');
        for (var i = size - FORMAT_NUM_FIRST_LAST_VALS; i < size; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, substrides, padPerCol, i === size - 1));
        }
    }
    else {
        for (var i = 0; i < size; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, substrides, padPerCol, i === size - 1));
        }
    }
    var sep = rank === 2 ? ',' : '';
    lines[0] = '[' + lines[0] + sep;
    for (var i = 1; i < lines.length - 1; i++) {
        lines[i] = ' ' + lines[i] + sep;
    }
    var newLineSep = ',\n';
    for (var i = 2; i < rank; i++) {
        newLineSep += '\n';
    }
    lines[lines.length - 1] =
        ' ' + lines[lines.length - 1] + ']' + (isLast ? '' : newLineSep);
    return lines;
}
//# sourceMappingURL=tensor_util.js.map