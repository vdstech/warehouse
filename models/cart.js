const mongoose = require('mongoose')

var cartSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})

cartSchema.index({ product: 1, user: 1}, { unique: true })
module.exports = mongoose.model('Cart', cartSchema)
