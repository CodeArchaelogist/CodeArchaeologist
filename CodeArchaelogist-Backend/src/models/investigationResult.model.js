import mongoose from "mongoose";

const investigationResultSchema = new mongoose.Schema(
    {
        investigationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Investigation",
            required: true,
            index: true,
        },

        historicalIntent: {
            type: String,
            default: "",
        },

        evidence: {
            type: Array,
            default: [],
        },

        impact: {
            type: mongoose.Schema.Types.Mixed,
            default: [],
        },

        risk: {
            type: mongoose.Schema.Types.Mixed,
            default: () => ({
                level: "Medium",
                reasons: [],
            }),
        },

        confidence: {
            type: mongoose.Schema.Types.Mixed,
            default: 75,
        },

        uncertainty: {
            type: [String],
            default: [],
        },

        recommendation: {
            type: String,
            default: "",
        },

        finalAnswer: {
            type: String,
            default: "",
        },

        aiMetadata: {
            type: mongoose.Schema.Types.Mixed,
            default: () => ({}),
        },
    },
    {
        timestamps: true,
    }
);

const InvestigationResult =
    mongoose.models.InvestigationResult ||
    mongoose.model("InvestigationResult", investigationResultSchema);

export default InvestigationResult;