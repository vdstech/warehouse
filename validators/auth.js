const { body, validationResult } = require('express-validator')
const _ = require('lodash')

exports.registrationRules = [
    //name
    body('name').exists().notEmpty().isLength({min:5, max:30})
    .withMessage('Name should not be empty. It should contain min 5 characters and maximum 30 characters'),

    //password
    body('password').exists().notEmpty().matches(/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&*])(?=.*[a-z]){8,16}/)
    .withMessage('Password should be minimum 8 characters and maximum 16 characters.'
    + 'It should contain one lower case character, one upper case character, one digit and special character'),

    //mobileNumber
    body('mobileNumber').exists().notEmpty().isLength({min:13, max:13}).withMessage('Invalid mobile Number'),
]

exports.loginRules = [
    body('name').exists().notEmpty().withMessage('Name should not be empty'),
    body('password').exists().notEmpty().withMessage('Password should not be empty')
]

exports.validationRulesCheck = (req, res, next) => {
    var errors = validationResult(req).mapped()
    if (_.isEmpty(errors) && _.isPlainObject(errors)) {
        return next()
    }
    res.status(401).json(errors)
}
