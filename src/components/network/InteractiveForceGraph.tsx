import React, { PureComponent, Children, cloneElement, ReactNode } from 'react';
import ForceGraph, { isNode, isLink } from './ForceGraph';
import { nodeId } from '../../utils/d3-force';
import { NodeDatum } from '../../propTypes/node';
import { LinkDatum } from '../../propTypes/link';

interface InteractiveForceGraphProps {
    zoom: boolean;
    className?: string;
    selectedNode?: NodeDatum | null;
    defaultSelectedNode?: NodeDatum | null;
    highlightDependencies?: boolean;
    opacityFactor?: number;
    onSelectNode?: (event: React.MouseEvent<SVGGElement>, node: NodeDatum) => void;
    onDeselectNode?: (event: React.MouseEvent<SVGGElement>, node: NodeDatum) => void;
    children: ReactNode;
    simulationOptions?: {
        animate?: boolean;
        strength: {};
    };
    labelAttr?: string;
    bfsPath?: string[] | null;
}

interface InteractiveForceGraphState {
    hoveredNode: NodeDatum | null;
    selectedNode: NodeDatum | null;
}

const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

export default class InteractiveForceGraph extends PureComponent<
    InteractiveForceGraphProps,
    InteractiveForceGraphState
> {
    static defaultProps: Partial<InteractiveForceGraphProps> = {
        className: '',
        defaultSelectedNode: null,
        opacityFactor: 4,
        onSelectNode: () => {},
        onDeselectNode: () => {},
    };

    constructor(props: InteractiveForceGraphProps) {
        super(props);
        this.state = {
            hoveredNode: null,
            selectedNode: props.selectedNode || props.defaultSelectedNode || null,
        };
    }

    componentDidUpdate(prevProps: InteractiveForceGraphProps) {
        if (prevProps.selectedNode !== this.props.selectedNode) {
            this.setState({ selectedNode: this.props.selectedNode || null });
        }
    }

    onHoverNode = (event: React.MouseEvent<SVGGElement>, hoveredNode: NodeDatum) => {
        if (!isTouch) {
            this.setState({ hoveredNode });
        }
    };

    onBlurNode = () => {
        if (!this.state.selectedNode) {
            this.setState({ hoveredNode: null });
        }
    };

    onClickNode = (event: React.MouseEvent<SVGGElement>, newSelection: NodeDatum) => {
        const { onDeselectNode, onSelectNode } = this.props;
        const { selectedNode } = this.state;

        if (selectedNode && nodeId(selectedNode) === nodeId(newSelection)) {
            this.setState({ selectedNode: null, hoveredNode: null });
            onDeselectNode?.(event, newSelection);
        } else {
            this.setState({ selectedNode: newSelection });
            onSelectNode?.(event, newSelection);
        }
    };

    getFocusedNode(): NodeDatum | null {
        const { selectedNode, hoveredNode } = this.state;
        return selectedNode ?? hoveredNode;
    }

    areNodesRelatives = (
        node1: NodeDatum | null,
        node2: NodeDatum | null,
        links: LinkDatum[]
    ) => {
        if (!node1 || !node2) return false;
        return links.some(
            link =>
                ((link.source === nodeId(node1) && link.target === nodeId(node2)) ||
                    (link.source === nodeId(node2) && link.target === nodeId(node1)))
        );
    };

    isNodeHighlighted = (node: NodeDatum, links: LinkDatum[]) => {
        const { highlightDependencies } = this.props;
        const focusedNode = this.getFocusedNode();
        if (!focusedNode) return false;

        const isSame = nodeId(node) === nodeId(focusedNode);
        const isRelative =
            highlightDependencies && this.areNodesRelatives(node, focusedNode, links);
        return isSame || isRelative;
    };

    isLinkHighlighted = (link: LinkDatum) => {
        const { highlightDependencies } = this.props;
        const focusedNode = this.getFocusedNode();
        if (!focusedNode || !highlightDependencies) return false;
        const focusedId = nodeId(focusedNode);
        return link.source === focusedId || link.target === focusedId;
    };

    opacityForNode = (node: NodeDatum, defaultOpacity: number, links: LinkDatum[]) => {
        const { bfsPath } = this.props;

        if (!bfsPath || bfsPath.length === 0) {
            const focusedNode = this.getFocusedNode();
            if (!focusedNode) return defaultOpacity;
            return this.isNodeHighlighted(node, links)
                ? defaultOpacity
                : defaultOpacity / (this.props.opacityFactor ?? 4);
        }

        return bfsPath.includes(node.id.toString())
            ? defaultOpacity
            : defaultOpacity / (this.props.opacityFactor ?? 4);
    };


    opacityForLink = (link: LinkDatum, defaultOpacity: number) => {
        const { bfsPath } = this.props;

        if (!bfsPath || bfsPath.length === 0) {
            const focusedNode = this.getFocusedNode();
            if (!focusedNode) return defaultOpacity;
            return this.isLinkHighlighted(link)
                ? defaultOpacity
                : defaultOpacity / (this.props.opacityFactor ?? 4);
        }

        const sourceId = link.source.toString();
        const targetId = link.target.toString();

        for (let i = 0; i < bfsPath.length - 1; i++) {
            if (
                (bfsPath[i] === sourceId && bfsPath[i + 1] === targetId) ||
                (bfsPath[i] === targetId && bfsPath[i + 1] === sourceId)
            ) {
                return defaultOpacity;
            }
        }
        return defaultOpacity / (this.props.opacityFactor ?? 4);
    };

    fontSizeForNode = (node: NodeDatum) => {
        const focusedNode = this.getFocusedNode();
        return nodeId(node) === focusedNode?.id ? 14 : 10;
    };

    fontWeightForNode = (node: NodeDatum) => {
        const focusedNode = this.getFocusedNode();
        return nodeId(node) === focusedNode?.id ? 700 : undefined;
    };

    render() {
        const {
            highlightDependencies,
            opacityFactor,
            children,
            className,
            selectedNode: _unused,
            ...spreadableProps
        } = this.props;

        const { links } = ForceGraph.getDataFromChildren(children);

        return (
            <ForceGraph
                className={`rv-force__interactive`}
                {...spreadableProps}
            >
                {Children.map(children, child => {
                    if (!React.isValidElement(child)) return child;

                    if (isNode(child)) {
                        const { node, labelStyle, onMouseEnter, onMouseLeave, onClick, ...rest } = child.props;
                        const newOpacity = this.opacityForNode(node as NodeDatum, rest.opacity ?? 1, links);

                        return cloneElement(child, {
                            ...rest,
                            opacity: newOpacity,
                            labelStyle: {
                                fontSize: this.fontSizeForNode(node),
                                fontWeight: this.fontWeightForNode(node),
                                opacity: newOpacity,
                                ...labelStyle,
                            },
                            onMouseEnter: (event: React.MouseEvent<SVGGElement>) => {
                                this.onHoverNode(event, node);
                                onMouseEnter?.(event);
                            },
                            onMouseLeave: (event: React.MouseEvent<SVGGElement>) => {
                                this.onBlurNode();
                                onMouseLeave?.(event);
                            },
                            onClick: (event: React.MouseEvent<SVGGElement>) => {
                                this.onClickNode(event, node);
                                onClick?.(event);
                            },
                        });
                    }

                    if (isLink(child)) {
                        const { link, ...rest } = child.props;
                        const newOpacity = this.opacityForLink(link, rest.opacity ?? 1);

                        return cloneElement(child, {
                            ...rest,
                            opacity: newOpacity,
                        });
                    }

                    return child;
                })}
            </ForceGraph>
        );
    }
}