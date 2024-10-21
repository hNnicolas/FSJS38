import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectTomes, loadTomes } from '../../slices/tomeSlice'
import { displayTomes, deleteOneTome } from '../../api/tome'
import { getAllComment, deleteOneComment } from '../../api/comments'
import { getAllUsers, updateUserStatus } from '../../api/user'
import TomeList from './components/TomeList'
import CommentsTable from './components/CommentsTable'
import UsersTable from './components/UsersTable'

const Admin = () => {
    // Récupère les tomes depuis le store Redux
    const tome = useSelector(selectTomes)
    const dispatch = useDispatch()

    // États locaux pour gérer les commentaires et utilisateurs
    const [sensitiveComments, setSensitiveComments] = useState([])
    const [publishedComments, setPublishedComments] = useState([])
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState({ text: '', type: '' })

    // Fonction pour supprimer un commentaire
    const handleDeleteComment = (id) => {
        deleteOneComment(id) // Appel de l'API pour supprimer le commentaire
            .then(() => getAllComment()) // Récupère tous les commentaires après suppression
            .then((res) => {
                if (res.status === 200) {
                    const allComments = res.result // Récupération des résultats
                    // Filtre les commentaires en fonction de leur statut
                    const sensitive = allComments.filter(comment => comment.status === 0)
                    const published = allComments.filter(comment => comment.status === 1)
                    // Mise à jour des états avec les nouveaux commentaires
                    setSensitiveComments(sensitive)
                    setPublishedComments(published)
                }
            })
            .catch(err => console.log(err)) // Gestion des erreurs
    }

    // Fonction pour supprimer un tome
    const onClickDeleteTome = (id) => {
        deleteOneTome(id) // Suppression du tome
            .then(() => displayTomes()) // Récupération des tomes après suppression
            .then((response) => {
                if (response.status === 200) {
                    dispatch(loadTomes(response.result)) // Mise à jour du store avec les nouveaux tomes
                }
            })
            .catch(err => console.log(err)) // Gestion des erreurs
    }

    // Fonction pour gérer la suppression d'un utilisateur de la liste
    const handleUserDelete = (id) => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id)) // Mise à jour de l'état des utilisateurs
    }

    // Fonction pour changer le statut d'un utilisateur (banni ou autorisé)
    const handleStatusChange = (id, newStatus) => {
        updateUserStatus(id, newStatus) // Appel de l'API pour mettre à jour le statut
            .then((response) => {
                if (response && response.status === 200) {
                    // Mise à jour de l'état local avec le nouveau statut
                    setUsers(prevUsers => 
                        prevUsers.map(user => 
                            user.id === id ? { ...user, status: newStatus } : user
                        )
                    )
    
                    // Message pour indiquer le changement de statut
                    const statusMessage = newStatus === 0 ? "Utilisateur banni." : "Utilisateur autorisé."
                    const messageType = newStatus === 0 ? "error" : "success"
    
                    setMessage({ text: statusMessage, type: messageType })
    
                    // Réinitialisation du message après un délai
                    setTimeout(() => {
                        setMessage({ text: '', type: '' })
                    }, 3000)
                }
            })
            .catch((err) => {
                console.error("Erreur API:", err)
            })
    }
    
    useEffect(() => {
        // Appel à l'API pour récupérer tous les commentaires
        getAllComment()
            .then((res) => {
                // Vérification si la réponse de l'API a un statut de succès
                if (res.status === 200) {
                    const allComments = res.result // Récupération de tous les commentaires

                    // Filtrage des commentaires en deux catégories : sensibles et publiés
                    const sensitive = allComments.filter(comment => comment.status === 0)
                    const published = allComments.filter(comment => comment.status === 1)

                    // Mise à jour de l'état avec les commentaires filtrés
                    setSensitiveComments(sensitive)
                    setPublishedComments(published)
                }
            })
            .catch(err => console.log(err)) // Gestion des erreurs lors de l'appel à l'API pour les commentaires

        // Appel à l'API pour récupérer tous les utilisateurs
        getAllUsers()
            .then((response) => {
                // Vérification si la réponse de l'API a un statut de succès
                if (response.status === 200) {
                    // Mise à jour de l'état avec la liste des utilisateurs
                    setUsers(response.result) // Stockage de tous les utilisateurs
                }
            })
            .catch(err => console.log(err)) // Gestion des erreurs lors de l'appel à l'API pour les utilisateurs
    }, [])

    return (
        <section id="admin-container">
            <div>
                <h2>Administration</h2>
                <Link to="/addTome" id="add-tome-link">Ajouter un tome</Link>
                <TomeList tomes={tome.tomes} onClickDeleteTome={onClickDeleteTome} />
            </div>

            <hr />

            <div>
                <h3>Mes commentaires</h3>
                <h4>Contenus sensibles</h4>
                <CommentsTable comments={sensitiveComments} status={0} onDeleteComment={handleDeleteComment} />
                <h4>Publiées</h4>
                <CommentsTable comments={publishedComments} status={1} onDeleteComment={handleDeleteComment} />
            </div>

            <hr />
            <div id="user-section">
                <div id="user-table-wrapper">
                    <h4>Utilisateurs Bannies</h4>
                    <UsersTable users={users} status={0} onUserDelete={handleUserDelete} onStatusChange={handleStatusChange} />
                    {message.text && message.type === 'error' && (
                        <div className={`status-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                </div>

                <div id="user-table-wrapper">
                    <h4>Utilisateurs Autorisés</h4>
                    <UsersTable users={users} status={1} onUserDelete={handleUserDelete} onStatusChange={handleStatusChange} />
                    {message.text && message.type === 'success' && (
                        <div className={`status-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Admin
