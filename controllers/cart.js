const Cart = require('../models/cart')
const UserObj = require('../models/user')
ObjectID = require('mongodb').ObjectID

exports.add = (req, res) => {
    console.log(__filename, '(add)')

    const filter = { user: ObjectID(req.profile._id), product: ObjectID(req.body.product)}
    const update = {$inc: {quantity: req.body.quantity}}

    Cart.findOneAndUpdate(filter, update, {upsert:true, new: true}).then((doc) => {
        res.status(200).json(doc)
    })
    .catch((err) => {
        console.log(__filename, '(add) Error occured while inserting / updating the user cart with the product', err)
        res.status(401).json(err)
    })
}

exports.remove = (req, res) => {
    console.log(__filename, '(remove)')

    const filter = { user: ObjectID(req.profile._id), product: ObjectID(req.params.product)}
    Cart.deleteOne(filter).then((removedDoc) => {
        res.status(200).json(removedDoc)
    })
    .catch((err) => {
        console.log(__filename, '(remove) Error occured while removing the user cart with the product', err)
        res.status(401).json(err)
    })
}

exports.update = (req, res) => {
    console.log(__filename, '(update)')

    const filter = { user: ObjectID(req.profile._id), product: ObjectID(req.body.product)}
    const update = {quantity: req.body.quantity}
    Cart.update(filter, update).then((updatedDoc) => {
        res.status(200).json(updatedDoc)
    })
    .catch((err) => {
        console.log(__filename, '(update) Error occured while updating the user cart with the product', err)
        res.status(401).json(err)
    })
}

exports.list = (req, res) => {
    console.log(__filename, '(list)')

    Cart.find({user: ObjectID(req.profile._id)}).then((user) => {
        res.status(200).json(user)
    })
    .catch((err) => {
        console.log(__filename, '(list) Error occured while listing user cart', err)
        res.status(400).json(err)
    })
}
