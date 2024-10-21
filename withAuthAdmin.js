const jwt = require("jsonwebtoken")
const secret = "fsjs38"

const withAuthAdmin = (req, res, next) => {
    //on récupère notre token dans le header de la requète HTTP (ajax)
    const token = req.headers['x-access-token']
    // console.log('Token reçu dans le middleware:', token)
    
    //si il ne le trouve pas
    if(token === undefined){
        console.log(token, " je suis la ")
        res.json({status: 404, msg: "Erreur, token introuvable! je suis là 1"})
        
    } else {
        //sinon il a trouvé un token, utilisation de la fonction de vérification de jsonwebtoken
        jwt.verify(token, secret, (err, decoded) => {
            if(err){
                res.json({status: 401, msg: "Erreur, ton token est invalide! je suis là 2"})
            } else {
                if(decoded.role !== "ADMIN"){
                    console.log("Token décodé mais l'utilisateur n'est pas admin:", decoded.role)
                    res.json({status: 401, msg: "Erreur, accès admin non autorisé! je suis là 3"})
                } else {
                    //on rajoute la propriété id dans l'objet req, qui va nous permettre de récupérer les infos de l'utilisateur à reconnecter
                    req.id = decoded.id
                    //on est good on sort de la fonction, on autorise l'accés à la callback de la route protégée!
                    next()
                }
            }
        })
    }
}

module.exports = withAuthAdmin