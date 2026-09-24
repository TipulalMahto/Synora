import mongoose from 'mongoose'

const ProposalSchema = new mongoose.Schema(
    {
        reportId: { type: String, required: true, index: true },
        type: { type: String, enum: ['interest', 'solution', 'collaboration'], default: 'interest' },
        message: String,
        authorRole: { type: String, required: true }, // university | industry
        authorEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
        authorName: String,
        org: String,
        status: { type: String, enum: ['proposed', 'accepted', 'rejected'], default: 'proposed', index: true },
        createdAt: String,
        updatedAt: String,
    },
    { minimize: false },
)

ProposalSchema.set('toJSON', {
    transform: (_doc, ret) => { delete ret._id; delete ret.__v; return ret },
})

export const Proposal = mongoose.model('Proposal', ProposalSchema)