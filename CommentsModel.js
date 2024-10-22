const withAuth = require('../middleware/withAuth')

module.exports = (CommentsModel) => {

    // Fonction pour sauvegarder un commentaire
    const saveOneComment = async (req, res) => {
        try {
            // Récupération des données du corps de la requête (ID utilisateur, contenu, ID du tome)
            const { users_id, content, tomes_id } = req.body

            // Vérification que les données nécessaires sont présentes
            if (!req.body.users_id || !req.body.content || req.body.tomes_id === undefined) {
                return res.json({ status: 400, msg: "Données manquantes!" })
            }

            // Enregistrement du commentaire via le modèle
            const comment = await CommentsModel.saveOneComment(users_id, content, tomes_id)

            // Vérification si l'enregistrement s'est bien passé ou s'il y a eu une erreur
            if (comment.code) {
                return res.json({ status: 500, msg: "Échec de l'enregistrement du commentaire!" })
            } else {
                return res.json({ status: 200, msg: "Commentaire enregistré avec succès!" })
            }
        } catch (err) {
            // En cas d'erreur, renvoye un statut 500 et un message d'erreur
            return res.json({ status: 500, msg: "Une erreur s'est produite!" })
        }
    }

    // Fonction pour récupérer un commentaire spécifique par son ID
    const getOneComment = async (req, res) => {
        try {
            // Appel du modèle pour récupérer les détails d'un commentaire
            const commentDetails = await CommentsModel.getCommentWithDetails(req.params.id)

            // Vérification si le commentaire a été trouvé
            if (!commentDetails || Object.keys(commentDetails).length === 0) {
                return res.status(404).json({ status: 404, msg: "Commentaire non trouvé" })
            }

            // Structuration des données du commentaire et des informations de l'utilisateur associé
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

            // Retour du commentaire structuré avec succès
            return res.status(200).json({ status: 200, comment })
        } catch (err) {
            // En cas d'erreur, renvoye un statut 500 et un message d'erreur
            return res.status(500).json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    // Fonction pour récupérer tous les commentaires d'un tome spécifique
    const getCommentsForTome = async (req, res) => {
        try {
            // Récupérer l'ID du tome depuis les paramètres de la requête
            const { tomeId } = req.params

            // Appel le modèle pour obtenir les commentaires liés à ce tome
            const comments = await CommentsModel.getCommentsForTome(tomeId)
    
            // Vérification si des commentaires sont trouvés
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

    // Fonction pour récupérer tous les commentaires
    const getAllComment = async (req, res) => {
        try {
            // Récupéreration de tous les commentaires via le modèle
            const comment = await CommentsModel.getAllComment()

            // Vérification si une erreur s'est produite
            if (comment.code) {
                return res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                // Renvoie la liste des commentaires
                return res.json({ status: 200, result: comment })
            }
        } catch (err) {
            // En cas d'erreur, renvoye un statut 500 et un message d'erreur
            return res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    // Fonction pour mettre à jour un commentaire
    const updateOneComment = async (req, res) => {
        try {
            // Récupération des données de la requête
            const { commentId, content, status } = req.body

            // Appel du modèle pour mettre à jour le commentaire
            const updateComment = await CommentsModel.updateOneComment(commentId, content, status)

            // Vérification si la mise à jour a bien été effectuée
            if (updateComment.affectedRows === 0) {
                return res.json({ status: 500, msg: "Le commentaire n'a pas pu être modifié!" })
            } else {
                // Confirmation du succès de la mise à jour
                return res.json({ status: 200, msg: "Le commentaire a été modifié!" })
            }
        } catch (err) {
            // En cas d'erreur, renvoye un statut 500 et un message d'erreur
            return res.json({ status: 500, msg: "Le commentaire n'a pas pu être modifié!" })
        }
    }

    // Fonction pour supprimer un commentaire
    const deleteOneComment = async (req, res) => {
        try {
            // Appel du modèle pour supprimer le commentaire
            const deleteComment = await CommentsModel.deleteOneComment(req.params.id)

            // Vérification si la suppression a échoué
            if (deleteComment.code) {
                res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                // Confirmation de la suppression
                res.json({ status: 200, msg: "Commentaire supprimée" })
            }
        } catch (err) {
            // En cas d'erreur, renvoye un statut 500 et un message d'erreur
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
