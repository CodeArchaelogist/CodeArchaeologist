import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

export async function analyzeCommit({
    repo_url,
    commit_hash,
    question,
}) {
    const aiServiceUrl =
        process.env.AI_SERVICE_URL ;

    try {
        const response = await axios.post(
            `${aiServiceUrl}/analyze`,
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