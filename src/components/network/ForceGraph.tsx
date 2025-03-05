import React, { PureComponent, Children, cloneElement, ReactNode } from 'react';
import '../../styles/components/ForceGraph.scss';
import * as forceUtils from '../../utils/d3-force';
import * as rafUtils from '../../utils/raf';

import ZoomableSVGGroup from './ZoomableSVGGroup';

import { DEFAULT_SIMULATION_PROPS } from '../../propTypes/simulation';
import { NodeDatum } from "../../propTypes/node";
import { LinkDatum } from "../../propTypes/link";

interface ZoomOptions {
    zoomSpeed?: number;
    minScale?: number;
    maxScale?: number;
    panLimit?: number;
    onZoom?: (scale: number, event: React.UIEvent<SVGGElement>) => void;
    onPan?: (x: number, y: number, event: React.UIEvent<SVGGElement>) => void;
}

interface ForceGraphProps {
    children: ReactNode;
    className?: string;
    zoom?: boolean;
    zoomOptions?: ZoomOptions;
    createSimulation?: (options: any) => any;
    updateSimulation?: (simulation: any, options: any) => any;
    simulationOptions?: any;
    labelAttr?: string;
    labelOffset?: {
        x: (node: NodeDatum) => number;
        y: (node: NodeDatum) => number;
    };
    showLabels?: boolean;
    width?: number;
    height?: number;
}

interface ForceGraphState {
    linkPositions: Record<string, { x1: number; y1: number; x2: number; y2: number }>;
    nodePositions: Record<string, { cx: number; cy: number }>;
    scale: number;
}

// Helper functions to identify nodes and links in React children
export function isNode(child: React.ReactElement): boolean {
    return !!(child.props && child.props.node);
}

export function isLink(child: React.ReactElement): boolean {
    return !!(child.props && child.props.link);
}

export default class ForceGraph extends PureComponent<ForceGraphProps, ForceGraphState> {
    static defaultProps: Partial<ForceGraphProps> = {
        createSimulation: forceUtils.createSimulation,
        updateSimulation: forceUtils.updateSimulation,
        zoom: false,
        labelAttr: 'id',
        simulationOptions: DEFAULT_SIMULATION_PROPS,
        labelOffset: {
            x: ({ radius = 5 }: NodeDatum) => radius / 2,
            y: ({ radius = 5 }: NodeDatum) => -radius / 4,
        },
        showLabels: false,
        zoomOptions: {},
    };

    private simulation: any;
    private frame: any;
    private cachedData?: { nodes: NodeDatum[]; links: LinkDatum[] };
    private lastUpdated?: Date;

    constructor(props: ForceGraphProps) {
        super(props);

        const { createSimulation, simulationOptions } = props;
        const data = this.getDataFromChildren();

        this.simulation = createSimulation!({
            ...DEFAULT_SIMULATION_PROPS,
            ...simulationOptions,
            data,
        });

        this.state = {
            linkPositions: {},
            nodePositions: {},
            scale: 1,
        };

        this.bindSimulationTick();
    }

    componentDidMount() {
        this.updateSimulation();
    }

    componentDidUpdate(prevProps: ForceGraphProps) {
        if (prevProps.children !== this.props.children) {
            this.lastUpdated = new Date();
            this.updateSimulation();
        }
    }

    componentWillUnmount() {
        this.unbindSimulationTick();
    }

    static getDataFromChildren(children: ReactNode): { nodes: NodeDatum[]; links: LinkDatum[] } {
        const data: { nodes: NodeDatum[]; links: LinkDatum[] } = { nodes: [], links: [] };

        Children.forEach(children, (child) => {
            if (React.isValidElement(child)) {
                if (isNode(child)) {
                    data.nodes.push(child.props.node as NodeDatum);
                } else if (isLink(child)) {
                    data.links.push(child.props.link as LinkDatum);
                }
            }
        });

        return data;
    }

    private getDataFromChildren(props = this.props, force = false) {
        if (!force && this.cachedData && new Date() > (this.lastUpdated || new Date())) {
            return this.cachedData;
        }

        const data = ForceGraph.getDataFromChildren(props.children);
        this.cachedData = data;
        this.lastUpdated = new Date();
        return data;
    }

    private bindSimulationTick() {
        this.simulation.on('tick', this.updatePositions.bind(this));
    }

    private unbindSimulationTick() {
        this.simulation.on('tick', null);
        if (this.frame) {
            rafUtils.cancelAnimationFrame(this.frame);
        }
    }

    private updateSimulation(props = this.props) {
        this.simulation = props.updateSimulation!(this.simulation, {
            ...DEFAULT_SIMULATION_PROPS,
            ...props.simulationOptions,
            data: this.getDataFromChildren(props, true),
        });

        this.onSimulationTick();
    }

    private updatePositions() {
        this.setState({
            linkPositions: ForceGraph.getLinkPositions(this.simulation),
            nodePositions: ForceGraph.getNodePositions(this.simulation),
        });
    }

    static getNodePositions(simulation: any) {
        return simulation.nodes().reduce(
            (obj: Record<string, { cx: number | undefined; cy: number | undefined }>, node: NodeDatum) => {
                obj[forceUtils.nodeId(node)] = {
                    cx: node.fx || node.x,
                    cy: node.fy || node.y,
                };
                return obj;
            },
            {}
        );
    }

    static getLinkPositions(simulation: any) {
        return simulation.force('link').links().reduce(
            (obj: Record<string, { x1: number; y1: number; x2: number; y2: number }>, link: LinkDatum) => {
                obj[forceUtils.linkId(link)] = {
                    x1: (link.source as unknown as NodeDatum).x ?? 0,
                    y1: (link.source as unknown as NodeDatum).y ?? 0,
                    x2: (link.target as unknown as NodeDatum).x ?? 0,
                    y2: (link.target as unknown as NodeDatum).y ?? 0,
                };
                return obj;
            },
            {}
        );
    }

    private onSimulationTick() {
        this.frame = rafUtils.requestAnimationFrame(() => this.updatePositions());
    }

    private onZoom(scale: number, event: React.UIEvent<SVGGElement>) {
        this.props.zoomOptions?.onZoom?.(scale, event);
        this.setState({ scale });
    }

    private onPan(x: number, y: number, event: React.UIEvent<SVGGElement>) {
        this.props.zoomOptions?.onPan?.(x, y, event);
    }

    private scale(value?: number) {
        return typeof value === 'number' ? value / this.state.scale : value;
    }

    render() {
        const { children, className, zoom, zoomOptions, width, height } = this.props;
        const { linkPositions, nodePositions } = this.state;

        return (
            <svg className={`rv-force__svg ${className}`}>
                <ZoomableSVGGroup
                    width={width || 800}
                    height={height || 600}
                    disabled={false}
                    onZoom={(scale, event) => this.onZoom(scale, event)}
                    onPan={(x, y, event) => this.onPan(x, y, event)}
                    {...zoomOptions}
                >
                    <g className="rv-force__links">
                        {Children.map(children, (child) =>
                            React.isValidElement(child) && isLink(child)
                                ? cloneElement(child, {
                                    ...child.props,
                                    ...linkPositions[forceUtils.linkId(child.props.link)]
                                })
                                : null
                        )}
                    </g>
                    <g className="rv-force__nodes">
                        {Children.map(children, (child) =>
                            React.isValidElement(child) && isNode(child)
                                ? cloneElement(child, {
                                    ...child.props,
                                    ...nodePositions[forceUtils.nodeId(child.props.node)]
                                })
                                : child
                        )}
                    </g>
                </ZoomableSVGGroup>
            </svg>
        );
    }
}
