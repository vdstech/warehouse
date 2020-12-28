const mongoose = require('mongoose')

var category = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 25,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    styles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Style",
    }],
    works: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Work"
    }],
    fabrics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fabric"
    }],
    occasions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Occasion"
    }]
}, {timestamps: true})

module.exports = mongoose.model('Category', category)
