import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { getOneComment, updateOneComment } from "../../../api/comments"
import moment from "moment"

const CommentDetail = () => {
    // Récupération de l'ID du commentaire depuis les paramètres d'URL
    const { id } = useParams()

    // Déclaration des états pour stocker le commentaire, l'utilisateur, et les messages de succès et d'erreur
    const [comment, setComment] = useState(null)
    const [user, setUser] = useState(null)
    const [successMessage, setSuccessMessage] = useState("") 
    const [errorMessage, setErrorMessage] = useState("")     

    // Fonction pour changer le statut du commentaire
    const changeStatus = (newStatus) => {
        // Création de l'objet datas contenant l'ID du commentaire, son contenu et le nouveau statut
        const datas = {
            commentId: id,
            content: comment?.text || "", 
            status: newStatus
        }

        // Appel de la fonction pour mettre à jour le commentaire
        updateOneComment(datas)
        .then((res) => {
            // Vérification de la réponse de la mise à jour
            if (res.status === 200) {
                setSuccessMessage("Le statut du commentaire a été mis à jour avec succès.")
                setErrorMessage("")
                
                // Mise à jour de l'état du commentaire avec le nouveau statut
                setComment(prevComment => ({
                    ...prevComment,
                    status: newStatus
                }))
            } 
        })
}

     // Fonction pour récupérer les détails du commentaire
    const recupComment = () => {
        // Appel de la fonction pour récupérer un commentaire par son ID
        getOneComment(id)
            .then((res) => { 
                // Vérification de la réponse de la récupération
                if (res.status === 200) {
                    setComment(res.comment) // Mise à jour de l'état avec les détails du commentaire
                    setUser(res.comment.user) // Mise à jour de l'état avec les informations de l'utilisateur
                } 
            })
    }

    useEffect(() => {
        recupComment() // Appel de la fonction pour récupérer le commentaire
    }, [id])

    // Déterminer l'id pour le statut du commentaire
    const statusId = comment?.status === 0 ? "status-sensitive" : "status-published"

    return (
        <section id="comment-detail">
            <Link to="/admin" id="back-link">Retour à l'admin</Link>
            <h2>Détails du commentaire {id}</h2>

            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            {user && (
                <article id="user-info">
                    <h3>Utilisateur : {user.firstName} {user.lastName}</h3>
                    <p>Email : {user.email}</p>
                </article>
            )}
            {comment && (
                <div id="comment-info">
                    <h3>Détails du commentaire</h3>
                    <table id="tableComments">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Contenu</th>
                                <th>Date</th>
                                <th>ID Utilisateur</th>
                                <th>ID Tome</th> 
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>Date de publication</td>
                                <td>{moment(comment.date).format("DD-MM-YYYY")}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>Statut</td>
                                <td id={statusId}>
                                    {comment.status === 0 ? "Non publié" : "Publié"}
                                </td>
                            </tr>
                        </tfoot>
                        <tbody>
                            <tr key={comment.id}>
                                <td>{comment.id}</td>
                                <td>{comment.text}</td>
                                <td>{moment(comment.date).format("DD-MM-YYYY")}</td>
                                <td>{comment.user?.id}</td>
                                <td>{comment.tomeId}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            <div id="status-buttons">
                <button
                    onClick={() => changeStatus(0)}
                    id="btn-unpublish"
                >
                    Marquer comme non publié
                </button>
                <button
                    onClick={() => changeStatus(1)}
                    id="btn-publish"
                >
                    Publier
                </button>
            </div>
        </section>
    )
}

export default CommentDetail
