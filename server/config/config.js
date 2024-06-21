require('dotenv').config()

module.exports = {
    CLIENTID: process.env.CLIENTID,
    CLIENTSECRET: process.env.CLIENTSECRET,
    PORT: process.env.PORT,
    
    DBUSERNAME: process.env.DBUSERNAME, 
    DBPASSWORD: process.env.DBPASSWORD,
    
    SALTROUND: Number(process.env.SALTROUND),
    
    JWT_SECRET: process.env.JWT_SECRET,

    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD
}