import User from '../models/User.js';
import LostHuman from '../models/LostHuman.js';
import FoundHuman from '../models/FoundHuman.js';
import Match from '../models/Match.js';


export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalLost = await LostHuman.countDocuments();
        const totalFound = await FoundHuman.countDocuments();
        const totalMatches = await Match.countDocuments();

        const pendingLost = await LostHuman.countDocuments({ status: 'pending' });
        const pendingFound = await FoundHuman.countDocuments({ status: 'pending' });
        const approvedLost = await LostHuman.countDocuments({ status: 'approved' });
        const approvedFound = await FoundHuman.countDocuments({ status: 'approved' });

        const pendingMatches = await Match.countDocuments({ status: 'pending' });
        const confirmedMatches = await Match.countDocuments({ status: 'confirmed' });

        res.json({
            success: true,
            data: {
                users: totalUsers,
                lostReports: totalLost,
                foundReports: totalFound,
                matches: totalMatches,
                pending: {
                    lost: pendingLost,
                    found: pendingFound,
                    matches: pendingMatches,
                },
                approved: {
                    lost: approvedLost,
                    found: approvedFound,
                },
                confirmedMatches,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getAllReports = async (req, res) => {
    try {
        const lostReports = await LostHuman.find()
            .populate('reportedBy', 'name email')
            .sort({ createdAt: -1 });

        const foundReports = await FoundHuman.find()
            .populate('reportedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                lost: lostReports,
                found: foundReports,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const approveLostReport = async (req, res) => {
    try {
        const lostPerson = await LostHuman.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );

        if (!lostPerson) {
            return res.status(404).json({
                success: false,
                message: 'Lost person report not found',
            });
        }

        res.json({
            success: true,
            data: lostPerson,
            message: 'Lost person report approved',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const rejectLostReport = async (req, res) => {
    try {
        const lostPerson = await LostHuman.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );

        if (!lostPerson) {
            return res.status(404).json({
                success: false,
                message: 'Lost person report not found',
            });
        }

        res.json({
            success: true,
            data: lostPerson,
            message: 'Lost person report rejected',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const approveFoundReport = async (req, res) => {
    try {
        const foundPerson = await FoundHuman.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );

        if (!foundPerson) {
            return res.status(404).json({
                success: false,
                message: 'Found person report not found',
            });
        }

        res.json({
            success: true,
            data: foundPerson,
            message: 'Found person report approved',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const rejectFoundReport = async (req, res) => {
    try {
        const foundPerson = await FoundHuman.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );

        if (!foundPerson) {
            return res.status(404).json({
                success: false,
                message: 'Found person report not found',
            });
        }

        res.json({
            success: true,
            data: foundPerson,
            message: 'Found person report rejected',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const deleteReport = async (req, res) => {
    try {
        const { type, id } = req.params;

        let report;
        if (type === 'lost') {
            report = await LostHuman.findByIdAndDelete(id);
        } else if (type === 'found') {
            report = await FoundHuman.findByIdAndDelete(id);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid report type',
            });
        }

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found',
            });
        }

        res.json({
            success: true,
            message: 'Report deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account',
            });
        }

        await user.deleteOne();

        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
