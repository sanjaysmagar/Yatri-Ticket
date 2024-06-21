const {validLogin, isLogin} = require('../../services/auth/login')
const { generateToken } = require('../../utils/jwtToken')


const login = async (req, res) => {
    const {email, password} = req.body

    const {user, isValidMessage} =  await validLogin(email, password)

    if(!user){
        return res.status(401).json({message: isValidMessage})
    }
        const token = generateToken(user)
        
        res.cookie('token', token)
        res.status(200).json({message:"Login successful", user: user})
    
}


const checkLogin = async (req, res) =>{
    const {id, email} = req.user
   
    
    const {user} =  await isLogin(id)

    if(!user){
        return res.status(401).json(null)
    }
    console.log(user)
    res.status(200).json(user)
   
}

module.exports = {login, checkLogin}

