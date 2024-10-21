import React from 'react'

const PrivacyPolicy = () => {
     // Récupère la date actuelle et la formate en chaîne de caractères selon les paramètres locaux
    const currentDate = new Date().toLocaleDateString()

    return (
        <div id="privacy-policy-container">
            <h1 id="privacy-policy-title">Politique de Confidentialité de DemonSlayerE-Book</h1>
            <p>**Dernière mise à jour : {currentDate}**</p>
            
            <h2 id="privacy-introduction">1. Informations que nous collectons</h2>
            <p>Nous collectons plusieurs types d’informations lorsque vous utilisez notre site, notamment </p>
            <ul>
                <li><strong>Informations personnelles</strong> Lorsque vous vous inscrivez sur notre site, nous collectons des informations personnelles telles que votre nom, adresse e-mail, et toute autre information que vous choisissez de fournir.</li>
                <li><strong>Données de lecture</strong> Nous collectons des informations sur les séries animées que vous lisez, y compris vos préférences et votre historique de lecture.</li>
                <li><strong>Données techniques</strong> Nous collectons également des informations techniques, y compris votre adresse IP, le type de navigateur que vous utilisez, et les pages que vous visitez sur notre site.</li>
            </ul>

            <h2 id="privacy-usage">2. Utilisation des informations</h2>
            <p>Nous utilisons les informations collectées pour </p>
            <ul>
                <li>Vous fournir un accès à nos services de lecture.</li>
                <li>Améliorer notre site et nos services.</li>
                <li>Personnaliser votre expérience utilisateur.</li>
                <li>Communiquer avec vous concernant vos lectures, mises à jour et promotions.</li>
                <li>Analyser l'utilisation de notre site afin d’améliorer nos offres.</li>
            </ul>

            <h2 id="privacy-data-retention">3. Conservation des données</h2>
            <p>Nous conserverons vos informations personnelles aussi longtemps que nécessaire pour atteindre les objectifs décrits dans cette Politique de Confidentialité ou pour respecter les obligations légales applicables. Lorsque vos informations ne sont plus nécessaires, nous les supprimerons ou les rendrons anonymes.</p>

            <h2 id="privacy-cookies">4. Cookies</h2>
            <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site. Les cookies sont de petits fichiers de données stockés sur votre appareil lorsque vous visitez notre site. Ils nous aident à </p>
            <ul>
                <li>Reconnaître votre appareil lors de vos visites ultérieures.</li>
                <li>Analyser le trafic et l'utilisation de notre site.</li>
                <li>Personnaliser le contenu en fonction de vos préférences.</li>
            </ul>
            <p>Vous pouvez choisir d’accepter ou de refuser les cookies dans les paramètres de votre navigateur. Cependant, si vous refusez les cookies, certaines fonctionnalités de notre site peuvent ne pas fonctionner correctement.</p>

            <h2 id="privacy-information-sharing">5. Partage des informations</h2>
            <p>Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. Nous pouvons partager vos informations avec des tiers dans les cas suivants :</p>
            <ul>
                <li>Avec votre consentement explicite.</li>
                <li>Pour se conformer aux lois, réglementations, ou demandes judiciaires.</li>
                <li>Pour protéger nos droits, votre sécurité ou celle d'autrui.</li>
            </ul>

            <h2 id="privacy-data-security">6. Sécurité des données</h2>
            <p>Nous prenons des mesures raisonnables pour protéger vos informations personnelles contre l'accès non autorisé, l'utilisation abusive, la divulgation ou la destruction. <br>
            </br>Cependant, aucune méthode de transmission sur Internet ou méthode de stockage électronique n'est totalement sécurisée. Nous ne pouvons garantir la sécurité absolue de vos informations.</p>

            <h2 id="privacy-user-rights">7. Vos droits</h2>
            <p>En vertu des lois applicables, vous pouvez avoir certains droits concernant vos informations personnelles, notamment </p>
            <ul>
                <li>Le droit d'accéder à vos informations personnelles.</li>
                <li>Le droit de demander la rectification de vos informations personnelles inexactes.</li>
                <li>Le droit de demander la suppression de vos informations personnelles.</li>
                <li>Le droit de vous opposer à l'utilisation de vos informations personnelles à des fins de marketing direct.</li>
            </ul>
            <p>Pour exercer ces droits, veuillez nous contacter à l'adresse fournie ci-dessous.</p>

            <h2 id="privacy-modifications">8. Modifications de cette Politique</h2>
            <p>Nous nous réservons le droit de modifier cette Politique de Confidentialité à tout moment. <br>
            </br>Nous vous informerons des modifications en publiant la nouvelle Politique sur notre site. Nous vous encourageons à consulter régulièrement cette page pour rester informé de notre politique de confidentialité.</p>

            <h2 id="privacy-contact">9. Contact</h2>
            <p>Pour toute question ou préoccupation concernant cette Politique de Confidentialité ou nos pratiques de traitement des données, veuillez nous contacter à </p>
            <ul>
                <li><strong>Email</strong>  contact@demonslayerE-Book.com</li>
            </ul>
        </div>
    )
}

export default PrivacyPolicy
