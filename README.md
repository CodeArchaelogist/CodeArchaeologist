# CodeArchaeologist — AI-Powered Software Archaeology

<p align="center">
  <em>
    A full-stack multi-agent platform that investigates GitHub repositories,
    reconstructs the history behind engineering decisions, maps dependencies
    and risks, and turns forgotten software knowledge into actionable intelligence.
  </em>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js">
  <img alt="Express" src="https://img.shields.io/badge/Express.js-API-black?logo=express">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb">
  <img alt="Python" src="https://img.shields.io/badge/Python-AI%20Service-3776AB?logo=python">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-AI%20API-009688?logo=fastapi">
  <img alt="LangGraph" src="https://img.shields.io/badge/LangGraph-Agent%20Orchestration-111827">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/TailwindCSS-Styling-38BDF8?logo=tailwindcss">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker">
</p>

<p align="center">
  <strong>Don't just understand the code. Discover why it survived.</strong>
</p>

---

#  About

**CodeArchaeologist** is a full-stack, multi-agent AI platform designed to uncover the hidden history of software repositories.

Modern codebases contain years of engineering decisions, migrations, emergency fixes, workarounds, dependencies, issues, pull requests, and undocumented business rules.

The current code tells engineers **what the system does**.

But when developers inherit an unfamiliar codebase, the more important question is often:

> **Why was it built this way?**

CodeArchaeologist investigates both the **present state and historical evolution** of a repository to reconstruct the reasoning behind important engineering decisions.

Instead of treating a GitHub repository as a collection of files, CodeArchaeologist treats it as an evolving body of **software memory**.

---

## 📸 Screenshots

<table>
  <tr>
    <td width="50%"><img src="screenshots/LandingPage-DarkTheme.png" alt="Landing Page Dark Theme"></td>
    <td width="50%"><img src="screenshots/LandingPage-LightTheme.png" alt="Landing Page Light Theme"></td>
  </tr>
  <tr>
    <td width="50%"><img src="screenshots/investigationPage.png" alt="Investigation Page"></td>
    <td width="50%"><img src="screenshots/repositoryDNA.png" alt="Repository DNA"></td>
  </tr>
  <tr>
    <td width="50%"><img src="screenshots/evolution.png" alt="Evolution"></td>
    <td width="50%"><img src="screenshots/askCodeArchaelogist.png" alt="Ask CodeArchaeologist"></td>
  </tr>
  <tr>
    <td width="50%"><img src="screenshots/decisionForensics.png" alt="Decision Forensics"></td>
    <td width="50%"><img src="screenshots/riskandimpact.png" alt="Risk Impact"></td>
  </tr>
  <tr>
    <td width="50%"><img src="screenshots/overview.png" alt="Overview"></td>
    <td width="50%"><img src="screenshots/demoMode.png" alt="Demo Mode"></td>
  </tr>
  <tr>
    <td width="50%"><img src="screenshots/login.png" alt="Login"></td>
    <td width="50%"><img src="screenshots/signup.png" alt="Login"></td>
  </tr>
</table>

---
#  The Problem

When engineers inherit a mature codebase, critical context is often scattered across:

- Source code
- Git commits
- Git blame
- Pull requests
- GitHub issues
- Dependencies
- Documentation
- Historical workarounds

This creates several problems:

- Slow developer onboarding
- Risky refactoring
- Repeated investigation of old decisions
- Undocumented business logic
- Forgotten workarounds
- Difficulty understanding legacy components
- Loss of institutional knowledge when developers leave

For example:

```text
if (account.type == X) {
    useLegacyPayment();
}
```

The code tells us:

> WHAT happens.

But an engineer needs to know:

> WHY does `account.type == X` require this legacy path?

CodeArchaeologist investigates the repository to reconstruct that missing context.

---

#  Core Features
 
-  GitHub Repository Ingestion
-  Repository Structure Analysis
-  Code Intelligence
-  Git History Analysis
-  Commit & Diff Analysis
-  Issue / Pull Request Analysis
-  Multi-Agent Investigation
-  Historical Decision Reconstruction
-  Evidence-Backed Answers
-  Repository Evolution Timeline
-  Dependency Analysis
-  Risk Detection
-  Decision Forensics
-  AI Investigation Chat
-  Interactive Repository Dashboard
-  Cloud Deployment
-  Asynchronous Investigation Workflow
-  Advanced Knowledge Graph
-  Demo Mode
-  Dark and light theme toggler
---

