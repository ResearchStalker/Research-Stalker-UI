import React from 'react';
import { useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';
import Toolbar from './Toolbar';
import Logo from './ui/Logo'
import '../styles/components/navbar.scss';

interface NavbarProps {
    toolbarProps?: {
        toggleFilters: () => void;
        toggleGrid: () => void;
        gridActive: boolean;
        filtersActive: boolean;
    };
}

const Navbar: React.FC<NavbarProps> = ({ toolbarProps }) => {
    const location = useLocation();
    const isNetworkPage = location.pathname === '/network';
    const isHomePage = location.pathname === '/';

    return (
        <nav className="research-navbar">
            <div className="navbar-left">
                <a href="/" className="brand-link">
                    <Logo width={220} height={55} />
                </a>
            </div>

            <div className="navbar-right">
                {isNetworkPage && toolbarProps && (
                    <Toolbar {...toolbarProps} />
                )}
                <UserProfile minimal={isNetworkPage} showLoginButton={true} />
            </div>
        </nav>
    );
};

export default Navbar;