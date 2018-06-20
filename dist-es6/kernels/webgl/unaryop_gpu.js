import * as erf_util from '../../ops/erf_util';
import * as selu_util from '../../ops/selu_util';
var UnaryOpProgram = (function () {
    function UnaryOpProgram(aShape, opSnippet) {
        this.variableNames = ['A'];
        this.outputShape = aShape;
        this.userCode = "\n      float unaryOperation(float x) {\n        " + opSnippet + "\n      }\n\n      void main() {\n        float x = getAAtOutCoords();\n        float y = unaryOperation(x);\n\n        setOutput(y);\n      }\n    ";
    }
    return UnaryOpProgram;
}());
export { UnaryOpProgram };
var CHECK_NAN_SNIPPET = "if (isNaN(x)) return x;";
export var ABS = "return abs(x);";
export var RELU = CHECK_NAN_SNIPPET + "\n  return (x < 0.0) ? 0.0 : x;\n";
export var ELU = "return (x >= 0.0) ? x : (exp(x) - 1.0);";
export var SELU = "\n  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.\n  // see: https://arxiv.org/abs/1706.02515\n  float scaleAlpha = " + selu_util.SELU_SCALEALPHA + ";\n  float scale = " + selu_util.SELU_SCALE + ";\n  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);\n";
export function STEP(alpha) {
    if (alpha === void 0) { alpha = 0.0; }
    return CHECK_NAN_SNIPPET + ("\n    return x > 0.0 ? 1.0 : float(" + alpha + ");\n  ");
}
export var NEG = "return -x;";
export var CEIL = "return ceil(x);";
export var FLOOR = "return floor(x);";
export var SIGN = "\n  if (isNaN(x)) { return 0.0; }\n  return sign(x);\n";
export var ROUND = "\n  // OpenGL ES does not support round function.\n  // The algorithm is based on banker's rounding.\n  float base = floor(x);\n  if ((x - base) < 0.5) {\n    return floor(x);\n  } else if ((x - base) > 0.5) {\n    return ceil(x);\n  } else {\n    if (mod(base, 2.0) == 0.0) {\n      return base;\n    } else {\n      return base + 1.0;\n    }\n  }\n";
export var EXP = "return exp(x);";
export var EXPM1 = "return exp(x) - 1.0;";
export var LOG = "return log(x);";
export var LOG1P = "return log(1.0 + x);";
export var SQRT = "return sqrt(x);";
export var RSQRT = "return inversesqrt(x);";
export var SIGMOID = "return 1.0 / (1.0 + exp(-1.0 * x));";
export var SOFTPLUS = "\n  float epsilon = 1.1920928955078125e-7;\n  float threshold = log(epsilon) + 2.0;\n\n  bool too_large = x > -threshold;\n  bool too_small = x < threshold;\n\n  float result;\n  float exp_x = exp(x);\n\n  if (too_large){\n    result = x;\n  }\n  else if (too_small){\n    result = exp_x;\n  }\n  else{\n    result = log(exp_x + 1.0);\n  }\n  return result;\n";
export var SIN = "return sin(x);";
export var COS = "return cos(x);";
export var TAN = "return tan(x);";
export var ASIN = "return asin(x);";
export var ACOS = "return acos(x);";
export var ATAN = CHECK_NAN_SNIPPET + "\n  return atan(x);\n";
export var SINH = "\n  float e2x = exp(x);\n  return (e2x - 1.0 / e2x) / 2.0;\n";
export var COSH = "\n  float e2x = exp(-x);\n  return (e2x + 1.0 / e2x) / 2.0;\n";
export var TANH = "\n  float e2x = exp(-2.0 * abs(x));\n  return sign(x) * (1.0 - e2x) / (1.0 + e2x);\n";
export var ASINH = "return log(x + sqrt(x * x + 1.0));";
export var ACOSH = "return log(x + sqrt(x * x - 1.0));";
export var ATANH = "return (log(1.0 + x) - log(1.0 - x)) / 2.0;";
export var ERF = "\n  // Error function is calculated approximately with elementary function.\n  // See \"Handbook of Mathematical Functions with Formulas,\n  // Graphs, and Mathematical Tables\", Abramowitz and Stegun.\n  float p = " + erf_util.ERF_P + ";\n  float a1 = " + erf_util.ERF_A1 + ";\n  float a2 = " + erf_util.ERF_A2 + ";\n  float a3 = " + erf_util.ERF_A3 + ";\n  float a4 = " + erf_util.ERF_A4 + ";\n  float a5 = " + erf_util.ERF_A5 + ";\n\n  float t = 1.0 / (1.0 + p * x);\n  return 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x);\n";
export var SQUARE = "return x * x;";
export var RECIPROCAL = "return 1.0 / x;";
export var LOGICAL_NOT = "return float(!(x >= 1.0));";
export var TO_INT = "return float(int(x));";
//# sourceMappingURL=unaryop_gpu.js.map