const mongoose = require('mongoose')

const sellerReqSchema = new mongoose.Schema({
    gst: {
        type: String
    },
    panNumber: {
        type: String,
        required: true
    },
    aadhar: {
        type: String,
        required: true
    },
    gstProof: {
        type: String
    },
    panProof: {
        type: String,
        required: true
    },
    aadharProof: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    status: {
        type: String,
        enum: ['Requested', 'Processing', 'Rejected', 'Completed'],
        default: 'Requested'
    }
})

module.exports = mongoose.model('SellerRequest', sellerReqSchema)
