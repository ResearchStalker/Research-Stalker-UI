import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';
import Toolbar from './Toolbar';
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
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const handleDropdownToggle = (dropdownName: string, isOpen: boolean) => {
        if (isOpen) {
            setActiveDropdown(dropdownName);
        } else if (activeDropdown === dropdownName) {
            setActiveDropdown(null);
        }
    };

    const enhancedToolbarProps = toolbarProps ? {
        ...toolbarProps,
        activeDropdown,
        onDropdownToggle: (name: string, isOpen: boolean) => handleDropdownToggle(name, isOpen)
    } : undefined;

    return (
        <nav className="research-navbar">
             <div className="navbar-left">
                <a href="/" className="brand-link">
                    <div className="brand-title-container">
                        <span className="brand-title-linked">Linked</span>
                        <span className="brand-title-scholar">Scholar</span>
                    </div>
                </a>
            </div>

            <div className="navbar-right">
                {isNetworkPage && enhancedToolbarProps && (
                    <Toolbar {...enhancedToolbarProps} />
                )}
                <UserProfile 
                    minimal={isNetworkPage} 
                    showLoginButton={true}
                    activeDropdown={activeDropdown}
                    onDropdownToggle={(isOpen) => handleDropdownToggle('userProfile', isOpen)}
                />
            </div>
        </nav>
    );
};

export default Navbar;