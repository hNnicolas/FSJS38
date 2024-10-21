const withAuth = require('../middleware/withAuth')

module.exports = (ContactsModel) => {

// Sauvegarder un contact
    const saveContact = async (req, res) => {
        try {
            const contact = await ContactsModel.saveOneContact(req)
            if (contact.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                res.json({status: 200, msg: "le contact est bien enregistré!"})
            }
        } catch(err) {
            console.error("Erreur lors de la sauvegarde du contact:", err)
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }

// Récup&rer un contact par ID
    const getOneContact = async () => {
    try {
        const contact = await ContactsModel.getOneContact(req.params.id)
        if(contact.code){
            res.json({status:500, msg: "Oups, une erreur est survenu!"})
        } else {
            res.json({status: 200, result: contact[0]})
        }
    } catch(err) {
        console.error("Erreur lors de la récupération du contact:", err)
        res.json({status: 500, msg: "Oups, une erreur est survenue!"})
    }
}

// Récupérer tous les contacts
    const getAllContacts = async (req, res) => {
    try{
        const contacts = await ContactsModel.getAllContacts()
        if(contacts.code){
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        } else {
            res.json({status: 200, result: contacts})
        }
    } catch(err) {
        console.error("Erreur lors de la récupération de tous les contacts:", err)
        res.json({status: 500, msg: "Oups, une erreur est survenue!"})
    }
}

// Mettre à jour un contact
    const updateContact = async (req, res) => {
    try {
        const contact = await ContactsModel.updateOneContact(req, req.params.id)
        if(contact.code){
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        } else {
            res.json({status: 200, msg: "Contact modifié!"})
        }
    } catch(err) {
        console.error("Erreur lors de la modification du contact:", err)
        res.json({status: 500, msg: "Oups, une erreur est survenue!"})
    }
}
// Supprimer un contact
    const deleteContact = async (req, res) => {
    try{
       const contact = await ContactsModel.deleteOneContact(req.params.id)
       if(contact.code){
          res.json({status: 500, msg: "Oups, une erreur est survenue!"})
       } else {
           res.json({status: 200, msg: "Contact supprimé!"})
       }
    } catch(err) {
        res.json({status: 500, msg: "Oups, une erreur est survenue!"})
    }
}

    return {
     saveContact,
     getOneContact,
     getAllContacts,
     updateContact,
     deleteContact
    }

}