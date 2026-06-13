import type { LayerName } from '../domain/layer-name';

export interface LayerClassifier {
    getLayer(path: string): LayerName | undefined;
}

export interface DependencyPolicy {
    isAllowed(fromLayer: LayerName, toLayer: LayerName): boolean;
}
