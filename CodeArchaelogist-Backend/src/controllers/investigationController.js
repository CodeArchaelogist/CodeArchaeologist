import Repository from "../models/repository.model.js";
import Investigation from "../models/investigation.model.js";
import InvestigationResult from "../models/investigationResult.model.js";

import { analyzeCommit } from "../services/aiService.js";

import { sanitizeAIResult } from "../utils/sanitizeAIResult.js";

function parseRepoUrl(repoUrl) {
    try {
        const url = new URL(repoUrl);

        if (url.hostname !== "github.com") {
            return null;
        }

        const parts = url.pathname
            .replace(/^\/|\/$/g, "")
            .split("/");

        if (parts.length < 2) {
            return null;
        }

        const owner = parts[0];

        const repoName = parts[1]
            .replace(/\.git$/, "");

        if (!owner || !repoName) {
            return null;
        }

        return {
            owner,
            repoName,
        };
    } catch {
        return null;
    }
}

export async function createInvestigation(
    req,
    res,
    next
) {
    let investigation = null;

    try {
        const {
            repo_url,
            commit_hash,
            question,
        } = req.body;

        if (
            !repo_url ||
            !commit_hash ||
            !question
        ) {
            return res.status(400).json({
                message:
                    "repo_url, commit_hash, and question are all required.",
            });
        }

        if (question.length > 500) {
            return res.status(400).json({
                message:
                    "Question cannot exceed 500 characters.",
            });
        }

        const parsed =
            parseRepoUrl(repo_url);

        if (!parsed) {
            return res.status(400).json({
                message:
                    "Please provide a valid GitHub repository URL.",
            });
        }

        /*
         * STEP 1
         * Find or create repository metadata.
         *
         * IMPORTANT:
         * No repository files are stored.
         */
        let repository =
            await Repository.findOne({
                userId: req.user._id,
                repoUrl: repo_url,
            });

        if (!repository) {
            repository =
                await Repository.create({
                    userId: req.user._id,
                    repoUrl: repo_url,
                    owner: parsed.owner,
                    repoName: parsed.repoName,
                    branch: "main",
                });
        }

        /*
         * STEP 2
         * Create investigation record.
         */
        investigation =
            await Investigation.create({
                userId: req.user._id,
                repositoryId: repository._id,
                commitHash: commit_hash,
                question,
                status: "processing",
            });

        /*
         * STEP 3
         * Send request to Python AI service.
         */
        const aiResult =
            await analyzeCommit({
                repo_url,
                commit_hash,
                question,
            });

        /*
         * STEP 4
         * Sanitize the AI response before persistence.
         *
         * The full AI response can still be returned
         * to the frontend.
         *
         * MongoDB gets only safe information.
         */
        const safeResult =
            sanitizeAIResult(aiResult);

        const investigationData =
            aiResult.investigation || {};

        const investigationResult =
            await InvestigationResult.create({
                investigationId:
                    investigation._id,

                historicalIntent:
                    investigationData.historicalIntent ||
                    aiResult.historicalIntent ||
                    "",

                evidence:
                    safeResult.evidence ||
                    [],

                impact:
                    investigationData.impact ||
                    safeResult.impact ||
                    null,

                risk:
                    investigationData.risk ||
                    safeResult.risk ||
                    "UNKNOWN",

                confidence:
                    investigationData.confidence ??
                    safeResult.confidence ??
                    0,

                finalAnswer:
                    investigationData.finalAnswer ||
                    safeResult.finalAnswer ||
                    "",
            });

        /*
         * STEP 5
         * Mark investigation complete.
         */
        investigation.status =
            "complete";

        await investigation.save();

        /*
         * STEP 6
         * Return everything needed by React.
         */
        return res.status(201).json({
            investigation: {
                id: investigation._id,
                status: investigation.status,
                commitHash:
                    investigation.commitHash,
                question:
                    investigation.question,
                createdAt:
                    investigation.createdAt,
            },

            repository: {
                id: repository._id,
                owner: repository.owner,
                repoName:
                    repository.repoName,
                repoUrl:
                    repository.repoUrl,
                branch:
                    repository.branch,
            },

            result: investigationResult,

            ai: aiResult,
        });
    } catch (error) {
        if (investigation) {
            investigation.status = "failed";

            investigation.errorMessage =
                error.message;

            await investigation.save();
        }

        next(error);
    }
}

export async function getInvestigation(
    req,
    res,
    next
) {
    try {
        const investigation =
            await Investigation.findOne({
                _id: req.params.id,
                userId: req.user._id,
            }).populate("repositoryId");

        if (!investigation) {
            return res.status(404).json({
                message:
                    "Investigation not found.",
            });
        }

        const result =
            await InvestigationResult.findOne({
                investigationId:
                    investigation._id,
            });

        return res.status(200).json({
            investigation,
            result,
        });
    } catch (error) {
        next(error);
    }
}

export async function listInvestigations(
    req,
    res,
    next
) {
    try {
        const investigations =
            await Investigation.find({
                userId: req.user._id,
            })
                .sort({
                    createdAt: -1,
                })
                .populate("repositoryId")
                .limit(50)
                .lean();

        return res.status(200).json({
            investigations,
        });
    } catch (error) {
        next(error);
    }
}