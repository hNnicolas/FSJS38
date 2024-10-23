module.exports = (_db)=>{
    db = _db
    return TomesModel
}

class TomesModel {
    
    //récupération des tomes
    static getAllTomes() {
        return db.query('SELECT * FROM tomes ORDER BY id DESC, name ASC')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    // récupération d'un seul tome avec les images (tableau) de la table content

        static getOneTome(id) {
            return db.query(`
                SELECT 
                    tomes.id AS tome_id,
                    tomes.name, 
                    tomes.picture, 
                    tomes.alt, 
                    tomes.description, 
                    tomes.release_date,
                    contents.id AS content_id,
                    contents.picture AS content_picture,
                    contents.alt AS content_alt,
                    contents.rang AS content_rang
                FROM tomes
                LEFT JOIN contents ON tomes.id = contents.tomes_id
                WHERE tomes.id = ?`, [id])
            .then((results) => {
  
                if (!Array.isArray(results) || results.length === 0) {
                    return null
                }
        
                const rows = results
        
                // Créez un objet tomeInfo basé sur la première ligne
                const tomeInfo = {
                    id: rows[0].tome_id,
                    name: rows[0].name,
                    picture: rows[0].picture,
                    alt: rows[0].alt,
                    description: rows[0].description,
                    release_date: rows[0].release_date,
                    contents: [] 
                }
        
                // Parcourir les résultats pour ajouter tous les contenus
                rows.forEach(row => {
                    if (row.content_id !== null) {
                        tomeInfo.contents.push({
                            content_id: row.content_id,
                            picture: row.content_picture,
                            alt: row.content_alt,
                            rang: row.content_rang
                        })
                    }
                })
        
                return tomeInfo 
            })
            .catch((err) => {
                throw err
            })
        }

    //sauvegarde d'un tome
    static async saveOneTome(req) {
        try {
            // Effectuer l'insertion
            const result = await db.query('INSERT INTO tomes (name, picture, alt, description, release_date) VALUES (?, ?, ?, ?, ?)', 
                [req.body.name, req.body.picture, req.body.alt, req.body.description, req.body.release_date]);
            
            // Récupérer l'ID du dernier enregistrement inséré
            const tomeId = result.insertId; // insertId contient l'ID du dernier enregistrement
    
            return { id: tomeId }; // Retourner l'ID du tome
        } catch (err) {
            return { code: 500, msg: "Oups, une erreur est survenue!" };
        }
    }
    

    //modification d'un tome
    static updateOneTome(req) {
        return db.query('UPDATE tomes SET name = ?, picture = ?, alt = ?, description = ?, release_date = ? WHERE id = ?', 
            [req.body.name, req.body.picture, req.body.alt, req.body.description, req.body.release_date, req.params.id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    //suppression d'un tome
    static deleteOneTome(id){
        return db.query('DELETE FROM tomes WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
}