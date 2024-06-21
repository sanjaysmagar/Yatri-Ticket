const User = require('../../model/user.js')
const {comparePassword} = require('../../utils/bcrypt.js')


const validLogin = async (email, password) =>{
    const trimPassword = password.trim()

    if(!email || !trimPassword){
        return {user: false, isValidMessage: "Email or password field must not be empty"}
    }

    try{
        // Checks if user exist
        const user = await User.findOne({email: email})

        if(!user){
            return {user: false, isValidMessage: "User not found"}
        }
        
        // DecryptPassword and compare with user entered password
        const isPasswordMatched = await comparePassword(trimPassword, user.password)

        if(!isPasswordMatched){
           return {user: false, isValidMessage: "Incorrect Password"}
        }
    
        return {user: user, isValidMessage: ""}
    }
        catch(error){
            console.log(error)
        }
}


const isLogin = async (id) => {
    try{
        const user = await User.findById(id) 
        return {user: user}
        }
        catch(error){
          console.log(error)
        }
}

module.exports = {validLogin, isLogin}