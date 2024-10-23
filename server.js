const express = require("express")
const app = express()

const mysql = require("promise-mysql")
const cors = require("cors")
// const helmet = require("helmet")


// app.use(helmet())

app.use(cors())

const fileUpload = require('express-fileupload')

app.use(fileUpload({
    createParentPath: true
}))

//parse les url
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(__dirname+'/public'))

const dotenv = require("dotenv")
dotenv.config()

//on récupère nos routes
const authRoutes = require("./routes/authRoutes")
const commentsRoutes = require("./routes/commentsRoutes")
const contactsRoutes = require("./routes/contactsRoutes")
const contentsRoutes = require("./routes/contentsRoutes")
const tomesRoutes = require("./routes/tomesRoutes")
const usersRoutes = require("./routes/usersRoutes")

mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}).then((db) => {
    console.log('connecté à la bdd !')
    
    setInterval(async () => {
        const res = await db.query("SELECT 1")
    }, 10000)
    
    app.get('/', async (req, res, next) => {
        res.json({status: 200, msg: "Welcome to DemonSlayer E-Book!"})
    })
    
    authRoutes(app, db)
    commentsRoutes(app, db)
    contactsRoutes(app,db)
    contentsRoutes(app, db)
    tomesRoutes(app, db)
    usersRoutes(app, db)

}).catch(err=>console.log(err))

const PORT = process.env.PORT || 9500
app.listen(PORT, () => {
    console.log(`Serveur à l'écoute sur le port ${PORT} `)
})