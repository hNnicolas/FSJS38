const withAuth = require ('../middleware/withAuth')
const withAuthAdmin = require('../middleware/withAuthAdmin')

module.exports = (app, db) => {
    const ContactsModel = require("../models/ContactsModel")(db)
    const contactsController = require("../controllers/contactsController")(ContactsModel)

//route permettant d'enregistrer un contact
app.post('/api/v1/contact/save', withAuth, contactsController.saveContact)
//route permettant de récupérer un contact
app.get('/api/v1/contact/one/:id', withAuthAdmin, contactsController.getOneContact)
//route permettant de récupérer tous les contact
app.get('/api/v1/contacts/all', withAuthAdmin, contactsController.getAllContacts)
//route permettant de modifier un contact
app.put('/api/v1/contact/update/:id', withAuthAdmin, contactsController.updateContact)
//route permettant de supprimer un contact
app.delete('/api/v1/contact/delete/:id', withAuthAdmin, contactsController.deleteContact)

}