#  What Makes CodeArchaeologist Different?

Traditional repository tools generally answer:

> **"What is this code?"**

CodeArchaeologist focuses on:

> **"Why does this code exist?"**

It combines multiple sources of repository evidence instead of relying on an LLM's general knowledge.

```text
Current Code
     +
Git History
     +
Issues
     +
Pull Requests
     +
Dependencies
     +
Documentation
     ↓
Multi-Agent Investigation
     ↓
Evidence
     ↓
Reasoning
     ↓
Historical Intent
     ↓
Actionable Insight
```

The system is designed so that important conclusions can be connected back to repository evidence rather than being presented as unsupported AI guesses.

---

#  Multi-Agent Architecture

CodeArchaeologist uses specialized agents instead of relying on a single general-purpose AI prompt.

```text
                         USER
                           │
                           ▼
                  ┌─────────────────┐
                  │   React Client  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Node + Express  │
                  │    API Layer    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Orchestrator  │
                  │      Agent      │
                  └────────┬────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   ┌────────────┐   ┌────────────┐   ┌────────────┐
   │ Code Agent │   │   History  │   │ Issue / PR │
   │            │   │   Agent    │   │   Agent    │
   └─────┬──────┘   └─────┬──────┘   └─────┬──────┘
         │                │                │
         └────────────────┼────────────────┘
                          ▼
                  ┌─────────────────┐
                  │ Dependency Agent│
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Evidence Layer │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Reasoning Agent │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Structured      │
                  │ Investigation   │
                  │ Results         │
                  └────────┬────────┘
                           │
                           ▼
                    React Dashboard
```

---

#  Agent Responsibilities

## Code Agent

Understands the current repository structure.

Analyzes:

* Files
* Functions
* Classes
* Imports
* Modules
* Entry points
* Architecture
* Code relationships

Example question:

> "Where is authentication implemented?"

---

## History Agent

Investigates how the repository evolved.

Analyzes:

* Commits
* Commit messages
* Diffs
* Git blame
* File history
* Major architectural changes

Example question:

> "When was this fallback introduced?"

---

## Issue / PR Agent

Connects implementation changes to developer discussions.

Analyzes:

* GitHub Issues
* Pull Requests
* Discussions
* Bug reports
* Requirements
* Migration decisions

Example question:

> "Why was this implementation changed?"

---

## Dependency Agent

Analyzes relationships between components.

Example:

```text
CheckoutService
       ↓
PaymentService
       ↓
LegacyPaymentFallback
       ↓
PaymentProvider
```

This allows CodeArchaeologist to reason about questions such as:

> "What could break if this component is removed?"

---

## Reasoning Agent

Combines evidence from all specialized agents.

It reconstructs:

* Historical intent
* Engineering decisions
* Current impact
* Risk
* Dependencies
* Confidence
* Recommendations

The goal is not simply to generate an answer.

The goal is to generate an **evidence-backed explanation**.

---

#  Decision Forensics

Decision Forensics is one of the core experiences of CodeArchaeologist.

A developer can ask:

> **Why does `PaymentService` still use the legacy fallback?**

The system investigates:

```text
PaymentService
      ↓
Git blame
      ↓
Original commit
      ↓
Related commits
      ↓
Pull Request
      ↓
GitHub Issue
      ↓
Dependent modules
      ↓
Reasoning Agent
```

The final result can contain:

```text
Historical Intent
────────────────────────────────

Introduced during a payment-provider
migration to handle timeout failures.


Evidence
────────────────────────────────

Commit: a81f2
PR: #142
Issue: #89
File: PaymentService.ts


Current Impact
────────────────────────────────

11 modules depend on this behaviour.


Risk
────────────────────────────────

HIGH


Recommendation
────────────────────────────────

Preserve the fallback until equivalent
behaviour is tested and downstream
dependencies are migrated.
```

---

#  Repository Evolution Timeline

