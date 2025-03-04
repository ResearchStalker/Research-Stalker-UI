import React, { useState, useEffect, useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import '@mdi/font/css/materialdesignicons.min.css';
import '../styles/components/researcher-window.scss';
import '../styles/components/interest-tags.scss';

import { LinkDatum } from '../propTypes/link';
import { NodeDatum } from '../propTypes/node';

interface FilterWindowProps {
    node: { [key: string]: any };
    onClose: () => void;
    onAddInterest?: (interest: string) => void;
    filterSidebarActive?: boolean;
    isNodeSelected: boolean;
    nodes: NodeDatum[];
    links: LinkDatum[];

    bfsPath?: string[] | null;
    onBFSRequest?: (
        startId: string,
        connectionType: 'Affiliation' | 'researcher',
        selectedValue: string
    ) => void;
}


const capitalizeFirstLetter = (text: string) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

const ResearcherWindow: React.FC<FilterWindowProps> = ({
                                                           node,
                                                           onClose,
                                                           onAddInterest,
                                                           filterSidebarActive = false,
                                                           isNodeSelected,
                                                           nodes,
                                                           links,
                                                           bfsPath,
                                                           onBFSRequest
                                                       }) => {
    const [selectedConnection, setSelectedConnection] =
        useState<{ value: string; label: string } | null>(null);
    const [connectionType, setConnectionType] =
        useState<'Affiliation' | 'researcher'>('Affiliation');
    const [connectionExpanded, setConnectionExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('researcher');
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const combinedOptions = useMemo(() => {
        const researcherOptions = nodes.map((nd) => ({
            value: nd.name || nd.id,
            label: nd.name || String(nd.id)
        }));

        const affiliationOptions = Array.from(
            new Set(nodes.map((nd) => nd.affiliation))
        ).map((aff) => ({
            value: aff,
            label: aff
        }));

        return [
            {
                label: 'Researchers',
                options: researcherOptions
            },
            {
                label: 'Affiliations',
                options: affiliationOptions
            }
        ];
    }, [nodes]);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300);
    };

    useEffect(() => {
        if (filterSidebarActive || !isNodeSelected) {
            setIsOpen(false);
            setTimeout(() => setIsVisible(false), 300);
        } else {
            setIsVisible(true);
            setTimeout(() => setIsOpen(true), 10);
        }
    }, [filterSidebarActive, isNodeSelected]);

    useEffect(() => {
        if (onBFSRequest) {
            onBFSRequest(String(node.id), connectionType, selectedConnection?.value || '');
        }
    }, [node])

    if (!isVisible) {
        return null;
    }

    const sortedEntries = Object.entries(node)
        .filter(([key]) => key.toLowerCase() !== 'id')
        .sort(([keyA], [keyB]) => {
            if (keyA.toLowerCase() === 'name') return -1;
            if (keyB.toLowerCase() === 'name') return 1;
            if (keyA.toLowerCase().includes('interest')) return 1;
            if (keyB.toLowerCase().includes('interest')) return -1;
            return 0;
        });

    const handleAddToFilters = (interest: string) => {
        onAddInterest?.(interest);
    };

    const handleCreateNewOption = (inputValue: string) => {
        const newOption = { value: inputValue, label: inputValue };
        setSelectedConnection(newOption);
    };
    const handleClearSearch = () => {
        setIsSearchActive(false);
        setSelectedConnection(null);
        onBFSRequest?.(String(node.id), connectionType, ''); // Trigger a reset in the parent component
    };
    const getFilteredOptions = () => {
        const group = combinedOptions.find(
            (g) =>
                g.label ===
                (connectionType === 'researcher' ? 'Researchers' : 'Affiliations')
        );
        return group ? group.options : [];
    };

    const handleSearch = () => {
        if (!selectedConnection) {
            alert(`Please select a ${connectionType}.`);
            return;
        }
        setIsSearchActive(true);
        onBFSRequest?.(String(node.id), connectionType, selectedConnection.value);
    };

    const renderBfsPath = () => {
        if (!bfsPath) return null;

        return (
            <div className="bfs-path">
                <h3>Connection Path:</h3>
                <ul>
                    {bfsPath.map((nodeId, index) => {
                        const found = nodes.find((n) => String(n.id) === nodeId);
                        return (
                            <li key={index}>
                                {found?.name || found?.affiliation || nodeId}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'researcher':
                return (
                    <div className="filter-window-content">
                        {sortedEntries.map(([key, value]) => {
                            const formattedKey = capitalizeFirstLetter(key);
                            if (key.toLowerCase() === 'name') {
                                return (
                                    <div key={key} className="metadata-item">
                                        <p className="metadata-key">{formattedKey}:&nbsp;</p>
                                        <p className="metadata-value">
                                            {capitalizeFirstLetter(String(value))}
                                        </p>
                                    </div>
                                );
                            }
                            if (key.toLowerCase().includes('interest')) {
                                const interests = String(value)
                                    .split(',')
                                    .map((interest) => interest.trim())
                                    .filter((interest) => interest.length > 0);
                                if (interests.length === 0) return null;
                                return (
                                    <div key={key} className="metadata-item full-width">
                                        <p className="metadata-key">{formattedKey}:</p>
                                        <div className="interest-tags">
                                            {interests.map((interest, index) => (
                                                <span key={index} className="interest-tag">
                          {interest}
                                                    {onAddInterest && (
                                                        <button
                                                            className="remove-interest"
                                                            onClick={() => handleAddToFilters(interest)}
                                                        >
                                                            <i className="mdi mdi-plus" />
                                                        </button>
                                                    )}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div key={key} className="metadata-item">
                                    <p className="metadata-key">{formattedKey}:&nbsp;</p>
                                    <p className="metadata-value">
                                        {capitalizeFirstLetter(String(value))}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                );
            case 'group':
                return (
                    <div className="filter-window-content">
                        <div className="metadata-item">
                            <p className="metadata-value">
                                Group content goes here. Display all researchers from the same affiliation.
                            </p>
                        </div>
                    </div>
                );
            case 'publications':
                return (
                    <div className="filter-window-content">
                        <div className="metadata-item">
                            <p className="metadata-value">Publications content goes here.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`filter-window ${isOpen ? 'open' : ''}`}>
            <div className="filter-window-header">
                <div className="header-top">
                    <h2 className="bold-title">Researcher Details</h2>
                    <button className="close-button" onClick={handleClose}>
                        ✖
                    </button>
                </div>
                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === 'researcher' ? 'active' : ''}`}
                        onClick={() => setActiveTab('researcher')}
                    >
                        <i className="mdi mdi-account" />
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'group' ? 'active' : ''}`}
                        onClick={() => setActiveTab('group')}
                    >
                        <i className="mdi mdi-account-multiple" />
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'publications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('publications')}
                    >
                        <i className="mdi mdi-book-open-page-variant" />
                    </button>
                </div>
            </div>

            {renderContent()}

            <div className="connection-path-section">
                <button
                    className="toggle-connection-btn"
                    onClick={() => setConnectionExpanded(!connectionExpanded)}
                >
                    <i
                        className={`mdi ${
                            connectionExpanded ? 'mdi-chevron-down' : 'mdi-chevron-up'
                        }`}
                    ></i>
                    Find Best Connection Path
                </button>
                {connectionExpanded && (
                    <div className="connection-form">
                        <div className="connection-type-toggle">
                            <button
                                className={`connection-type-btn ${
                                    connectionType === 'Affiliation' ? 'active' : ''
                                }`}
                                onClick={() => {
                                    setConnectionType('Affiliation');
                                    setSelectedConnection(null);
                                }}
                            >
                                Affiliation
                            </button>
                            <button
                                className={`connection-type-btn ${
                                    connectionType === 'researcher' ? 'active' : ''
                                }`}
                                onClick={() => {
                                    setConnectionType('researcher');
                                    setSelectedConnection(null);
                                }}
                            >
                                Researcher
                            </button>
                        </div>

                        <div className="form-row">
                            <CreatableSelect
                                value={selectedConnection}
                                onChange={(option) =>
                                    setSelectedConnection(option as { value: string; label: string })
                                }
                                onCreateOption={handleCreateNewOption}
                                options={getFilteredOptions()}
                                placeholder={`Select or type a ${connectionType}...`}
                                className="connection-select"
                                isSearchable
                                formatCreateLabel={(inputValue) => `Search "${inputValue}"`}
                                noOptionsMessage={({ inputValue }) => `No matches found for "${inputValue}"`}
                                isValidNewOption={() => true}
                            />
                        </div>

                        <div className="button-container">
                            <button className="search-btn" onClick={handleSearch}>
                                <i className="mdi mdi-magnify" />
                                Search
                            </button>
                            {isSearchActive && (
                                <button className="clear-search-btn" onClick={handleClearSearch}>
                                    <i className="mdi mdi-close" />
                                    Clear Search
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResearcherWindow;
