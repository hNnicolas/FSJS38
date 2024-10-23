import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Logo from "../assets/logo/demon-logo.jpeg"
import { useSelector, useDispatch } from "react-redux"
import { selectUser, logoutUser, connectUser } from "../slices/userSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faGears, faSignOutAlt, faUser, faSearch } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  const user = useSelector(selectUser)
  // console.log("Données utilisateur dans le store :", user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const token = window.localStorage.getItem('b4y-token')
    const savedUserInfos = window.localStorage.getItem('user-infos')

    // console.log("Infos utilisateur récupérées :", savedUserInfos)
  
    if (token && savedUserInfos) {
      const parsedUserInfos = JSON.parse(savedUserInfos)
      // console.log("Infos utilisateur après parsing :", parsedUserInfos)
      
      // Si un token et des infos utilisateur existent, les restaurer dans Redux
      dispatch(connectUser(parsedUserInfos))
    }
  }, [dispatch])
  

  // Fonction de déconnexion de l'utilisateur
  const logout = (e) => {
    e.preventDefault()
    // Suppression du token du stockage local
    window.localStorage.removeItem('b4y-token')
    window.localStorage.removeItem('user-infos')
    // Action Redux pour déconnecter l'utilisateur
    dispatch(logoutUser())
    // Redirection vers la page de connexion après déconnexion
    navigate('/login')
  }

  // Fonction de recherche d'un tome spécifique
  const handleSearch = (e) => {
    e.preventDefault()
  
    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase()
      let tomeNumber
  
      // Si l'utilisateur tape un nombre
      if (!isNaN(normalizedSearchTerm)) {
        tomeNumber = parseInt(normalizedSearchTerm, 10)
      } 
      // Si l'utilisateur tape 'tome[number]'
      else if (normalizedSearchTerm.startsWith('tome') && !isNaN(normalizedSearchTerm.slice(4))) {
        tomeNumber = parseInt(normalizedSearchTerm.slice(4), 10)
      } 
  
      // Vérification si le tome existe (variable mise à jour dans TomesDatas)
      if (tomeNumber >= 1 && tomeNumber <= 22) {
        navigate(`/tomes/tome${tomeNumber}`)
      } else {
        alert("Ce tome n'existe pas.")
      }
  
      // Réinitialisation du champ de recherche
      setSearchTerm('')
    }
  }
  
  

  return (
    <header id="header-nav">
      <nav id="header-nav-bar">
        <div id="header-list1">
          <img src={Logo} alt="logo Demon Slayer" />
          <Link to="/"><FontAwesomeIcon icon={faHome} /></Link>
          <form onSubmit={handleSearch} style={{ display: 'inline' }}>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ padding: '2px', width: '80px', marginLeft: '2px' }} 
            />
            <button type="submit" className="search-button" style={{ padding: '2px', marginLeft: '1px' }}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>

        {!user.isLogged ? (
          <div id="header-list2">
            <Link to="/register">S'enregistrer</Link>
            <Link to="/login">Se connecter</Link>
          </div>
        ) : (
          <div id="header-list2">
            {user.infos.role && user.infos.role.toLowerCase() === "admin" && (
              <Link to="/admin">
                <FontAwesomeIcon icon={faGears} />
              </Link>
            )}
            <Link to="/profil">
              <FontAwesomeIcon icon={faUser} /> {user.infos.firstname} {user.infos.lastname}
            </Link>
            <a href="#" onClick={logout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </a>
          </div>
        )}
      </nav>

      <section id="header-pict">
        <h1>Demon Slayer E-Book, le site de la série intégrale en version française</h1>
        <p id="#header-subtitle">Lire Demon Slayer VF en ligne</p>
      </section>
    </header>
  )
}

export default Header
