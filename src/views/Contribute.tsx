import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/views/footerPages.scss';

const Contribute: React.FC = () => {
    return (
        <div className="page-container">
            <Navbar />
            <main className="content">
                <h1 className="footer-page-title">Become a Collaborator</h1>
                <p>Join Research Stalker and help researchers collaborate more effectively.</p>

                <section>
                    <h2>How to Contribute</h2>
                    <p>
                        Research Stalker is an open-source project, and we welcome contributions from developers, researchers, and enthusiasts.
                        Here’s how you can get involved:
                    </p>
                    <ul>
                        <li>
                            <strong>Report Issues:</strong> Found a bug or have a feature request? Open an issue on our GitHub repository.
                        </li>
                        <li>
                            <strong>Submit Pull Requests:</strong> Have a fix or improvement? Submit a pull request, and we’ll review it.
                        </li>
                        <li>
                            <strong>Improve Documentation:</strong> Help us improve the documentation to make the project more accessible.
                        </li>
                        <li>
                            <strong>Spread the Word:</strong> Share Research Stalker with your network to help us grow.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>GitHub Repository</h2>
                    <p>
                        The source code for Research Stalker is hosted on GitHub. You can find the repository, report issues, and contribute here:
                    </p>
                    <div className="github-repo">
                        <a
                            href="https://github.com/MikoMikarro/ResearchStalker"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="github-link"
                        >
                            <img
                                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                                alt="GitHub Logo"
                                className="github-logo"
                            />
                            <span>Research Stalker Repository</span>
                        </a>
                    </div>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions or need guidance on contributing, feel free to reach out to us:
                    </p>
                    <p>
                        <strong>Email:</strong> [Insert Email Address]<br />
                        <strong>Address:</strong> [Insert Physical Address]
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Contribute;