CodeArchaeologist reconstructs important events in the evolution of a repository.

Example:

```text
2019
│
├── System created
│
2020
│
├── Payment provider migration
│
2021
│
├── Emergency fallback introduced
│
2023
│
├── Dependency architecture changed
│
2025
│
└── Documentation gap detected
```

This allows developers to understand **how the current architecture came to exist**.

---

#  Risk & Impact Analysis

CodeArchaeologist can identify areas that deserve engineering attention.

Potential signals include:

* Highly connected components
* Deprecated dependencies
* Legacy implementations
* Undocumented workarounds
* Components with many dependents
* Historical emergency fixes
* Architecture hotspots

Example:

```text
┌─────────────────────────────────┐
│ PaymentService                  │
│                                 │
│ Risk: 🔴 HIGH                   │
│                                 │
│ Dependents: 11                  │
│ Historical fixes: 4             │
│ Legacy dependency: 1            │
│ Documentation: Missing          │
└─────────────────────────────────┘
```

---

#  AI Investigation

Users can ask natural-language questions about the repository.

Examples:

```text
Why does this function exist?

When was this component introduced?

What changed after this commit?

Which modules depend on this service?

What could break if I remove this?

Why is this dependency still being used?

Which parts of the codebase are risky?

What was the original reason for this workaround?
```

The AI uses repository-specific context rather than relying only on general model knowledge.

---

#  Tech Stack

| Layer                   | Technology                        |
| ------------------------ | ---------------------------------- |
| Frontend                | React + Vite                       |
| Styling                 | Tailwind CSS                       |
| Routing                 | React Router                       |
| Backend                 | Node.js + Express                  |
| Database                | MongoDB + Mongoose                 |
| AI Service              | Python + FastAPI                   |
| Agent Framework         | LangGraph                          |
| LLM                     | Gemini / OpenAI / Compatible LLM   |
| Repository Integration  | GitHub API                         |
| Code Analysis           | Git / Repository Parsers           |
| Retrieval               | RAG + Embeddings                   |
| Knowledge Layer         | Graph / Vector Storage             |
| Containerization        | Docker                             |
| Cloud                   | Cloud-hosted deployment            |
| Version Control         | Git + GitHub                       |

> The exact AI model, vector database and cloud provider can be configured through environment variables.

---

# Project Structure

