const Wishlists = require('../models/wishlist')
ObjectID = require('mongodb').ObjectID

const express = require('express')
const router = express.Router()

exports.add = (req, res) => {
    console.log(__filename, '(add)')

    var {product, tag, user} = req.body
    if (!product || !tag || !user) {
        return res.status(401).json({msg: 'All fields are mandatory'})
    }

    wishlist = new Wishlists(req.body)
    wishlist.save().then((wishlist) => {
        res.status(200).json(wishlist)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.remove = (req, res) => {
    console.log(__filename, '(remove) desc: remove product from the tag')

    var {product, tag, user} = req.body
    if (!product || !tag || !user) {
        return res.status(401).json({msg: 'All fields are mandatory'})
    }

    Wishlists.deleteOne(
        {
            user: ObjectID(req.body.user),
            product: ObjectID(req.body.product),
            tag: req.body.tag
        })
        .then((removed) => {
        es.status(200).json(removed)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.removeById = (req, res) => {
    console.log(__filename, '(removeById)')

    Wishlists.deleteOne({_id: req.params.p1, user: ObjectID(req.profile._id)}).then((doc) => {
        res.status(200).json(doc)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.listTags = (req, res) => {
    console.log(__filename, '(listTags)')

    Wishlists.distinct('tag', {user: req.profile._id}).then((docs) => {
        res.status(200).json(docs)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.listByTag = (req, res) => {
    console.log(__filename, '(listByTag)')

    Wishlists.find({user: ObjectID(req.profile._id), tag: req.params.p1})
    .then((docs) => {
        res.status(200).json(docs)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}
