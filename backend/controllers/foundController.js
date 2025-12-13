import FoundHuman from '../models/FoundHuman.js';
import LostHuman from '../models/LostHuman.js';
import Match from '../models/Match.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import { extractFaceDescriptor, compareFaces, isMatch } from '../utils/faceRecognition.js';


export const reportFound = async (req, res) => {
    try {
        const { foundLocation, foundDate, description, estimatedAge, gender, contactInfo } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a photo',
            });
        }

        let photoURL = '';
        let publicId = '';

        // Upload to Cloudinary if configured
        if (process.env.CLOUDINARY_CLOUD_NAME) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'lost-found/found',
                });
                photoURL = result.secure_url;
                publicId = result.public_id;
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                photoURL = `/uploads/${req.file.filename}`;
            }
        } else {
            photoURL = `/uploads/${req.file.filename}`;
        }

        // Extract face descriptor
        const faceDescriptor = await extractFaceDescriptor(req.file.path);

        if (!faceDescriptor) {
            // Delete uploaded file
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                success: false,
                message: 'No face detected in the image. Please upload a clear photo with a visible face.',
            });
        }

        // Parse contact info if it's a string
        const parsedContactInfo = typeof contactInfo === 'string'
            ? JSON.parse(contactInfo)
            : contactInfo;

        // Create found person report
        const foundPerson = await FoundHuman.create({
            foundLocation,
            foundDate,
            photoURL,
            publicId,
            description,
            estimatedAge,
            gender,
            contactInfo: parsedContactInfo,
            reportedBy: req.user._id,
            faceDescriptor: Array.from(faceDescriptor),
        });

        // Delete local file after processing
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // Trigger automatic matching (async - don't wait for completion)
        matchFoundPersonWithLost(foundPerson._id).catch(err =>
            console.error('Background matching error:', err)
        );

        res.status(201).json({
            success: true,
            data: foundPerson,
            message: 'Found person reported. Matching process started in background.',
        });
    } catch (error) {
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//   Match found person with lost persons (background task)
const matchFoundPersonWithLost = async (foundPersonId) => {
    try {
        const foundPerson = await FoundHuman.findById(foundPersonId);
        if (!foundPerson || !foundPerson.faceDescriptor) {
            return;
        }

        // Get all approved lost persons with face descriptors
        const lostPersons = await LostHuman.find({
            status: 'approved',
            faceDescriptor: { $exists: true, $ne: null },
        });

        console.log(` Matching found person ${foundPersonId} against ${lostPersons.length} lost persons...`);

        for (const lostPerson of lostPersons) {
            // Compare faces
            const similarity = compareFaces(
                foundPerson.faceDescriptor,
                lostPerson.faceDescriptor
            );

            console.log(`Similarity with ${lostPerson.personName}: ${(similarity * 100).toFixed(2)}%`);

            
            if (isMatch(similarity)) {
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

                    console.log(` Match created: ${lostPerson.personName} (${(similarity * 100).toFixed(2)}%)`);
                }
            }
        }
    } catch (error) {
        console.error('Error in automatic matching:', error);
    }
};


export const getFoundPersons = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = status ? { status } : {};

        const foundPersons = await FoundHuman.find(query)
            .populate('reportedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await FoundHuman.countDocuments(query);

        res.json({
            success: true,
            data: foundPersons,
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


export const getFoundPerson = async (req, res) => {
    try {
        const foundPerson = await FoundHuman.findById(req.params.id).populate(
            'reportedBy',
            'name email phone'
        );

        if (!foundPerson) {
            return res.status(404).json({
                success: false,
                message: 'Found person not found',
            });
        }

        res.json({
            success: true,
            data: foundPerson,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const updateFoundPerson = async (req, res) => {
    try {
        let foundPerson = await FoundHuman.findById(req.params.id);

        if (!foundPerson) {
            return res.status(404).json({
                success: false,
                message: 'Found person not found',
            });
        }

        // Check ownership
        if (foundPerson.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this report',
            });
        }

        foundPerson = await FoundHuman.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: foundPerson,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const deleteFoundPerson = async (req, res) => {
    try {
        const foundPerson = await FoundHuman.findById(req.params.id);

        if (!foundPerson) {
            return res.status(404).json({
                success: false,
                message: 'Found person not found',
            });
        }

        // Check ownership
        if (foundPerson.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this report',
            });
        }

        // Delete from cloudinary if exists
        if (foundPerson.publicId && process.env.CLOUDINARY_CLOUD_NAME) {
            try {
                await cloudinary.uploader.destroy(foundPerson.publicId);
            } catch (error) {
                console.error('Error deleting from Cloudinary:', error);
            }
        }

        await foundPerson.deleteOne();

        res.json({
            success: true,
            message: 'Found person report deleted',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
