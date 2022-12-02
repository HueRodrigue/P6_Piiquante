const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// Modele de l'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Email unique 1 utilisateur = 1 email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);