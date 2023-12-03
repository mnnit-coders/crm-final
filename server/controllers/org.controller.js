require('dotenv').config()
const bcrypt = require('bcrypt')
const createError = require('http-errors')

const Org = require('../models/Org.model')
const User = require('../models/User.model')
const Campaign = require('../models/Campaign.model')
const Response = require("../models/Response.model")
const Lead = require("../models/Lead.model")
const Token = require("../models/Token.model")

module.exports = {
    getAllOrgs: async (req, res, next) => {
        try{
            const orgs = await Org.find({})
            const orgPayload = orgs.map(org => new Object({
                orgID: org.orgID,
                name: org.name,
                description: org.description,
                expiry: org.expiry,
                activeUsers: org.activeUsers,
                maxUsers: org.maxUsers,
            }))
            res.status(200).json(orgPayload)
        } catch (err){
            next(err)
        }
    },

    getDialers: async (req, res, next) => {
        try{
            const { orgID } = req.user
            const members = await User.find({ orgID: orgID })
            const dialers = members.filter(member => member.role==='dialer').map(member => {
                return {
                    name: member.firstName+" "+member.lastName,
                    email: member.email,
                }
            })
            res.status(200).json(dialers)
        }catch(err){
            next(err)
        }
    },

    addOrg: async (req, res, next) => {
        try{
            const { orgID, name, description, password, expiry, maxUsers } = req.body
            if (!orgID || !name || !password || !expiry || !maxUsers) throw createError.BadRequest('All fields are required')

            const doesExists = await Org.exists({ orgID: orgID })
            if (doesExists) throw createError.Conflict(`Organization with this id ${orgID} already exists`)

            const org = await Org.create({
                orgID, name, description, password, expiry, maxUsers
            })
            res.status(201).json(org)
        } catch (err){
            next(err)
        }
    },

    removeOrg: async (req, res, next) => {
        try{
            const { orgID, password } = req.body
            if (!orgID) throw createError.BadRequest('OrgID is required')
            if (!password) throw createError.BadRequest('Password is required')
            const org = await Org.findOne({ orgID: orgID })
            if (!org) throw createError.NotFound('Organization not found')
            if (password!=process.env.OWNER_KEY) throw createError.Unauthorized('Invalid Owner password')
            
            User.deleteMany({ orgID: orgID })
            Campaign.deleteMany({ orgID: orgID })
            Response.deleteMany({ orgID: orgID })
            Lead.deleteMany({ orgID: orgID })
            // Token.deleteMany({ orgID: orgID })

            const deleteRes = await Org.deleteOne({ orgID: orgID })
            res.status(200).json({ message: 'Organization deleted' })
        } catch (err){
            next(err)
        }
    },

    updateSubscription: async (req, res, next) => {
        try{
            const { orgID, expiry, addDays, maxUsers } = req.body
            if (!orgID) throw createError.BadRequest('OrgID is required')
            if (expiry && addDays) throw createError.BadRequest('Only one of newExpiry or addDays can be provided')
            const org = await Org.findOne({ orgID : orgID })
            if (!org) throw createError.NotFound('Organization not found')

            if (maxUsers){
                if (maxUsers < org.activeUsers) throw createError.BadRequest('New Max Users cannot be less than current active Users')
                org.maxUsers = maxUsers
            }
            if (expiry){
                org.expiry = expiry
                console.log("EXPIRY :",org.expiry)
                org.markModified('expiry')
            } 
            if (addDays){
                const Expiry = (org.expiry < Date.now()) ? new Date() : org.expiry
                Expiry.setDate( Expiry.getDate() + addDays )
                org.expiry = Expiry
                org.markModified('expiry')
            }
            const updatedOrg = await org.save()
            
            const resPayload = {
                id: updatedOrg.orgID,
                name: updatedOrg.name,
                expiry: updatedOrg.expiry,
                activeUsers: updatedOrg.activeUsers,
                maxUsers: updatedOrg.maxUsers
            }
            console.log("RES PAYLOAD : ", resPayload)
            res.status(200).json({
                message: "Organization Updated",
                org: resPayload
            })
        } catch (err){
            next(err)
        }
    },

    changePassword: async (req, res, next) => {
        const { orgID, oldPassword, newPassword } = req.body;

        try {
            const org = await Org.findOne({ orgID });

            if (!org) throw createError.NotFound('Organization Not Found' );

            const isMatch = await org.isValidPassword(oldPassword);
            if (!isMatch) throw createError.BadRequest('Invalid old password');

            const salt = await bcrypt.genSalt(5);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            org.password = hashedPassword;
            await org.save();

            return res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            return next(error);
        }
    },

    setOrgSettings: async (req, res, next) => {
        try{

        }catch(err) { next(err) }
    }
}