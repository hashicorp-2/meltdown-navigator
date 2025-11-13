import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './server.js';
dotenv.config();
const port = Number(process.env.PORT ?? 4000);
const mongoUri = process.env.MONGODB_URI ?? process.env.MONGO_URI;
/**
 * Connects to MongoDB if a connection string is provided.
 * The connection is optional - the app can run without it if profiles aren't used yet.
 */
async function connectDatabase() {
    if (!mongoUri) {
        console.warn('[Database] No MongoDB URI provided. AiProfile features will be unavailable.');
        return;
    }
    try {
        await mongoose.connect(mongoUri);
        console.log('[Database] Connected to MongoDB');
    }
    catch (error) {
        console.error('[Database] Failed to connect to MongoDB:', error);
        // Don't exit - allow the server to start without DB for now
        console.warn('[Database] Continuing without database connection...');
    }
}
/**
 * Gracefully closes the database connection on process termination.
 */
async function closeDatabase() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        console.log('[Database] Disconnected from MongoDB');
    }
}
// Handle graceful shutdown
process.on('SIGINT', async () => {
    await closeDatabase();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await closeDatabase();
    process.exit(0);
});
// Start server
async function startServer() {
    await connectDatabase();
    app.listen(port, () => {
        console.log(`[Translator] Server listening on http://localhost:${port}`);
    });
}
startServer().catch((error) => {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map