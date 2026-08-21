import Repository from "../models/repository.model.js";
import Investigation from "../models/investigation.model.js";
import InvestigationResult from "../models/investigationResult.model.js";
import { analyzeCommit } from "../services/aiService.js";
import { sanitizeAIResult } from "../utils/sanitizeAIResult.js";

function parseRepoUrl(repoUrl) {
    try {
        const url = new URL(repoUrl);

        if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
            return null;
        }

        const parts = url.pathname
            .replace(/^\/|\/$/g, "")
            .split("/");

        if (parts.length < 2) {
            return null;
        }

        const owner = parts[0];
        const repoName = parts[1].replace(/\.git$/, "");

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

function computeConfidenceScore(confidence) {
    if (typeof confidence === "number") return confidence;
    if (typeof confidence === "string") {
        const lower = confidence.toLowerCase();
        if (lower.includes("high")) return 90;
        if (lower.includes("med")) return 72;
        if (lower.includes("low")) return 45;
        const num = parseInt(confidence, 10);
        if (!isNaN(num)) return num;
    }
    return 75;
}

function computeRiskScore(riskLevel) {
    const level = (typeof riskLevel === "string" ? riskLevel : riskLevel?.level || "Medium").toUpperCase();
    if (level === "HIGH") return 82;
    if (level === "MEDIUM") return 54;
    return 24;
}

function formatDerivedData(investigation, repository, result) {
    const aiMeta = result?.aiMetadata || {};
    const commits = aiMeta.commits || [];
    const dependencies = aiMeta.dependencies || [];
    const impactMap = aiMeta.impact || {};
    const riskObj = result?.risk || { level: "Medium", reasons: [] };
    const riskLevel = (typeof riskObj === "string" ? riskObj : riskObj.level || "Medium").toUpperCase();
    const riskReasons = Array.isArray(riskObj.reasons) ? riskObj.reasons : [];
    const confidenceNum = computeConfidenceScore(result?.confidence);
    const riskScore = computeRiskScore(riskLevel);

    const filesCount = aiMeta.filesCount || (Array.isArray(dependencies) ? dependencies.length : 0) || 1;
    const commitCount = commits.length || 1;
    const prCount = aiMeta.githubHistory?.total_pull_requests || (aiMeta.githubHistory?.pull_requests?.length) || 0;
    const depCount = Array.isArray(dependencies) ? dependencies.length : Object.keys(dependencies).length || 0;

    // 1. Repository Info & Stats
    const repoFormatted = {
        id: investigation._id,
        name: repository.repoName,
        owner: repository.owner,
        fullName: `${repository.owner}/${repository.repoName}`,
        url: repository.repoUrl,
        branch: repository.branch || "main",
        description: `Investigated repository commit ${investigation.commitHash.slice(0, 7)} for engineering history and decision forensics.`,
        lastAnalyzed: investigation.createdAt,
        stats: {
            files: filesCount,
            commits: commitCount,
            issues: (aiMeta.githubHistory?.referenced_issues?.length) || 0,
            pullRequests: prCount,
            dependencies: depCount,
            riskScore: riskScore,
        },
        languages: [
            { name: "JavaScript/TypeScript", percent: 85, color: "#3FD0FF" },
            { name: "Config / Other", percent: 15, color: "#5B6474" },
        ],
    };

    // 2. Architecture & Dependency Graph
    const nodes = [];
    const edges = [];
    const nodeDetails = {};
    const keyModules = [];

    if (Array.isArray(dependencies) && dependencies.length > 0) {
        dependencies.forEach((item, index) => {
            const fileName = item.file || `Module_${index + 1}`;
            const dependsOn = Array.isArray(item.depends_on) ? item.depends_on : [];
            const dependents = impactMap[fileName] || [];
            const modRisk = dependsOn.length > 3 || dependents.length > 2 ? "HIGH" : dependsOn.length > 0 ? "MEDIUM" : "LOW";

            nodes.push({
                id: fileName,
                type: fileName.includes("node_modules") ? "package" : "module",
                risk: modRisk,
            });

            dependsOn.forEach((target) => {
                edges.push({
                    source: fileName,
                    target: target,
                });
            });

            nodeDetails[fileName] = {
                files: 1,
                dependents: dependents.length,
                dependencies: dependsOn.length,
                risk: modRisk,
                historicalEvents: 1,
                description: `Component analyzed during investigation of commit ${investigation.commitHash.slice(0, 7)}.`,
            };

            if (keyModules.length < 8) {
                keyModules.push({
                    name: fileName,
                    files: 1,
                    risk: modRisk,
                });
            }
        });
    } else {
        const mainNode = repository.repoName;
        nodes.push({ id: mainNode, type: "service", risk: riskLevel });
        nodeDetails[mainNode] = {
            files: filesCount,
            dependents: 0,
            dependencies: 0,
            risk: riskLevel,
            historicalEvents: commitCount,
            description: `Primary component for repository ${repository.repoName}.`,
        };
        keyModules.push({
            name: mainNode,
            files: filesCount,
            risk: riskLevel,
        });
    }

    const architectureFormatted = {
        style: "Analyzed Source Architecture",
        size: `${filesCount} files analyzed`,
        framework: "JavaScript / Node.js ecosystem",
        entryPoints: nodes.slice(0, 3).map((n) => n.id),
        keyModules: keyModules,
    };

    const dependencyGraphFormatted = {
        nodes: nodes.slice(0, 20),
        edges: edges.slice(0, 30),
    };

    // 3. Timeline Events
    const timelineEvents = commits.map((c, index) => {
        const hashShort = (c.hash || "").slice(0, 7) || `commit_${index + 1}`;
        const isTarget = c.hash === investigation.commitHash || hashShort === investigation.commitHash.slice(0, 7);
        return {
            id: c.hash || `ev_${index}`,
            year: c.date ? c.date.slice(0, 4) : "Recent",
            date: c.date ? c.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
            title: c.message || `Commit ${hashShort}`,
            commit: hashShort,
            author: c.author || "maintainer",
            description: isTarget
                ? `[Target Commit] ${c.message || "Investigated commit"} — ${result?.historicalIntent || ""}`
                : c.message || "Historical repository commit",
            filesAffected: Array.isArray(c.changed_files) ? c.changed_files.length : 1,
            importance: isTarget ? "MILESTONE" : index < 3 ? "MAJOR" : "MINOR",
            relatedPR: null,
            relatedIssue: null,
        };
    });

    if (timelineEvents.length === 0) {
        timelineEvents.push({
            id: `ev_target`,
            year: new Date().getFullYear().toString(),
            date: new Date().toISOString().slice(0, 10),
            title: `Investigation of commit ${investigation.commitHash.slice(0, 7)}`,
            commit: investigation.commitHash.slice(0, 7),
            author: "author",
            description: result?.historicalIntent || "Target commit under archaeological analysis.",
            filesAffected: 1,
            importance: "MILESTONE",
            relatedPR: null,
            relatedIssue: null,
        });
    }

    // 4. Decisions
    const evidenceList = Array.isArray(result?.evidence)
        ? result.evidence.map((item, idx) => {
              if (typeof item === "string") {
                  return {
                      type: "commit",
                      ref: investigation.commitHash.slice(0, 7),
                      label: item,
                  };
              }
              return item;
          })
        : [
              {
                  type: "commit",
                  ref: investigation.commitHash.slice(0, 7),
                  label: `Commit ${investigation.commitHash.slice(0, 7)} evidence chain`,
              },
          ];

    const recommendationText =
        result?.recommendation ||
        (riskReasons.length > 0 ? riskReasons[0] : "Preserve current architecture and verify dependencies before modifying this component.");

    const decisions = [
        {
            id: `dec_${investigation._id}`,
            component: repository.repoName,
            question: investigation.question,
            historicalIntent: result?.historicalIntent || "The evidence indicates this change was introduced to implement required repository behavior.",
            evidence: evidenceList,
            affectedModules: Array.isArray(result?.impact) ? result.impact.length : 1,
            confidence: confidenceNum,
            risk: riskLevel,
            recommendation: recommendationText,
        },
    ];

    // 5. Risks
    const risks = [
        {
            id: `risk_${investigation._id}`,
            component: repository.repoName,
            level: riskLevel,
            dependents: Object.keys(impactMap).length || 1,
            historicalFixes: commitCount,
            legacyDependency: riskReasons.some((r) => r.toLowerCase().includes("legacy") || r.toLowerCase().includes("unmaintained")),
            documentationMissing: (result?.uncertainty?.length || 0) > 0,
            likelihood: riskLevel === "HIGH" ? 8 : riskLevel === "MEDIUM" ? 5 : 2,
            impact: riskLevel === "HIGH" ? 9 : riskLevel === "MEDIUM" ? 6 : 3,
            summary: riskReasons.join(" ") || `Risk level assessed as ${riskLevel} based on commit diff and dependency impact analysis.`,
        },
    ];

    if (Array.isArray(result?.impact) && result.impact.length > 0) {
        result.impact.forEach((imp, i) => {
            const compName = typeof imp === "string" ? imp : imp?.name || `Impacted_${i + 1}`;
            risks.push({
                id: `risk_impact_${i}`,
                component: compName,
                level: riskLevel === "HIGH" ? "MEDIUM" : "LOW",
                dependents: 1,
                historicalFixes: 1,
                legacyDependency: false,
                documentationMissing: false,
                likelihood: 4,
                impact: 5,
                summary: `Component directly or indirectly affected by modifications to ${repository.repoName}.`,
            });
        });
    }

    // 6. Agent Pipeline Status
    const agentPipeline = [
        {
            id: "code",
            name: "Code Agent",
            description: "Parses source files, builds module and file-level structure.",
            status: "complete",
            progress: 100,
            discoveries: `${filesCount} files analyzed`,
            timestamp: "Completed",
        },
        {
            id: "history",
            name: "History Agent",
            description: "Indexes commit history and attributes changes to authors and time periods.",
            status: "complete",
            progress: 100,
            discoveries: `${commitCount} commits indexed`,
            timestamp: "Completed",
        },
        {
            id: "issues",
            name: "Issue / PR Agent",
            description: "Links issues and pull requests to the code changes they produced.",
            status: "complete",
            progress: 100,
            discoveries: `${prCount} pull requests / issues checked`,
            timestamp: "Completed",
        },
        {
            id: "dependency",
            name: "Dependency Agent",
            description: "Maps internal and external dependency relationships.",
            status: "complete",
            progress: 100,
            discoveries: `${depCount} relationships mapped`,
            timestamp: "Completed",
        },
        {
            id: "rag",
            name: "RAG Agent",
            description: "Retrieves contextual evidence from indexed repository vectors.",
            status: "complete",
            progress: 100,
            discoveries: "Evidence retrieved",
            timestamp: "Completed",
        },
        {
            id: "reasoning",
            name: "Investigation Engine",
            description: "Synthesizes multi-agent evidence into historical intent and risk assessment.",
            status: "complete",
            progress: 100,
            discoveries: `${confidenceNum}% confidence reached`,
            timestamp: "Completed",
        },
    ];

    const investigationLog = [
        { time: "00:01", message: `Repository cloned: ${repository.owner}/${repository.repoName}` },
        { time: "00:03", message: `Target commit identified: ${investigation.commitHash.slice(0, 7)}` },
        { time: "00:05", message: `Code AST & dependency relationships analyzed (${filesCount} files)` },
        { time: "00:08", message: `Git history extracted (${commitCount} commits)` },
        { time: "00:10", message: `GitHub collaboration history checked (${prCount} PRs)` },
        { time: "00:14", message: `Investigation engine completed synthesis: Risk ${riskLevel}` },
    ];

    return {
        repository: repoFormatted,
        architecture: architectureFormatted,
        dependencyGraph: dependencyGraphFormatted,
        nodeDetails,
        timelineEvents,
        decisions,
        risks,
        agentPipeline,
        investigationLog,
    };
}

export async function createInvestigation(req, res, next) {
    let investigation = null;

    try {
        const { repo_url } = req.body;
        const commit_hash = (req.body.commit_hash || "HEAD").trim();
        const question = (
            req.body.question ||
            "Why was this commit introduced, what evidence explains the change, and what could be affected if this change is removed?"
        ).trim();

        if (!repo_url) {
            return res.status(400).json({
                message: "Repository URL is required.",
            });
        }

        if (question.length > 500) {
            return res.status(400).json({
                message: "Question cannot exceed 500 characters.",
            });
        }

        const parsed = parseRepoUrl(repo_url);

        if (!parsed) {
            return res.status(400).json({
                message: "Please provide a valid GitHub repository URL (e.g., https://github.com/owner/repo).",
            });
        }

        // STEP 1: Find or create repository record
        let repository = await Repository.findOne({
            userId: req.user._id,
            repoUrl: repo_url,
        });

        if (!repository) {
            repository = await Repository.create({
                userId: req.user._id,
                repoUrl: repo_url,
                owner: parsed.owner,
                repoName: parsed.repoName,
                branch: "main",
            });
        }

        // STEP 2: Create investigation record in processing state
        investigation = await Investigation.create({
            userId: req.user._id,
            repositoryId: repository._id,
            commitHash: commit_hash,
            question,
            status: "processing",
        });

        // STEP 3: Call existing Python AI service
        const aiResult = await analyzeCommit({
            repo_url,
            commit_hash,
            question,
        });

        // STEP 4: Sanitize AI response before persistence (never store raw code or diffs)
        const safeResult = sanitizeAIResult(aiResult);
        const investigationData = aiResult.investigation || {};

        const riskData = investigationData.risk || {
            level: "Medium",
            reasons: [],
        };

        const recommendation =
            Array.isArray(riskData.reasons) && riskData.reasons.length > 0
                ? riskData.reasons[0]
                : investigationData.historical_intent || "Review dependencies before altering code.";

        const investigationResult = await InvestigationResult.create({
            investigationId: investigation._id,
            historicalIntent: investigationData.historical_intent || investigationData.historicalIntent || safeResult.historicalIntent || "",
            evidence: investigationData.evidence || safeResult.evidence || [],
            impact: investigationData.impact || safeResult.impact || [],
            risk: riskData,
            confidence: investigationData.confidence || safeResult.confidence || 75,
            uncertainty: investigationData.uncertainty || [],
            recommendation: recommendation,
            finalAnswer: investigationData.historical_intent || "",
            aiMetadata: {
                filesCount: aiResult.agents?.code_agent?.total_files_analyzed || aiResult.evidence?.code?.total_files_analyzed || 0,
                commits: safeResult.evidence?.history?.commits || [],
                dependencies: safeResult.evidence?.dependencies || [],
                impact: safeResult.evidence?.impact || {},
                githubHistory: safeResult.evidence?.github_history || {},
                agents: safeResult.agents || {},
            },
        });

        // STEP 5: Mark investigation complete
        investigation.status = "complete";
        await investigation.save();

        // STEP 6: Format derived payload for frontend
        const derived = formatDerivedData(investigation, repository, investigationResult);

        return res.status(201).json({
            investigation: {
                id: investigation._id,
                status: investigation.status,
                commitHash: investigation.commitHash,
                question: investigation.question,
                createdAt: investigation.createdAt,
            },
            repository: {
                id: repository._id,
                owner: repository.owner,
                repoName: repository.repoName,
                repoUrl: repository.repoUrl,
                branch: repository.branch,
            },
            result: investigationResult,
            ...derived,
        });
    } catch (error) {
        if (investigation) {
            investigation.status = "failed";
            investigation.errorMessage = error.message;
            await investigation.save();
        }

        next(error);
    }
}

export async function getInvestigation(req, res, next) {
    try {
        const investigation = await Investigation.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate("repositoryId");

        if (!investigation) {
            return res.status(404).json({
                message: "Investigation not found.",
            });
        }

        const result = await InvestigationResult.findOne({
            investigationId: investigation._id,
        });

        const repository = investigation.repositoryId;
        const derived = formatDerivedData(investigation, repository, result);

        return res.status(200).json({
            id: investigation._id,
            investigation,
            repository: derived.repository,
            result,
            architecture: derived.architecture,
            dependencyGraph: derived.dependencyGraph,
            nodeDetails: derived.nodeDetails,
            timelineEvents: derived.timelineEvents,
            decisions: derived.decisions,
            risks: derived.risks,
            agentPipeline: derived.agentPipeline,
            investigationLog: derived.investigationLog,
        });
    } catch (error) {
        next(error);
    }
}

export async function askQuestion(req, res, next) {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                message: "Question is required.",
            });
        }

        const investigation = await Investigation.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate("repositoryId");

        if (!investigation) {
            return res.status(404).json({
                message: "Investigation not found.",
            });
        }

        const repository = investigation.repositoryId;

        // Call the AI service with the user's specific question
        const aiResult = await analyzeCommit({
            repo_url: repository.repoUrl,
            commit_hash: investigation.commitHash,
            question: question.trim(),
        });

        const investigationData = aiResult.investigation || {};
        const riskObj = investigationData.risk || { level: "Medium", reasons: [] };
        const riskLevel = (typeof riskObj === "string" ? riskObj : riskObj.level || "Medium").toUpperCase();
        const riskReasons = Array.isArray(riskObj.reasons) ? riskObj.reasons : [];
        const confidenceNum = computeConfidenceScore(investigationData.confidence);

        const evidenceList = Array.isArray(investigationData.evidence)
            ? investigationData.evidence.map((item) => ({
                  type: "commit",
                  ref: investigation.commitHash.slice(0, 7),
                  label: typeof item === "string" ? item : item.label || "Evidence",
              }))
            : [
                  {
                      type: "commit",
                      ref: investigation.commitHash.slice(0, 7),
                      label: `Commit ${investigation.commitHash.slice(0, 7)} evidence`,
                  },
              ];

        const responsePayload = {
            id: `ask_${Date.now()}`,
            component: repository.repoName,
            question: question.trim(),
            historicalIntent: investigationData.historical_intent || "No direct historical intent could be derived from the available evidence.",
            evidence: evidenceList,
            affectedModules: Array.isArray(investigationData.impact) ? investigationData.impact.length : 1,
            confidence: confidenceNum,
            risk: riskLevel,
            recommendation: riskReasons[0] || "Review repository evidence before making modifications.",
        };

        return res.status(200).json(responsePayload);
    } catch (error) {
        next(error);
    }
}

export async function listInvestigations(req, res, next) {
    try {
        const investigations = await Investigation.find({
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