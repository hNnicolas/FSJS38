import React from 'react'
import { deleteUser as apiDeleteUser, updateUserStatus as apiUpdateUserStatus } from '../../../api/user'

const UsersTable = ({ users = [], status, onStatusChange, onUserDelete }) => {
  // Filtre les utilisateurs en fonction de leur statut
  const filteredUsers = Array.isArray(users) ? users.filter(user => user.status === status) : []

  // Fonction pour supprimer un utilisateur
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')
    if (confirmDelete) {
      try {
        // Appelle l'API pour supprimer l'utilisateur par son ID
        await apiDeleteUser(id)
        // Appelle la fonction de rappel pour mettre à jour l'interface après la suppression
        onUserDelete(id)
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', err)
      }
    }
  }

  // Fonction pour changer le statut d'un utilisateur (banni/autorisé)
  const handleStatusChange = async (user) => {
    // Détermine le nouveau statut de l'utilisateur (1 pour autorisé, 0 pour banni)
    const newStatus = user.status === 1 ? 0 : 1

    // Confirme l'action de changement de statut auprès de l'utilisateur
    const confirmStatusChange = window.confirm(
      `Êtes-vous sûr de vouloir ${newStatus === 1 ? 'autoriser' : 'bannir'} cet utilisateur ?`
    )

    if (confirmStatusChange) {
      try {
        // Appelle l'API pour mettre à jour le statut de l'utilisateur par son ID
        await apiUpdateUserStatus(user.id, newStatus)
        // Appelle la fonction de rappel pour mettre à jour l'interface après le changement de statut
        onStatusChange(user.id, newStatus)
      } catch (err) {
        console.error('Erreur lors de la mise à jour du statut de l\'utilisateur :', err)
      }
    }
  }

  return (
    <div className="table-container">
      <table id="tableUser">
        <thead>
          <tr>
            <th>ID</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user.id}>
                <td data-label="ID">{user.id}</td>
                <td data-label="Prénom">{user.firstname}</td>
                <td data-label="Nom">{user.lastname}</td>
                <td className="email-column" data-label="Email">{user.email}</td>
                <td data-label="Action">
                  <button
                    className={`button ${user.status === 1 ? 'ban' : 'authorize'}`}
                    onClick={() => handleStatusChange(user)}
                  >
                    {user.status === 1 ? 'Bannir' : 'Autoriser'}
                  </button>
                  <button className="button delete" onClick={() => handleDelete(user.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Aucun utilisateur trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable
