# Learning Platform NoSQL

## Description
Ce projet est une API backend pour une plateforme d'apprentissage en ligne. Il utilise MongoDB pour la base de données principale et Redis pour la gestion du cache.

## Installation

### Prérequis
- Node.js
- Docker et Docker Compose

### Étapes d'installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/[votre-compte]/learning-platform-nosql
   cd learning-platform-nosql
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   Copiez le fichier `.env.example` en `.env` et modifiez les valeurs si nécessaire :
   ```bash
   cp .env.example .env
   ```


4. Démarrez l'application :
   ```bash
   npm start
   ```

## Structure du projet
```
src/
├── config/         # Configuration et variables d'environnement
├── controllers/    # Logique de contrôle des routes
├── routes/        # Définition des routes API
├── services/      # Services pour interagir avec les bases de données
└── app.js         # Point d'entrée de l'application
```

## Choix techniques
- **Variables d'environnement** : Utilisées pour ne pas exposer les informations sensibles dans le code source.
- **Séparation des responsabilités** : Routes, contrôleurs et services sont séparés pour une meilleure organisation et maintenabilité du code.
- **Gestion des connexions** : Connexions aux bases de données MongoDB et Redis centralisées dans des modules séparés.


## Réponses aux Questions

### db.js

- **Pourquoi créer un module séparé pour les connexions aux bases de données ?**
Un module séparé permet de centraliser la gestion des connexions et la réutiliser les connexions dans différentes parties de l'application

- **Comment gérer proprement la fermeture des connexions ?**
Il faut créer des fonctions dédiées pour la fermeture et ecouter au evenements SIGTERM et SIGINT pour les appeler

### env.js

- **Pourquoi est-il important de valider les variables d'environnement au démarrage ?**
La validation des variables d'environnement au démarrage est cruciale car :elle permet de détecter rapidement les problèmes de configuration

- **Que se passe-t-il si une variable requise est manquante ?**
Si une variable requise est manquante, l'application s'arrête immédiatement au démarrage avec un message d'erreur explicite, évitant ainsi des comportements inattendus ou des pannes en cours d'exécution.

### .env

- **Quelles sont les informations sensibles à ne jamais commiter ?**
les Informations sensibles comme les API-Keys ou les mots de passe

- **Pourquoi utiliser des variables d'environnement ?**
pour ne pas exposer les informations sensibles dans le code source

### courseController.js

- **Quelle est la différence entre un contrôleur et une route ?**
Un contrôleur contient la logique métier de l'application tandis qu'une route définit les points d'entrée de l'API.

- **Pourquoi séparer la logique métier des routes ?**
Séparer la logique métier des routes permet de rendre le code plus modulaire, réutilisable et facile à maintenir.

### route.js

- **Pourquoi séparer les routes dans différents fichiers ?**
Un contrôleur contient la logique métier de l'application tandis qu'une route définit les points d'entrée de l'API.

- **Comment organiser les routes de manière cohérente ?**
Séparer la logique métier des routes permet de rendre le code plus modulaire, réutilisable et facile à maintenir.

### mongoService.js

- **Pourquoi créer des services séparés ?**
Les services permettent de séparer la logique métier de la logique de contrôle, rendant le code plus modulaire et facile à tester.

### redisService.js

- **Comment gérer efficacement le cache avec Redis ?**
Utilisez des TTL (Time To Live) pour expirer les données obsolètes et éviter la surcharge de mémoire. Utilisez également des clés structurées pour une gestion plus facile et une récupération rapide des données.

- **Quelles sont les bonnes pratiques pour les clés Redis ?**
Utilisez des noms de clés descriptifs et structurés, par exemple, "object:id:field" pour faciliter la gestion et la recherche. Évitez les clés trop longues et assurez-vous qu'elles sont uniques pour éviter les collisions.

### app.js

- **Comment organiser le point d'entrée de l'application ?**
Organiser le point d'entrée de l'application en modules distincts pour une meilleure lisibilité et maintenabilité.

- **Quelle est la meilleure façon de gérer le démarrage de l'application ?**
La meilleure façon de gérer le démarrage de l'application est de séparer la logique de démarrage dans une fonction dédiée et de gérer les erreurs de manière appropriée.
