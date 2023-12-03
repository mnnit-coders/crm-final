const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required:true,
    },
    callTime:{
        type: Date,
    },
    callFrom:{
        type: Date,
    },
    callTill:{
        type:Date
    },
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    respondedAt: {
        type: Date,
        default: Date.now
    }
});

const responseModel = mongoose.model('Response', responseSchema);

module.exports = responseModel