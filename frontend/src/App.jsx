import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import AdminRoute from './utils/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <UserDashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/report-lost"
                                element={
                                    <PrivateRoute>
                                        <ReportLost />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/report-found"
                                element={
                                    <PrivateRoute>
                                        <ReportFound />
                                    </PrivateRoute>
                                }
                            />

                            {/* Admin Routes - Placeholder */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <AdminRoute>
                                        <UserDashboard />
                                    </AdminRoute>
                                }
                            />

                            {/* 404 */}
                            <Route
                                path="*"
                                element={
                                    <div className="min-h-screen flex items-center justify-center">
                                        <div className="text-center">
                                            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                                            <p className="text-xl text-gray-600">Page not found</p>
                                        </div>
                                    </div>
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
