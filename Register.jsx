import { useState } from "react"
import { Navigate } from "react-router-dom"
import { addOneUser } from "../../api/user"

const Register = (props) => {
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [redirect, setRedirect] = useState(false)
    const [message, setMessage] = useState(null)
    const [isError, setIsError] = useState(false)

    // Fonction de validation des entrées utilisateur
    const validateInput = () => {
        // Vérification si le nom ou prénom contient un chiffre
        if (/\d/.test(firstname) || /\d/.test(lastname)) {
            setMessage("Le prénom et le nom ne doivent pas contenir de chiffres !")
            setIsError(true)
            return false
        }
        // Vérification du format de l'adresse mail
        const emailRegex = /^[a-zA-Z0-9._%+-ïîëôû]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email)) {
            setMessage("Adresse email invalide !")
            setIsError(true)
            return false
        }
        // Vérification du mot de passe avec des critères spécifiques
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
        if (!passwordRegex.test(password)) {
            setMessage("Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial !")
            setIsError(true)
            return false
        }
        return true // Retourne true si toutes les validations passent
    }

    // Fonction de soumission du formulaire
    const onSubmitForm = (e) => {
        e.preventDefault()
        setMessage(null)

        // Valide les entrées avant de soumettre
        if (!validateInput()) {
            return // Si la validation échoue, on ne procède pas à l'envoi des données
        }

        // Préparation des données à envoyer
        const datas = {
            firstname,
            lastname,
            email,
            password,
        }

        // Appel à la fonction d'ajout d'utilisateur
        addOneUser(datas)
            .then((res) => {
                if (res.status === 200) {
                    setMessage("Inscription réussie !")
                    setIsError(false) 
                    setRedirect(true) 
                } else {
                    setMessage(res.msg) 
                    setIsError(true) 
                }
            })
    }

    // Redirection vers la page de connexion si l'inscription est réussie
    if (redirect) {
        return <Navigate to="/login" />;
    }

    return (
        <section id="register-container">
            <h2 id="register-title">S'enregistrer</h2>
            {message !== null && (
                <p id="register-error" className={isError ? "error" : "success"}>
                    {message}
                </p>
            )}
            <form id="register-form" onSubmit={onSubmitForm}>
                <input
                    type="text"
                    id="firstname"
                    placeholder="Votre prénom"
                    onChange={(e) => setFirstname(e.currentTarget.value)}
                />
                <input
                    type="text"
                    id="lastname"
                    placeholder="Votre nom"
                    onChange={(e) => setLastname(e.currentTarget.value)}
                />
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
                <input type="submit" id="submit" value="Enregistrer" />
            </form>
        </section>
    )
}

export default Register
