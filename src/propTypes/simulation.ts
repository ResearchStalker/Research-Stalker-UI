import {NodeDatum} from "./node";
import {LinkDatum} from "./link";

export const DEFAULT_SIMULATION_PROPS = {
    animate: false,
    width: 900,
    height: 600,
    strength: {},
} as const;

export interface SimulationOptions {
    data?: {
        nodes: NodeDatum[];
        links: LinkDatum[];
    };
    animate?: boolean;
    alpha?: number;
    alphaDecay?: number;
    alphaMin?: number;
    alphaTarget?: number;
    velocityDecay?: number;
    radiusMargin?: number;
    linkAttrs?: string[];
    nodeAttrs?: string[];
    strength?: {
        charge?: number | ((node: NodeDatum) => number);
        collide?: number | ((node: NodeDatum) => number);
        x?: number | ((node: NodeDatum) => number);
        y?: number | ((node: NodeDatum) => number);
    };
}
