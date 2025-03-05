import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    forceCollide,
    forceX,
    forceY,
    Simulation,
    SimulationNodeDatum,
    SimulationLinkDatum,
} from 'd3-force';

import setsEqual from './sets-equal';
import { NodeDatum } from '../propTypes/node';
import { LinkDatum } from '../propTypes/link';

const ALPHA_FACTORS = [
    'alpha',
    'alphaDecay',
    'alphaMin',
    'alphaTarget',
    'velocityDecay',
] as const;


interface SimulationOptions {
    height?: number;
    width?: number;
    data: {
        nodes: NodeDatum[];
        links: LinkDatum[];
    };
    strength?: {
        charge?: number | ((node: NodeDatum) => number);
        collide?: number | ((node: NodeDatum) => number);
        x?: number | ((node: NodeDatum) => number);
        y?: number | ((node: NodeDatum) => number);
    };
    animate?: boolean; // When false, simulation runs only on load
    alpha?: number;
    alphaDecay?: number;
    alphaMin?: number;
    alphaTarget?: number;
    velocityDecay?: number;
    radiusMargin?: number;
    linkAttrs?: string[];
    nodeAttrs?: string[];
}

// ---- PRIVATE METHODS ----
const pick = <T extends object, K extends keyof T>(list: T[], ...attrNames: K[]) =>
    list.map((item) =>
        attrNames.reduce((obj, attrName) => ({ ...obj, [attrName]: item[attrName] }), {} as Pick<T, K>)
    );

const asStrengthFn = (target: number | ((node: NodeDatum) => number)) =>
    typeof target === 'function' ? target : () => target;

const applyAlphaFactors = (simulation: Simulation<NodeDatum, LinkDatum>, options: SimulationOptions) => {
    ALPHA_FACTORS.forEach((alphaFactorName) => {
        if (options[alphaFactorName as keyof SimulationOptions] !== undefined) {
            (simulation as any)[alphaFactorName] = options[alphaFactorName as keyof SimulationOptions];
        }
    });

    // Adjust alphaDecay to slow down the simulation convergence
    simulation.alphaDecay(0.01); // Slow decay for smoother transitions and settling
    simulation.alphaMin(0.001); // Set a minimum alpha to stop after convergence

    return simulation;
};

const applyCenterForce = (simulation: Simulation<NodeDatum, LinkDatum>, { height, width }: SimulationOptions) => {
    if (!simulation.force('center')) {
        simulation.force('center', forceCenter());
    }

    const centerX = width ? width / 1.5 : 2;
    if (width && (simulation.force('center') as any)?.x() !== centerX) {
        (simulation.force('center') as any).x(centerX);
        simulation.alpha(2).restart();
    }

    const centerY = height ? height / 1.5 : 2;
    if (height && (simulation.force('center') as any)?.y() !== centerY) {
        (simulation.force('center') as any).y(centerY);
        simulation.alpha(3).restart();
    }

    return simulation;
};

const applyManyBodyChargeForce = (simulation: Simulation<NodeDatum, LinkDatum>, { strength }: SimulationOptions) => {
    if (!simulation.force('charge')) {
        simulation.force('charge', forceManyBody());
    }
    // Increase charge to ensure nodes are more separated.
    if (strength?.charge !== undefined) {
        (simulation.force('charge') as any).strength(asStrengthFn(strength.charge));
    } else {
        (simulation.force('charge') as any).strength(-2000); // Stronger charge for more separation between nodes.
    }
};

const applyCollisionForce = (simulation: Simulation<NodeDatum, LinkDatum>, options: SimulationOptions) => {
    const { radiusMargin = 3, strength } = options;
    if (!simulation.force('collide')) {
        simulation.force('collide', forceCollide());
    }

    if (strength?.collide && typeof strength.collide === 'function') {
        // Use the provided function as the collision radius.
        // @ts-ignore
        (simulation.force('collide') as any).radius((d: NodeDatum) => strength.collide!(d));
    } else {
        // Increase collision radius for more separation.
        (simulation.force('collide') as any).radius((d: NodeDatum) => (d.radius || 5) + radiusMargin);
        if (strength?.collide !== undefined && typeof strength.collide === 'number') {
            (simulation.force('collide') as any).strength(() => strength.collide);
        } else {
            (simulation.force('collide') as any).strength(0.5); // Set default collide strength to ensure separation.
        }
    }
};

const applyLinkForce = (simulation: Simulation<NodeDatum, LinkDatum>, options: SimulationOptions) => {
    const { data: { nodes, links }, linkAttrs = [], nodeAttrs = [] } = options;

    if (!simulation.force('link')) {
        simulation.force('link', forceLink<NodeDatum, LinkDatum>().id(nodeId));
    }

    const prevNodesSet = new Set(simulation.nodes().map(nodeId));
    const newNodesSet = new Set(nodes.map(nodeId));

    if (!setsEqual(prevNodesSet, newNodesSet)) {
        simulation.nodes(pick(nodes, 'id', 'radius', 'fx', 'fy', ...(nodeAttrs as (keyof NodeDatum)[])));
        simulation.alpha(1).restart();
    }

    const prevLinksSet = new Set((simulation.force('link') as any).links().map(linkId));
    const newLinksSet = new Set(links.map(linkId));

    if (!setsEqual(prevLinksSet, newLinksSet)) {
        (simulation.force('link') as any).links(
            pick(links, 'source', 'target', 'value', ...(linkAttrs as (keyof LinkDatum)[]))
        );
        simulation.alpha(1).restart();
    }
};

const applyAxisForce = (simulation: Simulation<NodeDatum, LinkDatum>, { strength }: SimulationOptions) => {
    if (!simulation.force('x')) {
        simulation.force('x', forceX());
    }
    if (!simulation.force('y')) {
        simulation.force('y', forceY());
    }

    if (strength?.x !== undefined) {
        (simulation.force('x') as any).strength(asStrengthFn(strength.x));
    }

    if (strength?.y !== undefined) {
        (simulation.force('y') as any).strength(asStrengthFn(strength.y));
    }
};

// ---- PUBLIC METHODS ----
export const nodeId = (node: NodeDatum) => node.id;

export const linkId = (link: LinkDatum) =>
    `${typeof link.source === 'object' ? link.source.id : link.source}=>${typeof link.target === 'object' ? link.target.id : link.target}`;

// Create simulation and force it to run only on load unless explicitly set to animate.
export const createSimulation = (options: SimulationOptions): Simulation<NodeDatum, LinkDatum> => {
    // Default to non-animated simulation (simulate only once on load)
    if (options.animate === undefined) {
        options.animate = false;
    }
    const simulation = forceSimulation<NodeDatum>();
    return updateSimulation(simulation, options);
};

export const updateSimulation = (simulation: Simulation<NodeDatum, LinkDatum>, options: SimulationOptions) => {
    applyAlphaFactors(simulation, options); // Apply smoother alpha control
    applyCenterForce(simulation, options);
    applyManyBodyChargeForce(simulation, options); // Apply stronger charge to keep nodes apart
    applyCollisionForce(simulation, options); // Apply proper collision to ensure separation
    applyLinkForce(simulation, options);
    applyAxisForce(simulation, options);

    // Run simulation only once if animation is disabled (to avoid lag)
    if (!options.animate) {
        simulation.restart();
        while (simulation.alpha() > simulation.alphaMin()) {
            simulation.tick();
        }
        simulation.stop();
    }

    return simulation;
};
