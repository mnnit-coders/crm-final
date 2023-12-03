const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const createError = require('http-errors');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'dialer'
    },
    orgID:{
        type: String,
        required: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    expireAt: { 
        type: Date, 
        default: Date.now, 
        index: { expires: 900 } 
    }
})

userSchema.pre('save', async function(next) {
    try{
        if (!['admin','dialer','owner'].includes(this.role)){
            throw new createError.BadRequest('Invalid Role')
        }
        // if (this.role!='owner' && !this.orgID) throw new createError.BadRequest('Organization ID required')
        if (this.isNew){
            const salt = await bcrypt.genSalt(5)
            this.password = await bcrypt.hash(this.password, salt)
        }
        next()
    }
    catch(error){
        next(error)
    }
})

userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;