```text
CodeArchaeologist/
│
├── CodeArchaeologist-AI/              # AI-powered code analysis & reasoning service
│   │
│   ├── app/
|   |
│   │   ├── api/
│   │   │   └── routes.py              # API route definitions
│   │   │
│   │   ├── core/
│   │   │   └── config.py               # Application configuration
│   │   │
│   │   ├── models/
│   │   │   └── schemas.py              # Pydantic request/response schemas
│   │   │
│   │   ├── services/
│   │   │   ├── code_analyzer.py        # Source-code analysis
│   │   │   ├── dependency_analyzer.py  # Dependency & relationship analysis
│   │   │   ├── evidence_builder.py     # Evidence collection & grounding
│   │   │   ├── git_analyzer.py         # Git repository analysis
│   │   │   ├── git_diff_analyzer.py    # Commit & diff analysis
│   │   │   ├── github_service.py       # GitHub integration
│   │   │   ├── impact_analyzer.py      # Change-impact & risk analysis
│   │   │   ├── investigation_engine.py # System investigation workflow
│   │   │   ├── reasoning_engine.py     # AI reasoning & inference
│   │   │   └── repo_analyzer.py        # Repository-level analysis
│   │   │
│   │   ├── __init__.py
│   │   └── main.py                     # FastAPI application entry point
│   │
│   ├── .env.example                    # Environment variable template
│   ├── .gitignore
│   └── requirements.txt                 # Python dependencies
│
├── CodeArchaeologist-Backend/          # Node.js backend & application services
│   │
│   ├── src/
│   │   ├── db/
│   │   │   └── index.js                # Database connection
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js             # Standardized API errors
│   │   │   ├── ApiResponse.js          # Standardized API responses
│   │   │   └── AsyncHandler.js         # Async error handling
│   │   │
│   │   ├── app.js                      # Express application setup
│   │   ├── constants.js                 # Application constants
│   │   └── index.js                    # Backend entry point
│   │
│   ├── .env.sample                     # Environment variable template
│   ├── .gitignore
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── package.json                    # Node.js dependencies & scripts
│   └── package-lock.json
│
├── CodeArchaeologist-Frontend/         # React-based web interface
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── BackButton.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── LoadingState.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   ├── Tabs.jsx
│   │   │   │   └── ThemeToggle.jsx
│   │   │   │
│   │   │   ├── AgentCard.jsx
│   │   │   ├── AgentPipeline.jsx
│   │   │   ├── CodeSnippet.jsx
│   │   │   ├── ConfidenceScore.jsx
│   │   │   ├── DecisionCard.jsx
│   │   │   ├── DeepScanBackground.jsx
│   │   │   ├── DependencyGraph.jsx
│   │   │   ├── EvidenceCard.jsx
│   │   │   ├── EvidenceList.jsx
│   │   │   ├── InvestigationProgress.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── RepositoryHealth.jsx
│   │   │   ├── RiskCard.jsx
│   │   │   ├── Searchbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Timeline.jsx
│   │   │   └── TimelineEvent.jsx
│   │   │
│   │   ├── context/
│   │   │   └── ThemeContext.jsx        # Theme state management
│   │   │
│   │   ├── data/
│   │   │   └── mockData.js             # Development/demo data
│   │   │
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx     # Dashboard layout
│   │   │
│   │   ├── pages/
│   │   │   ├── AskArchaeologist.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DecisionForensics.jsx
│   │   │   ├── EvolutionTimeline.jsx
│   │   │   ├── Investigation.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── RepositoryDNA.jsx
│   │   │   ├── RepositoryInput.jsx
│   │   │   └── RiskImpact.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js                  # Frontend API communication
│   │   │
│   │   ├── App.jsx                     # Root React component
│   │   ├── index.css                   # Global styles
│   │   └── main.jsx                    # React entry point
│   │
│   ├── .env
│   ├── .env.sample
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── README.md
│
└── README.md                           # Project documentation
```

---


#  System Architecture

```mermaid
graph TD

    A[React Frontend]

    B[Node.js + Express API]

    C[Investigation Job]

    D[AI Agent Service]

    E[Orchestrator Agent]

    F[Code Agent]

    G[History Agent]

    H[Issue / PR Agent]

    I[Dependency Agent]

    J[Reasoning Agent]

    K[Evidence / Knowledge Layer]

    L[MongoDB]

    M[GitHub API]

    A -->|HTTP / API| B

    B --> C

    C --> D

    D --> E

    E --> F
    E --> G
    E --> H
    E --> I

    F --> K
    G --> K
    H --> K
    I --> K

    K --> J

    M --> F
    M --> G
    M --> H

    J --> L

    L --> B

    B --> A
```

---

#  Technical Workflow

## 1. Repository Submission

```text
User enters GitHub URL
        ↓
Frontend sends repository URL
        ↓
Express validates request
        ↓
Investigation created
```

---

## 2. Repository Ingestion

```text
GitHub Repository
        ↓
Files
Commits
Issues
Pull Requests
Dependencies
Documentation
        ↓
Structured Repository Data
```

---

## 3. Agent Investigation

```text
Repository Data
        ↓
Orchestrator
        ↓
Specialized Agents
        ↓
Evidence Collection
```

Each agent focuses on a different aspect of the repository.

---

## 4. Evidence Correlation

```text
Code
 ↓
Commit
 ↓
Diff
 ↓
Pull Request
 ↓
Issue
 ↓
Dependency
```

These relationships allow the system to reconstruct the context surrounding engineering decisions.

---

## 5. Reasoning

The Reasoning Agent receives the collected evidence and produces structured insights:

```text
Historical Intent
        +
Current Context
        +
Dependencies
        +
Risk
        +
Evidence
        ↓
Final Investigation
```

---

## 6. Results

The frontend presents:

```text
Repository Overview
        ↓
Architecture
        ↓
Evolution Timeline
        ↓
Decision Forensics
        ↓
Risk Analysis
        ↓
AI Investigation
```

