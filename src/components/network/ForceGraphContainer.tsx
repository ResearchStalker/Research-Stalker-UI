import React, { useState, useMemo, useEffect } from 'react';
import InteractiveForceGraph from './InteractiveForceGraph';
import ForceGraphNode from './ForceGraphNode';
import ForceGraphLink from './ForceGraphLink';
import { NodeDatum } from '../../propTypes/node';
import { LinkDatum } from '../../propTypes/link';
import { bfs } from "../../utils/bfsUtils";

interface ForceGraphContainerProps {
    nodes: NodeDatum[];
    links: LinkDatum[];
    affiliationColors: Record<string, string>;
    addInterest?: (interest: string) => void;
    selectedAffiliations?: string[];
    fieldsOfInterest?: string[];
    onPathFound?: (path: string[]) => void;
    selectedNode?: NodeDatum | null;
    onNodeSelect?: (node: NodeDatum | null) => void;
    bfsRequest?: {
        startId: string;
        connectionType: 'Affiliation' | 'researcher';
        selectedValue: string;
    } | null;
}

const ForceGraphContainer: React.FC<ForceGraphContainerProps> = ({
                                                                     nodes,
                                                                     links,
                                                                     affiliationColors,
                                                                     selectedAffiliations = [],
                                                                     fieldsOfInterest = [],
                                                                     onPathFound,
                                                                     selectedNode,
                                                                     onNodeSelect,
                                                                     bfsRequest
                                                                 }) => {
    const [bfsPath, setBfsPath] = useState<string[] | null>(null);

    useEffect(() => {
        if (!selectedNode) {
            onNodeSelect?.(null);
            setBfsPath(null);
            return;
        }

        if (bfsRequest) {
            const { startId, connectionType, selectedValue } = bfsRequest;
            const startNode = nodes.find((n) => String(n.id) === startId);
            const targetNode = connectionType === 'researcher'
                ? nodes.find((n) => n.name === selectedValue)
                : nodes.find((n) => n.affiliation === selectedValue);

            if (!startNode || !targetNode) return;

            const path = bfs(startNode.id, targetNode.id, nodes, links);
            setBfsPath(path ?? null);
            onPathFound?.(path ?? []);
        } else {
            setBfsPath(null);
        }
    }, [bfsRequest, nodes, links, onPathFound, selectedNode]);

    const nodeHasAnyInterest = (node: NodeDatum, fields: string[]): boolean => {
        if (fields.length === 0) return true;
        const combined = node.interests.join(',').toLowerCase();
        return fields.some((f) => combined.includes(f.toLowerCase()));
    };

    const highlightSet = useMemo(() => {
        const highlightNodeIds = new Set<string>();
        const selectedAffiliationsSet = new Set(selectedAffiliations);

        // Add nodes that pass filters
        nodes.forEach((node) => {
            const passAffiliation =
                selectedAffiliations.length === 0 ||
                selectedAffiliationsSet.has(node.affiliation);
            const passInterest = nodeHasAnyInterest(node, fieldsOfInterest);

            if (passAffiliation && passInterest) {
                highlightNodeIds.add(String(node.id));
            }
        });

        if (selectedNode) {
            highlightNodeIds.add(String(selectedNode.id));
        }

        return highlightNodeIds;
    }, [nodes, selectedAffiliations, fieldsOfInterest, selectedNode]);

    const handleSelectNode = (
        event: React.MouseEvent<SVGGElement>,
        node: NodeDatum
    ) => {
        onNodeSelect?.(node);
    };

    const handleDeselectNode = () => {
        onNodeSelect?.(null);
    };

    return (
        <InteractiveForceGraph
            simulationOptions={{ animate: false, strength: {} }}
            labelAttr="label"
            onSelectNode={handleSelectNode}
            onDeselectNode={handleDeselectNode}
            highlightDependencies
            bfsPath={bfsPath}
        >
            {nodes.map((node) => {
                const isBFSHighlighted = bfsPath?.includes(String(node.id)) || false;
                const isHighlighted = highlightSet.has(String(node.id));
                const isSelectedNode = selectedNode?.id === String(node.id);
                const opacity = isBFSHighlighted || isHighlighted ? 2 : 0.5;

                const fillColor = isHighlighted
                    ? affiliationColors[node.affiliation] ?? '#666'
                    : '#ccc';

                const stroke = isSelectedNode ? 'darkblue' : undefined;
                const strokeWidth =  isSelectedNode ? '3px' : undefined;
                const transformScale = isSelectedNode ? 'scale(1.1)' : undefined;
                return (
                    <ForceGraphNode
                        key={node.id}
                        node={node}
                        fill={fillColor}
                        opacity={opacity}
                        stroke={stroke}
                        stroke-width={strokeWidth}
                        transform={transformScale}
                        showLabel
                    />
                );
            })}

            {links.map((link, index) => {
                const sourceId = String(link.source);
                const targetId = String(link.target);

                let linkHighlighted = false;
                if (bfsPath) {
                    for (let i = 0; i < bfsPath.length - 1; i++) {
                        if (
                            (bfsPath[i] === sourceId && bfsPath[i + 1] === targetId) ||
                            (bfsPath[i] === targetId && bfsPath[i + 1] === sourceId)
                        ) {
                            linkHighlighted = true;
                            break;
                        }
                    }
                }

                const strokeColor = linkHighlighted ? '#ff6600' : '#ccc';

                return (
                    <ForceGraphLink
                        key={index}
                        link={link}
                        stroke={strokeColor}
                    />
                );
            })}
        </InteractiveForceGraph>
    );
};

export default ForceGraphContainer;