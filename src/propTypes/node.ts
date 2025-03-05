import { SimulationNodeDatum } from "d3";

export interface NodeDatum extends SimulationNodeDatum{
    id: string;
    name: string;
    affiliation: string;
    email: string;
    interests: string[];
    role: string;

    fx?: number;
    fy?: number;
    radius?: number;
}