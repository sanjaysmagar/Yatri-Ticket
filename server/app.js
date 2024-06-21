const express = require('express')
const app = express()
const FlightEngine = require('./routes/FlightEngine')
const auth = require('./routes/auth')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const connectDB = require('./config/db')

connectDB();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(session({
    secret: 'This is insane', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1500000
    } // Set to true if using HTTPS
}));
  
app.use('/flight/v1',FlightEngine)
app.use('/',auth)




module.exports = app