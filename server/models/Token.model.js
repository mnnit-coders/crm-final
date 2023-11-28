const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    token: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Token', tokenSchema);
