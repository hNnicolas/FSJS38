const fs = require("fs")

module.exports = (ContentsModel) => {
    const saveContent = async (req, res) => {
        const { picture, alt, rang, tomes_id } = req.body
        
        try {
            // Sauvegarder le contenu en utilisant le modèle
            const content = await ContentsModel.saveOneContent(picture, alt, rang, tomes_id)
            
            // Vérification du résultat
            if (content.code) {
                res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                res.json({ status: 200, msg: "Le contenu du tome est bien enregistré!" })
            }
        } catch (err) {
            res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    const getOneContent = async (req, res) => {
        try {
            const content = await ContentsModel.getOneContent(req.params.id)
            if(content.code){
                res.json({status:500, msg: "Oups, une erreur est survenu!"})
            } else {
                res.json({status: 200, result: content[0]})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }

    const updateContent = async (req, res) => {
        try {
            const content = await ContentsModel.updateOneContent(req)
    
            if (content.code) {
                return res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                return res.json({ status: 200, msg: "Tome modifié!" });
            }
        } catch (err) {
            return res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    const deleteOneContent = (req, res) => {
        const contentId = req.params.id
    
        // Récupérer le contenu
        ContentsModel.getOneContent(contentId)
            .then(content => {
                if (!content || content.length === 0) {
                    return res.status(404).json({ msg: "Contenu non trouvé ou format incorrect" })
                }
    
                // Supprimer le contenu
                return ContentsModel.deleteOneContent(contentId)
                    .then(deleteResult => {
                        if (deleteResult.code) {
                            return res.status(500).json({ msg: "Erreur lors de la suppression du contenu." })
                        }
    
                        // Supprimer l'image associée si nécessaire
                        if (content[0].photo && content[0].photo !== "Tome1-cover.webp") { 
                            return fs.unlink(`public/images/tomes/${content[0].photo}`)
                        }
                    })
            })
            .then(() => {
                return res.status(200).json({ msg: "Contenu supprimé avec succès." })
            })
            .catch(error => {
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