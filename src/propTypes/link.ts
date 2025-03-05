import { SimulationLinkDatum } from "d3";
import { NodeDatum } from "./node";

export interface LinkDatum extends SimulationLinkDatum<NodeDatum>{
    source: string | NodeDatum;
    target: string | NodeDatum;
    value?: number;
}
