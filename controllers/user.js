const User = require('../models/user')
const Cart = require('../models/cart')

exports.findUserById = async (req, res, next, id) => {
    console.log(__filename, '(findUserById)')

    try {
        var user = await User.findById(id).populate(['wlists', 'cart'])
        req.profile = user.toObject({ virtuals: true })
        next()
    }
    catch(err) {
        return res.status(401).json(err)
    }
}

exports.fetchUserHistory = (req, res) => {
    console.log(__filename, '(fetchUserHistory)')

    User.findById(req.profile._id).populate(['wlists', 'cart', 'orders'])
    .then((user) => {
        res.status(200).json(user.toObject({virtuals: true}))
    })
    .catch((err) => {
        console.log(__filename, '(fetchUserHistory) Error occured while fetching complete user details. ', err)
        res.status(401).json(err)
    })
}
