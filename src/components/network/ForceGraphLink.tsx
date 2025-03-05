import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { LinkDatum } from '../../propTypes/link';

interface ForceGraphLinkProps {
    link: LinkDatum;
    edgeOffset?: number;
    strokeWidth?: number;
    stroke?: string;
    className?: string;
    x1?: number;
    x2?: number;
    y1?: number;
    y2?: number;
    opacity?: number;
}

export default class ForceGraphLink extends PureComponent<ForceGraphLinkProps> {
    static propTypes = {
        link: PropTypes.object.isRequired,
        edgeOffset: PropTypes.number,
        strokeWidth: PropTypes.number,
        className: PropTypes.string,
        x1: PropTypes.number,
        x2: PropTypes.number,
        y1: PropTypes.number,
        y2: PropTypes.number,
    };

    static defaultProps: Partial<ForceGraphLinkProps> = {
        className: '',
        edgeOffset: 0,
        strokeWidth: 1,
    };

    render() {
        const {
            link,
            strokeWidth,
            className,
            edgeOffset = 0,
            x1,
            x2,
            y1,
            y2,
            ...restProps
        } = this.props;
        const mutableProps: Record<string, any> = { ...restProps };

        if (
            typeof edgeOffset === 'number' &&
            typeof x1 === 'number' &&
            typeof x2 === 'number' &&
            typeof y1 === 'number' &&
            typeof y2 === 'number'
        ) {
            const xLen = x2 - x1;
            const yLen = y2 - y1;
            const length = Math.sqrt(xLen ** 2 + yLen ** 2);

            if (length > 0) {
                const offsetFactor = edgeOffset / length;
                const xOffset = offsetFactor * xLen;
                const yOffset = offsetFactor * yLen;

                mutableProps.x1 = x1 + xOffset;
                mutableProps.x2 = x2 - xOffset;
                mutableProps.y1 = y1 + yOffset;
                mutableProps.y2 = y2 - yOffset;
            }
        }

        return (
            <line
                strokeWidth={strokeWidth || Math.sqrt(link.value || 1)}
                opacity={1}
                style={{ transition : 'all 0.3s ease-in-out' }}
                {...mutableProps}
            />
        );
    }
}
