const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const mongoose = require('mongoose')
const User = require('./models/User')
const flash = require('connect-flash');
var methodOverride = require('method-override')



const routes = require('./routes/index')
const authRoutes = require('./routes/auth')
const storyRoutes = require('./routes/stories')


//Load config
dotenv.config({path: './config/config.env'})
connectDB()

//Passport config
const initializePassportLocal = require('./config/passport-config-local')

initializePassportLocal(passport, async email =>{
    console.log("getUserByEmail speaking!")
    try {
        const user = await User.findOne({email:email}).lean()
        return user
    } catch (error) {
        throw new Error(error)
    }

}, async id =>{
    console.log("getUserById speaking!")
    try {
        const user = await User.findById(id).lean()
        return user
    } catch (error) {
        throw new Error(error)
    }
})

const app = express()

//Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//EJS
app.set('view engine', 'ejs');

//Sessions
app.use(session({
    secret: "hello",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongoUrl: process.env.MONGO_URI})
}))


//Passport middleware
app.use(passport.initialize())
app.use(passport.session())


//Flash
app.use(flash());




//Static folder
app.use(express.static(path.join(__dirname, 'public')))


//routes
app.use(methodOverride('_method'))
app.use('/', routes)
app.use('/auth', authRoutes)
app.use('/stories', storyRoutes)


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))