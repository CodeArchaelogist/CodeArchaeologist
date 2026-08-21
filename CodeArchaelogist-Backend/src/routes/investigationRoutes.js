import express from "express";

import {
    createInvestigation,
    getInvestigation,
    listInvestigations,
    askQuestion,
} from "../controllers/investigationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createInvestigation);

router.get("/", listInvestigations);

router.get("/:id", getInvestigation);

router.post("/:id/questions", askQuestion);

export default router;