module.exports = (_db)=>{
    db = _db
    return ContactsModel
}

class ContactsModel {
    // Sauvegarde d'un contact
    static async saveOneContact(req) {
        return db.query('INSERT INTO contacts (title, content, email) VALUES (?, ?, ?)', 
        [req.body.title, req.body.content, req.body.email])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            console.error("Error saving contact:", err);
            return { code: 500, msg: "Erreur lors de l'enregistrement du contact."} 
        })
    
    }

    // Récupération d'un contact par ID
    static async getContactById(id) {
        return db.query('SELECT title, content, email FROM contacts WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch ((err)=>{
            console.error("Error retrieving contact by ID:", err);
            return { code: 500, msg: "Erreur lors de la récupération du contact." };
        })
    }

    // Récupération de tous les contacts
    static async getAllContacts() {
        return db.query('SELECT title, content, email FROM contacts')
        .then((res)=>{
            return res
        })
        .catch ((err)=>{
            console.error("Error retrieving contacts:", err);
            return { code: 500, msg: "Erreur lors de la récupération des contacts." };
        })
    }


    // Mise à jour d'un contact
    static async updateContact(req, id) {
        return db.query ('UPDATE contacts SET title = ?, content = ?, email = ? WHERE id = ?',[req.body.title, req.body.content, req.body.email, id])
        .then((res)=>{
            return res
        })
        .catch ((err)=>{
            console.error("Error updating contact:", err);
            return { code: 500, msg: "Erreur lors de la mise à jour du contact." };
        })
    }

    // Suppression d'un contact
    static async deleteOneContact(id) {
        return db.query ('DELETE FROM contacts WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch ((err)=>{
            console.error("Error deleting contact:", err);
            return { code: 500, msg: "Erreur lors de la suppression du contact." };
        })
    }
}
