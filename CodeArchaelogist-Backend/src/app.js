import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import investigationRoutes from "./routes/investigationRoutes.js";

import {
    notFound,
    errorHandler,
} from "./middleware/errorMiddleware.js";

dotenv.config();

export const app = express();

app.disable("x-powered-by");

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:5175",
        ],
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "1mb",
    })
);

app.use(cookieParser());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "CodeArchaeologist Backend",
    });
});

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/investigations",
    investigationRoutes
);

app.use(notFound);

app.use(errorHandler);