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
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });
    // Sauvegarde de la sauce dans la BDD
    sauce.save()
    // ==> 201 indique une requete reussie avec une ressource créée
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    // ==> 400 indique une erreur au niveau de la requête coté client 
    .catch(error => { res.status(400).json( { error })})
 };

// Récupération d'une seul sauce 
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      // ==> 200 requête réussi
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      // ==> 404 Ressource non trouvé 
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
              // ==> 401 accès refusé
                res.status(401).json({ message : 'Not authorized'});
            } else {
              // SInon la modification est authorisé
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                // ==> 200 requête réussi
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                // ==> 401 accès refusé
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
          // ==> 400 indique une erreur au niveau de la requête coté client 
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
                // ==> 401 accès refusé
                res.status(401).json({message: 'Not authorized'});
            } else {
              // Séparation Image/ Sauce
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                  // Suppression de la sauce 
                    Sauce.deleteOne({_id: req.params.id})
                    // ==> 200 requête réussi
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        // ==> 401 accès refusé
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
          // ==> 500 erreur serveur
            res.status(500).json({ error });
        });
 };
// Récupération de toute les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      // ==> 200 requête réussi
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      // ==> 400 indique une erreur au niveau de la requête coté client 
      res.status(400).json({
        error: error
      });
    }
  );
};

// Like et dislike d'une sauce 
exports.likeDislikeSauce = (req, res, next) => {
  // Récupération et séparation du corp de la requête
  const userId = req.body.userId;
  const like = req.body.like;
  console.log('userId : ' + userId + ' like : ' + like)

  // On trouve la sauce sur laqu'elle l'utilisateur opère
  Sauce.findOne({ _id: req.params.id })
      .then( sauce => {
          // Condition permettant de regarder la valeur du like
          switch (like) {
              // Si le like est égal a 1
              case 1 : 
                  // Mise a jour de la sauce 
                  // => Incrémentation du compteur de like avec $inc
                  // => Ajout de l'id de l'utilisateur dans le tableau usersLiked
                  // => Vérifiaction de l'id de la sauce 
                  Sauce.updateOne({ _id: req.params.id }, { $inc:{likes: +1}, $push:{usersLiked: userId}, _id: req.params.id })
                      .then(() => {
                         // Requête bonne
                         // ==> 200 requête réussi
                          res.status(200).json({ message: "Like !"});
                      })
                        // Erreur 
                        // ==> 400 indique une erreur au niveau de la requête coté client 
                      .catch(error => res.status(400).json({ error }));
                  break;
                  // Si le like est égal à 0
              case 0 : 
                  // Mise a jour de la sauce 
                  // 2 condition a l'envoi d'un 0
                  // On vérifie que l'utilisateur est dans le tableau de like
                  if (sauce.usersLiked.includes(userId)) {
                  // => Décrementation du compteur de like avec $inc
                  // => Suppression de l'id de l'utilisateur dans le tableau usersLiked
                  // => Vérifiaction de l'id de la sauce 
                      Sauce.updateOne({ _id: req.params.id }, { $inc:{likes: -1}, $pull:{usersLiked: userId}, _id: req.params.id })
                          .then(() => {
                            // Requête bonne
                            // ==> 200 requête réussi
                              res.status(200).json({ message: "Stop Like !"});
                          })
                          // Erreur
                          // ==> 400 indique une erreur au niveau de la requête coté client 
                          .catch(error => res.status(400).json({ error }));
                  } 
                  // On vérifie que l'utilisateur est dans le tableau de Dislike
                  else if (sauce.usersDisliked.includes(userId)) {
                    // => Décrementation du compteur de like avec $inc
                    // => Suppression de l'id de l'utilisateur dans le tableau usersDisliked
                    // => Vérifiaction de l'id de la sauce 
                      Sauce.updateOne({ _id: req.params.id }, { $inc:{dislikes: -1}, $pull:{usersDisliked: userId}, _id: req.params.id })
                      .then(() => {
                        // Requête bonne
                        // ==> 200 requête réussi
                          res.status(200).json({ message: "Stop Dislike !"});
                      })
                      // Erreur
                      // ==> 400 indique une erreur au niveau de la requête coté client 
                      .catch(error => res.status(400).json({ error }));
                  }     
                  break;
                  // Si le like est égal à -1
              case -1 : 
                  // Mise a jour de la sauce 
                  // => Incrémentation du compteur de dislike avec $inc
                  // => Ajout de l'id de l'utilisateur dans le tableau usersDisliked
                  // => Vérifiaction de l'id de la sauce 
                  Sauce.updateOne({ _id: req.params.id }, { $inc:{dislikes: +1}, $push:{usersDisliked: userId}, _id: req.params.id })
                      .then(() => {
                        // Requete bonne
                        // ==> 200 requête réussi
                          res.status(200).json({ message: "Dislike !"});
                      })
                        // Erreur
                        // ==> 400 indique une erreur au niveau de la requête coté client 
                      .catch(error => res.status(400).json({ error }));
                  break;
              default : 
                  console.log("error");
          }
      })
      .catch(error => {
        // ==> 404 Ressource non trouvé 
          res.status(404).json({ error })
      });  
};