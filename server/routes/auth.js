const express = require('express')
const router = express.Router()
const logOut = require('../controller/auth/logOut')
const register = require('../controller/auth/register')
const {login, checkLogin} = require('../controller/auth/login')
const authenticate = require('../middleware/authenticate')
const registerSchema = require('../schema/auth/register')
const loginSchema = require('../schema/auth/login')
const validator = require('../middleware/validator')
const {verifyEmailAndSendOTP, verifyOTP, changePassword} = require('../controller/auth/reset')

router.route('/register').post(validator(registerSchema), register)

router.route('/login').post(validator(loginSchema), login)

router.route('/check-login').get(authenticate, checkLogin)

router.route('/logout').get(authenticate, logOut)

router.route('/reset-password/:email').get(verifyEmailAndSendOTP)
router.route('/reset-password')
.post(verifyOTP)
.put(changePassword)

module.exports = router
