const bcrypt = require('bcrypt')
const {SALTROUND} = require('../config/config')

const encryptPassword = async (password) =>{
    try{
       return await bcrypt.hash(password, SALTROUND)
    }
    catch(error){
        console.error(error)
    }
}

const comparePassword = async (password, userPassword) =>{
    try{
        return await bcrypt.compare(password, userPassword)
    }
    catch(error){
        console.log(error)
    }
}

module.exports = {encryptPassword, comparePassword}