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
const flash = require('express-flash');
var methodOverride = require('method-override')


const routes = require('./routes/index')
const authRoutes = require('./routes/auth')
const storyRoutes = require('./routes/stories')
const userRoutes = require('./routes/users')
const adminRoutes = require('./routes/admin')


//Load config
dotenv.config({path: './config/config.env'})
connectDB()

//Passport config
const initializePassportLocal = require('./config/passport-config-local')

initializePassportLocal(passport, async email =>{
    try {
        const user = await User.findOne({email:email}).lean()
        return user
    } catch (error) {
        throw new Error(error)
    }

}, async id =>{
    try {
        const user = await User.findById(id).lean()
        return user
    } catch (error) {
        throw new Error(error)
    }
})
const initializePassportGoogle = require('./config/passport-config-google')
initializePassportGoogle(passport)

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

//Flash
app.use(flash());

//Sessions
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongoUrl: process.env.MONGO_URI}),
}))


//Passport middleware
app.use(passport.initialize())
app.use(passport.session())







//Static folder
app.use(express.static(path.join(__dirname, 'public')))


//routes
app.use(methodOverride('_method'))
app.use('/', routes)
app.use('/auth', authRoutes)
app.use('/stories', storyRoutes)
app.use('/users', userRoutes)
app.use('/admin', adminRoutes)


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

//Onetime update { field: { $exists: <boolean> } }


