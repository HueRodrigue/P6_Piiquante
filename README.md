## Présentation et instructions

### Présentation

Le site **Piiquante** est un site d'avis culinaires où les utilisateurs peuvent partager des fiches concernant des sauces selon un modèle précis, incluant la possibilité de "liker" ou "disliker" les sauces.

**Objectif**: permettre à l'internaute de s'inscrire sur le site et de pouvoir:

    - consulter toutes les sauces enregistrées,
    - créer des sauces,
    - modifier les sauces qu'il a créé,
    - supprimer les sauces qu'il a crée,
    - liker ou disliker les sauces enregistrées sur le site.

### Sécurité mise en place

    - Hashage du mot de passe utilisateur avec BCRYPT
    - Cryptage des emails utilisateurs dans la base de données avec CRYPTO-JS
    - Manupulation sécurisée de la base de donnée avec MONGOOSE
    - Vérification que l'email utilisateur soit unique dans la base de données avec MONGOOSE-UNIQUE-VALIDATOR
    - Utilisation de variables d'environnement pour les données sensibles avec DOTENV
    - Authentification de l'utilisateur par token avec JSONWEBTOKEN
    - Protection des headers avec HELMET

### Instructions pour le lancement: partie Frontend et partie Backend

#### Partie frontend

Avec un terminal, aller dans le dossier "frontend" puis:

    - taper: "npm run start",
    - enfin: dans votre navigateur se rendre à l'adresse: http://localhost:4200 

#### Partie backend

Avec un terminal, aller dans le dossier backend, puis:

        -taper: "nodemon server",
        -le serveur écoute sur le port: http://localhost:3000

**Arrivé à ce point, vous pouvez utiliser les fonctionnalités du site.**
