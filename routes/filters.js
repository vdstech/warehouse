const express = require('express')
const {extractTokenInfo, isAuth, isSeller} = require('../controllers/auth')
const {findUserById} = require('../controllers/user')
const {insertStyles, insertWorks, insertFabrics, insertOccasions} = require('../controllers/filters.js')

var router = express.Router()

router.post('/filters/style/create/:userId', extractTokenInfo, isAuth, isSeller, insertStyles)
router.post('/filters/work/create/:userId', extractTokenInfo, isAuth, isSeller, insertWorks)
router.post('/filters/fabric/create/:userId', extractTokenInfo, isAuth, isSeller, insertFabrics)
router.post('/filters/occasion/create/:userId', extractTokenInfo, isAuth, isSeller, insertOccasions)

router.param('userId', findUserById)
module.exports = router
