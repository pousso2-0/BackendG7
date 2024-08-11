import express from 'express';
import { PORT } from './config/env.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import connectDB from './config/database.js'; 
import configureRoutes from './routes/index.js';

const app = express();

// Middleware de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(cors());

// Configuration des routes
configureRoutes(app);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});



// Fonction de démarrage du serveur
const startServer = async () => {
    try {
      logger.info('Attempting to connect to MongoDB...');
      await connectDB();
      logger.info('Successfully connected to MongoDB');
  
      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  };

startServer();
