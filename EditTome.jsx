import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from '../../../slices/userSlice'
import { loadTomes } from '../../../slices/tomeSlice'
import { useParams } from 'react-router-dom'
import { takeOneTome, updateOneTome, displayTomes } from '../../../api/tome'
import { updateOneContent, deleteOneContent } from '../../../api/content'

import axios from 'axios'
import { config } from '../../../config'

const EditTome = () => {
    const { id } = useParams()
    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    // État local pour stocker les données du tome
    const [tomeData, setTomeData] = useState({
        name: '',
        alt: '',
        description: '',
        releaseDate: '',
        oldPict: '',
        otherImages: [],
    })

    // États pour gérer les fichiers d'images et les messages d'erreur/success
    const [selectedFile, setFile] = useState(null)
    const [secondaryFiles, setSecondaryFiles] = useState([])
    const [rang, setRang] = useState("1")
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)


    // Fonction pour mettre à jour le tome
    const addTome = (datas) => {
        updateOneTome(datas, id) // Met à jour le tome avec les nouvelles données
            .then((res) => {
                if (res.status === 200) { // Vérifie si la mise à jour a réussi
                    displayTomes() // Récupère la liste mise à jour des tomes
                        .then((response) => {
                            if (response.status === 200) {
                                dispatch(loadTomes(response.result)) // Met à jour le store Redux avec les tomes
                                setSuccessMessage("Mise à jour du tome réussie !")
                                setTimeout(() => setSuccessMessage(null), 3000)
                                setRedirect(true)
                            }
                        })
                }
            })
            .catch((err) => {
                setError(`Une erreur s'est produite lors de la mise à jour`)
                setTimeout(() => setError(null), 3000)
            })
    }

    // Fonction pour sauvegarder le tome avec image principale
    const saveCompleteTome = () => {
        const formData = new FormData() // Crée un nouvel objet FormData pour l'envoi d'images
        
        // Ajouter une image principale
        formData.append("image", selectedFile)
    
        // Route d'envoi du formulaire pour l'image principale
        axios.post(`${config.api_url}/api/v1/tome/pict/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token': user.infos.token,
            }
        })
        .then((res) => {
            if (res.status === 200) {
                const imageUrl = res.data.imageUrl // Récupère l'URL de l'image
                const datas = {
                    name: tomeData.name,
                    picture: imageUrl, 
                    alt: tomeData.alt,
                    description: tomeData.description,
                    release_date: tomeData.releaseDate || "",
                    otherImages: res.data.otherImages || [] // Récupère d'autres images
                }
                addTome(datas) // Appelle la fonction pour mettre à jour le tome
                setFile(null) // Réinitialise le fichier sélectionné

                // Met à jour l'état pour afficher l'image
                setTomeData((prevState) => ({
                    ...prevState,
                    picture: imageUrl // Met à jour l'état avec la nouvelle URL de l'image
                }))

                updateContentImages() // Met à jour les images des contenus associés
            }
        })
        .catch((err) => {
            setError(`Une image doit être selectionné`)
            setTimeout(() => setError(null), 3000)
        })
    }
    
    // Fonction pour mettre à jour les images des contenus associés
    const updateContentImages = () => {
        const updatePromises = tomeData.otherImages.map((content, idx) => {
            const contentId = content.content_id || content.id
            const formData = new FormData()
            
            // Vérification si une nouvelle image a été sélectionnée pour ce contenu
            if (secondaryFiles[idx]) {
                formData.append("image", secondaryFiles[idx]) // Ajoute la nouvelle image si disponible
            }
            
            // Ajoute les données existantes à la requête
            formData.append("picture", content.picture)
            formData.append("alt", content.alt)
            formData.append("rang", content.rang)
            
            return updateOneContent(contentId, formData) // Met à jour le contenu
        })
        
        Promise.all(updatePromises) // Attendre que toutes les promesses soient résolues
            .then(() => {
                setSuccessMessage("Images et données du contenu mises à jour avec succès !")
                setTimeout(() => setSuccessMessage(null), 3000)
            })
            .catch((err) => {
                setError(`Une erreur s'est produite lors de la mise à jour des images`)
                setTimeout(() => setError(null), 3000)
            })
    }
    
      // Fonction de soumission du formulaire
      const onSubmitForm = (e) => {
        e.preventDefault()
        // Vérifie si tous les champs sont remplis
        if (tomeData.name === "" || tomeData.alt === "" || tomeData.description === "" || tomeData.releaseDate === "") {
            setError("Tous les champs ne sont pas encore remplis !")
        } else if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
            setError("La taille de l'image ne doit pas dépasser 2 Mo !")
        } else if (selectedFile && !['image/webp', 'image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)) {
            setError("Le fichier doit être une image au format JPEG, PNG ou GIF !")
        } else {
            saveCompleteTome() // Si tout est valide, sauvegarde le tome
        }
    }
    
    
    // Récupération du tome au chargement du composant
    useEffect(() => {
        const fetchTome = async () => {
            try {
                const response = await takeOneTome(id) // Récupère le tome à partir de l'ID
                if (response && response.result) {
                    // Met à jour l'état avec les données du tome récupérées
                    setTomeData({
                        name: response.result.name || '',
                        oldPict: response.result.picture || '',
                        alt: response.result.alt || '',
                        description: response.result.description || '',
                        releaseDate: response.result.release_date || '',
                        otherImages: Array.isArray(response.result.contents)
                            ? response.result.contents.map((content, idx) => ({
                                ...content,
                                newPosition: idx // Ajoute une nouvelle position pour chaque contenu
                            }))
                            : [],
                    })
                }
            } catch (error) {
                setError(`Une erreur s'est produite lors de la récupération du tome`)
                setTimeout(() => setError(null), 3000)
            }
        }

        fetchTome() // Appelle la fonction pour récupérer le tome
    }, [id]) // Dépendance sur l'ID du tome

    // Fonction pour modifier le positionnement d'une image 
    const handleUpdateContentPosition = (index, newPosition) => {
        const updatedContents = [...tomeData.otherImages]
        updatedContents[index].newPosition = newPosition // Met à jour la nouvelle position
        setTomeData({ ...tomeData, otherImages: updatedContents }) // Met à jour l'état avec les nouvelles positions
    }

    // Fonction pour valider et appliquer le changement de position
    const handleConfirmPositionChange = (index) => {
        const movedContent = tomeData.otherImages[index] // Récupère l'image à déplacer
        const newPosition = parseInt(movedContent.newPosition, 10) // Récupère la nouvelle position

        // Vérifie si l'image a un ID valide
        if (movedContent && (movedContent.content_id || movedContent.id)) {
            // Réorganisation du tableau des images
            const updatedContents = [...tomeData.otherImages]
            updatedContents.splice(index, 1) // Supprime l'image de sa position actuelle
            updatedContents.splice(newPosition, 0, movedContent) // Insère l'image à la nouvelle position

            // Met à jour le rang de chaque image
            updatedContents.forEach((content, idx) => {
                content.rang = idx + 1 // Met à jour le rang basé sur l'index
                content.newPosition = idx // Met à jour la nouvelle position
            })

            setTomeData({ ...tomeData, otherImages: updatedContents }) // Met à jour l'état des images

            // Met à jour du rang dans la base de données pour chaque image
            const updatePromises = updatedContents.map((content) => {
                const contentId = content.content_id || content.id // Récupère l'ID de contenu
                const updatedContent = {
                    picture: content.picture,
                    alt: content.alt,
                    rang: content.rang,
                }
                return updateOneContent(contentId, updatedContent) // Mise à jour en base de données
            })

            Promise.all(updatePromises)
                .then(() => {
                    setSuccessMessage("Positions mises à jour avec succès !")
        
                    // Réinitialiser le message après 3 secondes
                    setTimeout(() => {
                        setSuccessMessage(null)
                    }, 3000)
                })
        } 
    }

    // Fonction pour supprimer un contenu
    const handleDeleteContent = (contentId) => {
        // Vérifie si l'ID du contenu est défini
        if (!contentId) {
            console.error("ID du contenu est indéfini.")
            return
        }

        // Supprime le contenu
        deleteOneContent(contentId)
            .then(() => {
                // Met à jour la liste des images après suppression
                const updatedContents = tomeData.otherImages.filter(content => (content.id || content.content_id) !== contentId)
                setTomeData({ ...tomeData, otherImages: updatedContents })
                setSuccessMessage("Image supprimée avec succès !")
                setTimeout(() => {
                    setSuccessMessage(null) // Réinitialise le message
                }, 3000)
            })
    }

    // Fonction pour changer le texte alternatif d'une image
    const handleChangeAltText = (index, newAltText) => {
        const updatedContents = [...tomeData.otherImages]
        updatedContents[index].alt = newAltText // Met à jour le texte alternatif de l'image

        // Vérifie si le texte dépasse 250 caractères
        if (newAltText.length > 250) {
            setError("Le texte alt ne peut pas dépasser 250 caractères.")
            setTimeout(() => {
                setError(null)
            }, 10000)
            return
        } 

        // Met à jour l'état des images
        setTomeData({ ...tomeData, otherImages: updatedContents }) 
    
        // Fonction pour valider le changement
        const handleSubmitChange = () => {
            const contentId = updatedContents[index].content_id || updatedContents[index].id
            
            // Requête SQL pour mettre à jour le texte d'une image
            updateOneContent(contentId, {
                alt: newAltText,
                picture: updatedContents[index].picture,
                rang: updatedContents[index].rang
            })
            .then((res) => {
                if (res.status === 200) {
                    setTimeout(() => {
                        setSuccessMessage("Mise à jour de champs de la description réussie !")
                    }, 4000)
                }
            })
        }
    
        handleSubmitChange() // Appelle la fonction pour soumettre le changement
    }

    // Fonction pour changer une image
    const handleChangeImage = (contentId, newFile, alt, index) => { 
        const formData = new FormData()
        formData.append("image", newFile) // Ajoute le nouveau fichier image
    
        // Envoi de la requête pour télécharger l'image
        axios.post(`${config.api_url}/api/v1/tome/pict/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token': user.infos.token,
            }
        })
        .then((res) => {
            if (res.status === 200) {
                const imageUrl = res.data.imageUrl // Récupère l'URL de l'image
                const updatedContents = [...tomeData.otherImages]
    
                // Mis à jour de la photo et l'ALT
                updatedContents[index].picture = imageUrl;
                updatedContents[index].alt = alt || updatedContents[index].alt
    
                setTomeData({ ...tomeData, otherImages: updatedContents }) // Met à jour l'état des images
    
                // Utilisation de contentId récupéré à partir de updatedContents
                const contentIdToUpdate = updatedContents[index].content_id || updatedContents[index].id
    
                // Mise à jour de l'image en base de données
                return updateOneContent(contentIdToUpdate, { picture: imageUrl, alt: updatedContents[index].alt, rang: updatedContents[index].rang })
            }
        })
        .then(() => {
            setSuccessMessage("Image modifiée avec succès!")
            // Réinitialise le message après 3 secondes
            setTimeout(() => {
                setSuccessMessage(null) // Réinitialise le message
            }, 3000)
        })
    }
    
    // Fonction pour gérer le changement d'image secondaire
    const handleSecondaryImageChange = (index, newFile) => {
        const updatedFiles = [...secondaryFiles]
        updatedFiles[index] = newFile // Met à jour le fichier à l'index correspondant
        setSecondaryFiles(updatedFiles) // Met à jour l'état des fichiers secondaires
    }
    
    // Fonction pour ajouter une image à un contenu
    const addImageToContent = async (selectedFile, alt, rang) => {
        if (!id) return // Sort si l'ID n'est pas défini
    
        const formData = new FormData()
        let imageUrl
        const newContentId = Date.now() // ID unique pour le nouveau contenu
    
        if (selectedFile) {
            formData.append('image', selectedFile)
            formData.append('alt', alt)
            formData.append('tomes_id', id)
            formData.append('rang', rang)
            
            try {
                // Chemin de l'Upload de l'image
                const imageResponse = await axios.post(`${config.api_url}/api/v1/tome/pict/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-access-token': user.infos.token,
                    }
                })
    
                if (imageResponse.status === 200 && imageResponse.data.imageUrl) {
                    imageUrl = imageResponse.data.imageUrl // Récupère l'URL de l'image
    
                    const contentData = {
                        picture: imageUrl,
                        alt: alt,
                        rang: rang,
                        tomes_id: id,
                    }
    
                     // Chemin de sauvegarde de l'image à la table "content"
                    const contentResponse = await axios.post(`${config.api_url}/api/v1/content/save`, contentData, {
                        headers: {
                            'x-access-token': user.infos.token,
                        }
                    })
                    
                    if (contentResponse && contentResponse.data.status === 200) {
                        setTimeout(() => {
                            setSuccessMessage("Le contenu du tome a été bien enregistré !")
                        }, 4000)
                        
                        // Création de l'objet de contenu sauvegardé avec l'URL 
                        const savedContent = {
                            picture: imageUrl,
                            alt: alt,
                            rang: rang,
                            tomes_id: id
                        }

                        // Met à jour de l'état avec les nouvelles images
                        setTomeData((prevTomeData) => ({
                            ...prevTomeData,
                            otherImages: [
                                ...prevTomeData.otherImages,
                                { 
                                    id: contentResponse.data.contentId || newContentId,
                                    ...savedContent 
                                }
                            ]
                        }))
                    }
                }
            } catch (error) {
                console.error("Erreur lors de l'upload de l'image ou de la sauvegarde du contenu:", error)
            }
        }
    }
    
    // Fonction pour gérer l'ajout d'image à un contenu via un bouton
    const handleAddImageClick = () => {
        const newFile = selectedFile
        const altText = tomeData.alt || "Texte alternatif"
        const rangValue = rang
    
        addImageToContent(newFile, altText, rangValue)
    }
    
    // Événement de changement du fichier 
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFile(file)
        }
    }

    return (
        <section id="edit-tome-section">
            <h2 id="edit-tome-title">Modifier un tome</h2>

            {error && <p id="error-message">{error}</p>}
            {successMessage && <p id="success-message">{successMessage}</p>}

            <form id="b-form" onSubmit={onSubmitForm}>
                <label htmlFor="name-input">Nom du tome :</label>
                <input
                    id="name-input"
                    type="text"
                    placeholder="Nom du tome"
                    value={tomeData.name}
                    onChange={(e) => setTomeData({ ...tomeData, name: e.currentTarget.value })}
                    required
                />
                <input
                    id="file-input"
                    type="file"
                    onChange={(e) => setFile(e.currentTarget.files[0])}
                />
                <label htmlFor="alt-textarea">Texte alternatif :</label>
                <textarea
                    id="alt-textarea"
                    name="alt"
                    value={tomeData.alt}
                    onChange={(e) => setTomeData({ ...tomeData, alt: e.currentTarget.value })}
                    required
                ></textarea>
    
                <label htmlFor="description-textarea">Description :</label>
                <textarea
                    id="description-textarea"
                    name="description"
                    value={tomeData.description}
                    onChange={(e) => setTomeData({ ...tomeData, description: e.currentTarget.value })}
                    required
                ></textarea>

                <label htmlFor="release-date-input">Date de sortie :</label>
                <input
                    id="release-date-input"
                    type="text"
                    placeholder="Release_date"
                    value={tomeData.releaseDate}
                    onChange={(e) => setTomeData({ ...tomeData, releaseDate: e.currentTarget.value })}
                    required
                />
                <button type="submit">Modifier le tome</button>
                {/* Séparation pour l'upload de l'image de la table "content" */}
                <>
                <label htmlFor="new-content-image">Ajouter une nouvelle image pour le contenu :</label>
                <input
                    id="new-content-image"
                    type="file"
                    onChange={handleFileChange}
                    />
                    <button onClick={handleAddImageClick}>Ajouter une image au contenu</button>
                </>
            </form>
    
            {tomeData.oldPict && (
                <img src={`${config.pict_url}${tomeData.oldPict}`} alt="image actuelle" />
            )}
    
            {tomeData.otherImages.length > 0 ? (
                <div id="other-images-section">
                <h3>Autres images :</h3>
                <ul>
                    {tomeData.otherImages.map((content, index) => (
                        <li key={content.content_id || content.id || index}>
                            <img src={`${config.pict_url}${content.picture}`} alt={content.alt} />
                            <h3>Changer la description de l'image</h3>
                            <textarea
                            value={content.alt}
                            onChange={(e) => handleChangeAltText(index, e.target.value)}
                            rows={4} 
                            style={{ width: '100%', resize: 'none' }} 
                            />
                            <h3>Changer le positionnement de l'image en validant</h3>
                            <select
                                value={content.newPosition}
                                onChange={(e) => handleUpdateContentPosition(index, parseInt(e.target.value, 10))}
                            >
                                {tomeData.otherImages.map((_, pos) => (
                                    <option key={`pos-${content.content_id || content.id}-${pos}`} value={pos}>
                                        Position {pos + 1}
                                    </option>
                                ))}
                            </select>
                            <div className="image-actions" style={{ textAlign: 'center' }}>
                            <button id="confirm-button" onClick={() => handleConfirmPositionChange(index)}>
                                Valider le changement
                            </button>
                            <h3>Sélectionnez une image pour la modifier</h3>
                            <span>
                                <input
                                    type="file"
                                    onChange={(e) => handleSecondaryImageChange(index, e.target.files[0])}
                                />
                            </span>
                                <button
                                    type="button"
                                    className="modify-image"
                                    onClick={() => handleChangeImage(content.content_id, secondaryFiles[index], content.alt, index)}
                                >
                                    Modifier l'image
                                </button>
                            </div>
                            <div className="button-group"> 
                            <button id="delete-button" onClick={() => handleDeleteContent(content.content_id || content.id)}>
                                Supprimer
                            </button>
                            </div> 
                        </li>
                    ))}
                </ul>
            </div>            
            ) : (
                <p>Aucune autre image disponible.</p>
            )}
        </section>
    
    )
}

export default EditTome
