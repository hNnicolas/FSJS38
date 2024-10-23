const withAuth = require ('../middleware/withAuth')

module.exports = (app, db) => {
    const UsersModel = require("../models/UsersModel")(db)
    const authController = require("../controllers/authController")(UsersModel)
    
    //route de vérification du token et de reconnexion automatique
    app.get('/api/v1/user/checkToken', withAuth, authController.checkToken)
}