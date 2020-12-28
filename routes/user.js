const express = require('express')
const router = express.Router()
const {findUserById, isUniqueAddressTag, addressAdd, addressUpdate, listAddresses,
    removeAddresses, addToCart, updateQuantity, removeFromCart} = require('../controllers/user')
const {extractTokenInfo, isAuth} = require('../controllers/auth')

router.post('/address/add/:userId', extractTokenInfo, isAuth, isUniqueAddressTag, addressAdd)
router.post('/address/update/:userId', extractTokenInfo, isAuth, addressUpdate)
router.get('/address/list/:userId', extractTokenInfo, isAuth, listAddresses)
router.post('/address/remove/:userId', extractTokenInfo, isAuth, removeAddresses)
router.post('/cart/add/:userId', extractTokenInfo, isAuth, addToCart)
router.post('/cart/updateQuantity/:userId', extractTokenInfo, isAuth, updateQuantity)
router.post('/cart/remove/:userId', extractTokenInfo, isAuth, removeFromCart)


router.param('userId', findUserById)

module.exports = router
