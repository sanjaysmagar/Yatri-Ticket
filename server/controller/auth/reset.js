const {findUserByEmail, updatePassword, generateOTP} = require('../../services/auth/reset')
const sendOTP = require('../../services/mail/resetPasswordMail')

const verifyEmailAndSendOTP = async (req, res) =>{
    const email = req.params.email
    try{
      const {user, userMessage} = await findUserByEmail(email)
  
      if(!user){
          return res.status(400).json({message: userMessage})
      }
      
      const OTP = generateOTP()
      await sendOTP(email, OTP)
      req.session.user = {
        email: email,
        OTP: OTP
      }
      console.log(req.session.user)
      res.status(200).json(true)
      }
    catch(errror){
        console.error(errror)
    }
  }



  const verifyOTP = async (req, res) =>{
    console.log(req.session.user)
    const {OTP} = req.body
    console.log(OTP)
     try{
      sessionOTP = req.session.user.OTP
      const {isVerifyOPT, verifyOPTMessage} = verifyOTP(sessionOTP, OTP)

      if(!isVerifyOPT){
        return res.json({message: verifyOPTMessage})
      }
      res.status(200).json(true)
     }
     catch(error){
      console.log(error)
     }
  }


  const changePassword = async (req, res) =>{
    const {password} = req.body
    try{
       const {isUpdate, updateMessage} = await updatePassword(req.session.user.email, password)

       if(!isUpdate){
        return res.json.status(400).json({message: false})
       }

      res.status(200).json({message: "Updated successfully"})
    }
    catch(error){
      console.log(error)
    }
  }

module.exports = {verifyEmailAndSendOTP, verifyOTP, changePassword}