const { response } = require('express')
const User = require('../../model/user.js')

const updatePassword = async (email, password) =>{
      try{
        const user = await User.findOneAndUpdate({email: email},{password: password},{new: true} )

        if(!user){
            return {isUpdate: false, updateMessage: "User not found"}
        }


        return {isUpdate: true, updateMessage: ""}
      }
      catch(error){
        console.error(error)
      }
}

const findUserByEmail = async (email) =>{
  try{
      // Checks if user already exist
      const user = await User.findOne({email: email}, 'email')
  
      if(!user){
          return {user: null, userMessage: "Email donot exist"}
      }
      return {user: user, userMessage: ""}
}
  catch(error){
      console.error(error)
  }
}

const generateOTP = () =>{
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
}

const verifyOTP = (sessionOTP, OTP) =>{
  if(sessionOTP === OTP){
    return {isVerifyOTP: true, verifyOTPMessage: ""}
  }
  return {isVerifyOTP: false, verifyOTPMessage: "Incorrect OTP"}
}

module.exports = {updatePassword, findUserByEmail, generateOTP, verifyOTP}