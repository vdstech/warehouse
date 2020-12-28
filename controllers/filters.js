const Style = require('../models/style')
const Work = require('../models/work')
const Fabric = require('../models/fabric')
const Occasion = require('../models/occasion')
const Category = require('../models/category')

exports.insertStyles = (req, res) => {
    console.log('(insertStyles) The body is = ', req.body)

    Style.insertMany(req.body).then(() => {
        res.status(200).json({msg: "Filter: Styles inserted successfully"})
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.insertWorks = (req, res) => {
    console.log('(insertWorks) The body is = ', req.body)

    Work.insertMany(req.body).then(() => {
        res.status(200).json({msg: "Filter: Works inserted successfully"})
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.insertFabrics = (req, res) => {
    console.log('(insertFabrics) The body is = ', req.body)

    Fabric.insertMany(req.body).then(() => {
        res.status(200).json({msg: "Filter: Fabrics inserted successfully"})
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}

exports.insertOccasions = (req, res) => {
    console.log('(insertOccasions) The body is = ', req.body)

    Occasion.insertMany(req.body).then(() => {
        res.status(200).json({msg: "Filter: Occasions inserted successfully"})
    })
    .catch((err) => {
        res.status(401).json(err)
    })
}
