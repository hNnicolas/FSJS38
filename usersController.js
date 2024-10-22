const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const secret = 'fsjs38'

module.exports = (UsersModel) => {
    // Fonction pour enregistrer un nouvel utilisateur
    const saveUser = async (req, res) => {
        try {
            const { firstname, lastname, email, password } = req.body // Extraction des données de la requête

            // Vérification si le nom ou prénom contient des chiffres
            if (/\d/.test(firstname) || /\d/.test(lastname)) {
                return res.status(400).json({ msg: "Le prénom et le nom ne doivent pas contenir de chiffres !" })
            }

            // Vérification si le nom ou prénom contient uniquement des lettres ou certains caractères spéciaux
            const nameRegex = /^[a-zA-Zéèïëîôû-]+$/
            if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
                return res.status(400).json({ msg: "Le prénom et le nom ne contiennent que des lettres ou les caractères spéciaux (é, è, -, ï, î, ë, ô, û) !" })
            }

            // Vérification du format de l'adresse email
            const emailRegex = /^[a-zA-Z0-9._%+-ïîëôû]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (!emailRegex.test(email)) {
                return res.status(400).json({ msg: "Adresse email invalide !" })
            }

            // Vérification de la robustesse du mot de passe
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
            if (!passwordRegex.test(password)) {
                return res.status(400).json({ msg: "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial !" })
            }

            // Vérification si l'utilisateur existe déjà avec cet email
            const users = await UsersModel.getUserByEmail(req.body.email)
            if (users.code) {
                res.status(500).json({ msg: "Oups, une erreur est survenue!" })
            } else {
                if (users.length > 0) { // Si l'email est déjà utilisé
                    res.status(401).json({ msg: "Vous ne pouvez pas créer de compte avec ces identifiants!" })
                } else { // Enregistrement de l'utilisateur si tout est valide
                    const user = await UsersModel.saveOneUser(req)
                    if (user.code) {
                        res.json({ status: 401, msg: "Oups, une erreur est survenue!" })
                    } else {
                        // L'utilisateur a bien été enregistré
                        res.json({ status: 200, msg: "L'utilisateur a bien été enregistré!" })
                    }
                }
            }
        } catch (err) {
            res.status(500).json({ msg: "Oups, une erreur est survenue!" })
        }
    }
    
    // Fonction pour authentifier un utilisateur
    const loginUser = async (req, res) => {
        try {
            // Vérification de l'existence de l'utilisateur par email
            const check = await UsersModel.getUserByEmail(req.body.email)
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
    
        } catch (err) {
            res.json({ status: 500, msg: "Oups, une erreur est survenue 3!" })
        }
    }
    
    // Fonction pour mettre à jour les informations d'un utilisateur
    const updateUser = async (req, res) => {
        try {
          const result = await UsersModel.updateUser(req, req.params.id)

          // Gestion des erreurs lors de la mise à jour
          if (result.code) {
            res.status(500).json({ msg: 'Erreur mise à jour de l\'utilisateur.' })
          } else {
            // Si mise à jour réussie, récupération de tous les utilisateurs avec le même statut
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

      // Fonction pour changer le statut d'un utilisateur
      const updateUserStatus = async (req, res) => {
        try {
            const userId = req.params.id // Récupération de l'ID de l'utilisateur
            const newStatus = req.body.status // Nouveau statut à appliquer
    
            const result = await UsersModel.updateUserStatus(userId, newStatus)
    
            if (result.code) {
                res.status(500).json({ msg: 'Erreur lors de la mise à jour du statut de l\'utilisateur.' })
            } else {
                res.status(200).json({ msg: 'Statut de l\'utilisateur mis à jour avec succès.' })
            }
        } catch (err) {
            res.status(500).json({ msg: 'Oups, une erreur est survenue!' })
        }
    }
    
    // Fonction pour mettre à jour un utilisateur en fonction de son ID et récupérer tous les utilisateurs par statut
    const updateAllUsersByStatus = async (req, res) => {
        try {
            // Met à jour l'utilisateur avec l'ID fourni dans les paramètres de la requête
            const users = await UsersModel.updateUser(req, req.params.id)
            // Vérifie s'il y a une erreur lors de la mise à jour
            if(users.code){
                res.json({status: 500, msg: "Erreur mise à jour de l'utilisateur."})
            } else {
                // Récupère tous les utilisateurs ayant un statut spécifique
                const newUsers = await UsersModel.getAllUsersByStatus(req.params.status)
                // Vérifie s'il y a une erreur lors de la récupération des utilisateurs par statut
                if(newUsers.code) {
                    res.json({status: 500, msg: "Oups, une erreur est survenue!"})
                } else {
                    // Formate les données du premier utilisateur récupéré pour la réponse
                    const myUser = {
                        id: newUsers[0].id,
                        firstname: newUsers[0].firstname,
                        lastname: newUsers[0].lastname,
                        email: newUsers[0].email
                    }
                    // Retourne une réponse avec l'utilisateur mis à jour et le nouveau statut
                    res.json({status: 200, msg: "Utilisateur modifié!", newUsers: myUser})
                }
            }
        } catch(err) {
            // En cas d'erreur, renvoye une réponse avec un statut 500
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }

    // Fonction pour récupérer un utilisateur par son ID
    const getOneUser = async (req, res) => {
        try {
            const userId = req.params.id  // Récupère l'ID depuis les paramètres de la requête
            const user = await UsersModel.getOneUser(userId) // Exécute une requête pour récupérer l'utilisateur par son ID
            
            // Vérifie si l'utilisateur existe dans la base de données
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
            // En cas d'erreur, renvoye une réponse avec un statut 500
            res.status(500).json({ msg: "Oups, une erreur est survenue!" })
        }
    }
    
    // Fonction pour récupérer tous les utilisateurs
    const getAllUsers = async (req, res) => {
        try {
            const users = await UsersModel.getAllUsers()
            if(users.code){
                // Si une erreur se produit pendant la récupération des utilisateurs
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                // Envoie les utilisateurs récupérés avec un statut de succès
                res.json({status: 200, result: users})
            }
        } catch(err) {
            // En cas d'erreur, renvoye une réponse avec un statut 500
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    
    // Fonction pour supprimer un utilisateur
    const deleteUser = async (req, res) => {
        try {
            const deleteUser = await UsersModel.deleteOneUser(req.params.id) // Supprime l'utilisateur par son ID
            if(deleteUser.code){
                // Si une erreur se produit lors de la suppression de l'utilisateur
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                // Envoie une réponse de succès lorsque l'utilisateur est supprimé
                res.json({status: 200, msg: "Utilisateur supprimé!"})
            }
        } catch(err) {
            // En cas d'erreur, renvoye une réponse avec un statut 500
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
