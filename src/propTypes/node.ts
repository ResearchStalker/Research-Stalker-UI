export interface NodeDatum {
    id: string;
    name: string;
    affiliation: string;
    email: string;
    interests: string[];
    role: string;
    radius?: number;
    [key: string]: any;
}