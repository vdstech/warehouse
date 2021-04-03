const {extractTokenInfo, isAuth, isAdmin, isEmailVerified, isMobileVerified} = require('../controllers/auth')
const {findUserById} = require('../controllers/user')
const {create, listOpenRequests, listRejectedRequests, listCompletedRequests, acceptReq, rejReq, search} = require('../controllers/seller-request')
const {sellerRules, sellerReqRules} = require('../validators/seller-request')
const express = require('express')
const router = express.Router()

router.post('/seller-req/create/:userId', extractTokenInfo, isAuth, isEmailVerified, isMobileVerified, create)
router.get('/seller-req/openReqs/:userId', extractTokenInfo, isAuth, isAdmin, listOpenRequests)
router.get('/seller-req/comReqs/:userId', extractTokenInfo, isAuth, isAdmin, listCompletedRequests)
router.post('/seller-req/acceptReq/:userId', sellerRules, sellerReqRules, extractTokenInfo, isAuth, isAdmin, acceptReq)
router.post('/seller-req/rejReq/:userId', sellerRules, sellerReqRules, extractTokenInfo, isAuth, isAdmin, rejReq)
router.post('/seller-req/search/:userId', extractTokenInfo, isAuth, isAdmin, search)
router.param('userId', findUserById)

module.exports = router
