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


// ********************** User Address related functions start ***********************
exports.isUniqueAddressTag = (req, res, next) => {
    user = req.profile
    addresses = user.addresses
    var newTag = req.body.tag
    for (i = 0, j = addresses.length; i < j; i++) {
        if (newTag === addresses[i].tag) {
            return res.status(401).json({msg: 'Unique address tag is required'})
        }
    }
    next()
}

exports.addressAdd = (req, res) => {
    var {address, contactNum, tag} = req.body
    if (!address || !contactNum || !tag) {
        return res.status.json({msg: 'All fields are mandatory - address, contactNum, tag'})
    }

    user = req.profile
    user.addresses.push({address, contactNum, tag})
    user.save().then((doc) => {
        res.status(200).json(doc)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.addressUpdate = (req, res) => {
    var {id, address, contactNum, tag} = req.body
    if (!id || !address || !contactNum || !tag) {
        return res.status(401).json({msg: 'All fields are mandatory - id, address, contactNum, tag'})
    }

    user = req.profile
    address = user.addresses.id(id)
    if (!address) {
        return res.status(401).json({msg: 'Address with id not found'})
    }

    address.set(req.body)

    user.save().then((address) => {
        return res.status(200).json(address)
    })
    .catch((err) => {
        return res.status(401).json(err)
    })
}

exports.listAddresses = (req, res) => {
    res.status(200).json(req.profile.addresses)
}

exports.removeAddresses = (req, res) => {
    user = req.profile
    ids = req.body.ids

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(401).json({msg: 'Address ids are mandatory'})
    }

    for (i = 0, j = ids.length; i < j; i++) {
        docs = user.addresses.id(ids[i]).remove()
    }

    user.save().then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

// ********************** User Address related functions end ***********************
