const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const createError = require('http-errors');

const orgSchema = new mongoose.Schema({
    orgID: {
        type: String,
        required: true,
        unique: true,
        lowercase: true  
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true,
    },
    activeUsers: {
        type: Number,
        default: 0,
    },
    maxUsers: {
        type: Number,
        required: true,
    }
})

orgSchema.pre('save', async function(next) {
    if (this.isNew){
        console.log("New Org Password :", this.password)
        const salt = await bcrypt.genSalt(5)
        this.password = await bcrypt.hash(this.password, salt)
    }
})

orgSchema.methods.isValidPassword = async function(password) {
    const res = await bcrypt.compare(password, this.password);
    return res
}

const orgModel = mongoose.model('Organization', orgSchema);

module.exports = orgModel;