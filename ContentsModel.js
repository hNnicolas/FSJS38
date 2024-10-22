const fs = require("fs")

module.exports = (ContentsModel) => {

    // Fonction pour sauvegarder un nouveau contenu
    const saveContent = async (req, res) => {
        // Extraction des données du corps de la requête
        const { picture, alt, rang, tomes_id } = req.body
        
        try {
            // Sauvegarde le contenu en utilisant le modèle
            const content = await ContentsModel.saveOneContent(picture, alt, rang, tomes_id)
            
            // Vérification du résultat
            if (content.code) {
                // Si une erreur se produit lors de l'enregistrement
                res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                // Sinon le contenu est sauvegardé avec succès
                res.json({ status: 200, msg: "Le contenu du tome est bien enregistré!" })
            }
        } catch (err) {
            // En cas d'erreur, renvoye une réponse avec un statut 500
            res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    // Fonction pour récupérer un contenu par son ID
    const getOneContent = async (req, res) => {
        try {
            // Appel le modèle pour récupérer un contenu avec son ID
            const content = await ContentsModel.getOneContent(req.params.id)

            // Vérification du résultat
            if(content.code){
                res.json({status:500, msg: "Oups, une erreur est survenu!"})
            } else {
                // Retourne le contenu si trouvé
                res.json({status: 200, result: content[0]})
            }
        } catch(err) {
            // En cas d'erreur, renvoye une réponse avec un statut 500
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }

    // Fonction pour mettre à jour un contenu existant
    const updateContent = async (req, res) => {
        try {
            // Mise à jour du contenu en utilisant le modèle
            const content = await ContentsModel.updateOneContent(req)
    
            // Vérification du résultat
            if (content.code) {
                return res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                // Retourne le contenu modifié avec succès
                return res.json({ status: 200, msg: "Tome modifié!" })
            }
        } catch (err) {
            // En cas d'erreur, renvoyer une réponse avec un statut 500
            return res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    // Fonction pour supprimer un contenu
    const deleteOneContent = (req, res) => {
        // Récupéreration de l'ID du contenu à supprimer
        const contentId = req.params.id
    
        // Récupérer le contenu à supprimer
        ContentsModel.getOneContent(contentId)
            .then(content => {
                // Vérifier si le contenu existe
                if (!content || content.length === 0) {
                    return res.status(404).json({ msg: "Contenu non trouvé ou format incorrect" })
                }
    
                // Si le contenu existe, procéde à sa suppression
                return ContentsModel.deleteOneContent(contentId)
                    .then(deleteResult => {
                        // Vérifier si la suppression a réussi
                        if (deleteResult.code) {
                            return res.status(500).json({ msg: "Erreur lors de la suppression du contenu." })
                        }
    
                        // Si le contenu a une image associée (et qu'il ne s'agit pas d'une image par défaut), supprimer l'image du serveur
                        if (content[0].photo && content[0].photo !== "Tome1-cover.webp") { 
                            return fs.unlink(`public/images/tomes/${content[0].photo}`)
                        }
                    })
            })
            .then(() => {
                // Si tout s'est bien passé, renvoye une réponse de succès
                return res.status(200).json({ msg: "Contenu supprimé avec succès." })
            })
            .catch(error => {
                // En cas d'erreur lors du processus de suppression
                console.error(error)
                return res.status(500).json({ msg: "Oups, une erreur est survenue." })
            })
    }
    
    return {
        saveContent,
        getOneContent,
        updateContent,
        deleteOneContent
    }   
}
