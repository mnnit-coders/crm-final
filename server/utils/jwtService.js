const jwt = require('jsonwebtoken')
const createError = require('http-errors')


module.exports = {

    generateAccessToken : function(user){
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
    },

    generateRefreshToken : function(user){
        return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    },

    refresh: function(refreshToken){
        return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            console.log("Refreshing ... \n",user)
            delete user.iat
            return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
        })
    },
    generateVerificationToken:async function(user){
            const token=await jwt.sign(user,process.env.VERIFICATION_TOKEN_SECRET,{expiresIn:'15m'})
            const tokenParam = Buffer.from(token).toString('base64');
            return tokenParam
    },
    verifyToken:async function(token){
        try {
            const jwttoken = Buffer.from(token, 'base64').toString('utf-8');
            const result= jwt.verify(jwttoken,process.env.VERIFICATION_TOKEN_SECRET);
            return {
                message:result,
                flag:true
            }
        } catch (error) {
            return {
                message:error.message,
                flag:false
            }
        }
    }
}