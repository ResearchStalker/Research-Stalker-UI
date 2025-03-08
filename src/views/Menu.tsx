// src/views/Menu.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import '../styles/views/menu.scss';
import { getNetwork, getUser } from '../service/ApiGatewayService';
import { login } from '../service/AuthService';

const Menu: React.FC = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState<{ email: string; picture?: string } | null>(null);

    // Check if user is logged in by querying your backend/spring-security session
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUser();
                setUser({ email: userData.email, picture: userData.picture });
            } catch (error) {
                setUser(null);
            }
        };

        fetchUserData();
    }, []);

    // Extract profile data from the provided URL
    const extractProfileData = (url: string) => {
        if (url.match(/scholar\.google\.[a-z.]+/)) {
            const match = url.match(/[?&]user=([^&]+)/);
            if (match && match[1]) {
                return { author_id: match[1], source: 'google' };
            }
        } else if (url.includes('researchgate.net/profile')) {
            const match = url.match(/profile\/([^/]+)/);
            if (match && match[1]) {
                return { author_id: match[1], source: 'research_gate' };
            }
        } else {
            // Assume if not Google Scholar or ResearchGate, we pass it to DBLP logic
            return { author_id: url, source: 'dblp' };
        }
        return null;
    };

    // Handle the search form submission
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
                    const recursivity = 0;
                    const response = await getNetwork(
                        profileData.author_id,
                        profileData.source,
                        recursivity
                    );
                    clearTimeout(timer);

                    navigate('/network', {
                        state: { networkData: response, loading: false },
                    });
                } catch (error) {
                    clearTimeout(timer);
                    setError('Failed to fetch network data. Please try again.');
                }
            } else {
                setError(
                    'Invalid link. Please provide a valid Google Scholar, ResearchGate or known source link.'
                );
            }
        }
    };

    // If user is not logged in, show the sign-in button
    if (!user) {
        return (
            <div className="menu-container">
                <header className="menu-header">
                    <div className="title-container">
                        <h1 className="menu-title">Linked Scholar</h1>
                        <p className="menu-version">v0.2</p>
                    </div>
                    <p className="menu-subtitle">
                        Enter a Researcher Name, ORCID, Google Scholar or ResearchGate profile link
                        to explore networking opportunities.
                    </p>
                </header>

                <button className="search-button" onClick={login}>
                    <i className="mdi mdi-google" style={{ marginRight: '8px' }}></i>
                    Sign in with Google
                </button>

                <Footer />
            </div>
        );
    }

    // If user is logged in, show the search form
    return (
        <div className="menu-container">
            <header className="menu-header">
                <div className="title-container">
                    <h1 className="menu-title">Linked Scholar</h1>
                    <p className="menu-version">v0.2</p>
                </div>
                <p className="menu-subtitle">
                    Enter a Researcher Name, ORCID, Google Scholar or ResearchGate profile link
                    to explore networking opportunities.
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
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <Footer />
        </div>
    );
};

export default Menu;
