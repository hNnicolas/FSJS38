const bcrypt = require('bcryptjs')
const saltRounds = 10

module.exports = (_db)=>{
    db=_db
    return UsersModel
}

class UsersModel {
     // Sauvegarde d'un utilisateur
     static async saveOneUser(req) {
        //on hash le password
        return bcrypt.hash(req.body.password, saltRounds)
        .then((hash) => {
            // on enregistre dans la BDD
            return db.query('INSERT INTO users (firstname, lastname, email, password, created_at) VALUES (?, ?, ?, ?, NOW())', 
        [req.body.firstname, req.body.lastname, req.body.email, hash])
            .then((res)=>{
                console.log(res)
                return res
            })
            .catch((err)=>{
                console.log(err)
                return err
            })
        }) 
        .catch(err=>err)
        
    }
    
    //récupération d'un utilisateur en fonction de son mail 
    static getUserByEmail(email){
        return db.query("SELECT id, firstname, lastname, password, role, status FROM users WHERE email = ?", [email])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //récupération d'un utilisateur par son id 
    static getOneUser(id){
        return db.query("SELECT firstname, lastname, email, password, role FROM users WHERE id = ?", [id])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }

     //modification d'un utilisateur
     static updateUser(req, userId) {
        return db.query("UPDATE users SET firstname = ?, lastname = ? WHERE id = ?", [req.body.firstname, req.body.lastname, userId])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }

    //modification du status d'un utilisateur
    static updateUserStatus(userId, newStatus) {
        return db.query("UPDATE users SET status = ? WHERE id = ?", [newStatus, userId])
          .then((res) => res)
          .catch((err) => err)
      }
    
     //récupération de tous les utilisateurs
     static getAllUsers(){
        return db.query("SELECT * FROM users LIMIT 100")
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }

      //récupération de tous les utilisateurs par leur status (0 = tous les utilisateurs bannis, 1 = tous les utilisateurs autorisés)
      static getAllUsersByStatus(status){
        return db.query("SELECT id, firstname, lastname, email FROM users WHERE status = ?", [status])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //modification de la dernière connexion d'un utilisateur
    static updateConnexion(id) {
        return db.query("UPDATE users SET last_connection = NOW() WHERE id = ?", [id])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //suppression d'un compte utilisateur
    static deleteOneUser(id){
        return db.query("DELETE FROM users WHERE id = ?", [id])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
}