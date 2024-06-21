const {EMAIL} = require('../../config/config')
const transporter = require('../../config/nodemailer')

const sendOTP = async (email, OTP) =>{
    try {
      console.log(transporter)
        const info = await transporter.sendMail({
          from: EMAIL,
          to: email,
          subject: 'Reset Password',
          text: `Your OTP to reset password is ${OTP}`
        });
}
catch(error){
    console.log(error)
}
}

module.exports = sendOTP