const Ajv = require('ajv')
const ajvFormats = require('ajv-formats')

const ajv = new Ajv({allErros: true})
ajvFormats(ajv)

module.exports = ajv