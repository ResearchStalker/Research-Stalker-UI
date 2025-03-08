import React from 'react';
import '../styles/components/navbar.scss';

const Navbar: React.FC = () => {
    return (
        <nav className="research-navbar">
            <div className="logo">
                <a href="/" className="brand-link">
                    <span className="brand-name">Linked Scholar</span>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
