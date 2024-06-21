const { verifyToken } = require('../utils/jwtToken')

const authenticate = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
        return res.status(401).json({ message: "Invalid token." })
    }

    req.user = decoded; 
    next()
}

module.exports = authenticate
