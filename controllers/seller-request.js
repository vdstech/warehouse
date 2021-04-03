const User = require('../models/user')
const SellerRequest = require('../models/seller-request')
const formidable = require('formidable')
const fs = require('fs')
ObjectID = require('mongodb').ObjectID

exports.create = (req, res) => {
    var form = formidable({require: true})
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(401).send({msg: ''})
        }

        var {gst, panNumber, aadhar} = fields
        if (!gst || !panNumber || !aadhar) {
            return res.status(401).send({msg: 'All fields are mandatory - GST, PAN Number, Aadhar, User details'})
        }

        if (!files.gstProof || !files.panProof || !files.aadharProof) {
            return res.status(401).send({msg: 'All proofs are mandatory - GST, PAN Number, Aadhar'})
        }

        regDocs = [files.gstProof, files.panProof, files.aadharProof]
        if (isDocumentGreaterThan2Mb(regDocs)) {
            return res.status(401).json({msg: 'Documents size should be less than 2MB'})
        }

        var paths = uploadFiles(regDocs)
        if (paths.length != 3) {
            return res.status(401).json({msg: 'Something went wrong while uploading the documents.'})
        }

        sellerRequest = new SellerRequest({gst, panNumber, aadhar, user: req.profile._id})
        sellerRequest.gstProof = paths[0]
        sellerRequest.panProof = paths[1]
        sellerRequest.aadharProof = paths[2]

        sellerRequest.save().then((newSellerReq) => {
            res.status(200).json(newSellerReq)
        })
        .catch((err) => {
            console.log(__filename, 'Error occured while creating the user seller request')
            res.status(200).json(err)
        })
    })
}

function isDocumentGreaterThan2Mb(files) {
    if (Array.isArray(files.photo)) {
        var len = files.photo.length
        for (i = 0; i < len; i++) {
            var file = files.photo[i]
            if (file.size > 20_00_000) {
                return true
            }
        }
        return false
    }
}

function uploadFiles(files) {
    var paths = []

    var len = files.length
    var promises = []
    for (i = 0; i < len; i++) {
        var file = files[i]
        if (!file) continue

        var path = saveFile(file)
        paths.push(path)
    }
    return paths
}

function saveFile(file) {
    var oldpath = file.path
    var newpath = process.env.PWD + '/' + 'file-uploads/sellers/' + oldpath.split('/')[6] + '.pdf'
    fs.renameSync(oldpath, newpath)
    return newpath
}

exports.listOpenRequests = (req, res) => {
    SellerRequest.find({$or: [{status: 'Requested'}, {status: 'Processing'}]})
    .then((docs) => {
        res.status(200).json(docs)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.listCompletedRequests = (req, res) => {
    SellerRequest.find({ $or:[ {status : 'Rejected'}, {status :'Completed'} ]})
    .then((docs) => {
        res.status(200).json(docs)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.acceptReq = async (req, res) => {
    console.log(__filename, 'acceptReq. Processing request = ' + req.body.requestID)
    const session = await SellerRequest.startSession()
    console.log('Session created *************')
    try {
        await session.startTransaction()
        console.log('transaction started *************')
        sellerReq = await SellerRequest.findOne({_id: ObjectID(req.body.requestID)}).session(session)
        console.log('Seller FindOne *************')
        if (!sellerReq) {
            session.endSession()
            return res.status(401).json({msg: 'Not a valid request id'})
        }
        sellerReq.status = 'Completed'
        savedReq = await sellerReq.save()

        reqUser = await User.findOne({_id: savedReq.user}).session(session)
        reqUser.role = 1
        await reqUser.save()

        await session.commitTransaction()
        session.endSession()
        res.status(200).send()
    }
    catch(err) {
        console.log(err)
        session.endSession()
        res.status(401).send()
    }
}

exports.rejReq = async (req, res) => {
    console.log(__filename, 'rejReq. Processing request = ' + req.body.requestID)

    const filter = {_id: ObjectID(req.body.requestID)}
    const update = {status: 'Rejected'}
    SellerRequest.findOneAndUpdate(filter, update, {new: true})
    .then((updatedDoc) => {
        res.status(200).send()
    })
    .catch((err) => {
        res.status(401).send()
    })
}

exports.search = async (req, res) => {
    console.log(__filename, 'The search id = ', req.body.requestID)
    SellerRequest.findById(req.body.requestID).then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => {
        res.status(401).send()
    })
}
