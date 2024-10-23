import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft, faHandPointRight, faThumbsUp, faUserPen } from '@fortawesome/free-solid-svg-icons'
import tomesData from '../components/TomesDatas'
import LazyImage from '../components/LazyImage'
import CommentForm from '../components/CommentForm'
import { getCommentsForTome } from '../api/comments'

const ReadTome = () => {
    const { tomeId } = useParams() 
    const navigate = useNavigate() 
    const [likeCounts, setLikeCounts] = useState({}) 
    const [imagesToDisplay, setImagesToDisplay] = useState([]) 
    const [comments, setComments] = useState([])
    const [loadingComments, setLoadingComments] = useState(true) 

    // Récupération des informations du tome actuel à partir des données des tomes
    const currentTome = tomesData[tomeId] 

    useEffect(() => {
        // Chargement des likes sauvegardés depuis le localStorage
        const savedLikeCounts = JSON.parse(localStorage.getItem('likeCounts')) || {}
        setLikeCounts(savedLikeCounts)

        // Si le tome actuel existe, prépare la liste des images à afficher
        if (currentTome) {
            const imagesList = []
            for (let i = 1; i < currentTome.images; i++) {
                imagesList.push({
                    src: `/images/tomes/tome${currentTome.id}/${String(i).padStart(2, "0")}.webp`,
                    alt: `Illustration ${i} du tome ${currentTome.title || currentTome.id}: ${currentTome.synopsis}`,
                    description: `Ceci est une description unique de l'image ${i}`
                })
            }
            // Mise à jour de l'état avec la liste des images à afficher
            setImagesToDisplay(imagesList) 
        }

        // Désactivation du clic droit et de la touche PrintScreen
        window.addEventListener('contextmenu', handleContextMenu)
        window.addEventListener('keydown', disablePrintScreen)

        // Récupération des commentaires pour le tome actuel
        fetchComments()

        // Nettoyage des écouteurs d'événements lors du démontage du composant
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu)
            window.removeEventListener('keydown', disablePrintScreen)
        }
    }, [tomeId, currentTome])

    // Fonction pour désactiver le clic droit
    const handleContextMenu = (e) => {
        e.preventDefault()
        alert("Le contenu est protégé.")
    }

    // Fonction pour désactiver la touche PrintScreen
    const disablePrintScreen = (e) => {
        if (e.key === "PrintScreen") {
            alert("La capture d'écran est désactivée. Le contenu est protégé.")
            e.preventDefault()
        }
    }

    // Fonction pour récupérer les commentaires du tome depuis l'API
    const fetchComments = async () => {
        setLoadingComments(true)
  
        // Récupération des commentaires du tome via l'API
        const recupComments = await getCommentsForTome(tomeId === 'tome0' ? 0 : parseInt(tomeId.replace('tome', '')))

        // Filtre les commentaires pour afficher uniquement ceux qui sont publiés (statut = 1)
        const filteredComments = (recupComments?.comments || []).filter(comment => comment.comment_status === 1)

        // Mise à jour de l'état avec les commentaires filtrés
        setComments(filteredComments)
    
        setLoadingComments(false) // Indique que le chargement des commentaires est terminé
    }

    // Fonction pour rafraîchir les commentaires
    const refreshComments = () => {
        fetchComments()
    }

    // Fonction pour gérer le clic sur le bouton "Like"
    const handleLikeClick = () => {
        setLikeCounts((prevCounts) => {
            const newCounts = { ...prevCounts }
            if (!newCounts[tomeId]) {
                newCounts[tomeId] = 0
            }
            newCounts[tomeId] += 1

            localStorage.setItem('likeCounts', JSON.stringify(newCounts))
        })
    }

    // Fonction pour faire défiler la page vers le haut
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    // Fonction pour naviguer vers le tome précédent
    const goToPreviousTome = () => {
        const currentTomeIndex = parseInt(tomeId.replace('tome', ''))
        const previousTomeId = `tome${currentTomeIndex - 1}`
        if (tomesData[previousTomeId]) {
            navigate(`/tomes/${previousTomeId}`)
            scrollToTop()
        }
    }

    // Fonction pour naviguer vers le tome suivant
    const goToNextTome = () => {
        const currentTomeIndex = parseInt(tomeId.replace('tome', ''))
        const nextTomeId = `tome${currentTomeIndex + 1}`
        if (tomesData[nextTomeId]) {
            navigate(`/tomes/${nextTomeId}`)
            scrollToTop()
        }
    }

    return (
        <section id="read-tome">
            <div id="image-display">
                {imagesToDisplay.map((image, index) => (
                    <figure key={index} style={{ display: 'block', marginBottom: '20px', padding: '20px' }}>
                        <picture>
                            <LazyImage
                                src={image.src}
                                alt={image.alt}
                                className="lazy-image"
                                loading="lazy"
                                style={{ maxWidth: '100%', height: 'auto' }}
                                srcSet={`${image.src}?w=200 200w, ${image.src}?w=400 400w, ${image.src}?w=600 600w`}
                                sizes="(max-width: 600px) 200px, (max-width: 1200px) 400px, 800px"
                            />
                        </picture>
                    </figure>
                ))}
            </div>

            <section id="like-section">
                <button onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faThumbsUp} /> Like
                    {likeCounts[tomeId] > 0 && (
                        <span id="like-count"> ({likeCounts[tomeId]})</span>
                    )}
                </button>
            </section>

            <div id="navigation">
                <button
                    onClick={goToPreviousTome}
                    disabled={!tomesData[`tome${parseInt(tomeId.replace('tome', '')) - 1}`]}
                >
                    <FontAwesomeIcon icon={faHandPointLeft} /> Previous Tome
                </button>
                <button
                    onClick={goToNextTome}
                    disabled={!tomesData[`tome${parseInt(tomeId.replace('tome', '')) + 1}`]}
                >
                    Next Tome <FontAwesomeIcon icon={faHandPointRight} />
                </button>
            </div>

            <section id="comment-section">
                <div id="comments">
                    <CommentForm tomeId={tomeId === 'tome0' ? 0 : tomeId} onCommentAdded={refreshComments} />
                    {loadingComments ? (
                        <p>Chargement des commentaires...</p>
                    ) : (
                        comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={comment.comment_id} className={`comment ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                    <div className="comment-header">
                                        <FontAwesomeIcon icon={faUserPen} style={{ marginRight: '10px', color: '#007bff' }} />
                                        <span className="user-name">{comment.firstname} {comment.lastname}</span>
                                    </div>
                                    <p className="comment-text">{comment.comment_text}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: "center" }}>
                                Be the first to comment !
                            </p>
                        )
                    )}
                </div>

                <div id="synopsis">
                    <h3 id="synopsis-title">Synopsis</h3>
                    <p id="synopsis-text">{currentTome ? currentTome.synopsis : 'Chargement...'}</p>
                </div>

            </section>
        </section>
    )
}

export default ReadTome
