                                import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lostAPI, foundAPI, matchAPI } from '../services/api';
import Loader from '../components/Loader';
import { FaUser, FaSearch, FaCheckCircle, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const UserDashboard = () => {
    const [stats, setStats] = useState({ lost: 0, found: 0, matches: 0 });
    const [lostReports, setLostReports] = useState([]);
    const [foundReports, setFoundReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [lostRes, foundRes, matchRes] = await Promise.all([
                lostAPI.getAll(),
                foundAPI.getAll(),
                matchAPI.getResults(),
            ]);

            setLostReports(lostRes.data.data.slice(0, 5));
            setFoundReports(foundRes.data.data.slice(0, 5));

            setStats({
                lost: lostRes.data.pagination.total,
                found: foundRes.data.pagination.total,
                matches: matchRes.data.pagination.total,
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="large" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <ToastContainer />

            {/* Header */}
            <div className="mb-12 animate-fadeIn">
                <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
                <p className="text-gray-600">Overview of all reports and matches</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-semibold mb-1">Lost Reports</p>
                            <p className="text-4xl font-bold text-primary-600">{stats.lost}</p>
                        </div>
                        <div className="bg-primary-100 p-4 rounded-full">
                            <FaUser className="text-3xl text-primary-600" />
                        </div>
                    </div>
                </div>

                <div className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-semibold mb-1">Found Reports</p>
                            <p className="text-4xl font-bold text-secondary-600">{stats.found}</p>
                        </div>
                        <div className="bg-secondary-100 p-4 rounded-full">
                            <FaSearch className="text-3xl text-secondary-600" />
                        </div>
                    </div>
                </div>

                <div className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-semibold mb-1">Total Matches</p>
                            <p className="text-4xl font-bold text-green-600">{stats.matches}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-full">
                            <FaCheckCircle className="text-3xl text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <Link
                    to="/report-lost"
                    className="card p-8 hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200"
                >
                    <h3 className="text-2xl font-bold text-primary-700 mb-2">Report Lost Person</h3>
                    <p className="text-gray-600">Submit a report for a missing person with photo and details</p>
                </Link>

                <Link
                    to="/report-found"
                    className="card p-8 hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-secondary-50 to-secondary-100 border-2 border-secondary-200"
                >
                    <h3 className="text-2xl font-bold text-secondary-700 mb-2">Report Found Person</h3>
                    <p className="text-gray-600">Report a found person and trigger automatic face matching</p>
                </Link>
            </div>

            {/* Recent Lost Reports */}
            <div className="card p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Recent Lost Reports</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Age</th>
                                <th className="p-3 text-left">Location</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lostReports.map((report) => (
                                <tr key={report._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{report.personName}</td>
                                    <td className="p-3">{report.age}</td>
                                    <td className="p-3">{report.locationLost}</td>
                                    <td className="p-3">
                                        <span className={`badge-${report.status}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button className="text-primary-600 hover:text-primary-800 mx-1">
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Found Reports */}
            <div className="card p-6">
                <h2 className="text-2xl font-bold mb-4">Recent Found Reports</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-3 text-left">Location</th>
                                <th className="p-3 text-left">Date Found</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foundReports.map((report) => (
                                <tr key={report._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{report.foundLocation}</td>
                                    <td className="p-3">{new Date(report.foundDate).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <span className={`badge-${report.status}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button className="text-primary-600 hover:text-primary-800 mx-1">
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
