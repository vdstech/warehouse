const express = require('express')
const {extractTokenInfo, isAuth, isAdmin} = require('../controllers/auth')
const {findUserById} = require('../controllers/user')
const {insertStyles, insertWorks, insertFabrics, insertOccasions} = require('../controllers/filters.js')

var router = express.Router()

router.post('/filters/style/create/:userId', extractTokenInfo, isAuth, isAdmin, insertStyles)
router.post('/filters/work/create/:userId', extractTokenInfo, isAuth, isAdmin, insertWorks)
router.post('/filters/fabric/create/:userId', extractTokenInfo, isAuth, isAdmin, insertFabrics)
router.post('/filters/occasion/create/:userId', extractTokenInfo, isAuth, isAdmin, insertOccasions)

router.param('userId', findUserById)
module.exports = router
