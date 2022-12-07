// Importation de bcrypt,jwt et du model utilisateur
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/user')

// Enregistrement d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // Récupération du mdp de l'utilisateur et hashage 
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Reconstruction de l'objet utilisateur avec le mdp hashé
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Sauvegarde de l'utilisateur dans la DB
        user.save()
        // 201 ==> requête réussi et objet créé
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          // ==> 400 indique une erreur au niveau de la requête coté client 
          .catch(error => res.status(400).json({ error }));
      })
      // 500 ==> Erreur cêté serveur
      .catch(error => res.status(500).json({ error }));
  };

  // login de l'utilisateur
  exports.login = (req, res, next) => {
    // On regarde si l'utilisateur est dans le DB
    User.findOne({ email: req.body.email })
        .then(user => {
            // Vérification su l'utilisateur est dans la DB
            if (!user) {
                // ==> 401 accès refusé et utilisateur non trouvé
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Vérification du mdp
            // mdp dans la requête et mdp dans la table User
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        // ==> 401 accès refusé et mdp incorrect
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // SI tout est ok, on lui fourni un token valide 24h
                    // 200 ==> requete réussi
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                // 500 ==>Erreur coté serveur
                .catch(error => res.status(500).json({ error }));
        })
        // 500 ==>Erreur coté serveur
        .catch(error => res.status(500).json({ error }));
 };