import mongoose from "mongoose";
import logger from "./logger";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000; // 5 seconds

const connectDb = async (retryCount = 0): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";
        logger.info(`Attempting MongoDB connection (Attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        await mongoose.connect(mongoUri);
        logger.info("MongoDB connected successfully.");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`MongoDB connection attempt ${retryCount + 1} failed: ${errorMessage}`);
        if (retryCount < MAX_RETRIES - 1) {
            logger.info(`Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            await connectDb(retryCount + 1);
        } else {
            logger.error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts. Exiting process.`);
            process.exit(1);
        }
    }
}

export default connectDb;
// This code connects to a MongoDB database using Mongoose.
// It includes a retry mechanism for connection failures and logs the connection status, handling errors gracefully.