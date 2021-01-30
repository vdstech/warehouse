const mongoose = require('mongoose')
const crypto = require('crypto')
const {v1: uuidv1} = require('uuid')

var addressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    contactNum: {
        type: Number,
        required: true
    },
    tag: {
        type: String,
        required: true
    }
})

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: 30,
        minlength: 3
    },
    email: {
        type: String,
        required: false,
        trim: true,
        unique: true,
        lowercase: true,
        sparse: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        maxlength: 255
    },
    role: {
        type: Number,
        default: 0
    },
    salt: {
        type: String
    },
    login_token: {
        type: Array,
        default:[]
    },
    addresses: [{
        type: addressSchema,
        required: false
    }],
    emailVerifyStatus: {
        type: Boolean,
        required: false,
        default: false
    },
    mobileVerifyStatus: {
        type: Boolean,
        required: false,
        default: false
    }
}, {timestamps : true})

userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuidv1()
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

userSchema.virtual('wlists', {
        ref: 'Wishlists',
        localField: '_id',
        foreignField: 'user',
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }}
)

userSchema.virtual('cart', {
        ref: 'Cart',
        localField: '_id',
        foreignField: 'user'
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }}
)

userSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'user'
})

// Create a virtual property `domain` that's computed from `email`.
userSchema.virtual('roleName').get(function() {
    if (this.role === 0) {
        return 'User'
    }
    else if (this.role == 1) {
        return 'Seller'
    }
    else if (this.role == 3) {
        return 'Admin'
    }
});

userSchema.methods = {
    encryptPassword: function(password) {
        try {
            console.log(`The salt is ${this.salt}`)
            const hash = crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
            console.log('The hash generarted = ', hash)
            return hash
        } catch(e) {
            console.log('Error occured', e)
            return ''
        }
    },

    validatePassword: function (plainPassword) {
        console.log('The plain password ', plainPassword)
        console.log('The hashed password ', this.hashed_password)
        return this.encryptPassword(plainPassword) === this.hashed_password
    }
}

module.exports = mongoose.model('User', userSchema)
