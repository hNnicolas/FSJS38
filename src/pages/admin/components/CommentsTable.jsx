import React from 'react'
import { Link } from 'react-router-dom'
import { deleteOneComment } from '../../../api/comments'

const CommentsTable = ({ comments, status, onDeleteComment }) => {
    // Filtre les commentaires en fonction du statut
    const filteredComments = comments.filter(comment => comment.status === status)

    const handleDelete = (id) => {
        // Appel API pour supprimer un commentaire
        deleteOneComment(id)
            .then((res) => {
                if (res.status === 200) {
                    // Appel à la fonction de suppression dans le parent pour mettre à jour la liste
                    onDeleteComment(id)
                }
            })
            .catch((err) => console.error("Erreur lors de la suppression du commentaire:", err))
    }

    return (
        <div id="comments-table-container">
            <table id="comments-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Contenu</th>
                        <th>Date</th>
                        <th>ID Utilisateur</th>
                        <th>ID Tome</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredComments.length > 0 ? (
                        filteredComments.map(comment => (
                            <tr key={comment.id}>
                                <td data-label="ID">{comment.id}</td>
                                <td data-label="Contenu">{comment.content}</td>
                                <td data-label="Date">{new Date(comment.date).toLocaleDateString()}</td>
                                <td data-label="ID Utilisateur">{comment.users_id}</td>
                                <td data-label="ID Tome">{comment.tomes_id}</td>
                                <td data-label="Action">
                                    <Link to={`/commentDetail/${comment.id}`}>Voir Détails</Link>
                                    <button 
                                        onClick={() => handleDelete(comment.id)} 
                                        id="btn-delete" 
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Aucun commentaire disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default CommentsTable
