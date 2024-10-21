const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const secret = 'fsjs38'

module.exports = (UsersModel) => {
        const saveUser = async (req, res) => {
            try{
                const { firstname, lastname, email, password } = req.body

        // Vérification si le nom ou prénom contient un chiffre
        if (/\d/.test(firstname) || /\d/.test(lastname)) {
            return res.status(400).json({ msg: "Le prénom et le nom ne doivent pas contenir de chiffres !" })
        }

        // Vérification si le nom ou prénom contient un charactère spécial défini
        const nameRegex = /^[a-zA-Zéèïëîôû-]+$/
        if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
            return res.status(400).json({ msg: "Le prénom et le nom ne contiennent que des lettres ou les caractères spéciaux (é, è, -, ï, î, ë, ô, û) !" })
        }

        // Vérification du format de l'email
        const emailRegex = /^[a-zA-Z0-9._%+-ïîëôû]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Adresse email invalide !" })
        }

        // Vérification du mot de passe robuste
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ msg: "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial !" })
        }
            const users = await UsersModel.getUserByEmail(req.body.email)
             if(users.code){ 
                res.status(500).json({msg: "Oups, une erreur est survenue!"})
            } else {
                if(users.length > 0){ // Si l'email de l'utilisateur est déjà existant
                    res.status(401).json({msg: "Vous ne pouvez pas créer de compte avec ces identifiants!"})
                } else { // we all good and we save the new user
                    const user = await UsersModel.saveOneUser(req)
                   if(user.code){ 
                        res.json({status:401, msg: "Oups, une erreur est survenue!"})
                   } else { // We did it boys  !
                        res.json({status:200, msg: "L'utilisateur a bien été enregistré!"})
                        console.log("user save")
                   }
                }
            }
        } catch(err) {
            res.status(500).json({msg: "Oups, une erreur est survenue!"})
        }

    }
    
    const loginUser = async (req, res) => {
        try {
            // Récupération de l'utilisateur par email
            const check = await UsersModel.getUserByEmail(req.body.email)
    
            // Vérification des erreurs de requête
            if (check.code) {
                return res.json({ status: 500, msg: "Oups, une erreur est survenue 1!" })
                
            }
    
            // Vérification de l'existence de l'utilisateur
            if (check.length === 0) {
                return res.json({ status: 404, msg: "Utilisateur introuvable!" })
            }

            // Vérification du statut de l'utilisateur (si banni, status = 0)
            if (check[0].status === 0) {
                return res.json({ status: 403, msg: "Votre compte a été banni, vous ne pouvez pas vous connecter." })
            }
    
            // Comparaison des mots de passe
            const same = await bcrypt.compare(req.body.password, check[0].password)
    
            if (!same) {
                return res.json({ status: 401, msg: "Mot de passe incorrect!" })
            }
    
            // Génération du token
            const payload = { id: check[0].id, role: check[0].role }
            const token = jwt.sign(payload, secret)
    
            // Mise à jour de la dernière connexion
            const connect = await UsersModel.updateConnexion(check[0].id)
    
            if (connect.code) {
                return res.json({ status: 500, msg: "Oups, une erreur est survenue 2!" })
            }
    
            // Préparation de l'objet utilisateur à envoyer au front-end
            const user = {
                id: check[0].id,
                firstname: check[0].firstname,
                lastname: check[0].lastname,
                email: check[0].email,
                role: check[0].role,
                status: check[0].status
            }
    
            // Réponse avec le token et les informations de l'utilisateur
            res.json({ status: 200, token: token, user: user })
            console.log("Bravo, tu t'es connecté Bro!")
    
        } catch (err) {
            res.json({ status: 500, msg: "Oups, une erreur est survenue 3!" })
        }
    }
    
    const updateUser = async (req, res) => {
        try {
          console.log(`Mise à jour de l'utilisateur ID ${req.params.id} avec les données:`, req.body)

          const result = await UsersModel.updateUser(req, req.params.id)
          if (result.code) {
            res.status(500).json({ msg: 'Erreur mise à jour de l\'utilisateur.' })
          } else {
            const updatedUser = await UsersModel.getAllUsersByStatus(req.body.status)
            if (updatedUser.code) {
              res.status(500).json({ msg: 'Oups, une erreur est survenue!' })
            } else {
              res.status(200).json({ msg: 'Utilisateur modifié!', newUsers: updatedUser })
            }
          }
        } catch (err) {
          res.status(500).json({ msg: 'Oups, une erreur est survenue!' })
        }
      }

      const updateUserStatus = async (req, res) => {
        try {
            const userId = req.params.id
            const newStatus = req.body.status
    
            const result = await UsersModel.updateUserStatus(userId, newStatus)
    
            if (result.code) {
                res.status(500).json({ msg: 'Erreur lors de la mise à jour du statut de l\'utilisateur.' })
            } else {
                console.log(result, "Bravo, la statut est modifié")
                res.status(200).json({ msg: 'Statut de l\'utilisateur mis à jour avec succès.' })
            }
        } catch (err) {
            res.status(500).json({ msg: 'Oups, une erreur est survenue!' })
        }
    }
      
    const updateAllUsersByStatus = async (req, res) => {
        try {
            console.log(`Mise à jour du statut des utilisateurs avec le status ${req.params.status}`)
            const users = await UsersModel.updateUser(req, req.params.id)
            if(users.code){
                res.json({status: 500, msg: "Erreur mise à jour de l'utilisateur."})
            } else {
                const newUsers = await UsersModel.getAllUsersByStatus(req.params.status)
                if(newUsers.code) {
                    res.json({status: 500, msg: "Oups, une erreur est survenue!"})
                } else {
                    console.log("Utilisateur modifié avec succès")
                    const myUser = {
                        id: newUsers[0].id,
                        firstname: newUsers[0].firstname,
                        lastname: newUsers[0].lastname,
                        email: newUsers[0].email
                    };
                    res.json({status: 200, msg: "Utilisateur modifié!", newUsers: myUser})
                }
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }

    const getOneUser = async (req, res) => {
        try {
            const userId = req.params.id  // Récupère l'ID depuis les paramètres de la requête
            const user = await UsersModel.getOneUser(userId)
            
            if (user.length === 0) {
                return res.status(404).json({ msg: "Utilisateur non trouvé" })
            }
    
            // Envoie les données de l'utilisateur (sans le mot de passe)
            res.status(200).json({
                id: user[0].id,
                firstname: user[0].firstname,
                lastname: user[0].lastname,
                email: user[0].email,
                role: user[0].role
            })
        } catch (err) {
            res.status(500).json({ msg: "Oups, une erreur est survenue!" })
        }
    }
    
    const getAllUsers = async (req, res) => {
        try {
            const users = await UsersModel.getAllUsers()
            if(users.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                res.json({status: 200, result: users})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    
    const deleteUser = async (req, res) => {
        try {
            console.log(`ID de l'utilisateur à supprimer: ${req.params.id}`)
            const deleteUser = await UsersModel.deleteOneUser(req.params.id)
            if(deleteUser.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                console.log("Utilisateur supprimé avec succès.")
                res.json({status: 200, msg: "Utilisateur supprimé!"})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    
    return {
        saveUser,
        loginUser,
        updateUser,
        updateUserStatus,
        getOneUser,
        getAllUsers,
        updateAllUsersByStatus,
        deleteUser
    }
}