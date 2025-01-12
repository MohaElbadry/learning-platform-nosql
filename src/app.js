// Question: Comment organiser le point d'entrée de l'application ?
// Réponse: Organiser le point d'entrée de l'application en modules distincts pour une meilleure lisibilité et maintenabilité.
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?
// Réponse: La meilleure façon de gérer le démarrage de l'application est de séparer la logique de démarrage dans une fonction dédiée et de gérer les erreurs de manière appropriée.

const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

async function startServer() {
  try {
    // TODO: Initialiser les connexions aux bases de données
    // TODO: Configurer les middlewares Express
    // TODO: Monter les routes
    // TODO: Démarrer le serveur
    await db.connectMongo();
    await db.connectRedis();

    app.use(express.json());

    app.use("/courses", courseRoutes);
    app.use("/students", studentRoutes);

    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on("SIGINT", async () => {
  // TODO: Implémenter la fermeture propre des connexions
  await db.closeMongo();
  await db.closeRedis();
  console.log("Server is shutting down");
  process.exit(0);
});

startServer();
