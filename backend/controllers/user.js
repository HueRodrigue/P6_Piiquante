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
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  // login de l'utilisateur
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // Vérification su l'utilisateur est dans la DB
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Vérification du mdp
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // SI tout est ok, on lui fourni un token valide 24h
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };