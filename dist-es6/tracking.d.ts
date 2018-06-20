import { ScopeFn, TimingInfo } from './engine';
import { Tensor } from './tensor';
import { TensorContainer } from './types';
export declare class Tracking {
    static tidy<T extends TensorContainer>(nameOrFn: string | ScopeFn<T>, fn?: ScopeFn<T>, gradMode?: boolean): T;
    static dispose(container: any): void;
    static keep<T extends Tensor>(result: T): T;
    static time(f: () => void): Promise<TimingInfo>;
}
