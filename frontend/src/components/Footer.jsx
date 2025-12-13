import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">About Us</h3>
                        <p className="text-gray-300">
                            Human Lost & Found System helps reunite families using advanced
                            face recognition technology. Report lost or found persons and let
                            our AI do the matching.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <a href="/" className="hover:text-primary-400 transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/report-lost" className="hover:text-primary-400 transition-colors">
                                    Report Lost Person
                                </a>
                            </li>
                            <li>
                                <a href="/report-found" className="hover:text-primary-400 transition-colors">
                                    Report Found Person
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex items-center space-x-3">
                                <FaEnvelope className="text-primary-400" />
                                <span>support@lostandfound.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaPhone className="text-primary-400" />
                                <span>+977 1234567890</span>
                            </div>
                            <div className="flex space-x-4 mt-4">
                                <a href="#" className="text-2xl hover:text-primary-400 transition-colors">
                                    <FaFacebook />
                                </a>
                                <a href="#" className="text-2xl hover:text-primary-400 transition-colors">
                                    <FaTwitter />
                                </a>
                                <a href="#" className="text-2xl hover:text-primary-400 transition-colors">
                                    <FaInstagram />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 Human Lost & Found System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
