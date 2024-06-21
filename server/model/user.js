const { Timestamp } = require("mongodb")

const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
        firstName: {
            type: String,
            required: true
        },
    
        lastName: {
            type: String,
            required: true
        },
    
        email:{
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true 
        },
          
        countryCode: {
            type: String,
            required: true
        },

        phoneNumber:{
            type: Number,
            required: true
        },

        nationality:{
            type: String,
            required: true
        }
},
{
    timestamp: true
}
)

const User = new mongoose.model('user', UserSchema)

module.exports = User