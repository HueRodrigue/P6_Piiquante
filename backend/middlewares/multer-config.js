const multer = require('multer');
const alert = require('alert');

// Tableau des extension d'image accepté
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// Création du stockage avec multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // La destination du stockage est le dossier images
    callback(null, 'images');
  },
  // filename ==> nom du fichier originel
  filename: (req, file, callback) => {
    // traitement des espaces dans le nom
    // ==> remplacement par des underscores
    const name = file.originalname.split(' ').join('_');
    // Vérification de l'extension
    const extension = MIME_TYPES[file.mimetype];
    // Création d'un nom unique avec un timestamp avec Date.now()
    callback(null, name + Date.now() + '.' + extension);
  }
});

/* defined filter */
const fileFilter = (req, file, callback,res) => {
  if (file.mimetype in MIME_TYPES) {
    callback(null, true);
  } else {
    callback(new Error("File format should be PNG,JPG,JPEG"), false); // if validation failed then generate error
    alert("Le format de l'image doit être en PNG,JPG ou JPEG")
    
    
  }
};

// exportation du module et traitement uniquement des images
module.exports = multer({storage: storage, fileFilter :fileFilter}).single('image');