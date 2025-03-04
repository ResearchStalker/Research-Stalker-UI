import React, { PureComponent, ReactNode } from 'react';
import * as d3 from 'd3';

interface ZoomableSVGGroupProps extends React.SVGProps<SVGGElement> {
    width: number;
    height: number;
    disabled?: boolean;
    onZoom?: (scale: number, event: any) => void;
    onPan?: (x: number, y: number, event: any) => void;
    children?: ReactNode;
}

interface ZoomableSVGGroupState {
    transform: d3.ZoomTransform;
}

export default class ZoomableSVGGroup extends PureComponent<ZoomableSVGGroupProps, ZoomableSVGGroupState> {
    static defaultProps: Partial<ZoomableSVGGroupProps> = {
        disabled: false,
    };

    private el: SVGGElement | null = null;
    private zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown>;

    constructor(props: ZoomableSVGGroupProps) {
        super(props);
        this.state = {
            transform: d3.zoomIdentity,
        };

        this.zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 10])
            .filter((event) => {
                // Prevent zooming on double-click
                return !event.ctrlKey && event.type !== 'dblclick';
            })
            .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
                this.setState({ transform: event.transform });
                if (this.props.onZoom) {
                    this.props.onZoom(event.transform.k, event);
                }
                if (this.props.onPan) {
                    this.props.onPan(event.transform.x, event.transform.y, event);
                }
            });
    }


    componentDidMount() {
        if (this.props.disabled) return;
        if (!this.el) return;
        const parentSVG = this.el.ownerSVGElement;
        if (parentSVG) {
            d3.select(parentSVG).call(this.zoomBehavior);
        }
    }

    render() {
        const { children, style, transform, disabled, ...passthrough } = this.props;
        const combinedTransform = this.state.transform.toString() + ' ' + (transform || '');
        return (
            <g
                ref={(c) => (this.el = c)}
                {...passthrough}
                style={{ ...style, cursor: disabled ? 'default' : 'grab', pointerEvents: 'all' }}
                transform={combinedTransform}
            >
                <rect x={0} y={0} width={this.props.width} height={this.props.height} fillOpacity={0} />
                {children}
            </g>
        );
    }
}
