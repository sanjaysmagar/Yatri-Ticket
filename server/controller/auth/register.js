
const {validatePassword, findUserByEmail, encryptPassword, createUser} = require('../../services/auth/register')
const sendWelcomeMail = require('../../services/mail/welcomeMail')
const { generateToken } = require('../../utils/jwtToken')


const register = async (req, res) => { 
try{
const {firstName, lastName, email, password, confirmPassword, countryCode, phoneNumber, nationality} = req.body

   const {isValid, isValidMessage} = validatePassword(password, confirmPassword)

   if(!isValid){
     return res.status(400).json({message: isValidMessage})
   }

    const {user, userMessage} = await findUserByEmail(email)
  

    if(user){
        return res.status(400).json({message: userMessage})
    }

    //EncryptPassword and register user to database
    const hashPassword =  await encryptPassword(password.trim())

    const registerUser = await createUser({firstName, lastName, email, password: hashPassword, countryCode, phoneNumber, nationality}) 
     
     const token = generateToken(registerUser)

     res.cookie('token', token)
     res.status(200).json({message: true, user: registerUser})
     await sendWelcomeMail(email, firstName, lastName)
     
    }
    catch(error){
      console.log(error)
    }
  
}


module.exports = register