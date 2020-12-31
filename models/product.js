var mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: 5000,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    colors: {
        type: Array
    },
    style: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Style',
        required: true
    }],
    work: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Work',
        required: true
    }],
    fabric: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fabric',
        required: true
    }],
    occasion: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Occasion',
        required: true
    }],
    quantity: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    photos: {
        type: Array,
        default: []
    },
    code: {
        type: String,
        required: false
    },
    care: {
        type: String,
        minlength: 5
    }
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema)
