const express = require('express')
const authRouter = express.Router()

const {findUserById} = require('../controllers/user')
const {signUp, signIn, signOut, isAuth, extractTokenInfo, isAdmin, verifyMobileNumber} = require('../controllers/auth')
const {registrationRules, loginRules, validationRulesCheck} = require('../validators/auth')
const { body } = require('express-validator')

authRouter.post('/signUp', registrationRules, validationRulesCheck, signUp)
authRouter.post('/signIn', loginRules, validationRulesCheck, signIn)
authRouter.get('/signOut/:userId', signOut)
authRouter.post('/otpVerify/:userId', verifyMobileNumber)

authRouter.get('/secret/:userId', extractTokenInfo, isAuth, (req, res) => {
    res.status(200).json({msg:'User logged in'})
})
authRouter.param('userId', findUserById)

module.exports = authRouter
