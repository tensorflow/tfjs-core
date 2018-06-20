export interface HeadingMap {
    'Tensors': 'Creation' | 'Classes' | 'Transformations' | 'Slicing and Joining';
    'Operations': 'Arithmetic' | 'Basic math' | 'Matrices' | 'Convolution' | 'Normalization' | 'Images' | 'Logical' | 'RNN' | 'Reduction' | 'Classification';
    'Training': 'Gradients' | 'Optimizers' | 'Losses' | 'Classes';
    'Performance': 'Memory' | 'Timing';
    'Environment': '';
}
export declare type Heading = keyof HeadingMap;
export declare type Namespace = 'losses' | 'image' | 'train';
export interface DocInfo {
    heading: string;
    subheading?: string;
    namespace?: string;
    subclasses?: string[];
    useDocsFrom?: string;
    configParamIndices?: number[];
}
export declare function doc(info: DocInfo): (...args: any[]) => void;
