const User = require('../models/user')
const jwt = require('jsonwebtoken') // this is used to generate signed jsonwebtoken
const expressJwt = require('express-jwt')
const customId = require("custom-id"); // this is used to generate custom id
require('dotenv').config()

exports.signUp = (req, res) => {
    console.log(__filename, req)
    const user = new User(req.body)

    user.save().then((usr) => {
        const {_id, name, email, mobileNumber, role, emailVerifyStatus, mobileVerifyStatus} = usr
        res.status(200).json({_id, name, email, mobileNumber, emailVerifyStatus, mobileVerifyStatus})
    })
    .catch((err) => {
        console.log(__filename, '(signUp) Error occured while signing up the user = ', err)
        res.status(401).json(err)
    })
}

exports.signIn = (req, res) => {

    var emailID = !req.body.email ? '' : req.body.email.toLowerCase()
    User.findOne( { $or:[ {email: emailID}, {mobileNumber: req.body.mobileNumber}]})
    .then((result) => {

        pwdMatch = result.validatePassword(req.body.password)
        if (!pwdMatch) {
            return res.status(401).json({msg: 'Password not correct. Please try again.'})
        }

        // generate a randomized token from the user id attribute.
        const token_id = customId({
            user_id : result._id,
            date : Date.now(),
            randomLength: 4
        })

        // sign the generated token with the app secret.
        const token = jwt.sign({_id: token_id}, process.env.JWT_SECRET)
        res.cookie('t', token, {expire: new Date() + 99990})
        req.token = token

        result.login_token.push({token_id: token_id, expiry: 9000})
        return result.save()
    })
    .then((loggedInUser) => {
        const {_id, name, email, mobileNumber, role, emailVerifyStatus, mobileVerifyStatus} = loggedInUser
        res.status(200).json({
            token: req.token,
            user: {_id, name, email, mobileNumber, role, emailVerifyStatus, mobileVerifyStatus, roleName: loggedInUser.roleName}
        })
    })
    .catch((err) => {
        console.log(__filename, 'Error occured while fetching the user', err)
        res.status(401).json(err)
    })
}

exports.extractTokenInfo = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: 'auth'
})

exports.isAuth = (req, res, next) => {

    var profile = req.profile
    var _id = req.auth._id

    if (!profile || !_id) {
        return res.status(401).json({msg: 'User profile not found'})
    }

    if (!profile.emailVerifyStatus) {
        return res.status(401).json({msg: 'User mobile number not verified'})
    }

    if (profile.login_token.length == 0) {
        return res.status(401).json({msg: 'User not logged in.'})
    }

    var session = profile.login_token.filter((val) => {
        val === _id
    })

    if (!session) {
        return res.status(401).json({msg: 'No user login session(s) found'})
    }

    next()
}

exports.isSeller = (req, res, next) => {
    if (req.profile.roleName === 'Seller') {
        return next()
    }
    return res.status(401).json({msg: 'The logged-in user is not seller'})
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.roleName === 'User' || req.profile.roleName === 'Seller') {
        return res.status(401).json({msg: 'User has no admin access'})
    }
    next()
}

exports.signOut = (req, res) => {
    res.clearCookie('t')
    var userId = req.profile._id

    User.findById({ _id: userId }).then((result) => {
        result.login_token = []
        return result.save()
    })
    .then((loggedOutUser) => {
        res.status(200).json({msg: 'user logout successfully'})
    })
    .catch((err) => {
        console.log(__filename, 'Error occured while logging out the user. ', err)
        res.status(401).json(err)
    })
}

exports.verifyMobileNumber = (req, res) => {
    console.log(__filename, '(verifyMobileNumber) profile = ', req.profile)
    if (req.profile.mobileVerifyStatus) {
        return res.status(401).json({msg: 'Mobile number already verified'})
    }

    var otpVerifyResult = { 'Status': 'Success', 'Details': 'OTP Matched' }
    if (otpVerifyResult.Status === 'Success') {
        User.updateOne({ _id: req.profile._id }, { $set: { mobileVerifyStatus: true }})
        .then((user) => {
            res.status(200).json({msg: 'OTP verified successfully'})
        })
        .catch((err) => {
            console.log(__filename, '(verifyMobileNumber) Failed to verify the OTP. ', err)
            res.status(401).json(err)
        })
    }
    else {
        res.status(401).json(otpVerifyResult)
    }
}

exports.isEmailVerified = (req, res, next) => {
    console.log(__filename, '(isEmailVerified) profile = ', req.profile)
    if (req.profile.emailVerifyStatus) {
        next()
    }
    else {
        return res.status(401).json({msg: 'Email not verified'})
    }
}

exports.isMobileVerified = (req, res, next) => {
    console.log(__filename, '(isMobileVerified) profile = ', req.profile)
    if (req.profile.mobileVerifyStatus) {
        next()
    }
    else {
        return res.status(401).json({msg: 'Mobile number not verified'})
    }
}
