const express = require('express')
const router = express.Router()

var {extractTokenInfo, isAuth} = require('../controllers/auth')
var {findUserById} = require('../controllers/user')
var {create} = require('../controllers/order')

router.post('/order/create/:userId', extractTokenInfo, isAuth, create)
router.param('userId', findUserById)

module.exports = router
