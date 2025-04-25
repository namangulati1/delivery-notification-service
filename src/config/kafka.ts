import { Kafka } from "kafkajs";
import logger from "../utils/logger";

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "notification-service-group",
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
    retry: {
        initialRetryTime: 100,
        retries: 8
    }
});

const producer = kafka.producer({
    allowAutoTopicCreation: true,
    createPartitioner: undefined,
    idempotent: false,
    maxInFlightRequests: 1,
    transactionalId: undefined,
});

const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "notification-service-group",
    maxWaitTimeInMs: 1000,
    minBytes: 1,
    maxBytes: 1024 * 1024,
    readUncommitted: false,
    allowAutoTopicCreation: true,
    sessionTimeout: 30000,
    rebalanceTimeout: 60000,
    heartbeatInterval: 3000,
    maxInFlightRequests: 1,
    retry: {
        initialRetryTime: 100,
        retries: 8
    }
});

const initKafka = async (): Promise<void> => {
    try {
        await producer.connect();
        logger.info("Kafka producer connected successfully");
    } catch (error) {
        logger.error("Kafka producer connection error:", error);
        process.exit(1);
    }

    try {
        await consumer.connect();
        logger.info("Kafka consumer connected successfully");
    } catch (error) {
        logger.error("Kafka consumer connection error:", error);
        process.exit(1);
    }
}

export { producer, consumer, initKafka };

