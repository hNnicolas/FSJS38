import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "../slices/userSlice"
import { saveOneComment, getCommentsForTome } from "../api/comments"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons"
import { faLock, faExclamation } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom"

const CommentForm = ({ tomeId, onCommentAdded }) => {
    const [commentContent, setCommentContent] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [comments, setComments] = useState([])
    const user = useSelector(selectUser)
    const [showSocialIcons, setShowSocialIcons] = useState(false)

    // Fonction de récupération des commentaires d'un tome spécifique
    const fetchComments = async () => {
        try {
            // Appel API pour récupérer les commentaires du tome correspondant
            const res = await getCommentsForTome(tomeId === 'tome0' ? 0 : parseInt(tomeId.replace('tome', '')))
            // Filtre les commentaires pour ne garder que ceux qui sont publiés (status === 1)
            const filteredComments = res.data?.filter(comment => comment.status === 1) || []
            // Mise à jour de l'état local avec les commentaires filtrés
            setComments(filteredComments)
        } catch (error) {
            // Affiche un message d'erreur si l'appel API échoue
            setErrorMessage("Erreur lors de la récupération des commentaires.")
            setTimeout(() => setErrorMessage(""), 3000);
        }
    }

    // Chargement des commentaires
    useEffect(() => {
        fetchComments()
    }, [tomeId])

    // Fonction pour sauvegarder un commentaire
    const onClickSaveComment = async (e) => {
        e.preventDefault()

        // Récupère l'ID du tome à partir du formulaire et le convertit en entier
        const hiddenTomeId = parseInt(e.target.elements.tomeId.value.replace('tome', ''), 10)

        if (isNaN(hiddenTomeId)) {
            // Affiche un message d'erreur si l'ID du tome est invalide
            setErrorMessage("L'ID du tome est invalide.")
            setTimeout(() => setErrorMessage(""), 3000)
            return
        }

        // Vérifie si l'utilisateur est connecté et a un ID utilisateur
        if (user?.isLogged && user.infos?.id) {
            const datas = {
                users_id: user.infos.id,
                content: commentContent,
                tomes_id: hiddenTomeId,
            }

            try {
                // Appel API pour sauvegarder le commentaire
                const res = await saveOneComment(datas)
                if (res.status === 200) {
                    // Si l'ajout réussit, affiche un message de succès et réinitialise le champ de commentaire
                    setSuccessMessage("Commentaire enregistré avec succès!")
                    setCommentContent("")
                    onCommentAdded()  // Notifie le parent "readTome" que le commentaire a été ajouté
                    await fetchComments() // Recharge les commentaires
                    setTimeout(() => setSuccessMessage(""), 3000)
                }
            } catch (error) {
                // Gestion des erreurs lors de la sauvegarde du commentaire
                setErrorMessage("Erreur lors de la sauvegarde du commentaire.")
                setTimeout(() => setErrorMessage(""), 3000)
            }
        } else {
            // Affiche un message d'erreur si l'utilisateur n'est pas connecté
            setErrorMessage("Vous devez être connecté pour laisser un commentaire.")
            setTimeout(() => setErrorMessage(""), 3000)
        }
    }

    const toggleSocialIcons = () => {
        setShowSocialIcons(prevState => !prevState)
    }

    return (
        <div id="comments-section">
            <h3>Donnez votre avis</h3>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

            {/* Si l'utilisateur est connecté, on affiche le formulaire */}
            {user?.isLogged ? (
                <form onSubmit={onClickSaveComment}>
                    <input type="hidden" name="tomeId" value={tomeId} />
                    <textarea
                        id="comment-box"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Comment on your review ..."
                        required
                    />

                    <div className="icon-container">
                        <a
                            href="https://portswigger.net/web-security/csrf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="privacy-icon"
                        >
                            <FontAwesomeIcon icon={faLock} className="privacy-icon-img" />
                        </a>
                        <span className="privacy-icon-text">Privacy</span>

                        <div className="exclamation-container">
                            <a
                                href="https://disqus.com/data-sharing-settings/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="do-not-sell"
                            >
                                <FontAwesomeIcon icon={faExclamation} className="privacy-icon-img" />
                            </a>
                            <span className="exclamation-text">Do not sell my data</span>
                        </div>
                    </div>

                    <button id="write-btn">Écrire ici</button>
                </form>
            ) : (
                // Si l'utilisateur n'est pas connecté, on affiche un message avec un lien vers la page de connexion
                <div className="login-prompt">
                    <p style={{ textAlign: "center" }}>
                        Vous devez être <Link to="/login">connecté</Link> pour laisser un commentaire.
                    </p>
                </div>
            )}

            <button id="share-btn" onClick={toggleSocialIcons}>Partager</button>

            {showSocialIcons && (
                <div id="social-icons" className={showSocialIcons ? "show" : ""}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                </div>
            )}

            <div id="comments-list">
                {comments.map(comment => (
                    <div key={comment.comment_id}>
                        <p>{comment.firstname} {comment.lastname}: {comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CommentForm
