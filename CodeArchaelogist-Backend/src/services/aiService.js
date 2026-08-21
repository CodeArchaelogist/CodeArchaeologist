import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export async function analyzeCommit({
    repo_url,
    commit_hash,
    question,
}) {
    const aiServiceUrl = process.env.AI_SERVICE_URL;

    if (!aiServiceUrl) {
        const error = new Error(
            "AI_SERVICE_URL is not configured."
        );

        error.statusCode = 500;
        throw error;
    }

    try {
        const response = await axios.post(
            `${aiServiceUrl.replace(/\/$/, "")}/analyze`,
            {
                repo_url,
                commit_hash,
                question,
            },
            {
                timeout: 180000,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "AI SERVICE ERROR:",
            error.response?.data || error.message
        );

        // AI service is not running / unreachable
        if (
            error.code === "ECONNREFUSED" ||
            error.code === "ECONNABORTED" ||
            error.code === "ETIMEDOUT"
        ) {
            const err = new Error(
                "AI service is unavailable or timed out."
            );

            err.statusCode = 503;
            throw err;
        }

        // AI service itself returned an error
        if (error.response) {
            const err = new Error(
                error.response.data?.detail ||
                error.response.data?.message ||
                "AI service returned an error."
            );

            err.statusCode =
                error.response.status >= 400
                    ? error.response.status
                    : 502;

            throw err;
        }

        const err = new Error(
            "Failed to reach the AI service."
        );

        err.statusCode = 502;
        throw err;
    }
}