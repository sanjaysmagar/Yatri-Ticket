

const logOut = (req, res) => {
    res.status(200).clearCookie('token')
    res.status(200).json({message: 'successful'})
}

module.exports = logOut