---
## AI Commit Investigation API

The AI service provides commit-level investigation using repository code analysis, Git history, commit diffs, dependency analysis, impact analysis, evidence building, and LLM-based reasoning.

### Endpoint

```http
POST /analyze-commit
```

### Request Parameters

The endpoint accepts the following query parameters:

| Parameter | Type | Description |
|---|---|---|
| `repo_url` | string | GitHub repository URL to analyze |
| `commit_hash` | string | Git commit hash to investigate |
| `question` | string | Engineering question about the selected commit |

### Example Request

```text
POST /analyze-commit?repo_url=https://github.com/CodeArchaelogist/CodeArchaelogist&commit_hash=30d3341cb4963922846d2b8df06a4ba6d6f1aab7&question=Why%20was%20this%20commit%20introduced%20and%20what%20could%20be%20affected%20by%20this%20change%3F
```

### Example Input

```json
{
  "repo_url": "https://github.com/CodeArchaelogist/CodeArchaelogist",
  "commit_hash": "30d3341cb4963922846d2b8df06a4ba6d6f1aab7",
  "question": "Why was this commit introduced and what could be affected by this change?"
}
```

> **Note:** The current FastAPI implementation accepts these values as query parameters. The JSON above represents the input values conceptually; the actual request format is the query-parameter URL shown above.

### Example Response

```json
{
  "status": "success",
  "repository": {
    "owner": "CodeArchaelogist",
    "name": "CodeArchaelogist"
  },
  "commit": {
    "hash": "30d3341cb4963922846d2b8df06a4ba6d6f1aab7",
    "changed_files": []
  },
  "evidence": {
    "code": {},
    "dependencies": {},
    "impact": {},
    "history": {},
    "commit_diff": {}
  },
  "investigation": {
    "historical_intent": "Explanation of the historical purpose of the change.",
    "evidence": [
      "Repository evidence supporting the investigation."
    ],
    "impact": [
      "Potentially affected files or components."
    ],
    "risk": {
      "level": "Medium",
      "reasons": [
        "Potential risks identified from the available repository evidence."
      ]
    },
    "confidence": "Medium",
    "uncertainty": [
      "Information that cannot be established from the available evidence."
    ]
  }
}
```

### Investigation Response Fields

| Field | Description |
|---|---|
| `historical_intent` | Explanation of what the available repository evidence suggests about why the change or code exists. |
| `evidence` | Specific repository evidence supporting the investigation, such as commits, changed files, dependencies, impact relationships, or diffs. |
| `impact` | Repository files or components that may be affected by the change. |
| `risk.level` | Overall risk level identified from the available evidence. |
| `risk.reasons` | Reasons supporting the assigned risk level. |
| `confidence` | Confidence level of the investigation: `High`, `Medium`, or `Low`. |
| `uncertainty` | Information that cannot be established from the available repository evidence. |

### AI Investigation Flow

```text
Repository URL
      ↓
Commit Hash + Question
      ↓
Code Analysis
      ↓
Git History + Commit Diff
      ↓
Dependency Analysis
      ↓
Impact Analysis
      ↓
Evidence Builder
      ↓
Evidence Compaction
      ↓
Groq LLM Investigation
      ↓
Historical Intent + Evidence + Impact
      ↓
Risk + Confidence + Uncertainty
      ↓
Structured Investigation Response
```

### AI Environment Configuration

The AI service requires the following environment variable:

```env
GROQ_API_KEY=
```

The actual Groq API key must be configured through the environment and must never be committed to the repository.

### Frontend Integration

The frontend/backend integration should provide the following values to the AI service:

```text
Repository URL
Commit Hash
Investigation Question
```

The frontend can use the returned `investigation` object to display:

```text
Historical Intent
Evidence
Impact
Risk
Confidence
Uncertainty
```

For example:

```text
investigation.historical_intent
investigation.evidence
investigation.impact
investigation.risk.level
investigation.risk.reasons
investigation.confidence
investigation.uncertainty
```


---

#  Getting Started

## Prerequisites

Make sure you have:

* Node.js 18+
* npm
* Python 3.10+
* Git
* MongoDB
* GitHub account
* LLM API key

---

