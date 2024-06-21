const User = require('../../model/user.js')
const bcrypt = require('bcrypt')
const { generateToken } = require('../../utils/jwtToken')
const {SALTROUND} = require('../../config/config')


const validatePassword = (password, confirmPassword) => {
    const trimPassword = password.trim()
    const trimConfirmPassword = confirmPassword.trim()

    if(trimPassword !== trimConfirmPassword){
        return {isValid: false, isValidmessage: "Password and confirm password not matched"}
}

// Checks if password meets the requirement
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

    if (!passwordRegex.test(trimPassword)) {
        return {isValid: false,
        isValidmessage: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      };
    }
    return {isValid: true, isValidmessage: ""}
}


const findUserByEmail = async (email) =>{
    try{
        // Checks if user already exist
        const user = await User.findOne({email: email}, 'email')
    
        if(user){
            return {user: true, userMessage: "Email already exist"}
        }
        return {user: false, userMessage: ""}
}
    catch(error){
        console.error(error)
    }
}


const encryptPassword = async (password) =>{
        try{
           return await bcrypt.hash(password, SALTROUND)
        }
        catch(error){
            console.error(error)
        }
}

const createUser = async ({firstName, lastName, email, password, countryCode, phoneNumber, nationality}) => {
     try{
        return await User.create({firstName, lastName, email, password, countryCode, phoneNumber, nationality})
     }
     catch(error){
        console.error(error)
    }
   
}

module.exports = {validatePassword, findUserByEmail, encryptPassword, createUser}

