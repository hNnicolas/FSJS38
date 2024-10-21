import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { loginUser } from "../../api/user"
import { useDispatch } from "react-redux"
import { connectUser } from "../../slices/userSlice"

const Login = (props) => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [redirect, setRedirect] = useState(null)
    const [error, setError] = useState(null)

    // Fonction exécutée lors de la soumission du formulaire
    const onSubmitForm = (e) => {
        e.preventDefault()
        setError(null) 

        // Préparation des données à envoyer pour l'authentification
        const datas = {
            email,
            password,
        }

        // Appel à la fonction d'authentification utilisateur
        loginUser(datas)
            .then((res) => {
                // Vérification de la réponse de l'API
                if (res.status === 200) {
                    // Stocker le token dans le localStorage
                    window.localStorage.setItem("b4y-token", res.token)
                    window.localStorage.setItem("user-infos", JSON.stringify(res.user)) 
                    // Créer un objet utilisateur à pousser dans le store de redux
                    let newUser = res.user
                    newUser.token = res.token

                    // Connecte l'utilisateur à redux
                    dispatch(connectUser(newUser))

                    // Redirection selon le rôle de l'utilisateur
                    if (newUser.role.toLowerCase() === "admin") {
                        setRedirect("/admin"); // Redirige vers la page admin si l'utilisateur est un admin
                    } else if (newUser.status === 0) { // Vérifier si l'utilisateur est banni
                        setError("Votre compte a été banni et vous ne pouvez pas vous connecter.")
                        window.localStorage.removeItem("b4y-token")
                    } else {
                        setRedirect("/") // Redirige vers la page d'accueil pour les utilisateurs normaux
                    }
                }
            })
            .catch((err) => console.log(err))
    }

    // Efface le message d'erreur après 5 secondes
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null) // Réinitialise le message d'erreur
            }, 5000)

            // Nettoyage du timer si le composant est démonté ou si le message d'erreur change
            return () => clearTimeout(timer)
        }
    }, [error])

    // Redirection si nécessaire
    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <section id="login-container">
            <h2 id="login-title">Se connecter</h2>

            {error !== null && <p id="login-error">{error}</p>} 

            <form id="login-form" onSubmit={onSubmitForm}>
                <input
                    type="email"
                    id="email"
                    placeholder="Votre mail"
                    onChange={(e) => setEmail(e.currentTarget.value)} 
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Votre mot de passe"
                    onChange={(e) => setPassword(e.currentTarget.value)} 
                />
                <input type="submit" id="submit" value="Se connecter" /> 
            </form>
        </section>
    )
}

export default Login