## 1. Clone the Repository

```bash
git clone https://github.com/CodeArchaelogist/CodeArchaeologist.git

cd CodeArchaeologist
```

---

## 2. Install Frontend

```bash
cd CodeArchaeologist-Frontend
npm install
```

---

## 3. Install Backend

```bash
cd ../CodeArchaeologist-Backend
npm install
```

---

## 4. Install AI Service

```bash
cd ../CodeArchaeologist-AI

python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

---

## 5. Configure Environment Variables

Create the required `.env` files:

```text
frontend/.env
backend/.env
ai-service/.env
```

Use the `.env.example` files as references.

---

## 6. Run the Application

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

### AI Service

```bash
cd ai-service
uvicorn main:app --reload
```

---

#  Docker

The project can also be containerized so that the frontend, backend, AI service and supporting infrastructure can be run consistently across development and deployment environments.

```bash
docker compose up --build
```

---

#  Deployment Architecture

```text
                       INTERNET
                           │
                           ▼
                  ┌─────────────────┐
                  │ React Frontend  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Express Backend │
                  └────────┬────────┘
                           │
                    Investigation
                           │
                           ▼
                  ┌─────────────────┐
                  │ Agent Workers   │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  AI Service     │
                  └────────┬────────┘
                           │
               ┌───────────┼───────────┐
               ▼           ▼           ▼
            GitHub     Knowledge     MongoDB
                         Layer
```

---

#  Example Investigation

### User

```text
Why does PaymentService still use LegacyPaymentFallback?
```

### CodeArchaeologist

```text
Historical Intent
────────────────────────────────────────

LegacyPaymentFallback was introduced during
a payment-provider migration to handle timeout
failures.


Evidence
────────────────────────────────────────

Commit: a81f2
Pull Request: #142
Issue: #89

Related File:
PaymentService.ts


Dependency Impact
────────────────────────────────────────

11 modules currently depend on this behaviour.


Risk
────────────────────────────────────────

🔴 HIGH


Recommendation
────────────────────────────────────────

Do not remove the fallback immediately.
First isolate the dependency, add behavioural
tests and migrate downstream modules.
```

This transforms repository archaeology from:

```text
"Here's what the code does."
```

into:

```text
"Here's why the code exists,
here's the evidence,
here's what depends on it,
and here's what you should do next."
```

---

# 🔮 Future Roadmap

* [ ] Advanced repository knowledge graph
* [ ] Support for larger repositories
* [ ] More programming languages
* [ ] Semantic code search
* [ ] Automated architectural diagrams
* [ ] Historical decision clustering
* [ ] Automated technical debt detection
* [ ] Advanced change-impact simulation
* [ ] IDE integration
* [ ] GitHub App integration
* [ ] Continuous repository monitoring
* [ ] Automated documentation generation
* [ ] Suggested refactoring plans
* [ ] Pull-request review using repository history

---

#  Why CodeArchaeologist?

### Software Has a Memory.

Every repository contains traces of the decisions that shaped it:

```text
Code
+
Commits
+
Issues
+
Pull Requests
+
Dependencies
+
Human Decisions
```

But that history is rarely available when engineers need it.

CodeArchaeologist brings those fragments together and turns them into **searchable, explainable and actionable software intelligence**.

### Our Core Belief

> **Code can survive its creator. Its context shouldn't have to die with them.**

---

#  Team
 
| Role                             | Name            | Responsibility                                                                                |
| --------------------------------- | --------------- | ----------------------------------------------------------------------------------------------- |
| Full-Stack Developer             | Radhika Gupta   | Architected and shipped the entire React + Node.js + Express + MongoDB stack end-to-end — wiring real-time investigation pipelines, API integration, and a production-grade dashboard from the ground up |
| AI Developer                     | Anshika Vats    | Multi-agent architecture, LLM integration, repository reasoning, RAG and evidence generation   |
| Cloud / Orchestration Developer  | Khushi Goel     | Containerization, deployment, agent workers, orchestration, infrastructure and reliability     |
 
---

#  License

This project is licensed under the MIT License.

---

<p align="center">

### Built to uncover the stories hidden inside software.

**CodeArchaeologist**

</p>
