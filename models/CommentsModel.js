module.exports = (_db)=>{
    db = _db
    return CommentsModel
}

class CommentsModel {
   
     //sauvegarde d'un commentaire
    static saveOneComment(users_id, content, tomes_id){

        return db.query(
        'INSERT INTO comments (content, date, users_id, tomes_id) VALUES (?, NOW(), ?,  ?)', 
        [content, users_id, tomes_id]
        )
        .then((res) => {
            return { insertId: res.insertId }
        })
        .catch((err) => {
            return { code: 500, msg: 'Erreur lors de la sauvegarde du commentaire', error: err }
        })
    }

    // modification d'un commentaire d'un utilisateur
    static updateOneComment(commentId, content, status) {

        return db.query('UPDATE comments SET content = ?, status = ? WHERE id = ?', [content, status, commentId])
         .then((res) => {
        console.log('Résultat de la requête:', res)
        return res
        })
        .catch((err) => {
        console.error('Erreur lors de la mise à jour:', err)
        return err
        })
    }

    // récupération des commentaires sur un tome spécifique avec les détails de l'utilisateur et le statut du commentaire
    static getCommentsForTome(tomeId) {
        return db.query(`
            SELECT comments.id AS comment_id, 
                comments.content AS comment_text, 
                comments.tomes_id AS tomes_id, 
                comments.status AS comment_status, 
                users.id AS user_id, 
                users.firstname, 
                users.lastname, 
                users.email
            FROM comments
            JOIN users ON comments.users_id = users.id
            WHERE comments.tomes_id = ?
        `, [tomeId])
        .then((res) => {
            if (Array.isArray(res) && res.length > 0) {
                return res  // Retourne tous les commentaires pour ce tome
            } else {
                return []  // Retourne un tableau vide si aucun commentaire n'est trouvé
            }
        })
        .catch((err) => {
            throw err  
        })
    }

    // récupération d'un commentaire avec le détails de l'utilisateur
    static getCommentWithDetails(id) {
        return db.query(`
            SELECT comments.id AS comment_id, 
                   comments.content AS comment_text, 
                   comments.tomes_id AS tome_id, 
                   users.id AS user_id, 
                   users.firstname, 
                   users.lastname, 
                   users.email
            FROM comments
            JOIN users ON comments.users_id = users.id
            WHERE comments.id = ?
        `, [id])
        .then((res) => {
            if (Array.isArray(res) && res.length > 0) {
                return res[0]
            } else {
                return {}
            }
        })
        .catch((err) => {
            throw err
        })
    }

     //récupération de tous les commentaires
    static getAllComment(status = 1){
        return db.query('SELECT * FROM comments')
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }

    //suppréssion d'un commentaire d'un utilisateur
    static deleteOneComment(id){
        return db.query('DELETE FROM comments WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}