const User = require('../models/User.model');
const Org = require('../models/Org.model')
const Token = require('../models/Token.model');
const createError = require('http-errors');
const { isEmailValid } = require('../utils/validations');
const jwtService = require('../utils/jwtService');

module.exports = {

    // OWNER REGISTERATION CONTROLLER
    ownerRegister : async function(req, res, next) {
        
        const {firstName,lastName,email,password,sysPass}=req.body;

        try {
            // Request Schema Validation
            if (!firstName || !lastName || !email || !password || !sysPass) throw createError.BadRequest("All fields are required")
            if (sysPass !== process.env.OWNER_KEY) throw createError.Unauthorized("Wrong System Password")
            if(!isEmailValid(email))  throw createError.BadRequest("Not a valid email");
            const doesExists = await User.findOne({email:email});
            if(doesExists) throw createError.Conflict(`A user with this ${email} email id already exists!!`);

            // User Request Schema Validated. Now create owner
            const user = await User.create({
                firstName:firstName,
                lastName:lastName,
                email:email,
                password:password,
                role:'owner',
            });

            res.status(201).json({Message:"Owner registered.", user:{
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }});

        }  catch (error) {
            console.log(error)
            next(error)
        }
    },

    // REGISTER CONTROLLER
    register : async function(req, res, next) {
        try {
            const {firstName,lastName,email,password,role,orgID,orgPass}=req.body;
            
            // Request Schema Validation
            if (!firstName  || !lastName  || !email  || !password  || !orgID || !orgPass ) throw createError.BadRequest("All fields are required")
            if(!isEmailValid(email))  throw createError.BadRequest("Not a valid email");
            
            const doesExists = await User.findOne({email:email});
            if(doesExists) throw createError.Conflict(`A user with this ${email} email id already exists!!`);

            
            const org = await Org.findOne({orgID:orgID});
            if (!org) throw createError.NotFound('Organzation not found')
            if (!(await org.isValidPassword(orgPass))) throw createError.Unauthorized('Wrong Organization Password')

            if (org.activeUsers == org.maxUsers) throw createError.BadRequest('Max Users Reached')
            org.activeUsers += 1;
            await org.save();

            // User Request Schema Validated. Now create user
            const user=new User({
                firstName:firstName,
                lastName:lastName,
                email:email,
                password:password,
                role: role||'owner',
                orgID: orgID
            });
            await user.save();
            
            res.status(201).json({Message:"User registered.", user:{
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                org: {
                    orgID: org.orgID,
                    name: org.name
                }
            }});
        }  catch (error) {
            next(error)
        }    
    },

    // LOGIN CONTROLLER
    login : async function(req, res, next) {
        const {email,password}=req.body;
        try {
            if(!isEmailValid(email)) 
                throw createError.BadRequest("Not a valid email");

            const user=await User.findOne({email:email}).populate();
            if(!user) throw createError.NotFound('User not registered');
            const isMatch = await user.isValidPassword(password)
            if (!isMatch) throw createError.Unauthorized('Username/password not valid')
            
            const org = await Org.findOne({orgID: user.orgID})
            if (user.role!=='owner' && (!org || org.expiry < Date.now())) throw createError.Unauthorized('Subscription Expired');

            const userPayload = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email, 
                role: user.role,
                orgID: user.orgID,
                maxDate: user.maxDate,
            }
            const accessToken = jwtService.generateAccessToken(userPayload);
            const refreshToken = jwtService.generateRefreshToken(userPayload);
            const userToken = await Token.findOne({user: user.email});
            if (userToken !== null) {
                userToken.token = refreshToken;
                await userToken.save();
            } else {
                await Token.create({user: user.email, token: refreshToken});
            }
            
            res.json({User:userPayload, accessToken: accessToken, refreshToken: refreshToken});
        } 
        catch (error) {
            next(error);
        }
    },

    // LOGOUT CONTROLLER
    logout : async function(req, res, next){
        try{
            const email = req.user?.email
            // if (refreshToken === "") throw createError.BadRequest("Refresh Token cannot be null")
            const result = await Token.deleteOne({user: email})
            res.status(200).json({message: "User Logged Out"})
        } catch (error){
            next(error)
        }
    },

    // UNREGISTER CONTROLLER
    unregister: async function(req, res, next) {
        try{
            const { email, password } = req.body
            if (!email  || !password ) throw createError.BadRequest("Email or Password cannot be null")
            const user = await User.findOne({email: email})
            if (user === null) throw createError.BadRequest("User not Registered")
            if (!user.isValidPassword(password)) throw createError.BadRequest("Wrong Password")
            
            const org = await Org.findOne({orgID: user.orgID})
            org.activeUsers -= 1
            await org.save()

            const result = await User.deleteOne({email: email})
            await Token.deleteOne({user: email})
            res.status(200).json({"message":"User Deleted"})
        }
        catch (error){
            next(error)
        }
    },

    // REFRESH TOKEN CONTROLLER
    refresh: async function(req, res, next) {
        try {
            const refreshToken = req.body?.refreshToken
            if (!refreshToken ) throw createError.BadRequest("Refresh Token cannot be null")
            const result = await Token.findOne({token: refreshToken})
            if (result === null) throw createError.NotFound("Token not found")
            const accessToken = jwtService.refresh(refreshToken)
            res.json({accessToken: accessToken})
        }
        catch (error) {
            next(error)
        }
    },

    // CHANGE PASSWORD CONTROLLER
    changePassword: async function(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body
            const email = req.user.email
            if (!oldPassword  || !newPassword ) throw createError.BadRequest("All fields are required")
            const user = await User.findOne({email: email})
            if (!user) throw createError.NotFound("User not found")
            if (!user.isValidPassword(oldPassword)) throw createError.BadRequest("Wrong Password")
            
            const salt = await bcrypt.genSalt(5)
            user.password = await bcrypt.hash(newPassword, salt)
            await user.save()

            res.status(200).json({"message":"Password Changed"})
        } catch (err){
            next(err)
        }
    },
}