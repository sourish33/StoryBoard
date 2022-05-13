const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const connectDB = require('./config/db')
const routes = require('./routes/index')
const authRoutes = require('./routes/auth')

//Load config
dotenv.config({path: './config/config.env'})
connectDB()

//Passport config
require('./config/passport')(passport)

const app = express()

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
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())



//Static folder
app.use(express.static(path.join(__dirname, 'public')))


//routes
app.use('/', routes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))