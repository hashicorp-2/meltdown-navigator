import dotenv from 'dotenv';
import app from './server.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';
dotenv.config();
const port = Number(process.env.PORT ?? 4000);
// Handle graceful shutdown
process.on('SIGINT', async () => {
    logger.info('Received SIGINT, shutting down gracefully...');
    await disconnectDatabase();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, shutting down gracefully...');
    await disconnectDatabase();
    process.exit(0);
});
// Start server
async function startServer() {
    try {
        await connectDatabase();
        app.listen(port, () => {
            logger.info(`Server listening on http://localhost:${port}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`Health check: http://localhost:${port}/api/health`);
        });
    }
    catch (error) {
        logger.error('Failed to start server', error);
        process.exit(1);
    }
}
startServer().catch((error) => {
    logger.error('Fatal error during startup', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map