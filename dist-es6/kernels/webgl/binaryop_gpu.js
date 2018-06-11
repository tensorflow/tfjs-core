import * as broadcast_util from '../../ops/broadcast_util';
var CHECK_NAN_SNIPPET = "\n  if (isNaN(a)) return a;\n  if (isNaN(b)) return b;\n";
export var ADD = 'return a + b;';
export var SUB = 'return a - b;';
export var MUL = 'return a * b;';
export var DIV = 'return a / b;';
export var INT_DIV = "\n  float resultSign = sign(a) * sign(b);\n  int ia = round(a);\n  int ib = round(b);\n  int result = ia / ib;\n  int amodb = ia - ib * result;\n\n  if (resultSign < 0.0 && amodb != 0) {\n    result -= 1;\n  }\n  return float(result);\n";
export var POW = "\n  return (round(mod(b, 2.0)) == 0 || round(mod(b, 2.0)) == 2) ?\n      pow(abs(a), b) : sign(a) * pow(abs(a), b);\n";
export var SQUARED_DIFFERENCE = 'return (a - b) * (a - b);';
export var EQUAL = "return float(a == b);";
export var NOT_EQUAL = "return float(a != b);";
export var LESS = "return float(a < b);";
export var LESS_EQUAL = "return float(a <= b);";
export var GREATER = "return float(a > b);";
export var GREATER_EQUAL = "return float(a >= b);";
export var LOGICAL_AND = "return float(a >= 1.0 && b >= 1.0);";
export var LOGICAL_OR = "return float(a >= 1.0 || b >= 1.0);";
export var MAX = CHECK_NAN_SNIPPET + "\n  return max(a, b);\n";
export var MIN = CHECK_NAN_SNIPPET + "\n  return min(a, b);\n";
export var MOD = "return mod(a, b);";
export var ATAN2 = CHECK_NAN_SNIPPET + "\n  return atan(a, b);\n";
export var ELU_DER = "return (b >= 1.0) ? a : a * (b + 1.0);";
var BinaryOpProgram = (function () {
    function BinaryOpProgram(op, aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.supportsBroadcasting = true;
        this.outputShape =
            broadcast_util.assertAndGetBroadcastShape(aShape, bShape);
        this.userCode = "\n      float binaryOperation(float a, float b) {\n        " + op + "\n      }\n\n      void main() {\n        float a = getAAtOutCoords();\n        float b = getBAtOutCoords();\n        setOutput(binaryOperation(a, b));\n      }\n    ";
    }
    return BinaryOpProgram;
}());
export { BinaryOpProgram };
//# sourceMappingURL=binaryop_gpu.js.map