//Importatio d'express et mongoose
const express = require('express');
const app = express();
const mongoose = require('mongoose');

//Importation des routes
const path = require('path');
const sauceRoute = require('./routes/sauce');
const userRoutes = require('./routes/user');



app.use(express.json());

//Connection a la base MongoDB
mongoose.connect('mongodb+srv://admin:admin@cluster0.z8zq49s.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//En-tête de requête specifique afin de résoudre le problème de CORS (requête n'ayant pas la même origine)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Utilisation des routes par l'api
app.use('/api/sauces', sauceRoute);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;