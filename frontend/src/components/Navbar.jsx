import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaUser, FaSignOutAlt, FaUserShield, FaPlusCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 shadow-2xl sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-white p-2 rounded-lg shadow-lg group-hover:shadow-glow transition-all duration-300">
                            <FaUser className="text-primary-600 text-2xl" />
                        </div>
                        <span className="text-white text-2xl font-bold hidden sm:block">
                            Lost & Found
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                                    className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                                >
                                    <FaHome />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>

                                <Link
                                    to="/report-lost"
                                    className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                                >
                                    <FaPlusCircle />
                                    <span className="hidden sm:inline">Report Lost</span>
                                </Link>

                                <Link
                                    to="/report-found"
                                    className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                                >
                                    <FaPlusCircle />
                                    <span className="hidden sm:inline">Report Found</span>
                                </Link>

                                {/* User Menu */}
                                <div className="flex items-center space-x-2 ml-4 border-l border-white/30 pl-4">
                                    <div className="text-white text-sm hidden md:block">
                                        <div className="font-semibold">{user?.name}</div>
                                        {isAdmin && (
                                            <div className="text-xs text-blue-200 flex items-center">
                                                <FaUserShield className="mr-1" /> Admin
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                                    >
                                        <FaSignOutAlt />
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-primary-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
