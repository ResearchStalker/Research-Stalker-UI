import * as React from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import '@mdi/font/css/materialdesignicons.min.css';
import '../styles/components/filter-sidebar.scss';
import '../styles/components/interest-tags.scss';

interface FiltersSidebarProps {
    minEdgeWeight: number;
    setMinEdgeWeight: (value: number) => void;
    selectedAffiliations: string[];
    setSelectedAffiliations: (values: string[]) => void;
    affiliationColors: Record<string, string>;
    fieldsOfInterest: string[];
    setFieldsOfInterest: (values: string[]) => void;
    navigate: (path: string) => void;
    resetFilters: () => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
                                                           minEdgeWeight,
                                                           setMinEdgeWeight,
                                                           selectedAffiliations,
                                                           setSelectedAffiliations,
                                                           affiliationColors,
                                                           fieldsOfInterest,
                                                           setFieldsOfInterest,
                                                           navigate,
                                                           resetFilters,
                                                       }) => {
    const [newInterest, setNewInterest] = React.useState('');

    const affiliationOptions = Object.keys(affiliationColors).map(aff => ({
        value: aff,
        label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                    width: '14px',
                    height: '14px',
                    backgroundColor: affiliationColors[aff] || '#ccc',
                    display: 'inline-block',
                    borderRadius: '50%',
                    marginRight: '8px'
                }}></span>
                {aff}
            </div>
        )
    }));

    const addInterest = () => {
        const trimmed = newInterest.trim();
        if (trimmed && !fieldsOfInterest.includes(trimmed)) {
            setFieldsOfInterest([...fieldsOfInterest, trimmed]);
            setNewInterest('');
        }
    };

    return (
        <aside className="filters-sidebar">
            <div className="filter-window-header">
                <div className="header-top">
                    <h2 className="bold-title">Filters</h2>
                </div>
            </div>

            <div className="filter-window-content">
                {/* Minimum Collaborations Filter 
                <Form.Group className="metadata-item">
                    <Form.Label className="metadata-key">
                        Minimum Collaborations: {minEdgeWeight}
                    </Form.Label>
                    <Form.Range
                        min="1"
                        max="100"
                        value={minEdgeWeight}
                        onChange={(e) => setMinEdgeWeight(Number(e.target.value))}
                        className="metadata-value"
                    />
                </Form.Group>
                */}

                {/* Affiliation Filter */}
                <div className="metadata-item full-width">
                    <Form.Label className="metadata-key">
                        Filter by Affiliation
                    </Form.Label>
                    <Select
                        isMulti
                        options={affiliationOptions}
                        value={selectedAffiliations.map(aff => ({
                            value: aff,
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{
                                        width: '14px',
                                        height: '14px',
                                        backgroundColor: affiliationColors[aff] || '#ccc',
                                        display: 'inline-block',
                                        borderRadius: '50%',
                                        marginRight: '8px'
                                    }}></span>
                                    {aff}
                                </div>
                            )
                        }))}
                        onChange={(selected) =>
                            setSelectedAffiliations(selected ? selected.map(option => option.value) : [])
                        }
                        placeholder="Select affiliations..."
                        className="select-affiliations metadata-value"
                    />
                </div>

                {/* Fields of Interest */}
                <div className="metadata-item full-width">
                    <Form.Label className="metadata-key">
                        Fields of Interest
                    </Form.Label>
                    <div className="interest-tags">
                        {fieldsOfInterest.map((interest, index) => (
                            <span key={index} className="interest-tag">
                                {interest}
                                <button
                                    className="remove-interest"
                                    onClick={() =>
                                        setFieldsOfInterest(fieldsOfInterest.filter(i => i !== interest))
                                    }
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                    <InputGroup className="mt-2 metadata-value">
                        <Form.Control
                            type="text"
                            placeholder="Add a field of interest"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                        />
                        <Button variant="outline-secondary" onClick={addInterest}>
                            +
                        </Button>
                    </InputGroup>
                </div>

                {/* Reset Button */}
                <div className="metadata-item reset-button-container">
                    <Button
                        className="search-btn reset-button smaller-reset-button"
                        onClick={resetFilters}
                    >
                        <i className="mdi mdi-refresh"></i> Reset Filters
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default FiltersSidebar;