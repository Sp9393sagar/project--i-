import LostHuman from '../models/LostHuman.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import { extractFaceDescriptor } from '../utils/faceRecognition.js';


export const reportLost = async (req, res) => {
    try {
        const { personName, age, gender, locationLost, dateLost, description, contactInfo } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a photo',
            });
        }

        let photoURL = '';
        let publicId = '';

        // Upload to Cloudinary if configured, otherwise use local path
        if (process.env.CLOUDINARY_CLOUD_NAME) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'lost-found/lost',
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

        // Create lost person report
        const lostPerson = await LostHuman.create({
            personName,
            age,
            gender,
            locationLost,
            dateLost,
            photoURL,
            publicId,
            description,
            contactInfo: parsedContactInfo,
            reportedBy: req.user._id,
            faceDescriptor: Array.from(faceDescriptor),
        });

        // Delete local file after processing
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(201).json({
            success: true,
            data: lostPerson,
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

export const getLostPersons = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = status ? { status } : {};

        const lostPersons = await LostHuman.find(query)
            .populate('reportedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await LostHuman.countDocuments(query);

        res.json({
            success: true,
            data: lostPersons,
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

// @desc    Get single lost person
// @route   GET /api/lost/:id
// @access  Public
export const getLostPerson = async (req, res) => {
    try {
        const lostPerson = await LostHuman.findById(req.params.id).populate(
            'reportedBy',
            'name email phone'
        );

        if (!lostPerson) {
            return res.status(404).json({
                success: false,
                message: 'Lost person not found',
            });
        }

        res.json({
            success: true,
            data: lostPerson,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update lost person report
// @route   PUT /api/lost/:id
// @access  Private
export const updateLostPerson = async (req, res) => {
    try {
        let lostPerson = await LostHuman.findById(req.params.id);

        if (!lostPerson) {
            return res.status(404).json({
                success: false,
                message: 'Lost person not found',
            });
        }

        // Check ownership
        if (lostPerson.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this report',
            });
        }

        lostPerson = await LostHuman.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: lostPerson,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete lost person report
// @route   DELETE /api/lost/:id
// @access  Private
export const deleteLostPerson = async (req, res) => {
    try {
        const lostPerson = await LostHuman.findById(req.params.id);

        if (!lostPerson) {
            return res.status(404).json({
                success: false,
                message: 'Lost person not found',
            });
        }

        // Check ownership
        if (lostPerson.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this report',
            });
        }

        // Delete from cloudinary if exists
        if (lostPerson.publicId && process.env.CLOUDINARY_CLOUD_NAME) {
            try {
                await cloudinary.uploader.destroy(lostPerson.publicId);
            } catch (error) {
                console.error('Error deleting from Cloudinary:', error);
            }
        }

        await lostPerson.deleteOne();

        res.json({
            success: true,
            message: 'Lost person report deleted',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
