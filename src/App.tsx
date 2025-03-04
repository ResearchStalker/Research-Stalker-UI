import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './views/Menu';
import ResearcherNetwork from './views/ResearcherNetwork';
import PrivacyPolicy from './views/PrivacyPolicy';
import TermsOfService from './views/TermsOfService';
import Help from './views/Help';
import Contribute from './views/Contribute';
import Sponsor from './views/Sponsor';
import './styles/app.scss';
import Api from "./views/API";
import Contact from "./views/Contact";

function App() {
    return (
        <Router>
            <Routes>
                {/* Main Pages */}
                <Route path="/" element={<Menu />} />
                <Route path="/network" element={<ResearcherNetwork />} />

                {/* Footer Pages */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/help" element={<Help />} />
                <Route path="/contribute" element={<Contribute />} />
                <Route path="/sponsor" element={<Sponsor />} />
                <Route path="/api" element={<Api />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Router>
    );
}

export default App;
