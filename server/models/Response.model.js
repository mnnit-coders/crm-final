const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    leadid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lead'
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required:true,
    },
    startTime:{
        type: Date,
    },
    endTime:{
        type: Date,
    },
    duration:{
        type:Number
    },
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    respondedAt: {
        type: Date,
        default: Date.now
    },
    orgID:{
        type:String,
        required:true
    },
    campID:{
        type:String,
        required:true
    }
});

const responseModel = mongoose.model('Response', responseSchema);

module.exports = responseModel