const jwt = require('jsonwebtoken');
const createError = require('http-errors')
const Org = require('../models/Org.model')

module.exports = {
    isUserAuthenticated: (req, res, next) => {
        try {
            if (!req.headers.authorization || req.headers.authorization == 'Bearer null') throw createError.BadRequest('Please Login')
            const tokenHeader = req.headers.authorization.split(' ');
            if (tokenHeader.length !== 2) throw createError.BadRequest('Invalid Token')
            const token = tokenHeader[1];
            if (token==null) throw createError.BadRequest('Token cannot be null')
            
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    if (err.name == 'TokenExpiredError') throw createError.Unauthorized('Token Expired')
                    res.status(401).json({ 
                        error:{
                            status: 401,
                            message: "Token Expired"
                        }
                    });
                } else {
                    req.user = decoded;
                    // Intermediate Check to see if a non owner is expired before every request
                    // if (req.user.role !== 'owner'){
                    //     const orgID = req.user.orgID;
                    //     const org = Org.findOne({orgID: orgID});
                    //     if (!org) throw createError.BadRequest('Org not found')
                    //     if (org.expiry < Date.now()) throw createError.Unauthorized('Subscription Expired')
                    // }

                    next();
                }
            });
        } catch(err) {
            next(err)
        }
    },

    isUserOwner: (req, res, next) => {
        try{
            if (req.user.role !== 'owner') throw createError.Unauthorized('Not an Owner')
            next()
        } catch(err) {
            next(err)
        }
    },

    isUserAdmin: (req, res, next) => {
        try{
            if (req.user.role !== 'admin') throw createError.Unauthorized('Not an Admin')
            next()
        } catch(err) {
            next(err)
        }
    },

    isUserDialer: (req, res, next) => {
        try{
            if (req.user.role !== 'dialer') throw createError.Unauthorized('Not a Dialer')
            next()
        } catch(err) {
            next(err)
        }
    },

    isUserAdminorOwner: (req, res, next) => {
        try{
            if (req.user.role !== 'admin' && req.user.role !== 'owner') throw createError.Unauthorized('Not an Admin or Owner')
            next()
        } catch(err) {
            next(err)
        }
    }
}