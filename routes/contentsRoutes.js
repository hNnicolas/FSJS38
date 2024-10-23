const withAuthAdmin = require('../middleware/withAuthAdmin')

module.exports = (app, db) => {
    const ContentsModel = require("../models/ContentsModel")(db)
    const contentsController = require("../controllers/contentsController")(ContentsModel)
    
//route permettant d'enregistrer un contenu
app.post('/api/v1/content/save', withAuthAdmin, contentsController.saveContent)
//route permettant de récupérer un contenu
app.get('/api/v1/content/one/:id', withAuthAdmin, contentsController.getOneContent)
//route permettant de modifier un contenu
app.put('/api/v1/content/update/:id', withAuthAdmin, contentsController.updateContent)
//route permettant de supprimer un contenu
app.delete('/api/v1/content/delete/:id', withAuthAdmin, contentsController.deleteOneContent)

}
