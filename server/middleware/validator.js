
const validator = (schema) =>{

    return (req, res, next) =>{
      const valid = schema(req.body)

      if(!valid){
        const errors = schema.errors
        console.log(errors)
        return res.status(400).json(errors)
      }
      next()
    }
}

module.exports = validator