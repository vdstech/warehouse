const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const authRoute = require('./routes/auth')
const catRoute = require('./routes/category')
const prodRoute = require('./routes/product')
const filtersRoute = require('./routes/filters')
const userRoute = require('./routes/user')
const orderRoute = require('./routes/order')
const wishlistRoute = require('./routes/wishlist')
const cartRoute = require('./routes/cart')
const sellerReqRouter = require('./routes/seller-request')

// configuring the environ props file.
dotenv.config()


//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`The database is running at port ${process.env.DATABASE}`)
})

var app = express()


app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/', authRoute)
app.use('/', catRoute)
app.use('/', prodRoute)
app.use('/', filtersRoute)
app.use('/', userRoute)
app.use('/', orderRoute)
app.use('/', wishlistRoute)
app.use('/', cartRoute)
app.use('/', sellerReqRouter)

var port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`The HTTP server started successfully at port ${port}`)
})
