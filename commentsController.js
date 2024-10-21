const withAuth = require('../middleware/withAuth')

module.exports = (CommentsModel) => {

    const saveOneComment = async (req, res) => {
        try {
            const { users_id, content, tomes_id } = req.body
            console.log('Yeah! Congrats, ton commentaire est sauvegardé! :) :', { users_id, content, tomes_id })

            if (!req.body.users_id || !req.body.content || req.body.tomes_id === undefined) {
                return res.json({ status: 400, msg: "Données manquantes!" })
            }

            // Enregistrement du commentaire
            const comment = await CommentsModel.saveOneComment(users_id, content, tomes_id);

            if (comment.code) {
                return res.json({ status: 500, msg: "Échec de l'enregistrement du commentaire!" })
            } else {
                return res.json({ status: 200, msg: "Commentaire enregistré avec succès!" })
            }
        } catch (err) {
            return res.json({ status: 500, msg: "Une erreur s'est produite!" })
        }
    }

    const getOneComment = async (req, res) => {
        try {
            const commentDetails = await CommentsModel.getCommentWithDetails(req.params.id)
            console.log("Détails du commentaire récupérés:", commentDetails)

            if (!commentDetails || Object.keys(commentDetails).length === 0) {
                return res.status(404).json({ status: 404, msg: "Commentaire non trouvé" })
            }

            const comment = {
                id: commentDetails.comment_id,
                text: commentDetails.comment_text,
                tomeId: commentDetails.tome_id,
                user: {
                    id: commentDetails.user_id,
                    firstName: commentDetails.firstname,
                    lastName: commentDetails.lastname,
                    email: commentDetails.email
                }
            }

            return res.status(200).json({ status: 200, comment })
        } catch (err) {
            return res.status(500).json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    const getCommentsForTome = async (req, res) => {
        try {
            // Récupérer l'ID du tome depuis les paramètres de la requête
            const { tomeId } = req.params

            // Appel le modèle pour obtenir les commentaires liés à ce tome
            const comments = await CommentsModel.getCommentsForTome(tomeId)
    
            // Vérifie si des commentaires sont trouvés
            if (comments.length === 0) {
                return res.status(404).json({ status: 404, msg: "Aucun commentaire trouvé pour ce tome." });
            }
    
            // Retourne les commentaires avec succès
            return res.status(200).json({ status: 200, comments })
        } catch (err) {
            // En cas d'erreur, renvoye un statut 500 et un message d'erreur
            return res.status(500).json({ status: 500, msg: "Erreur lors de la récupération des commentaires." })
        }
    }

    const getAllComment = async (req, res) => {
        try {
            const comment = await CommentsModel.getAllComment()
            if (comment.code) {
                return res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                return res.json({ status: 200, result: comment })
            }
        } catch (err) {
            return res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    const updateOneComment = async (req, res) => {
        try {
            const { commentId, content, status } = req.body
            console.log('Données reçues:', { commentId, content, status })

            const updateComment = await CommentsModel.updateOneComment(commentId, content, status)

            if (updateComment.affectedRows === 0) {
                return res.json({ status: 500, msg: "Le commentaire n'a pas pu être modifié!" })
            } else {
                return res.json({ status: 200, msg: "Le commentaire a été modifié!" })
            }
        } catch (err) {
            return res.json({ status: 500, msg: "Le commentaire n'a pas pu être modifié!" })
        }
    }

    const deleteOneComment = async (req, res) => {
        try {
            const deleteComment = await CommentsModel.deleteOneComment(req.params.id)
            if (deleteComment.code) {
                res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                console.log(deleteComment,"commentaire supprimée")
                res.json({ status: 200, msg: "Commentaire supprimée" })
            }
        } catch (err) {
            res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    return {
        saveOneComment,
        getOneComment,
        getCommentsForTome,
        getAllComment,
        updateOneComment,
        deleteOneComment
    }
}
