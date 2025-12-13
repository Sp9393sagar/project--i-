import Match from '../models/Match.js';
import LostHuman from '../models/LostHuman.js';
import FoundHuman from '../models/FoundHuman.js';
import { compareFaces, isMatch as checkMatch } from '../utils/faceRecognition.js';


export const runManualMatching = async (req, res) => {
    try {
        // Get all approved lost and found persons with face descriptors
        const lostPersons = await LostHuman.find({
            status: 'approved',
            faceDescriptor: { $exists: true, $ne: null },
        });

        const foundPersons = await FoundHuman.find({
            status: 'approved',
            faceDescriptor: { $exists: true, $ne: null },
        });

        let matchesCreated = 0;

        // Compare each found person with each lost person
        for (const foundPerson of foundPersons) {
            for (const lostPerson of lostPersons) {
                // Compare faces
                const similarity = compareFaces(
                    foundPerson.faceDescriptor,
                    lostPerson.faceDescriptor
                );

                // If similarity exceeds threshold
                if (checkMatch(similarity)) {
                    // Check if match already exists
                    const existingMatch = await Match.findOne({
                        lostId: lostPerson._id,
                        foundId: foundPerson._id,
                    });

                    if (!existingMatch) {
                        await Match.create({
                            lostId: lostPerson._id,
                            foundId: foundPerson._id,
                            similarityScore: similarity,
                            status: 'pending',
                        });
                        matchesCreated++;
                    }
                }
            }
        }

        res.json({
            success: true,
            message: `Matching completed. ${matchesCreated} new matches found.`,
            data: {
                lostPersonsChecked: lostPersons.length,
                foundPersonsChecked: foundPersons.length,
                newMatches: matchesCreated,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMatchResults = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = status ? { status } : {};

        // If user is not admin, only show matches related to their reports
        if (req.user.role !== 'admin') {
            const userLostReports = await LostHuman.find({ reportedBy: req.user._id }).select('_id');
            const userFoundReports = await FoundHuman.find({ reportedBy: req.user._id }).select('_id');

            const lostIds = userLostReports.map(r => r._id);
            const foundIds = userFoundReports.map(r => r._id);

            query.$or = [
                { lostId: { $in: lostIds } },
                { foundId: { $in: foundIds } },
            ];
        }

        const matches = await Match.find(query)
            .populate({
                path: 'lostId',
                populate: { path: 'reportedBy', select: 'name email phone' },
            })
            .populate({
                path: 'foundId',
                populate: { path: 'reportedBy', select: 'name email phone' },
            })
            .sort({ similarityScore: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Match.countDocuments(query);

        res.json({
            success: true,
            data: matches,
            pagination: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate({
                path: 'lostId',
                populate: { path: 'reportedBy', select: 'name email phone' },
            })
            .populate({
                path: 'foundId',
                populate: { path: 'reportedBy', select: 'name email phone' },
            });

        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found',
            });
        }

        res.json({
            success: true,
            data: match,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateMatchStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;

        const match = await Match.findByIdAndUpdate(
            req.params.id,
            { status, notes },
            { new: true, runValidators: true }
        );

        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found',
            });
        }

        
        if (status === 'confirmed') {
            await LostHuman.findByIdAndUpdate(match.lostId, { status: 'found' });
            await FoundHuman.findByIdAndUpdate(match.foundId, { status: 'matched' });
        }

        res.json({
            success: true,
            data: match,
            message: 'Match status updated',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndDelete(req.params.id);

        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found',
            });
        }

        res.json({
            success: true,
            message: 'Match deleted',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
