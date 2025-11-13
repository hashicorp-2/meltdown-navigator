import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
/**
 * Connects to MongoDB with connection pooling and error handling.
 * Gracefully handles disconnection and reconnection.
 */
export async function connectDatabase() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        logger.warn('MONGODB_URI not set. Profile features will not be available.');
        return;
    }
    try {
        await mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        logger.info('Connected to MongoDB');
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error', err);
        });
        mongoose.connection.on('disconnected', () => {
            logger.warn('Disconnected from MongoDB');
        });
        mongoose.connection.on('reconnected', () => {
            logger.info('Reconnected to MongoDB');
        });
    }
    catch (error) {
        logger.error('Failed to connect to MongoDB', error);
        throw error;
    }
}
/**
 * Gracefully disconnects from MongoDB.
 */
export async function disconnectDatabase() {
    try {
        await mongoose.disconnect();
        logger.info('Disconnected from MongoDB');
    }
    catch (error) {
        logger.error('Error disconnecting from MongoDB', error);
    }
}
/**
 * Checks if database is connected.
 */
export function isDatabaseConnected() {
    return mongoose.connection.readyState === 1;
}
//# sourceMappingURL=database.js.map