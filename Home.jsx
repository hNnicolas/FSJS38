import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faFaceLaughSquint, faFaceSadCry, faFaceGrinHearts, faFaceAngry, faFaceGrinStars } from '@fortawesome/free-solid-svg-icons'
import demonHome from '../assets/logo/demonHome.jpg'

const Home = () => {
    const navigate = useNavigate()
    const tomeId = 0
    const [selectedEmoticon, setSelectedEmoticon] = useState(null)
    const [emojiCounts, setEmojiCounts] = useState({})
    const [likeCounts, setLikeCounts] = useState({})

    useEffect(() => {
        // Charger les données du localStorage
        const savedEmoticon = localStorage.getItem('selectedEmoticon')
        const savedEmojiCounts = JSON.parse(localStorage.getItem('emojiCounts')) || {}
        const savedLikeCounts = JSON.parse(localStorage.getItem('likeCounts')) || {}

        if (savedEmoticon) {
            setSelectedEmoticon(savedEmoticon)
        }

        // Mis à jour de l'état avec les valeurs du localStorage
        setEmojiCounts(savedEmojiCounts)
        setLikeCounts(savedLikeCounts)
    }, [])

    // Fonction appelée lorsque l'utilisateur clique sur un émoticône
    const handleEmoticonClick = (emoticon) => {
        setSelectedEmoticon(emoticon)

        // Mise à jour du nombre d'utilisations pour l'émoticône sélectionné
        setEmojiCounts((prevCounts) => {
            const newCounts = { ...prevCounts }
            if (!newCounts[emoticon]) {
                newCounts[emoticon] = 0
            }
            newCounts[emoticon] += 1

            // Sauvegarde les nouveaux comptages dans le localStorage
            localStorage.setItem('emojiCounts', JSON.stringify(newCounts))
            localStorage.setItem('selectedEmoticon', emoticon)

            return newCounts
        })
    }

    // Fonction appelée lorsque l'utilisateur clique sur le bouton "like"
    const handleLikeClick = () => {
        setLikeCounts((prevCounts) => {
            const newCounts = { ...prevCounts }
            if (!newCounts[tomeId]) {
                newCounts[tomeId] = 0
            }
            newCounts[tomeId] += 1

            // Sauvegarde les nouveaux comptages de "likes" dans le localStorage
            localStorage.setItem('likeCounts', JSON.stringify(newCounts))
            return newCounts
        })
    }

    // Fonction de navigation vers le premier tome (tome1) au clic du bouton
    const goToTome = () => {
        navigate('/tomes/tome1')
    }

    return (
        <div id="home">
            <h1 id="home-presentation">Kimetsu no Yaiba</h1>

            <div id="main-image-container">
                <img
                    src={demonHome}
                    id="demonHome"
                    alt="Demon Slayer"
                    onClick={goToTome}
                />
            </div>

            <h2>Clique sur l'image pour lancer la lecture</h2>
            <section id="like-section">
                <button onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faThumbsUp} /> Like
                    {likeCounts[tomeId] > 0 && (
                        <span id="like-count"> ({likeCounts[tomeId]})</span>
                    )}
                </button>
            </section>

            <section id="comment-section">
                <div id="comments">
                    <h2 id="comments-title">What do you think?</h2>
                    <div id="emoticons">
                        {['laugh', 'sad', 'hearts', 'angry', 'stars'].map((emoticon) => (
                            <div
                                key={emoticon}
                                id={`${emoticon}-container`}
                                className="emoticon-container"
                            >
                                <FontAwesomeIcon
                                    icon={
                                        emoticon === 'laugh'
                                            ? faFaceLaughSquint
                                            : emoticon === 'sad'
                                            ? faFaceSadCry
                                            : emoticon === 'hearts'
                                            ? faFaceGrinHearts
                                            : emoticon === 'angry'
                                            ? faFaceAngry
                                            : faFaceGrinStars
                                    }
                                    id={emoticon}
                                    onClick={() => handleEmoticonClick(emoticon)}
                                    className={`fa-icon ${selectedEmoticon === emoticon ? 'active' : ''}`}
                                />
                                <span className="emoticon-text">
                                    {emoticon === 'laugh' && 'Funny'}
                                    {emoticon === 'sad' && 'Sad'}
                                    {emoticon === 'hearts' && 'Love'}
                                    {emoticon === 'angry' && 'Angry'}
                                    {emoticon === 'stars' && 'Awesome'}
                                </span>
                                <span id={`${emoticon}-count`}>
                                    {emojiCounts[emoticon] || 0}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
