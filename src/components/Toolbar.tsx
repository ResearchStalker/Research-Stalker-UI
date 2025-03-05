import React, { useState } from 'react';
import '@mdi/font/css/materialdesignicons.min.css';
import '../styles/components/toolbar.scss';

const Toolbar: React.FC<
    { toggleFilters: () => void; graphView: boolean, toggleGrid: () => void}> = 
        ({ toggleFilters, graphView, toggleGrid }) => 
{
    const [mapView, setMapView] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [gridActive, setGridActive] = useState(false); // Track grid state
    const [filtersActive, setFiltersActive] = useState(false); // Track filter button state

    const handleToggleFilters = () => {
        setFiltersActive((prev) => !prev);
        toggleFilters();
    };

    const handleToggleGrid = () => {
        setGridActive((prev) => !prev);
        toggleGrid();
    };


    return (
        <div>
            <div className={`toolbar ${collapsed ? 'collapsed' : ''}`}>
                <button className="toolbar-toggle-button" onClick={() => setCollapsed(!collapsed)}>
                    <i className={`mdi ${collapsed ? 'mdi-chevron-right' : 'mdi-chevron-left'}`}></i>
                </button>
                    <>
                        <button className="toolbar-button">
                            <i className="mdi mdi-home"></i>
                        </button>

                        {/* Toggle Grid Background */}
                        <button 
                            className={`toolbar-button ${gridActive ? 'active' : ''}`}
                            onClick={handleToggleGrid}
                        >
                            <i className="mdi mdi-grid"></i>
                        </button>

                        {/* Toggle Filters - Keep active state when pressed */}
                        <button
                            className={`toolbar-button ${filtersActive ? 'active' : ''}`}
                            onClick={handleToggleFilters}
                        >
                            <i className="mdi mdi-filter"></i>
                        </button>

                        {mapView && (
                            <button className="toolbar-button">
                                <i className="mdi mdi-dots-hexagon"></i>
                            </button>
                        )}

                        {graphView && (
                            <button className="toolbar-button">
                                <i className="mdi mdi-earth"></i>
                            </button>
                        )}
                    </>
            </div>
        </div>
    );
};

export default Toolbar;
