import React, { useState, useEffect } from 'react';
import '@mdi/font/css/materialdesignicons.min.css';
import '../styles/components/toolbar.scss';

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

    // Fetch user data on component mount
    useEffect(() => {
        fetch('http://localhost:8080/api/user/me', {
            method: 'GET',
            credentials: 'include', // Send session cookies
        })
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error('Not authenticated');
            })
            .then((data) => {
                setUser({ email: data.email, picture: data.picture }); // Update state with user data
            })
            .catch(() => setUser(null));
    }, []);

    const handleToggleFilters = () => {
        setFiltersActive((prev) => !prev);
        toggleFilters();
    };

    const handleToggleGrid = () => {
        setGridActive((prev) => !prev);
        toggleGrid();
    };

    const handleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    const handleLogout = () => {
        fetch('http://localhost:8080/logout', {
            method: 'POST',
            credentials: 'include',
        }).then(() => {
            setUser(null);
            window.location.reload(); // Refresh page after logout
        });
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

                        {/* Display User Name */}
                        <span className="toolbar-user-name">{user.email}</span>

                        {/* Logout Button */}
                        <button className="toolbar-button" onClick={handleLogout} title="Logout">
                            <i className="mdi mdi-logout"></i>
                        </button>
                    </div>
                ) : (
                    <button className="toolbar-button" onClick={handleLogin}>
                        <i className="mdi mdi-login"></i>
                    </button>
                )}

            </div>
        </div>
    );
};

export default Toolbar;
