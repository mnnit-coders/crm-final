const mongoose=require('mongoose')
const sessionSchema=new mongoose.Schema({
    sessionId:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    loginAt:{
        type:Date,
        default:Date.now
    },
    org:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Org'
    },
    logoutAt:{
        type:Date
    },
    duration:{
        type:Number
    }
})

module.exports=mongoose.model('Session',sessionSchema);