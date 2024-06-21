const ajv = require('../../utils/ajv')

const loginSchema = {
    type: "object",
    properties: {
      email: {type: "string", format: 'email'},
      password: {type: "string", format: 'password', minLength: 8}
    },
    required: [
        "email", 
        "password"
    ],
    additionalProperties: false
}

module.exports = ajv.compile(loginSchema)