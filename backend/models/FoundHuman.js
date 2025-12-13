import mongoose from 'mongoose';

const foundHumanSchema = new mongoose.Schema(
    {
        foundLocation: {
            type: String,
            required: [true, 'Please add the location where person was found'],
            trim: true,
        },
        foundDate: {
            type: Date,
            required: [true, 'Please add the date when person was found'],
        },
        photoURL: {
            type: String,
            required: [true, 'Please upload a photo'],
        },
        publicId: {
            type: String, // Cloudinary public ID for deletion
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            trim: true,
        },
        estimatedAge: {
            type: Number,
            min: 0,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'Unknown'],
            default: 'Unknown',
        },
        contactInfo: {
            phone: {
                type: String,
                required: [true, 'Please add contact phone'],
            },
            email: {
                type: String,
            },
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'matched', 'rejected'],
            default: 'pending',
        },
        faceDescriptor: {
            type: [Number], // Face embedding array from face-api.js
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster searching
foundHumanSchema.index({ status: 1, createdAt: -1 });
foundHumanSchema.index({ reportedBy: 1 });

const FoundHuman = mongoose.model('FoundHuman', foundHumanSchema);

export default FoundHuman;
