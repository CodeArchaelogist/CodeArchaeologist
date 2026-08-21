import mongoose from "mongoose";

const investigationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },

        repositoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repository",
            required: true,
            index: true,
        },

        commitHash: {
            type: String,
            required: true,
            trim: true,
        },

        question: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "complete",
                "failed",
            ],
            default: "pending",
        },

        errorMessage: {
            type: String,
            default: null,
        },
    },

    {
        timestamps: true,
    }
);

const Investigation =
    mongoose.models.Investigation ||
    mongoose.model("Investigation", investigationSchema);

export default Investigation;