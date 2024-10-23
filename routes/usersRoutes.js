const withAuth = require ('../middleware/withAuth')
const withAuthAdmin = require('../middleware/withAuthAdmin')

module.exports = (app, db) => {
    const UsersModel = require("../models/UsersModel")(db)
    const usersController = require("../controllers/usersController")(UsersModel)
    
    //route d'enregistrement d'un contact
    app.post('/api/v1/user/save', usersController.saveUser)
    //route de connexion d'un utilisateur (c'est ici qu'on va créer le token qui renvoi vers le front)
    app.post('/api/v1/user/login', usersController.loginUser)  
    //route de modification d'un utilisateur
    app.put('/api/v1/user/update/:id', withAuth, usersController.updateUser)
    // Route de modification du statut d'un utilisateur
    app.put('/api/v1/user/status/:id', withAuthAdmin, usersController.updateUserStatus)
    // Route pour récupérer un utilisateur par son ID
    app.get('/api/v1/user/:id', withAuth, usersController.getOneUser)
    //route de récupération de tous les utilisateurs
    app.get('/api/v1/users/all', withAuthAdmin, usersController.getAllUsers)
    //route de modification de tous les utilisateurs par son status
    app.get('/api/v1/users/:status', withAuthAdmin, usersController.updateAllUsersByStatus)
    //route de suppression d'un utilisateur
    app.delete('/api/v1/user/delete/:id', usersController.deleteUser)
}