const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    leadID:{
        type: String,
        unique: true,
        required: true
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
        type: ["Pending", "Follow-up", "Not-Connected", "Closed", "Lost"],
        default: "Pending"
    },
    history: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Response",
        default: []
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
    }
});

const leadModel = mongoose.model('Lead', leadSchema);

module.exports = leadModel