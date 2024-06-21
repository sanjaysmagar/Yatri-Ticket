const {EMAIL} = require('../../config/config')
const transporter = require('../../config/nodemailer')

const sendWelcomeMail = async (email, fristName, lastName) =>{
    try {
        const info = await transporter.sendMail({
          from: EMAIL,
          to: email,
          subject: 'Welcome to Our Service',
          text: `Hello ${fristName} ${lastName},\n\nThank you for registering!\n\nBest regards,\nYour Company`,
        });
}
catch(error){
    console.log(error)
}
}

module.exports = sendWelcomeMail