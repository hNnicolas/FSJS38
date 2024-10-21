module.exports = (UsersModel) => {
    const checkToken = async (req, res) => {
        try {
            const user = await UsersModel.getOneUser(req.id)
            if(user.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                const myUser = {
                    id: user[0].id,
                    firstName: user[0].firstname,
                    lastName: user[0].lastname,
                    email: user[0].email,
                    role: user[0].role
                }
                res.json({status: 200, user: myUser})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    return {
        checkToken
    }
}