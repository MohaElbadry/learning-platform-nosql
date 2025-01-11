// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : La séparation des routes permet une meilleure organisation du code,
// facilite la maintenance et améliore la lisibilité en regroupant les fonctionnalités connexes.

// Question : Comment organiser les routes de manière cohérente ?
// Réponse: Utiliser une structure RESTful cohérente, regrouper les routes par ressource,
// et implémenter des middlewares de validation appropriés.

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Middleware de validation d'ID
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid course ID format' });
  }
  next();
};

// Routes CRUD pour les cours
router.post('/', 
  express.json(),
  courseController.createCourse
);

router.get('/', courseController.listCourses);

router.get('/:id', 
  validateObjectId,
  courseController.getCourse
);

router.put('/:id',
  validateObjectId,
  express.json(),
  courseController.updateCourse
);

router.delete('/:id',
  validateObjectId,
  courseController.deleteCourse
);

module.exports = router;