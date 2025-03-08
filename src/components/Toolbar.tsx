import React, { useState, useEffect } from 'react';
import '@mdi/font/css/materialdesignicons.min.css';
import '../styles/components/toolbar.scss';

interface ToolbarProps {
    toggleFilters: () => void;
    toggleGrid: () => void;
    gridActive: boolean;
    filtersActive: boolean;
    activeDropdown?: string | null;
    onDropdownToggle?: (name: string, isOpen: boolean) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
    toggleFilters, 
    toggleGrid, 
    gridActive, 
    filtersActive,
    activeDropdown,
    onDropdownToggle
}) => {
    const [collapsed, setCollapsed] = useState(false);
    
    // Close any toolbar dropdowns if user profile is opened
    useEffect(() => {
        if (activeDropdown === 'userProfile' && filtersActive) {
            toggleFilters();
        }
    }, [activeDropdown, filtersActive, toggleFilters]);

    const handleToggleFilters = () => {
        // Notify the parent when filters are toggled
        if (onDropdownToggle) {
            onDropdownToggle('filters', !filtersActive);
        }
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

            <button
                className={`toolbar-button ${gridActive ? 'active' : ''}`}
                onClick={handleToggleGrid}
                title="Toggle Grid"
            >
                <i className="mdi mdi-grid"></i>
            </button>

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