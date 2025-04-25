import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDb = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/myapp";
        await mongoose.connect(mongoUri);
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDb;
// This code connects to a MongoDB database using Mongoose. It logs the connection status and handles errors.