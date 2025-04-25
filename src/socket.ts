import { Server } from "socket.io";
import http from "http";
import logger from "./utils/logger";
import { redisClient } from "./config/redis";

let io: Server;

export const initSocketIO = (server: http.Server): void => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    });
    io.on('connection', (socket) => {
        logger.info(`Client connected: ${socket.id}`);

        socket.on('authenticate', async (userId: string) => {
            socket.data.userId = userId;
            await redisClient.set(`user:online:${userId}`, socket.id, {EX: 3600});
            logger.info(`User ${userId} authenticated with socket ${socket.id}`);
        });

        socket.on('disconnect', async () => {
            const userId = socket.data.userId;
            if (userId) {
                await redisClient.del(`user:online:${userId}`);
                logger.info(`User ${userId} disconnected from socket ${socket.id}`);
            }
        });
    });

    logger.info("Socket.IO initialized");
};

export { io };