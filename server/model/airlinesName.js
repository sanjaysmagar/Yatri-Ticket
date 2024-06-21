const { Timestamp } = require("mongodb")

const mongoose = require('mongoose')

const AirlinesNameSchema = mongoose.Schema({
    iataCode: {
        type: String,
        required: true,
        unique: true
    },
    businessName: {
        type: String,
        required: true,
        unique: true
    }
},
{
    timestamp: true
})

const AirlinesName = mongoose.model("airlinesname", AirlinesNameSchema)

module.exports = AirlinesName