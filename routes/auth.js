const express = require('express')
const authRouter = express.Router()

const {findUserById} = require('../controllers/user')
const {signUp, signIn, signOut, isAuth, extractTokenInfo, isAdmin, verifyMobileNumber} = require('../controllers/auth')
const {registrationRules, registationRulesCheck} = require('../validators/auth')
const { body } = require('express-validator')

authRouter.post('/signUp', registrationRules, registationRulesCheck, signUp)
authRouter.post('/signIn', signIn)
authRouter.get('/signOut/:userId', signOut)
authRouter.post('/otpVerify/:userId', verifyMobileNumber)

authRouter.get('/secret/:userId', extractTokenInfo, isAuth, (req, res) => {
    console.log('headers = ', req.auth._id)
    res.status(200).json({
        msg:'User logged in'
    })
})
authRouter.param('userId', findUserById)

module.exports = authRouter
