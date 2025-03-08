import React, { useState } from 'react';
import '@mdi/font/css/materialdesignicons.min.css';
import '../styles/components/toolbar.scss';

const Toolbar: React.FC<{
    toggleFilters: () => void;
    toggleGrid: () => void;
    gridActive: boolean;
    filtersActive: boolean;
}> = ({ toggleFilters, toggleGrid, gridActive, filtersActive }) => {
    const [collapsed, setCollapsed] = useState(false);

    const handleToggleFilters = () => {
        toggleFilters();
    };

    const handleToggleGrid = () => {
        toggleGrid();
    };

    return (
        <div className={`toolbar ${collapsed ? 'collapsed' : ''}`}>

            {/*
            <button className="toolbar-toggle-button" onClick={() => setCollapsed(!collapsed)}>
                <i className={`mdi ${collapsed ? 'mdi-chevron-right' : 'mdi-chevron-left'}`}></i>
            </button>
            */}
            {/*
            <button className="toolbar-button" title="Home">
                <i className="mdi mdi-home"></i>
            </button>
            */}

            {/* Toggle Grid Background */}
            <button
                className={`toolbar-button ${gridActive ? 'active' : ''}`}
                onClick={handleToggleGrid}
                title="Toggle Grid"
            >
                <i className="mdi mdi-grid"></i>
            </button>

            {/* Toggle Filters */}
            <button
                className={`toolbar-button ${filtersActive ? 'active' : ''}`}
                onClick={handleToggleFilters}
                title="Toggle Filters"
            >
                <i className="mdi mdi-filter"></i>
            </button>
        </div>
    );
};

export default Toolbar;