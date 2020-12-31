const mongoose = require('mongoose')

var wishlistSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    tag: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
wishlistSchema.index({ product: 1, user: 1, tag: 1 }, { unique: true })

module.exports = mongoose.model('Wishlists', wishlistSchema)
