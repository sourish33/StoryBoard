const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const router = require('./routes/index')

//Load config
dotenv.config({path: './config/config.env'})
connectDB()

const app = express()

//Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//EJS
app.set('view engine', 'ejs');


//Static
app.use()


//routes
app.use('/', router)

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))