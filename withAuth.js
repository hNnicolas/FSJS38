const jwt = require("jsonwebtoken")
const secret = "fsjs38"

const withAuth = (req, res, next) => {
    //on récupère notre token dans le header de la requète HTTP (ajax)
    const token = req.headers['x-access-token']
    
    //si il ne le trouve pas
    if(token === undefined){
        res.json({status: 404, msg: "Erreur, token introuvable!"})
    } else {
        //sinon il a trouvé un token, utilisation de la fonction de vérification de jsonwebtoken
        jwt.verify(token, secret, (err, decoded) => {
            if(err){
                res.json({status: 401, msg: "Erreur, ton token est invalide!"})
            } else {
                //on rajoute la propriété id dans l'objet req, qui va nous permettre de récupérer les infos de l'utilisateur à reconnecter
                req.id = decoded.id
                //on est good on sort de la fonction, on autorise l'accés à la callback de la route protégée!
                next()
            }
        })
    }
}

module.exports = withAuth