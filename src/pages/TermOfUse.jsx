import { useEffect } from 'react'

const TermOfUse = () => {

    useEffect(() => {
        // Désactiver le clic droit
        const handleContextMenu = (e) => {
            e.preventDefault()
        }
        
        // Désactiver la sélection de texte
        const handleSelectStart = (e) => {
            e.preventDefault()
        }
        
        // Ajoute des événements au montage du composant
        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('selectstart', handleSelectStart)

        // Nettoye les événements au démontage du composant
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('selectstart', handleSelectStart)
        }
    }, [])

    return (
        <div id="terms-container">
            <h1 id="terms-title">Conditions Générales d'Utilisation</h1>
            <p id="terms-intro">
                Bienvenue sur DemonSlayer E-Book. En accédant ou en utilisant nos services, vous acceptez d'être lié par ces Conditions Générales d'Utilisation.
            </p>
            <h2 id="terms-acceptance">1. Acceptation des Conditions</h2>
            <p>
                En accédant à ce site, vous reconnaissez avoir lu, compris et accepté d'être lié par ces conditions.
            </p>
            <h2 id="terms-property">2. Propriété Intellectuelle</h2>
            <p>
                Tout le contenu fourni sur DemonSlayer E-Book, y compris les textes, graphiques, logos et images, est protégé par le droit d'auteur.
                Vous ne pouvez pas copier, reproduire ou distribuer de contenu sans l'autorisation écrite préalable de l'opérateur.
            </p>
            <h2 id="terms-conduct">3. Conduite de l'Utilisateur</h2>
            <p>
                Vous vous engagez à ne pas utiliser ce site à des fins illégales ou interdites, y compris, sans s'y limiter, le piratage,
                le vol de données ou la violation des lois locales, nationales ou internationales.
            </p>
            <h2 id="terms-behavior">4. Charte de Comportement</h2>
            <p>
                Nous attendons de chaque utilisateur qu'il fasse preuve de respect mutuel envers les autres membres de la communauté.
                Il est strictement interdit de publier des messages malveillants, des injures, des propos discriminatoires ou tout autre contenu nuisible.
                Tout comportement qui va à l'encontre de cette charte pourra entraîner des mesures disciplinaires, y compris, mais sans s'y limiter, le bannissement.
            </p>
            <h2 id="terms-liability">5. Exclusion de Responsabilité</h2>
            <p>
                L'opérateur de DemonSlayer E-Book ne sera pas tenu responsable des dommages résultant de votre utilisation de ce site.
                Tout le contenu est fourni "tel quel" sans aucune garantie de quelque nature que ce soit.
            </p>
            <h2 id="terms-modification">6. Modification des Conditions</h2>
            <p>
                L'opérateur se réserve le droit de modifier ces conditions à tout moment. Il est de votre responsabilité de consulter régulièrement les conditions.
            </p>
            <h2 id="terms-law">7. Droit Applicable</h2>
            <p>
                Ces Conditions Générales d'Utilisation sont régies par les lois de juridiction. Tout litige sera traité devant les tribunaux de votre juridiction.
            </p>
        </div>
    )
}

export default TermOfUse
