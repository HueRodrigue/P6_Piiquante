const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
    // Vérification de l'utilisateur via son token
       const token = req.headers.authorization.split(' ')[1];
       // On decode le token
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       req.auth = {
        // On fourni l'userId
           userId: userId
       };
	next();
   } catch(error) {
    // ==> 401 accès refusé
       res.status(401).json({ error });
   }
};