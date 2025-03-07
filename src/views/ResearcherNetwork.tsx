import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FiltersSidebar from '../components/FiltersSidebar';
import Toolbar from '../components/Toolbar';
import ResearcherWindow from '../components/ResearcherWindow';
import '../styles/views/researchNetwork.scss';

import { NodeDatum } from '../propTypes/node';
import { LinkDatum } from '../propTypes/link';
import ForceGraphContainer from '../components/network/ForceGraphContainer';

interface GraphData {
    nodes: NodeDatum[];
    links: LinkDatum[];
}

const ResearcherNetwork: React.FC = () => {
    const [data, setData] = useState<GraphData | null>(null);
    const [minEdgeWeight, setMinEdgeWeight] = useState<number>(1);
    const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>([]);
    const [fieldsOfInterest, setFieldsOfInterest] = useState<string[]>([]);
    const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
    const [gridVisible, setGridVisible] = useState<boolean>(false);
    const [graphView, setGraphView] = useState<boolean>(true);
    const [selectedNode, setSelectedNode] = useState<NodeDatum | null>(null);
    const [bfsPath, setBfsPath] = useState<string[] | null>(null);
    const [bfsRequest, setBfsRequest] = useState<{
        startId: string;
        connectionType: 'Affiliation' | 'researcher';
        selectedValue: string;
    } | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    /*--ONLINE MODE--*/

    useEffect(() => {
        if (location.state?.networkData) {
            setData(location.state.networkData);
        } else if (location.state?.loading) {
        } else {
            navigate('/');
        }
        }, [location.state, navigate]);

    /*--LOCAL MODE--*/
    /*
        useEffect(() => {
            const fetchGraphData = async () => {
                try {
                    const response = await fetch('/data/mock-data/demo-rec-1.json');
                    if (!response.ok) throw new Error('Failed to fetch network data');
                    const jsonData: GraphData = await response.json();
                    setData(jsonData);
                } catch (error) {
                    console.error('Error fetching network data:', error);
                    setData(null);
                }
            };
            fetchGraphData();
        }, []);

     */

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const toggleGrid = () => {
        setGridVisible(!gridVisible);
    };

    const affiliationColors = useMemo(() => {
        if (!data) return {};
        const uniqueAffiliations = Array.from(new Set(data.nodes.map((n) => n.affiliation)));
        return uniqueAffiliations.reduce<Record<string, string>>((acc, aff) => {
            const hue = Math.floor(Math.random() * 360);
            const saturation = 25;
            const lightness = 60;
            acc[aff] = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            return acc;
        }, {});
    }, [data]);

    const addInterest = (newInterest: string) => {
        const trimmed = newInterest.trim();
        if (!fieldsOfInterest.includes(trimmed) && trimmed.length > 0) {
            setFieldsOfInterest((prev) => [...prev, trimmed]);
        }
    };

    const resetFilters = () => {
        setMinEdgeWeight(1);
        setSelectedAffiliations([]);
        setFieldsOfInterest([]);
    };

    const handleNodeSelect = useCallback((node: NodeDatum | null) => {
        setSelectedNode(node);
        setBfsPath(null);
        setBfsRequest(null);
    }, []);

    const handleBFSRequest = (startId: string, connectionType: 'Affiliation' | 'researcher', selectedValue: string) => {
        if (selectedValue === '') {
            setBfsPath(null);
            setBfsRequest(null);
        } else {
            setBfsPath(null);
            setBfsRequest({ startId, connectionType, selectedValue });
        }
    };

    const handleCloseResearcherWindow = () => {
        setSelectedNode(null);
        setBfsPath(null);
        setBfsRequest(null);
    };


    return (
        <div className="research-network-container">
            <Navbar />
            <Toolbar toggleFilters={toggleFilters} graphView={graphView} toggleGrid={toggleGrid}/>

            <div className="network-content">
                {filtersVisible && (
                    <FiltersSidebar
                        minEdgeWeight={minEdgeWeight}
                        setMinEdgeWeight={setMinEdgeWeight}
                        selectedAffiliations={selectedAffiliations}
                        setSelectedAffiliations={setSelectedAffiliations}
                        affiliationColors={affiliationColors}
                        fieldsOfInterest={fieldsOfInterest}
                        setFieldsOfInterest={setFieldsOfInterest}
                        navigate={navigate}
                        resetFilters={resetFilters}
                    />
                )}

                {data ? (
                    <ForceGraphContainer
                        nodes={data.nodes}
                        links={data.links.filter((lnk) => (lnk.value ?? 1) >= minEdgeWeight)}
                        affiliationColors={affiliationColors}
                        addInterest={addInterest}
                        selectedAffiliations={selectedAffiliations}
                        fieldsOfInterest={fieldsOfInterest}
                        selectedNode={selectedNode}
                        onNodeSelect={handleNodeSelect}
                        bfsRequest={bfsRequest}
                        onPathFound={setBfsPath}
                        gridVisible={gridVisible}
                    />
                ) : (
                    <div className="loading-container">
                        <div className="loading-messages">
                            <p className="loading-message">
                                We haven't found this researcher in our database
                            </p>
                            <p className="loading-message">
                                We are loading its network, please wait...
                            </p>
                        </div>
                    </div>

                )}
            </div>

            {selectedNode && (
                <ResearcherWindow
                    node={selectedNode}
                    onClose={handleCloseResearcherWindow}
                    onAddInterest={addInterest}
                    nodes={data ? data.nodes : []}
                    links={data ? data.links : []}
                    isNodeSelected={true}
                    bfsPath={bfsPath ?? undefined}
                    onBFSRequest={handleBFSRequest}
                />
            )}
            <Footer />
        </div>
    );
};

export default ResearcherNetwork;