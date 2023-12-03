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
    }
    
}