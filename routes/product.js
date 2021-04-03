const express = require('express')
var router = express.Router()

var {extractTokenInfo, isAuth, isSeller} = require('../controllers/auth')
var {findUserById} = require('../controllers/user')
var {create, listBySeller, listAll, listByCategory, listByCategoryAndStyle, listByCategoryAndFabric,
    listByCategoryAndWork, listByCategoryAndOccasion, listByCategoryAndColor} = require('../controllers/product')

router.post('/product/create/:userId', extractTokenInfo, isAuth, isSeller, create)

// the following endpoint lists all products by seller. Need login info of seller for returning info.
router.get('/products/list/:userId', extractTokenInfo, isAuth, isSeller, listBySeller)
router.get('/products/all', listAll)
router.get('/products/byCategory', listByCategory)
router.get('/products/byCategoryAndStyle', listByCategoryAndStyle)
router.get('/products/byCategoryAndFabric', listByCategoryAndFabric)
router.get('/products/byCategoryAndWork', listByCategoryAndWork)
router.get('/products/byCategoryAndOccasion', listByCategoryAndOccasion)
router.get('/products/byCategoryAndColor', listByCategoryAndColor)



router.param('userId', findUserById)


module.exports = router
