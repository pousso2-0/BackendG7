import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tailor API',
      version: '1.0.0',
      description: 'Documentation de notre API pour le réseau social des tailleurs',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Indique le format du token utilisé
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Applique le schéma de sécurité par défaut à toutes les routes
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Chemin vers vos fichiers de routes
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
