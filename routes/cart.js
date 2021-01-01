const express = require('express')
var router = express.Router()

const {add, remove, update, list} = require('../controllers/cart')
const {findUserById} = require('../controllers/user')

router.post('/cart/add/:userId', add)
router.post('/cart/update/:userId', update)
router.post('/cart/remove/:userId/:product', remove)
router.get('/cart/list/:userId', list)
router.param('userId', findUserById)

module.exports = router
