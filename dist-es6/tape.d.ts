import { Tensor } from './tensor';
import { NamedTensorMap } from './types';
export interface TapeNode {
    id: number;
    name: string;
    output: Tensor;
    inputs: NamedTensorMap;
    gradient?: (dy: Tensor | NamedTensorMap) => NamedGradientMap;
}
export declare type NamedGradientMap = {
    [inputName: string]: () => Tensor;
};
export declare function getFilteredNodesXToY(tape: TapeNode[], xs: Tensor[], y: Tensor): TapeNode[];
export declare function backpropagateGradients(tensorAccumulatedGradientMap: {
    [tensorId: number]: Tensor;
}, filteredTape: TapeNode[]): void;
