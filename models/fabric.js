const mongoose = require('mongoose')

var fabricSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    }]
}, {timestamps: true})

module.exports = mongoose.model('Fabric', fabricSchema)
