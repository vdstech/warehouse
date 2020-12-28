const User = require('../models/user')
const jwt = require('jsonwebtoken') // this is used to generate signed jsonwebtoken
const expressJwt = require('express-jwt')
const customId = require("custom-id"); // this is used to generate custom id
require('dotenv').config()

exports.signUp = (req, res) => {
    console.log('Login info sent = ', req.body)
    const user = new User(req.body)
    user.save((err, result) => {
        if (err || !result) {
            res.status(401).json({
                msg: err
            })
            return
        }

        res.status(200).json({
            result
        })
    })
}

exports.signIn = (req, res) => {
    console.log('Login info to validate = ', req.body.email)

    var email = req.body.email.toLowerCase()
    User.findOne({ email: email }, (err, result) => {
        if (err || !result) {
            msg = 'Error while retrieving user details for email = ' + email
            console.log(msg)
            res.status(401).json({
                err: msg
            })
            return
        }

        console.log('The result = ', result)
        if (!result.validatePassword(req.body.password)) {
            console.log('Password incorrect for the email = ', email)
            msg = 'Incorrect password for the email = ' + email
            res.status(401).json({
                err: msg
            })
            return
        }

        console.log('The result = ', result)
        const token_id = customId({
            user_id : result._id,
            date : Date.now(),
            randomLength: 4
        });
        result.login_token.push({token_id: token_id, expiry: 9000});
        result.save()

        const token = jwt.sign({_id: token_id}, process.env.JWT_SECRET)
        res.cookie('t', token, {expire: new Date() + 99990})
        const {_id, name, email, role} = result

        res.status(200).json({
            token,
            user: {_id, name, email, role}
        })
    });
}

exports.extractTokenInfo = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: 'auth'
})

exports.isAuth = (req, res, next) => {

    var profile = req.profile
    var _id = req.auth._id

    console.log('_id = ', _id)
    console.log('profile = ', profile.login_token[0].token_id)

    if (!profile || !_id || !profile.login_token[0] || profile.login_token[0].token_id !== _id) {
        res.status(401).json({
            msg: 'User not logged in'
        })
        return
    }

    next()
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        res.status(401).json({
            err: 'User has no admin access'
        })
        return
    }
    next()
}

exports.signOut = (req, res) => {
    res.clearCookie('t')
    var userId = req.profile._id
    User.findById({ _id: userId }, (err, result) => {
        if (err || !result) {
            res.status(401).json({
                msg: 'Unable to logout'
            })
            return
        }

        result.login_token = []
        result.save()

        res.status(200).json({
            msg: 'user logout successfully'
        })

    })
}
