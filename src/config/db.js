/* Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
*  Réponse : Un module séparé permet de centraliser la gestion des connexions 
*  et la réutiliser les connexions dans différentes parties de l'application
*/

/* Question : Comment gérer proprement la fermeture des connexions ?
*  Réponse : Il faut créer des fonctions dédiées pour la fermeture et 
*  ecouter au evenements SIGTERM et SIGINT pour les appeler
*/
const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo() {
  try {
        // Implémenter la connexion MongoDB
    mongoClient = new MongoClient(config.mongodb.uri, {
      connectTimeoutMS: 5000,
      retryWrites: true
    });

    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);
    console.log('MongoDB connected successfully');
    return db;
  } catch (error) {
    // Gérer les erreurs et les retries
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

async function connectRedis() {
  try {
    // Implémenter la connexion Redis
    redisClient = redis.createClient({ url: config.redisUri });
    redisClient.on("error", (err) => console.error("Redis Client Error", err));
    await redisClient.connect();
    console.log("Redis connected successfully");
    return redisClient;
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
}

async function closeConnections() {
  try {
    if (mongoClient) await mongoClient.close();
    if (redisClient) await redisClient.quit();
    console.log('Database connections closed');
  } catch (error) {
    console.error('Error closing connections:', error);
    throw error;
  }
}


module.exports = {
  connectMongo,
  connectRedis,
  closeConnections,
  getMongoDb: () => db,
  getRedisClient: () => redisClient
};