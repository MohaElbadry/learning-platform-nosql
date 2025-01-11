// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Un contrôleur contient la logique métier de l'application tandis qu'une route définit les points d'entrée de l'API.
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : Séparer la logique métier des routes permet de rendre le code plus modulaire, réutilisable et facile à maintenir.

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
  try {
    const course = req.body;
    const db = await mongoService.getCollection('courses');
    
    const result = await db.insertOne(course);
    const courseId = result.insertedId;
    
    // Cache le nouveau cours
    await redisService.cacheData(
      redisService.createKey('course', courseId),
      { _id: courseId, ...course }
    );

    res.status(201).json({ _id: courseId, ...course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Error creating course' });
  }
}

async function getCourse(req, res) {
  try {
    const { id } = req.params;
    const cacheKey = redisService.createKey('course', id);

    // Tente de récupérer depuis le cache
    const cachedCourse = await redisService.getCachedData(cacheKey);
    if (cachedCourse) {
      return res.json(cachedCourse);
    }

    // Si pas en cache, récupère depuis MongoDB
    const db = await mongoService.getCollection('courses');
    const course = await db.findOne({ _id: new ObjectId(id) });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Met en cache pour les prochaines requêtes
    await redisService.cacheData(cacheKey, course);
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Error retrieving course' });
  }
}

async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const db = await mongoService.getCollection('courses');
    const result = await db.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Invalide le cache
    await redisService.invalidateCache(redisService.createKey('course', id));
    
    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Error updating course' });
  }
}

async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    
    const db = await mongoService.getCollection('courses');
    const result = await db.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Invalide le cache
    await redisService.invalidateCache(redisService.createKey('course', id));
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Error deleting course' });
  }
}

async function listCourses(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const db = await mongoService.getCollection('courses');
    const courses = await db
      .find({})
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    res.json(courses);
  } catch (error) {
    console.error('List courses error:', error);
    res.status(500).json({ error: 'Error listing courses' });
  }
}

module.exports = {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  listCourses
};