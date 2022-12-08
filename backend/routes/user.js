// Imporation d'express
// Express permet de gérer les différente routes de l'API
const express = require('express');
const router = express.Router();

//Importation des controllers
const userCtrl = require('../controllers/user');

// Requête post Enregistrement d'un nouvel utilisateur
router.post('/signup', userCtrl.signup);

// Requête post de login d'un utilisateur
router.post('/login', userCtrl.login);

module.exports = router;