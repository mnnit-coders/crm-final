const mongoose = require('mongoose');

const CampaignSchema = mongoose.Schema({
    orgID: {
        type: String,
        required: true
    },
    campID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdOn:{
        type: Date,
        default: Date.now
    },
    members: {
        type: [String],
        default: []
    },
    category:{
        type: String,
        required: true
    },
    priority: {
        type: Number,
        default: 1
    },
    settings: {
        type: Object,
        default: {
            "NotConnected": {
                "not-pick":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'day'],
                    "maxTries": 3
                }, 
                "busy":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'day'],
                    "maxTries": 3
                }, 
                "user-disconnected":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'day'],
                    "maxTries": 3
                }, 
                "switch-off":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'day'],
                    "maxTries": 3
                }, 
                "out-of-coverage-area":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'day'],
                    "maxTries": 3                    
                }, 
                "incorrect-number":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'day'],
                    "maxTries": 3
                }, 
                "incoming-not-available":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'day'],
                    "maxTries": 3
                }, 
                "out-of-service":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'day'],
                    "maxTries": 3
                }
            }
        }
    }
});

module.exports = mongoose.model('Campaign', CampaignSchema);