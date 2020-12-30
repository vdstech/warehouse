const User = require('../models/user')
const Cart = require('../models/cart')

exports.findUserById = async (req, res, next, id) => {
    console.log(__filename, '(findUserById)')

    try {
        var user = await User.findById(id).populate('wlists')
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


// ********************** User cart related functions start *************************
exports.addToCart = (req, res) => {
    console.log(__filename, '(addToCart)')
    user = req.profile

    products = req.body
    console.log(__filename, "(addToCart) products = ", products)

    for (i = 0, j = products.length; i < j; i++) {
        cart = new Cart(products[i])
        cartProduct = getProductFromUserCart(user, cart)
        if (!cartProduct) {
            user.cart.push(cart)
        }
        else {
            cartProduct.quantity = cart.quantity + cartProduct.quantity
        }
    }

    user.save().then((updatedUser) => {
        res.status(200).json(updatedUser)
    })
    .catch((err) => {
        res.status(200).json(err)
    })
}

exports.updateQuantity = (req, res) => {
    console.log(__filename, '(updateQuantity)')
    user = req.profile

    cart = new Cart(req.body)

    // if the product is already in the user cart, increase the count by 1.
    cartProduct = getProductFromUserCart(user, cart)
    if (!cartProduct) {
        return res.status(401).json({msg: 'No Product found in the user category'})
    }

    cartProduct.quantity = cart.quantity

    // save the quantity.
    user.save().then((updatedUser) => {
        res.status(200).json(updatedUser)
    })
    .catch((err) => {
        res.status(200).json(err)
    })
}

exports.removeFromCart = (req, res) => {
    console.log(__filename, '(removeFromCart)')
    user = req.profile

    products = req.body
    console.log(__filename, "(removeFromCart) products = ", products)

    for (i = 0, j = products.length; i < j; i++) {
        cart = new Cart(products[i])
        cartProduct = getProductFromUserCart(user, cart)
        if (!cartProduct) {
            return res.status(401).json({msg: 'Product not found in the cart'})
        }

        user.cart.id(cartProduct._id).remove()
    }

    user.save().then((updatedUser) => {
        res.status(200).json(updatedUser)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

/**
 * parameters:
 * user - The logged in user.
 * product - The product in the form of cartProduct to search
 * {product: '', quantity: 4}
 */
function getProductFromUserCart(user, prodObj) {
    console.log(__filename, '(getProductFromUserCart)')
    var found = user.cart.filter(obj => {
        productEqual = obj.product.equals(prodObj.product)
        return productEqual
    })

    if (found.length > 0) {
        prod = found[0]
        console.log(__filename, '(getProductFromUserCart) found the product in the user cart = ', prod)

        return prod
    }
}

// ********************** User cart related functions end *************************
