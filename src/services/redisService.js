// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : Utilisez des TTL (Time To Live) pour expirer les données obsolètes et éviter la surcharge de mémoire. Utilisez également des clés structurées pour une gestion plus facile et une récupération rapide des données.
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : Utilisez des noms de clés descriptifs et structurés, par exemple, "object:id:field" pour faciliter la gestion et la recherche. Évitez les clés trop longues et assurez-vous qu'elles sont uniques pour éviter les collisions.

const { getRedisClient } = require('../config/db');

// Helper pour structurer les clés
const createKey = (prefix, id) => `${prefix}:${id}`;

async function cacheData(key, data, ttl = 3600) {
  const redis = getRedisClient();
  try {
    await redis.setEx(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

async function getCachedData(key) {
  const redis = getRedisClient();
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

async function invalidateCache(key) {
  const redis = getRedisClient();
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Cache invalidation error:', error);
    return false;
  }
}

async function setCacheWithPattern(pattern, data, ttl = 3600) {
  return await cacheData(`pattern:${pattern}`, data, ttl);
}

module.exports = {
  cacheData,
  getCachedData,
  invalidateCache,
  setCacheWithPattern,
  createKey
};
