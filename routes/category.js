const express = require('express')
const router = express.Router()

const {extractTokenInfo, isAuth, isSeller} = require('../controllers/auth')
const {findCategoryById, create, list, addStyles, addWorks, addOccasions, addFabrics} = require('../controllers/category')
const {findUserById} = require('../controllers/user')

router.post('/category/create/:userId', extractTokenInfo, isAuth, isSeller, create)
router.post('/category/update-styles/:userId/:categoryId', extractTokenInfo, isAuth, isSeller, addStyles)
router.post('/category/update-works/:userId/:categoryId', extractTokenInfo, isAuth, isSeller, addWorks)
router.post('/category/update-occasions/:userId/:categoryId', extractTokenInfo, isAuth, isSeller, addOccasions)
router.post('/category/update-fabrics/:userId/:categoryId', extractTokenInfo, isAuth, isSeller, addFabrics)
router.get('/category/list/:userId', extractTokenInfo, isAuth, list)

router.param('userId', findUserById)
router.param('categoryId', findCategoryById)

module.exports = router
