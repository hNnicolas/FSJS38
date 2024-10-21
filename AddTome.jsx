import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from '../../../slices/userSlice'
import { loadTomes } from '../../../slices/tomeSlice'
import { Navigate } from 'react-router-dom'
import { addOneTome, displayTomes } from '../../../api/tome'
import { addOneContent } from '../../../api/content'
import axios from 'axios'
import { config } from '../../../config'

const AddTome = () => {
    // Récupération de l'utilisateur connecté à partir du store Redux
    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    // Déclaration des états locaux pour gérer les champs du formulaire et les messages
    const [name, setName] = useState("")
    const [alt, setAlt] = useState("")
    const [description, setDescription] = useState("")
    const [release_date, setReleaseDate] = useState("")
    const [selectedFile, setFile] = useState(null)
    const [secondaryFiles, setSecondaryFiles] = useState([])
    const [redirect, setRedirect] = useState(false)
    const [successMessage, setSuccessMessage] = useState(null)
    const [error, setError] = useState(null)

    // Fonction pour ajouter le tome et gérer le téléchargement des fichiers
    const addProd = async (datas) => {
        try {
            const res = await addOneTome(datas, user.infos.token) // Appel à l'API pour ajouter un tome
            
            // Vérification de la réponse de l'API
            if (res.status === 200 && res.id) {
                setSuccessMessage("Tome ajouté avec succès !")
                const tomeId = res.id // Récupération de l'ID du tome ajouté

                // Téléchargement des fichiers secondaires
                const urls = await Promise.all(secondaryFiles.map(async (file) => {
                    const formData = new FormData() // Création d'un objet FormData pour le téléchargement
                    formData.append("image", file) // Ajout du fichier à l'objet FormData

                    const uploadRes = await axios.post(`${config.api_url}/api/v1/tome/pict`, formData, {
                        headers: {
                            'Content-type': 'multipart/form-data',
                            'x-access-token': user.infos.token
                        }
                    })

                    return uploadRes.data.imageUrl // Retourne l'URL de l'image téléchargée
                }))
    
                // Ajout des contenus associés aux fichiers secondaires
                await Promise.all(urls.map(async (url, index) => {
                    const contentData = {
                        picture: url || "", 
                        alt: `Image ${index + 1}`,
                        rang: index + 1,
                        tomes_id: tomeId
                    }

                    if (contentData.picture) {
                        await addOneContent(contentData) // Appel à l'API pour ajouter le contenu
                    } 
                }))

                const response = await displayTomes() // Récupération de tous les tomes
                if (response.status === 200) {
                    dispatch(loadTomes(response.result)) // Dispatch de l'action pour charger les tomes dans Redux
                    setRedirect(true) // Mise à jour de l'état pour déclencher la redirection
                }
            } 
        } catch (err) {
            setError("Une erreur est survenue lors de l'ajout du tome.")
        }
    }
    
    // Fonction pour sauvegarder le tome complet
    const saveCompleteTome = () => {
        // Si aucun fichier n'est sélectionné, utiliser une image par défaut
        if (selectedFile === null) {
            const datas = {
                name,
                picture: "no-pict.jpg",
                alt,
                description,
                release_date
            }
            addProd(datas) // Appel à la fonction pour ajouter le tome
        } else {
            // Si un fichier est sélectionné, procéder au téléchargement
            const formData = new FormData()
            formData.append("image", selectedFile)

            // Téléchargement de l'image principale
            axios.post(`${config.api_url}/api/v1/tome/pict`, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    'x-access-token': user.infos.token
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    // Préparation des données pour l'ajout du tome
                    const datas = {
                        name,
                        picture: res.data.imageUrl,
                        alt,
                        description,
                        release_date
                    }
                    addProd(datas) // Appel à la fonction pour ajouter le tome
                }
            })
            .catch(err => console.log('Erreur lors du téléchargement de l\'image:', err))
        }
    }

    // Fonction pour gérer la soumission du formulaire
    const onSubmitForm = (e) => {
        e.preventDefault()

        // Validation des champs du formulaire
        if (name === "" || alt === "" || description === "" || release_date === "") {
            setError("Tous les champs ne sont pas encore remplis !")
        } else if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
            setError("La taille de l'image ne doit pas dépasser 2 Mo !")
        } else if (selectedFile && !['image/webp', 'image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)) {
            setError("Le fichier doit être une image au format JPEG, PNG ou GIF !")
        } else {
            saveCompleteTome() // Appel à la fonction pour sauvegarder le tome complet
        }
    }

    // useEffect pour gérer l'affichage du message de succès
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [successMessage])

    // Redirection vers la page d'administration si un tome a été ajouté avec succès
    if (redirect) {
        return <Navigate to="/admin" />
    }

    return (
        <section id="add-tome-section">
            <h2 id="add-tome-title">Ajouter un tome</h2>
            {error && <p id="error-message">{error}</p>}
            {successMessage && <p id="success-message">{successMessage}</p>}
            <form id="b-form" onSubmit={onSubmitForm}>
                <input
                    id="name-input"
                    type="text"
                    placeholder="Nom du tome"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                />
                <input
                    id="file-input"
                    type="file"
                    onChange={(e) => setFile(e.currentTarget.files[0])}
                />
                <textarea
                    id="alt-textarea"
                    name="alt"
                    placeholder="Texte alternatif"
                    value={alt}
                    onChange={(e) => setAlt(e.currentTarget.value)}
                ></textarea>
                <textarea
                    id="description-textarea"
                    name="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                ></textarea>
                <input
                    id="release-date-input"
                    type="text"
                    placeholder="Date de sortie"
                    value={release_date}
                    onChange={(e) => setReleaseDate(e.currentTarget.value)}
                />
                <input
                    type="file"
                    multiple
                    onChange={(e) => setSecondaryFiles(Array.from(e.currentTarget.files))}
                />
                <button id="submit-button">Enregistrer</button>
            </form>
        </section>
    )
}

export default AddTome
