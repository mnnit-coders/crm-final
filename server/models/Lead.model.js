const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    leadID:{
        type: String,
        unique: true,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    campID:{
        type: String,
        required: true  
    },
    orgID:{
        type: String,
        required: true
    },
    contact:{
        type: Number,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tryTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Pending", "Follow-up", "Not-Connected", "Converted", "Lost"],
        default: "Pending"
    },
    history: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Response"
    },
    notconnectedcount:{
        type: Number,
        default: 0
    },
    assignedTo: {
        type: String,
        required: true
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    reason:{
        type:String
    },
    followupdate:{
        type:Date
    },
    city:{
        type:String
    },
    address:{
        type:String
    },
    amount:{
        type:Number
    },
    product:{
        type:String
    },
    detail1:{
        type:String
    },
    detail2:{
        type:String
    },
    detail3:{
        type:String
    },
    detail4:{
        type:String
    }
});

const leadModel = mongoose.model('Lead', leadSchema);

module.exports = leadModel