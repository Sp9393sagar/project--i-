import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
    {
        lostId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LostHuman',
            required: true,
        },
        foundId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FoundHuman',
            required: true,
        },
        similarityScore: {
            type: Number,
            required: true,
            min: 0,
            max: 1,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'rejected'],
            default: 'pending',
        },
        matchedAt: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster querying
matchSchema.index({ lostId: 1, foundId: 1 }, { unique: true });
matchSchema.index({ status: 1, similarityScore: -1 });

const Match = mongoose.model('Match', matchSchema);

export default Match;
