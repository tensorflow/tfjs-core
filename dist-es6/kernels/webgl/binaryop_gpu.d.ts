import { GPGPUProgram } from './gpgpu_math';
export declare const ADD = "return a + b;";
export declare const SUB = "return a - b;";
export declare const MUL = "return a * b;";
export declare const DIV = "return a / b;";
export declare const INT_DIV = "\n  float resultSign = sign(a) * sign(b);\n  int ia = round(a);\n  int ib = round(b);\n  int result = ia / ib;\n  int amodb = ia - ib * result;\n\n  if (resultSign < 0.0 && amodb != 0) {\n    result -= 1;\n  }\n  return float(result);\n";
export declare const POW = "\n  return (round(mod(b, 2.0)) == 0 || round(mod(b, 2.0)) == 2) ?\n      pow(abs(a), b) : sign(a) * pow(abs(a), b);\n";
export declare const SQUARED_DIFFERENCE = "return (a - b) * (a - b);";
export declare const EQUAL = "return float(a == b);";
export declare const NOT_EQUAL = "return float(a != b);";
export declare const LESS = "return float(a < b);";
export declare const LESS_EQUAL = "return float(a <= b);";
export declare const GREATER = "return float(a > b);";
export declare const GREATER_EQUAL = "return float(a >= b);";
export declare const LOGICAL_AND = "return float(a >= 1.0 && b >= 1.0);";
export declare const LOGICAL_OR = "return float(a >= 1.0 || b >= 1.0);";
export declare const MAX: string;
export declare const MIN: string;
export declare const MOD = "return mod(a, b);";
export declare const ATAN2: string;
export declare const ELU_DER = "return (b >= 1.0) ? a : a * (b + 1.0);";
export declare class BinaryOpProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    supportsBroadcasting: boolean;
    constructor(op: string, aShape: number[], bShape: number[]);
}
