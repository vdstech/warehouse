const { body, check, validationResult } = require('express-validator')
const _ = require('lodash')

exports.sellerRules = [
    //name
    check('requestID').notEmpty().withMessage('Seller RequestID is required.')
]

exports.sellerReqRules = (req, res, next) => {
    var errors = validationResult(req).mapped()
    if (_.isEmpty(errors) && _.isPlainObject(errors)) {
        return next()
    }
    res.status(401).json(errors)
}
