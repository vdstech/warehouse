const express = require('express')
var router = express.Router()

const {findUserById} = require('../controllers/user')
const {extractTokenInfo, isAuth} = require('../controllers/auth')
const {add, remove, removeById, listTags, listByTag} = require('../controllers/wishlist')

router.post('/wishlist/add/:userId', extractTokenInfo, isAuth, add)
router.post('/wishlist/remove/:userId', extractTokenInfo, isAuth, remove)
router.post('/wishlist/removeByWishlistId/:userId/:p1', extractTokenInfo, isAuth, removeById)


router.get('/wishlist/tags/:userId', extractTokenInfo, isAuth, listTags)
router.get('/wishlist/listByTag/:userId/:p1', extractTokenInfo, isAuth, listByTag)


router.param('userId', findUserById)

module.exports = router
