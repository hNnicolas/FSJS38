const fs = require("fs")
const path = require('path')

module.exports = (TomesModel) => {

    const saveTome = async (req, res) => {
        try {
            const tome = await TomesModel.saveOneTome(req)
            if (tome.code) {
                res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                res.json({ status: 200, msg: "Tome enregistré!", id: tome.id })
            }
        } catch (err) {
            res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    const updateTome = async (req, res) => {
        try {
            const tome = await TomesModel.updateOneTome(req, req.params.id)
            if (tome.code) {
                res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                res.json({ status: 200, msg: "Tome modifié!" })
            }
        } catch (err) {
            res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    const deleteTome = async (req, res) => {
        try {
            // Avant de supprimer, je stocke en mémoire les infos du tome
            const tome = await TomesModel.getOneTome(req.params.id)
            if (tome.code) {
                res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                // On supprime le tome
                const deleteTome = await TomesModel.deleteOneTome(req.params.id)
                if (deleteTome.code) {
                    res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
                } else {
                    // Le tome est supprimé, on supprime l'image du tome 
                    if (tome[0].photo !== "Tome1-cover.webp") {
                        // Supprime le fichier (photo) correspondant au nom de la photo
                        fs.unlink(`public/images/${tome[0].photo}`, (err) => {
                            if (err) {
                                res.json({ status: 500, msg: "Problème de suppression de l'image!" })
                            } else {
                                res.json({ status: 200, msg: "Tome supprimé!" })
                            }
                        })
                    } else {
                        res.json({ status: 200, msg: "Tome supprimé!" })
                    }
                }
            }
        } catch (err) {
            res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    const getOneTome = async (req, res) => {
        try {
            const tomeId = parseInt(req.params.id, 10)
            console.log("ID reçu :", req.params.id)
    
            // Vérification si l'ID est un nombre valide
            if (isNaN(tomeId) || tomeId <= 0) {
                return res.status(400).json({ msg: "L'ID du tome doit être un entier positif." })
            }
    
            const tome = await TomesModel.getOneTome(tomeId)
            console.log("Résultat de la base de données:", tome)
            
            if (tome) {
                return res.status(200).json({ result: tome })
            } else {
                return res.status(404).json({ msg: "Aucun tome trouvé avec cet ID." })
            }
        } catch (err) {
            console.error("Erreur dans getOneTome:", err)
            return res.status(500).json({ msg: "Oups, une erreur est survenue!" })
        }
    }
    

    const getAllTomes = async (req, res) => {
        try {
            const tome = await TomesModel.getAllTomes()
            if (tome.code) {
                res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                res.json({ status: 200, result: tome })
            }
        } catch (err) {
            res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    }

    const savePicture = async (req, res) => {
        try {
            console.log(req.files)
            // Vérification si un fichier a bien été envoyé
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ msg: "Veuillez sélectionner une image pour valider l'enregistrement d'un tome" })
            }
        
            const image = req.files.image

            // Vérification basique du type MIME du fichier
            const validMimeTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/gif']
            if (!validMimeTypes.includes(image.mimetype)) {
                return res.status(400).json({ msg: "Le fichier envoyé n'est pas une image valide !" })
            }

            // Vérification de l'extension du fichier pour éviter les extensions déguisées
            const validExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.gif']
            const fileExtension = image.name.substring(image.name.lastIndexOf('.')).toLowerCase()
            if (!validExtensions.includes(fileExtension)) {
                return res.status(400).json({ msg: "L'extension du fichier n'est pas valide !" })
            }

            // Lire les premiers octets du fichier pour vérifier la signature
            const buffer = image.data.slice(0, 4) // Lire les 4 premiers octets

            // Vérification des signatures magiques pour les images
            const isValidImage = checkImageSignature(buffer)
            if (!isValidImage) {
                return res.status(400).json({ msg: "Le fichier n'est pas une image valide, contenu incorrect !" })
            }

            // Vérifier la taille du fichier
            const maxSize = 2 * 1024 * 1024 // 2 Mo en octets
            if (image.size > maxSize) {
                return res.status(400).json({ msg: "La taille de l'image dépasse 2 Mo !" })
            }

            // Envoi de l'image vers le dossier public/images
            const uploadPath = `public/images/${image.name}`
            image.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).json({ msg: "La photo n'a pas pu être enregistrée!" })
            }
                return res.status(200).json({ msg: "Image enregistrée !", imageUrl: image.name })
            })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Erreur lors de l'enregistrement de l'image!" })
        }
    }

        // Fonction pour vérifier la signature binaire du fichier
        const checkImageSignature = (buffer) => {
            const signatures = {
                jpg: [0xff, 0xd8, 0xff],               // JPEG signature
                png: [0x89, 0x50, 0x4e, 0x47],         // PNG signature
                gif: [0x47, 0x49, 0x46],               // GIF signature
                webp: [0x52, 0x49, 0x46, 0x46]         // WebP signature
            }
        
            for (const key in signatures) {
                const signature = signatures[key]
        
                // Vérifie si la taille du buffer est suffisante pour comparer la signature
                if (buffer.length >= signature.length) {
                    let isMatch = true
        
                    // Comparer chaque octet de la signature
                    for (let i = 0; i < signature.length; i++) {
                        if (buffer[i] !== signature[i]) {
                            isMatch = false
                            break
                        }
                    }
        
                    // Si tous les octets correspondent, retourne `true`
                    if (isMatch) return true
                }
            }
        
            // Si aucune signature ne correspond, retourne `false`
            return false
        }
        
    return {
        saveTome,
        updateTome,
        deleteTome,
        getOneTome,
        getAllTomes,
        savePicture
    }
}
