const mongoose = require('mongoose')

const customerDetailSchema = mongoose.Schema({
   contactName: {
    type: String,
    required: true
   },
   contactEmail: {
      type: String,
      required: true
   },
   contactNumber: {
     type: String,
     requrid: true
   },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      requierd: true
    },
    birthDate:{
      type: String,
      required: true
    },
    gender:{
      type: String,
      required: true
    },
   nationality: {
      type: String,
      required: true
   },
   mealType:{
      type: String,
      requried: true
   },
   passportNumber:{
      type: String,
      required: true
   },
   passportExpiryDate: {
      type: String,
      required: true
   },

   passportImage: {
      type: Image,
      required: true
   }
},
{
   timestamp: true
})

const customerModel = new mongoose.model('customer', customerDetailSchema) 

module.exports = customerModel
