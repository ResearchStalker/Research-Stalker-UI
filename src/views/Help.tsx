import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/views/footerPages.scss';

const Help: React.FC = () => {
    return (
        <div className="page-container">
            <Navbar />
            <main className="content">
                <h1 className="footer-page-title">Help & Support</h1>

                <section>
                    <h2>Frequently Asked Questions (FAQs)</h2>

                    <div className="faq-item">
                        <h3>What is Research Stalker?</h3>
                        <p>
                            Research Stalker is a web application designed to help users explore and analyze academic research networks.
                            It provides insights into researchers, their collaborations, and their fields of interest using publicly available data.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3>How do I search for researchers?</h3>
                        <p>
                            To search for researchers, use the search bar on the homepage or explore the network graph.
                            You can filter researchers by affiliation, collaboration strength, or fields of interest.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3>Is Research Stalker free to use?</h3>
                        <p>
                            Yes, Research Stalker is completely free to use. We are committed to providing open access to academic research insights.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3>Can I distribute or modify the software?</h3>
                        <p>
                            Research Stalker is protected by copyright and intellectual property laws.
                            You may not distribute, modify, or use the software for commercial purposes without explicit permission from the creators.
                            If you are interested in collaboration or distribution, please contact us at [Insert Contact Information].
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3>What are the future updates for Research Stalker?</h3>
                        <p>
                            We are continuously working to improve Research Stalker. Future updates may include:
                        </p>
                        <ul>
                            <li>Enhanced search and filtering capabilities.</li>
                            <li>Integration with additional academic databases.</li>
                            <li>New visualization tools for analyzing research networks.</li>
                        </ul>
                    </div>

                    <div className="faq-item">
                        <h3>How can I contact support?</h3>
                        <p>
                            If you have any questions or need assistance, please contact us at:
                        </p>
                        <p>
                            <strong>Email:</strong> [Insert Email Address]<br />
                            <strong>Address:</strong> [Insert Physical Address]
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Help;