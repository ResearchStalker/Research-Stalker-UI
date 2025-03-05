import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NodeDatum } from '../../propTypes/node';

interface ForceGraphNodeProps {
    node: NodeDatum;
    cx?: number;
    cy?: number;
    r?: number;
    className?: string;
    labelStyle?: React.CSSProperties;
    labelClass?: string;
    showLabel?: boolean;
    fill?: string;
    opacity?: number;
    stroke?: string;
    strokeWidth?: number;
    onClick?: (event: React.MouseEvent<SVGCircleElement>, node: NodeDatum) => void;
}

export default class ForceGraphNode extends PureComponent<ForceGraphNodeProps> {
    static propTypes = {
        node: PropTypes.object.isRequired,
        cx: PropTypes.number,
        cy: PropTypes.number,
        r: PropTypes.number,
        className: PropTypes.string,
        labelStyle: PropTypes.object,
        labelClass: PropTypes.string,
        showLabel: PropTypes.bool,
        onClick: PropTypes.func,
    };

    static defaultProps: Partial<ForceGraphNodeProps> = {
        className: '',
        fill: '#4a90e2',
        opacity: 1,
        showLabel: false,
        onClick: () => {},
    };

    static getShortLabel = (text: string): string[] => {
        if (!text) return [];
        const tokens = text.trim().split(' ');
        return tokens.length >= 2 ? [tokens[0], tokens[1].charAt(0) + '.'] : [tokens[0]];
    };

    handleClick = (event: React.MouseEvent<SVGCircleElement>) => {
        const { node, onClick } = this.props;
        if (onClick) {
            onClick(event, node);
        }
    };

    handleMouseDown = (event: React.MouseEvent<SVGCircleElement>) => {
        event.stopPropagation();
    };

    render() {
        const {
            node,
            className,
            r,
            labelStyle,
            labelClass,
            showLabel,
            cx = 0,
            cy = 0,
            fill,
            opacity,
            stroke,
            strokeWidth,
            onClick,
            ...spreadable
        } = this.props;

        const fullLabel = node.name || node.id || '';
        const labelParts = ForceGraphNode.getShortLabel(fullLabel);

        // Adjust the circle radius based on the label length
        const baseRadius = r || node.radius || 20;
        const radius = baseRadius + (labelParts.length > 1 ? 5 : 0); // Increase radius for multi-line labels

        const fontSize = Math.min(radius / (labelParts.length > 1 ? 3 : 2), 12);

        return (
            <g
                transform={`translate(${cx}, ${cy})`}
                onMouseDown={this.handleMouseDown}
                style={{ cursor: 'pointer' }}
            >
                <circle
                    className={`rv-force__node ${className}`}
                    r={radius}
                    fill={fill}
                    opacity={opacity}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    onClick={this.handleClick}
                    {...spreadable}
                />
                {showLabel && labelParts.length > 0 && (
                    <text
                        className={`rv-force__label ${labelClass}`}
                        textAnchor="middle"
                        dy={labelParts.length > 1 ? `${-fontSize / 2}px` : '0.3em'}
                        style={{
                            fontSize: `${fontSize}px`,
                            fill: 'white',
                            pointerEvents: 'none',
                            ...labelStyle,
                        }}
                    >
                        {labelParts.map((part, index) => (
                            <tspan
                                key={index}
                                x="0"
                                dy={index === 0 ? 0 : fontSize * 2}
                            >
                                {part}
                            </tspan>
                        ))}
                    </text>
                )}
            </g>
        );
    }
}