const mongoose = require('mongoose')
const Cart = require('../models/cart')

var orderSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Initiated', 'Payment Success', '', "Payment Failure", "Processing", "Packed", "Shipped", "In Transit", "Delivered"],
        default: 'Initiated',
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    address: {
        type: String,
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: false
    },
    razorpay_payment_id: {
        type: String,
        required: false
    },
    razorpay_signature: {
        type: String,
        required: false
    }
}, {timestamps: true})

orderSchema.virtual('password')
.set(function(password) {
    this.seller = password
})
.get(function() {
    return this.seller
})

module.exports = mongoose.model('Order', orderSchema)
