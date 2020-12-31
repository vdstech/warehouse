const mongoose = require('mongoose')

var colorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: color
    },
    code: {
        type: String,
        required: color
    }
}, {timestamps: true})

module.exports = mongoose.model("Color", colorSchema)
