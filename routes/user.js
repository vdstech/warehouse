const express = require('express')
const router = express.Router()
const {findUserById, fetchUserHistory, isUniqueAddressTag, addressAdd, addressUpdate, listAddresses,
    removeAddresses} = require('../controllers/user')
const {extractTokenInfo, isAuth} = require('../controllers/auth')


router.get('/user/history/:userId', extractTokenInfo, isAuth, fetchUserHistory)

// user address related routes.
router.post('/address/add/:userId', extractTokenInfo, isAuth, isUniqueAddressTag, addressAdd)
router.post('/address/update/:userId', extractTokenInfo, isAuth, addressUpdate)
router.get('/address/list/:userId', extractTokenInfo, isAuth, listAddresses)
router.post('/address/remove/:userId', extractTokenInfo, isAuth, removeAddresses)

router.param('userId', findUserById)

module.exports = router
