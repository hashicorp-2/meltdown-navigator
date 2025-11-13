import mongoose, { Schema } from 'mongoose';
const SupportContactSchema = new Schema({
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true },
    contactMethod: {
        type: String,
        enum: ['sms', 'email', 'call'],
        required: true,
    },
}, { _id: false });
const AiProfileSchema = new Schema({
    userId: { type: String, required: true, index: true },
    preferredName: { type: String, required: true, trim: true },
    supportCircle: {
        type: [SupportContactSchema],
        default: [],
        validate: [
            {
                validator: (arr) => arr.length <= 5,
                message: 'Support circle cannot exceed five contacts.',
            },
            {
                validator: (arr) => {
                    const seen = new Set();
                    return arr.every((contact) => {
                        const key = `${contact.name?.trim().toLowerCase()}::${contact.relationship?.trim().toLowerCase()}`;
                        if (seen.has(key)) {
                            return false;
                        }
                        seen.add(key);
                        return true;
                    });
                },
                message: 'Support circle contains duplicate contacts.',
            },
        ],
    },
    communicationGuidelines: {
        tone: {
            type: String,
            enum: ['soft', 'direct', 'informative'],
            default: 'soft',
        },
        doPhrases: { type: [String], default: [] },
        avoidPhrases: { type: [String], default: [] },
    },
    crisisSignals: {
        triggers: { type: [String], default: [] },
        escalationIndicators: { type: [String], default: [] },
        selfRegulationTechniques: { type: [String], default: [] },
    },
}, {
    timestamps: true,
    collection: 'ai_profiles',
});
export const AiProfileModel = mongoose.model('AiProfile', AiProfileSchema);
//# sourceMappingURL=AiProfile.js.map