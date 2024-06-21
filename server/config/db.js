const {DBUSERNAME,DBPASSWORD} = require('./config')
const mongoose = require('mongoose')

const connectDB = () => {
mongoose.connect(`mongodb+srv://${DBUSERNAME}:${DBPASSWORD}@yatri-ticket.h9u37m8.mongodb.net/Yatri-DB?retryWrites=true&w=majority&appName=Yatri-Ticket`)
.then(() =>{
    console.log("Connected to database")
})
.catch(error => console.error(error))
}


module.exports = connectDB;