import mongoose from "mongoose";
import express from "express";

// Guaranteed environment fallbacks to fix auth crashes
process.env.PORT = process.env.PORT || "3000";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://user1:Radhika25@cluster0.7ycofli.mongodb.net/";
process.env.JWT_SECRET = process.env.JWT_SECRET || "supersecretkey12345";
process.env.AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`Server is listening at port ${port} with active environment fallbacks!`);
        });
    })
    .catch((err) => {
        console.log(`Mongo Atlas connection failed! Error:${err}`);
    });