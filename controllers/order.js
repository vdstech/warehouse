const Product = require('../models/product')
const Order = require('../models/order')

exports.create = async (req, res) => {
    var {cart, address} = req.body
    console.log('The cart = ', cart)
    console.log('The address = ', address)
    if (!cart || !Array.isArray(cart) || !address) {
        return res.status(401).json({msg: 'All fields are necessary - Cart and Address'})
    }

    var allProductsValid = await productsAllValid(cart)
    if (!allProductsValid) {
        return res.status(401).json({msg: 'Products not valid'})
    }

    //generate razor pay id and associate with each order create here.

    //create razor pay orderid
    user = req.profile
    orders = []
    for (i = 0, j = cart.length; i < j; i++) {
        cart = cart[i]
        var {product, quantity} = cart
        orders.push(new Order({product, quantity, 'user': user._id, address, 'razorpay_order_id': 123}))
        user.cart.push(cart)
    }

    Orders.insertMany(orders).then((insertedOrders) => {

    })
    .catch((err) => {

    })


    // buy immediate -> create order id and ask for payment.
    // what happens if the payment fails? If payment fails, then we need to add in the cart / update the cart.
    // if payment fails, then it should be added to the cart.
    // how to proceed with cart items? all cart items are added as one order and proceed for patment.
    // if the payment succeeded. order is created
    //

    /*user = req.profile
    orders = []
    for (i = 0, j = cart.length; i < j; i++) {
        cart = cart[0]
        console.log('----------------- ', cart)
        orders.push(new Order({cart, address}))
        user.cart.push(cart)
    }*/

    //res.status(200).json(user)
}

async function productsAllValid(products) {
    pids = []
    for (i = 0, j = products.length; i < j; i++) {
        pids.push(products[i].product)
    }
    console.log('(productsAllValid) The product ids to verify = ', pids)

    docs = await Product.find({'_id': { $in: pids}})
    return docs.length === products.length
}
