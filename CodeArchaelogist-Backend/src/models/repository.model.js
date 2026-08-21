import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },

        repoUrl: {
            type: String,
            required: [true, "Repository URL is required"],
            trim: true,
        },

        owner: {
            type: String,
            required: true,
            trim: true,
        },

        repoName: {
            type: String,
            required: true,
            trim: true,
        },

        branch: {
            type: String,
            default: "main",
            trim: true,
        },
    },

    {
        timestamps: true,
    }
);

repositorySchema.index(
    {
        userId: 1,
        repoUrl: 1,
    },
    {
        unique: true,
    }
);

const Repository =
    mongoose.models.Repository ||
    mongoose.model("Repository", repositorySchema);

export default Repository;