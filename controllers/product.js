const Product = require('../models/product')
const Style = require('../models/style')
const Fabric = require('../models/fabric')
const Occasion = require('../models/occasion')
const Work = require('../models/work')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')

exports.create = (req, res) => {

    var form = formidable({ multiples: true })
    form.parse(req, async (err, fields, files) => {

        if (err || !files || !fields)  {
            return res.status(401).json({
                msg: 'Error in parsing the form'
            })
        }

        var {category, name, description, price, quantity, styles, works, fabrics, occasions, colors, care} = fields
        if (!category || !name || !description || !price || !quantity || !styles || !works || !fabrics || !occasions || !colors) {
            return res.status(401).json({msg: 'All fields are mandatory'})
        }

        stylesList = parseFilters(styles)
        worksList = parseFilters(works)
        fabricsList = parseFilters(fabrics)
        occasionsList = parseFilters(occasions)
        colorsList = parseFilters(colors)

        const promises = [verifyFilters('Style', stylesList), verifyFilters('Work', worksList), verifyFilters('Fabric', fabricsList),
                                                        verifyFilters('Occasion', occasionsList)]
        const validators = await Promise.all(promises)
        filtersValidation = validators.every(choice => (choice == true))

        if (!filtersValidation) {
            return res.status(401).json({msg: 'Filters does not matcfh with category'})
        }

        if (isPhotosGreaterThan2Mb(files)) {
            return res.status(401).json({msg: 'Files size should be less than 2MB'})
        }

        var paths = await uploadFiles(files.photo)
        saveProduct(req, res, fields, paths, stylesList, worksList, fabricsList, occasionsList, colorsList)
    })
}

function saveProduct(req, res, fields, paths, stylesList, worksList, fabricsList, occasionsList, colorsList) {

    var {category, name, description, price, quantity, code, care} = fields
    var product = new Product({category, name, description, price, quantity, code, care})

    product.seller = req.profile._id
    product.photos = paths
    product.style = stylesList
    product.work = worksList
    product.fabric = fabricsList
    product.occasion = occasionsList
    product.colors = colorsList

    product.save().then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

function isPhotosGreaterThan2Mb(files) {
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
    else {
        console.log('(isPhotosLessThan2Mb) The file size is ', (files.photo.size > 2000000))
        return (files.photo.size > 2000000)
    }
}

exports.listBySeller = (req, res) => {
    console.log('productsOfSeller')

    Product.find({seller: req.profile._id}).then((products) => {
        res.status(200).json(products)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

/**
 *  TODO:
 *  The methods listAll(), listByCategory(), listByCategoryAndStyle(), listByCategoryAndWork(),
 *  listByCategoryAndColor(), listByCategoryAndFabric(), listByCategoryAndOccasion() should all take
 *  sortBy field for price: high to low and low to high and latest: new to old and old to new.
 *  Also should have limit functionality too.
 *  To brain strom: What happens if no params are sent?
*/
exports.listAll = (req, res) => {
    console.log('getAllProducts')

    Product.find({}).populate(['style', 'work', 'fabric', 'occasion']).then((docs) => {
        res.status(200).json(docs)
    })
    .catch((err) => {
        res.status(401).json({
            msg: err
        })
    })
}

exports.listByCategory = (req, res) => {
    console.log('getProductsByCategory')
    Product.find({category: req.body.category}).populate(['style', 'work', 'fabric', 'occasion']).then((docs) => {
        res.status(200).json(docs)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.listByCategoryAndStyle = (req, res) => {
    console.log('listByCategoryAndStyle')
    Product.find({category: req.body.category, style:{ $all : req.body.styles }})
    .populate(['style', 'work', 'fabric', 'occasion']).then((docs) => {
        res.status(200).json(docs)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.listByCategoryAndWork = (req, res) => {
    console.log('listByCategoryAndWork')
    Product.find({category: req.body.category, work:{ $all : req.body.works }})
    .populate(['style', 'work', 'fabric', 'occasion']).then((docs) => {
        res.status(200).json(docs)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.listByCategoryAndFabric = (req, res) => {
    console.log('listByCategoryAndFabric')
    Product.find({category: req.body.category, fabric:{ $all : req.body.fabrics }})
    .populate(['style', 'work', 'fabric', 'occasion']).then((docs) => {
        res.status(200).json(docs)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.listByCategoryAndOccasion = (req, res) => {
    console.log('listByCategoryAndOccasion')
    Product.find({category: req.body.category, occasion:{ $all : req.body.occasions }})
    .populate(['style', 'work', 'fabric', 'occasion']).then((docs) => {
        res.status(200).json(docs)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.listByCategoryAndColor = (req, res) => {
    console.log('listByCategoryAndColor')
    Product.find({category: req.body.category, colors:{ $all : req.body.colors }})
    .populate(['style', 'work', 'fabric', 'occasion']).then((docs) => {
        res.status(200).json(docs)
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

async function verifyFilters(filter, ids) {

    docs = []
    try {
        switch (filter) {
            case "Style":
                docs = await Style.find().where('_id').in(ids)
                break

            case "Work":
                docs = await Work.find().where('_id').in(ids)
                break

            case "Occasion":
                docs = await Occasion.find().where('_id').in(ids)
                break

            case "Fabric":
                docs = await Fabric.find().where('_id').in(ids)
                break

        }
    } catch(err) {
        console.log('(verifyFilters) Error occured while verifying the filter = ', filter)
    }

    return docs.length === ids.length
}

function parseFilters(filters) {

    let filterArr = filters.split(',')
    ids = []
    for (i = 0, j = filterArr.length; i < j; i++) {
        ids.push(filterArr[i].trim())
    }
    return ids
}

async function uploadFiles(files) {
    var paths = []
    if (Array.isArray(files)) {
        console.log('The files is array ======= ', Array.isArray(files))
        var len = files.length
        var promises = []
        for (i = 0; i < len; i++) {
            var file = files[i]
            var path = saveFile(file)
            paths.push(path)
        }
    }
    else {
        var path = saveFile(files)
        paths.push(path)
    }
    return paths
}

function saveFile(file) {

    var oldpath = file.path
    var newpath = process.env.PWD + '/' + 'uploads/' + oldpath.split('/')[6] + '.jpeg'
    fs.renameSync(oldpath, newpath)
    return newpath
}
