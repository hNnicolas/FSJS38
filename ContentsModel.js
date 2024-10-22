module.exports = (_db)=>{
    db = _db
    return ContentsModel
}

class ContentsModel {

    // Sauvegarde des images secondaires d'un tome dans la table contents
    static async saveOneContent(picture, alt, rang, tomeId) {
        try {
            const result = await db.query(
                'INSERT INTO contents (picture, alt, rang, tomes_id) VALUES (?, ?, ?, ?)',
                [
                    picture,    
                    alt || 'Alt par défaut',     
                    rang || 1,                   
                    tomeId                      
                ]
            )
            
            return result
        } catch (err) {
            return { code: 500, msg: "Erreur lors de la sauvegarde du contenu", error: err }
        }
    }

    
     //récupération d'un contenu d'un tome
     static getOneContent(id){
        return db.query('SELECT * FROM contents WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    // modification d'un contenu d'un tome
    static updateOneContent(req) {
        return db.query('UPDATE contents SET picture = ?, alt = ?, rang = ? WHERE id = ?', [req.body.picture, req.body.alt, req.body.rang, req.params.id])
            .then((res) => {
                if (res.affectedRows > 0) 
                return res
            })
            .catch((err) => {
                return err
            })
    }
    
    //suppression du contenu d'un tome
    static deleteOneContent (id){
        return db.query('DELETE FROM contents WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}
