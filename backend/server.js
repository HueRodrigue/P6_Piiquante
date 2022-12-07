const http = require('http');
const app = require('./app');

// Fonction qui retourne un port valide pour le serveur 
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// Ajout du port au serveur 
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Fonction qui recherche les erreurs du serveur et les gères
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    // Absence de privilège
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
      // Adresse deja utilisée
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Définition du serveur
// ==> Transformation du pc en serveur
// ==> Création du objet HTTP Server
// ==> l'Objet permet d'écouter les port et d'effectuer un requestListener a chaque requête effectué
const server = http.createServer(app);

server.on('error', errorHandler);
// Serveur mise a lé' écoute sur une addresse précise
// ==> localhost:3000
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
