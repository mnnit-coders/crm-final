const Campaign = require('../models/Campaign.model.js');
const Lead = require('../models/Lead.model.js');

const createError = require('http-errors')

const { settings } = require("./response.controller.js")

const { generateRandomId, deepUpdate } = require('../utils/Helpers.js');
module.exports = {

    createCampaign: async (req, res, next) => {
        try {
            const { name, members, category, priority } = req.body

            const orgID = req.user.orgID
            let campID = orgID+"::"+generateRandomId(16)
            while (await Campaign.exists({ campID: campID }))  campID = generateRandomId(16)

            if (!campID || !name || !category || !name || !priority ) throw createError.BadRequest('All fields are required')

            const doesExists = await Campaign.exists({ orgID:orgID, campID: campID })
            if (doesExists) throw createError.Conflict(`Campaign with this id ${campID} already exists`)

            const campaign = await Campaign.create({
                orgID, campID, name, category, priority, members: members||[]
            })

            const campaignPayload = {
                campID: campaign.campID,
                name: campaign.name,
                priority: campaign.priority,
                category: campaign.category,
                members: campaign.members
            }

            res.status(201).json(campaignPayload)

        } catch (err) {
            next(err)
        }
    },

    getCampaigns: async (req, res, next) => {
        try{
            const { orgID } = req.user
            const campaigns = await Campaign.find({ orgID: orgID })

            const campaignPayload = campaigns.map(campaign=>{
                return {
                    campID: campaign.campID,
                    name: campaign.name,
                    category: campaign.category,
                    priority: campaign.priority,
                    members: campaign.members
                }
            })

            console.log("Campaigns :",campaignPayload)

            res.status(200).json(campaignPayload)

        }catch(err){
            next(err)
        }
    },

    removeCampaign: async (req, res, next) => {
        try{
            const { campID } = req.params
            const orgID = req.user.orgID

            console.log(req.params)
            console.log("removing:", campID, orgID)

            if (!campID) throw createError.BadRequest('All fields are required')

            const doesExists = await Campaign.exists({ orgID:orgID, campID: campID })
            if (!doesExists) throw createError.NotFound(`Campaign with this id ${campID} does not exists`)

            const campaign = await Campaign.deleteOne({ orgID:orgID, campID: campID })
            await Lead.deleteMany({orgID,campID})
            res.status(200).json({message:"Campaign deleted successfully"})
        } catch (err) { 
            next(err)
        }
    },

    getDetails: async (req, res, next) => {
        try{
            const campID = req.params.campID

            if (!campID) throw createError.BadRequest('Campaign ID is required')

            const doesExists = await Campaign.exists({ campID: campID })
            if (!doesExists) throw createError.NotFound(`Campaign with this id ${campID} does not exists`)

            const campaign = await Campaign.findOne({ campID: campID })

            if (req.user.role!='admin' && !campaign.members.includes(req.user.userID)) throw createError.Forbidden('You are not authorized to view this campaign')

            const orgID = req.user.orgID
            const leadPayload = await Lead.find({ orgID: orgID, campID: campID }).then(res=>{
                return res.map(lead=>{
                    return {
                        leadID: lead.leadID,
                        name: lead.name,
                        email: lead.email,
                        phone: lead.phone,
                        status: lead.status,
                        priority: lead.priority
                    }
                })
            })

            const campaignPayload = {
                campID: campaign.campID,
                name: campaign.name,
                priority: campaign.priority,
                members: campaign.members,
                leads : leadPayload
            }

            res.status(200).json(campaignPayload)

        } catch (err) { 
            next(err)
        }
    },

    getCampaignMembers : async (req, res, next) => {
        try{
            const { orgID } = req.user
            const { campID } = req.params
            const campaign = await Campaign.findOne({ orgID: orgID, campID: campID })
            if (!campaign) throw createError.NotFound(`Campaign with this id ${campID} does not exists`)
            const users = campaign.members
            const members = await User.find({ userID: { $in: users } }).then(res=>res.map(user=>{
                return {
                    name: user.firstName+" "+user.lastName,
                    email: user.email
                }
            }))
            res.status(200).json(members)
        }catch (err){
            next(err)
        }
    },

    updateCampaign: async (req, res, next) => {
        try{
            
            const orgID = req.user.orgID
            const { campID, name, priority, members, newSettings,category } = req.body
            console.log(members)

            if (!campID) throw createError.BadRequest('Campaign ID is required')
            if(!name ||!members||!newSettings||!category) createError.BadRequest('All fields required')

            const doesExists = await Campaign.exists({ orgID:orgID, campID: campID })
            if (!doesExists) throw createError.NotFound(`Campaign with this id ${campID} does not exists`)

            const campaign = await Campaign.findOne({ orgID:orgID, campID: campID })

            if (req.user.role!='admin' && campaign.orgID!=orgID) throw createError.Forbidden('You are not authorized to update this campaign')

            if (name) campaign.name = name
            if (priority) campaign.priority = priority
            if (members) {
                campaign.members = members
                campaign.markModified('members')
            }
            if (newSettings){
                // console.log("Old Settings :",campaign.settings)
                console.log("New Settings :",newSettings)
                // deepUpdate(campaign.settings, newSettings)
                // campaign.markModified('settings')
                campaign.settings={'NotConnected':newSettings};
            }
            campaign.category=category;
            await campaign.save()

            const campaignPayload = {
                campID: campaign.campID,
                name: campaign.name,
                priority: campaign.priority,
                members: campaign.members
            }

            res.status(200).json({
                message: "Campaign updated successfully",
                campaign: campaignPayload
            })

        } catch (err) { 
            next(err)
        }
    },
    getCampaignByID:async(req,res,next)=>{
        try {
            const orgID = req.user.orgID;
            const {campID}=req.params;
            if(!campID) throw createError.BadRequest('Campaign Id is required');
            const doesExist=await Campaign.findOne({campID});
            if(!doesExist) throw createError.NotFound(`Campaign with this id ${campID} does not exists`)
            const campaign = await Campaign.findOne({ orgID:orgID, campID: campID })

            if (campaign.orgID!=orgID) throw createError.Forbidden('You are not authorized to see this Campaign')
            return res.status(200).json({
                message: "Campaign successfully",
                data: campaign
            })
        } catch (error) {
            next(error);
        }
    }
}