const nodemailer = require('nodemailer')
const {EMAIL, PASSWORD}  = require('../config/config')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 587,
    secure: false,
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
})

module.exports = transporter