require('dotenv').config()
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const server = express()
const PORT = process.env.PORT || 3000;
const connectDatabase = require('./server/config/database')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const session = require('express-session')
const methodOverride = require('method-override')

connectDatabase()
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cookieParser())
server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

server.use(methodOverride('_method'))
server.use(express.static('public'))
server.use(expressLayout)
server.set('layout', './layouts/main')
server.set('view engine', 'ejs')

server.use('/', require('./server/routes/app'))
server.use('/', require('./server/routes/admin'))


server.listen(PORT, () => console.log(`Server live on Port ${PORT}`))