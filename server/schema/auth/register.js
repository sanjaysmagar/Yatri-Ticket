const ajv = require('../../utils/ajv')

const registerSchema = {
    type: "object",
    properties: {
      firstName: {type: "string"},
      lastName: {type: "string"},
      email: {type: "string", format: 'email'},
      password: {type: "string", format: 'password', minLength: 8},
      confirmPassword: {type: "string", minLength: 8},
      countryCode: {type: "string",},
      phoneNumber: {type: "string"},
      nationality: {type: "string"}

    },
    required: [
        "firstName", 
        "lastName", 
        "email", 
        "password", 
        "confirmPassword",
        "countryCode", 
        "phoneNumber", 
        "nationality"
    ],
    additionalProperties: false
}

module.exports = ajv.compile(registerSchema)