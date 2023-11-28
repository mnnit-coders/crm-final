const mongoose=require('mongoose')

const SettingSchema=new mongoose.Schema({
    campaignID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Campaign'
    },
    settings: {
        type: Object,
        default: {
            "NotConnected": {
                "not-pick":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'minute'],
                    "maxTries": 3
                }, 
                "busy":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'minute'],
                    "maxTries": 3
                }, 
                "user-disconnected":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'minute'],
                    "maxTries": 3
                }, 
                "switch-off":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'minute'],
                    "maxTries": 3
                }, 
                "out-of-coverage-area":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'minute'],
                    "maxTries": 3                    
                }, 
                "incorrect-number":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'minute'],
                    "maxTries": 3
                }, 
                "incoming-not-available":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'minute'],
                    "maxTries": 3
                }, 
                "out-of-service":{
                    "retryEnabled": true,
                    "retryAfter": [ 5, 'minute'],
                    "maxTries": 3
                }
            }
        }
    }
})

module.exports=mongoose.model('Settings',SettingSchema)