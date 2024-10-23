const withAuth = require ('../middleware/withAuth')
const withAuthAdmin = require('../middleware/withAuthAdmin')

module.exports = (app, db) => {
    const CommentsModel = require("../models/CommentsModel")(db)
    const commentsController = require("../controllers/commentsController")(CommentsModel)
    
    //route de sauvegarde complète d'un commentaire
    app.post('/api/v1/comment/save', commentsController.saveOneComment)
    //route de modification d'un commentaire d'un utilisateur
    app.put('/api/v1/comment/updateComment', withAuthAdmin, commentsController.updateOneComment)
    //route de récupération d'un commentaire
    app.get('/api/v1/comment/getOneComment/:id', withAuthAdmin, commentsController.getOneComment)
    //route de récupération des commentaires lié à un tome spécifique
    app.get('/api/v1/comment/getCommentsForTome/:tomeId', withAuth, commentsController.getCommentsForTome)
    //route de récupération de toutes les commentaires
    app.get('/api/v1/comment/all', commentsController.getAllComment)
    //route permettant de supprimer un commentaire
    app.delete('/api/v1/comment/deleteComment/:id', withAuthAdmin, commentsController.deleteOneComment)
}