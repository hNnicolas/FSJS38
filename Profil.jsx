import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectUser, connectUser, logoutUser } from "../../slices/userSlice"
import { updateProfil, deleteUser, checkMyToken } from "../../api/user"
import { useNavigate } from "react-router-dom"

const Profil = () => {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [msg, setMsg] = useState(null)
    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")

    useEffect(() => {
        // Initialisation des champs avec les données de l'utilisateur
        if (user && user.infos) {
            setFirstName(user.infos.firstname || "")
            setLastName(user.infos.lastname || "")
        }
    }, [user])

    // Fonction pour soumettre le formulaire de mise à jour du profil
    const onSubmitForm = (e) => {
        e.preventDefault()
        setMsg(null)
        const datas = {
            id: user.infos.id,
            firstname,
            lastname,
        }
 
        updateProfil(datas, user.infos.id)
        .then((res) => {
            if (res.status === 200) {
                // Message de confirmation
                setMsg("Modification réussie !")
                setTimeout(() => {
                    setMsg(null)
                  }, 3000)

                // Dispatch pour mettre à jour Redux avec les nouvelles infos
                dispatch(connectUser({
                    infos: {
                        id: user.infos.id,    
                        firstname,           
                        lastname,             
                        email: user.infos.email, 
                        role: user.infos.role,   
                    },
                    isLogged: true,             // Met à jour l'état de connexion
                    token: window.localStorage.getItem('b4y-token'), 
                }))
            }
        })
        .catch((err) => console.log(err))
    }

    // Fonction pour supprimer le compte de l'utilisateur
    const removeUser = (e) => {
        e.preventDefault()

        if (!window.confirm("Es-tu sûr de vouloir supprimer ton compte ?")) {
            return
          }

        const token = window.localStorage.getItem("b4y-token")
        if (!token) {
            setMsg("Erreur, tu n'es pas authentifié !")
            navigate("/login")
            return
        }

        // Vérifiez le token avant de supprimer l'utilisateur
        checkMyToken()
            .then((res) => {
                if (res.status !== 200) {
                    setMsg("Erreur, ton token est invalide!")
                    dispatch(logoutUser())
                    navigate("/login")
                } else {
                    // Si le token est valide, on peut supprimer l'utilisateur
                    const userId = user.infos.id
                    if (!userId) {
                        setMsg("ID utilisateur non disponible!")
                        return
                    }

                    deleteUser(userId)
                        .then((res) => {
                            if (res.status === 200) {
                                window.localStorage.removeItem("b4y-token")
                                dispatch(logoutUser())
                                navigate("/login")
                            } else {
                                setMsg("Oups, impossible de supprimer le compte!")
                                console.log(res)
                            }
                        })
                        .catch((err) => console.log(err))
                }
            })
            .catch((err) => console.log(err))
    }

    return (
        <section id="profil-container">
            <h2 id="profil-title">Mon profil</h2>
            {msg && <p id="profil-message" className="success-message">{msg}</p>}
            <form id="profil-form" onSubmit={onSubmitForm}>
                <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prénom"
                    required
                />
                <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nom"
                    required
                />
                <input type="submit" id="profil-submit" value="Enregistrer" />
            </form>
            <button id="profil-delete-btn" onClick={removeUser}>
                Supprimer mon compte
            </button>
        </section>
    )
}

export default Profil
