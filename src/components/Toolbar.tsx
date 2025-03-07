import React, { useState, useEffect } from 'react';
import '@mdi/font/css/materialdesignicons.min.css';
import '../styles/components/toolbar.scss';
import { getUser } from '../service/ApiGatewayService';
import {login, logout} from "../service/AuthService";


const Toolbar: React.FC<{
    toggleFilters: () => void;
    graphView: boolean;
    toggleGrid: () => void;
}> = ({ toggleFilters, graphView, toggleGrid }) => {
    const [mapView, setMapView] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [gridActive, setGridActive] = useState(false);
    const [filtersActive, setFiltersActive] = useState(false);
    const [user, setUser] = useState<{ email: string; picture?: string } | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUser();
                setUser({ email: userData.email, picture: userData.picture });
            } catch (error) {
                setUser(null);
            }
        };

        fetchData();
    }, []);

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

                <button className="toolbar-button">
                    <i className="mdi mdi-home"></i>
                </button>

                {/* Toggle Grid Background */}
                <button className={`toolbar-button ${gridActive ? 'active' : ''}`} onClick={handleToggleGrid}>
                    <i className="mdi mdi-grid"></i>
                </button>

                {/* Toggle Filters */}
                <button className={`toolbar-button ${filtersActive ? 'active' : ''}`} onClick={handleToggleFilters}>
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

                {/* User Profile Display */}
                {user ? (
                    <div className="toolbar-user">
                        {/* Display Profile Picture if available */}
                        {user.picture ? (
                            <img src={user.picture} alt="User" className="toolbar-user-image" />
                        ) : (
                            <i className="mdi mdi-account-circle toolbar-user-icon"></i>
                        )}

                        {/* Display User Email */}
                        <span className="toolbar-user-name">{user.email}</span>


                        {/* Logout Button */}
                        <button className="toolbar-button" onClick={logout} title="Logout">
                            <i className="mdi mdi-logout"></i>
                        </button>
                    </div>
                ) : (
                    <button className="toolbar-button" onClick={login}>
                        <i className="mdi mdi-login"></i>
                    </button>
                )}

            </div>
        </div>
    );
};

export default Toolbar;
