// Imporation d'express
// Express permet de gérer les différente routes de l'API
const express = require('express');
//importation des middlewares
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

//Importation des controllers
const sauceCtrl = require('../controllers/sauce');

const router = express.Router();


// Mise en place du CRUD
// Auth ==> L'utilisateur doit être loggué pour pouvoir faire ces requêtes
// Multer ==> Permet de gérer les fichiers entrant via les requêtes HTTP
//sauceCTRL ==> Appel le controlleur à executer la requête demandé
router.get('/',auth,sauceCtrl.getAllSauce);
router.post('/',auth,multer, sauceCtrl.createSauce);
router.get('/:id',auth, sauceCtrl.getOneSauce);
router.put('/:id',auth,multer, sauceCtrl.modifySauce);
router.delete('/:id',auth, sauceCtrl.deleteSauce);
// Route like sauce 
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);
module.exports = router;