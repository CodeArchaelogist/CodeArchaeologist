import express from "express";

import {
    createInvestigation,
    getInvestigation,
    listInvestigations,
} from "../controllers/investigationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createInvestigation);

router.get("/", listInvestigations);

router.get("/:id", getInvestigation);

export default router;