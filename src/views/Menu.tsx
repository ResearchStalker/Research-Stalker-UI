import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import '../styles/views/menu.scss';
import { getNetwork } from '../service/ApiGatewayService';

const Menu: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const extractProfileData = (url: string) => {
        if (url.match(/scholar\.google\.[a-z.]+/)) {
            const match = url.match(/[?&]user=([^&]+)/);
            if (match && match[1]) {
                return { author_id: match[1], source: 'google' };
            }
        }
        else if (url.includes('researchgate.net/profile')) {
            const match = url.match(/profile\/([^/]+)/);
            if (match && match[1]) {
                return { author_id: match[1], source: 'research_gate' };
            }
        }
        else {
            return { author_id: url, source: 'dblp' };
        }
        return null;
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (searchTerm.trim()) {
            const profileData = extractProfileData(searchTerm);
            if (profileData) {
                let timedOut = false;
                const timer = setTimeout(() => {
                    timedOut = true;
                    navigate('/network', { state: { networkData: null, loading: true } });
                }, 10000);

                try {
                    const recursivity = 1;
                    const response = await getNetwork(profileData.author_id, profileData.source, recursivity);
                    clearTimeout(timer);
                    navigate('/network', { state: { networkData: response, loading: false } });
                } catch (error) {
                    clearTimeout(timer);
                    setError('Failed to fetch network data. Please try again.');
                }
            } else {
                setError('Invalid link. Please provide a valid Google Scholar or ResearchGate link.');
            }
        }
    };

    return (
        <div className="menu-container">
            <header className="menu-header">
                <div className="title-container">
                    <h1 className="menu-title">Research Stalker</h1>
                    <p className="menu-version">v0.2</p>
                </div>
                <p className="menu-subtitle">
                    Enter a Researcher Name, ORCID, Google Scholar or ResearchGate profile link to explore networking opportunities.
                </p>

            </header>

            <form onSubmit={handleSearch} className="search-container">
                <input
                    id="researcher-search-input"
                    type="text"
                    className="search-input"
                    placeholder="Search Researchers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <Footer />
        </div>
    );
};

export default Menu;