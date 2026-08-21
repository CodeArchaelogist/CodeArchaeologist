import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URI,
            {
                dbName: DB_NAME,
            }
        );
        console.log(`Connected to MongoDB Atlas database: ${DB_NAME}`);
        return connectionInstance;
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;