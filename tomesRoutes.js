const withAuthAdmin = require('../middleware/withAuthAdmin')

module.exports = (app, db) => {
    const TomesModel = require("../models/TomesModel")(db)
    const tomesController = require("../controllers/tomesController")(TomesModel)
    
    //route permettant de récupérer tous les tomes
    app.get('/api/v1/tome/all', tomesController.getAllTomes)
    //route permettant de récupérer un seul tome
    app.get('/api/v1/tome/one/:id', tomesController.getOneTome)
    //route permettant d'enregistrer un tome
    app.post('/api/v1/tome/save', withAuthAdmin, tomesController.saveTome)
    //route permettant de modifier un tome
    app.put('/api/v1/tome/update/:id', withAuthAdmin, tomesController.updateTome)
    //route permettant de supprimer un tome
    app.delete('/api/v1/tome/:id', withAuthAdmin, tomesController.deleteTome)
    //route d'ajout d'une image dans l'api (stock l'image et retourne le nom)
    app.post('/api/v1/tome/pict', tomesController.savePicture)
}

