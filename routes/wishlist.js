const express = require('express')
var router = express.Router()

const {findUserById} = require('../controllers/user')
const {extractTokenInfo, isAuth} = require('../controllers/auth')
const {add, remove} = require('../controllers/wishlist')

router.post('/wishlist/add/:userId', extractTokenInfo, isAuth, add)
router.post('/wishlist/remove/:userId', extractTokenInfo, isAuth, remove)
router.param('userId', findUserById)

module.exports = router
