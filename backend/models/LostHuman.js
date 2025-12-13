import mongoose from 'mongoose';

const lostHumanSchema = new mongoose.Schema(
    {
        personName: {
            type: String,
            required: [true, 'Please add the person\'s name'],
            trim: true,
        },
        age: {
            type: Number,
            required: [true, 'Please add the person\'s age'],
            min: 0,
        },
        gender: {
            type: String,
            required: [true, 'Please add gender'],
            enum: ['Male', 'Female', 'Other'],
        },
        locationLost: {
            type: String,
            required: [true, 'Please add the location where person was lost'],
            trim: true,
        },
        dateLost: {
            type: Date,
            required: [true, 'Please add the date when person was lost'],
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
            enum: ['pending', 'approved', 'found', 'rejected'],
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
lostHumanSchema.index({ status: 1, createdAt: -1 });
lostHumanSchema.index({ reportedBy: 1 });

const LostHuman = mongoose.model('LostHuman', lostHumanSchema);

export default LostHuman;
