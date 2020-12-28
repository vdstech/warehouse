const express = require('express')
const authRouter = express.Router()

const {findUserById} = require('../controllers/user')
const {signUp, signIn, signOut, isAuth, extractTokenInfo, isAdmin} = require('../controllers/auth')

authRouter.post('/signUp', signUp)
authRouter.post('/signIn', signIn)
authRouter.get('/signOut/:userId', signOut)

authRouter.get('/hello', extractTokenInfo, isAuth, (req, res) => {
    console.log('headers = ', req.auth._id)


    res.status(200).json({
        msg:'User logged in'
    })
})

authRouter.get('/secret/:userId', extractTokenInfo, isAuth, (req, res) => {
    console.log('headers = ', req.auth._id)
    res.status(200).json({
        msg:'User logged in'
    })
})
authRouter.param('userId', findUserById)

module.exports = authRouter
