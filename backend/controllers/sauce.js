// Importation du model Sauce
const Sauce = require('../models/sauce');
// Importation de fs permettant de gérer les images 
const fs = require('fs');

// Creation d'une sauce 
exports.createSauce = (req, res, next) => {
    // Récupération des données de la sauce
    const sauceObject = JSON.parse(req.body.sauce);
    // Suppression des ID par mesure de sécurité
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        // Récupération de l'userId via l'authentification
        userId: req.auth.userId,
        // Création de l'url de stockage de l'image de la sauce 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

// Récupération d'une seul sauce 
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
// Modification d'une sauce 
exports.modifySauce = (req, res, next) => {
    // recherche de la sauce
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // Suppression de l'userID 
    delete sauceObject._userId;
    // Recherche de la sauce via son id
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            // Si l'utilisateur n'est pas le propriétaire de la sauce, il n'a pas le droit de modifié
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
              // SInon la modification est authorisé
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };
// Supression d'une sauce
 exports.deleteSauce = (req, res, next) => {
  //Récupération de la sauce avec son ID
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
          // Vérification si l'utilisateur est authorisé
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
              // Séparation Image/ Sauce
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                  // Suppression de la sauce 
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };
// Récupération de toute les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};