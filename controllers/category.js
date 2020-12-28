const Category = require('../models/category')
const Style = require('../models/style')
const Fabric = require('../models/fabric')
const Work = require('../models/work')
const Occasion = require('../models/occasion')

exports.findCategoryById = (req, res, next, id) => {

    Category.findById(id).then((result) => {
        req.category = result
        next()
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.create = (req, res) => {
    var {name, description, styles, works, fabrics, occasions} = req.body

    if (!name) {
        return res.status(401).json({msg: 'All fields are mandatory - name, fabrics, occasions, styles, works'})
    }

    cat = new Category({name, description, styles, works, fabrics, occasions})
    cat.save().then((doc) => {
        req.newcat = doc
        console.log('updating fabrics = ', fabrics)
        return Fabric.updateMany(
            {_id: {$in: fabrics}},
            {$push: {categories: req.newcat._id}},
            {new: true}
        )
    })
    .then(() => {
        console.log('updating occasions')
        return Occasion.updateMany(
            {_id: {$in: occasions}},
            {$addToSet: {categories: req.newcat._id}},
            {new: true}
        )
    })
    .then(() => {
        console.log('updating styles')
        return Style.updateMany(
            {_id: {$in: styles}},
            {$addToSet: {categories: req.newcat._id}},
            {new: true}
        )
    })
    .then(() => {
        console.log('updating works')
        return Work.updateMany(
            {_id: {$in: works}},
            {$addToSet: {categories: req.newcat._id}},
            {new: true}
        )
    })
    .then(() => {
        res.status(200).json(req.newcat)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.list = (req, res) => {
    console.log('Listing all the products')
    Category.find({}).populate(['styles', 'occasions', 'fabrics', 'works'])
    .then((cats) => {
        res.status(200).json(cats)
    })
    .catch((err) => {
        res.status(200).json(err)
    })
}

exports.addStyles = (req, res) => {

    category = req.category
    Category.findByIdAndUpdate(
        category._id, //condition
        {$addToSet:{styles:req.body.styles}},
        {new: true}
    )
    .then((docs) => {
        return Style.updateMany(
            {_id: {$in:req.body.styles}}, //condition
            {$addToSet: { categories: category._id}}
        )
    }).then(() => {
        res.status(200).json({msg: 'Fabrics added successfully to the category'})
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.addWorks = (req, res) => {
    category = req.category
    Category.findByIdAndUpdate(
        category._id, //condition
        {$addToSet:{works:req.body.works}},
        {new: true}
    )
    .then((docs) => {
        return Work.updateMany(
            {_id: {$in:req.body.works}}, //condition
            {$addToSet: { categories: category._id}}
        )
    }).then(() => {
        res.status(200).json({msg: 'Works added successfully to the category'})
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.addFabrics = (req, res) => {
    category = req.category
    Category.findByIdAndUpdate(
        category._id, //condition
        {$addToSet:{fabrics:req.body.fabrics}},
        {new: true}
    )
    .then((docs) => {
        return Fabric.updateMany(
            {_id: {$in:req.body.fabrics}}, //condition
            {$addToSet: { categories: category._id}}
        )
    }).then(() => {
        res.status(200).json({msg: 'Fabrics added successfully to the category'})
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.addOccasions = (req, res) => {

    category = req.category
    Category.findByIdAndUpdate(
        category._id, //condition
        {$addToSet:{occasions:req.body.occasions}},
        {new: true}
    )
    .then((docs) => {
        return Occasion.updateMany(
            {_id: {$in:req.body.occasions}}, //condition
            {$addToSet: { categories: category._id}}
        )
    }).then(() => {
        res.status(200).json({msg: 'Occasions added successfully to the category'})
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}
