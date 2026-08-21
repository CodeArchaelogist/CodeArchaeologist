import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is listening at port ${port}`);
        })
    })
    .catch((err) => {
        console.log(`Mongo Atlas connection failed! Error:${err}`);
    })