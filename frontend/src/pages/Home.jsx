import { Link } from 'react-router-dom';
import { FaSearch, FaUserPlus, FaCheckCircle, FaHeartbeat, FaUsers, FaChartLine } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="min-h-screen">
            {}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center animate-fadeIn">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Reuniting Families with{' '}
                            <span className="text-yellow-300">AI Technology</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Advanced face recognition system to help find missing persons and reunite them with their loved ones
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/report-lost"
                                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-glow-lg hover:scale-105 transition-all duration-300"
                            >
                                Report Lost Person
                            </Link>
                            <Link
                                to="/report-found"
                                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-glow-lg hover:scale-105 transition-all duration-300"
                            >
                                Report Found Person
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
                        How It Works
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Feature 1 */}
                        <div className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
                            <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-glow">
                                <FaUserPlus className="text-4xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Report Missing Person</h3>
                            <p className="text-gray-600">
                                Upload a photo and details of the missing person. Our system will store and process the information.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
                            <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-glow">
                                <FaSearch className="text-4xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">AI Face Matching</h3>
                            <p className="text-gray-600">
                                Our AI compares faces automatically and creates matches when similarity is ≥75%. Admin approval required.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-glow">
                                <FaCheckCircle className="text-4xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Get Reunited</h3>
                            <p className="text-gray-600">
                                When a match is found, both parties are notified with contact information to facilitate reunion.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="card-gradient p-8 text-center">
                            <FaUsers className="text-5xl text-primary-600 mx-auto mb-4" />
                            <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
                            <div className="text-gray-600 font-semibold">Active Users</div>
                        </div>

                        <div className="card-gradient p-8 text-center">
                            <FaHeartbeat className="text-5xl text-secondary-600 mx-auto mb-4" />
                            <div className="text-4xl font-bold text-gray-900 mb-2">120+</div>
                            <div className="text-gray-600 font-semibold">Successful Reunions</div>
                        </div>

                        <div className="card-gradient p-8 text-center">
                            <FaChartLine className="text-5xl text-green-600 mx-auto mb-4" />
                            <div className="text-4xl font-bold text-gray-900 mb-2">85%</div>
                            <div className="text-gray-600 font-semibold">Match Accuracy</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Join our community and help reunite families today
                    </p>
                    <Link
                        to="/register"
                        className="bg-white text-primary-600 px-10 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-glow-lg hover:scale-105 transition-all duration-300 inline-block"
                    >
                        Get Started Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
