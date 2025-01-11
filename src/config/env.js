/*
*  Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
*  Réponse : La validation des variables d'environnement au démarrage est cruciale car :elle permet de détecter rapidement les problèmes de configuration
*/

/* 
* Question: Que se passe-t-il si une variable requise est manquante ?
* Réponse : Si une variable requise est manquante, l'application s'arrête immédiatement 
* au démarrage avec un message d'erreur explicite, évitant ainsi des comportements
* inattendus ou des pannes en cours d'exécution.
*/

const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  // Implémenter la validation
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  // Si une variable manque, lever une erreur explicative
  if (missingVars.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes: ${missingVars.join(", ")}`
    );
  }
}

validateEnv();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};