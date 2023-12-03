const Response = require("../models/Response.model")
const Lead = require("../models/Lead.model")
const Org = require("../models/Org.model")

const createError = require("http-errors")

settings = {}

module.exports = {
    settings: settings,
    
    createResponse: async (req, res, next) => {
        try{
            if (req.user.role!=='admin') throw createError.Unauthorized("You are not an admin")

            const user = req.user
            const orgID = user.orgID

            if (!orgID in settings) settings[orgID] = (await Org.findOne({orgID: orgID})).settings
            let orgSettings = settings[orgID]

            const { leadID, status, body, startTime, endTime, notConnectedReason } = req.body
            if (!leadID || !body || !callTime || !author) throw createError.BadRequest("Missing required fields")

            const lead = await Lead.findOne({leadID: leadID})
            if (!lead) throw createError.NotFound("Lead not found")

            if (status.toLowerCase() == "Not-Connected") {
                if (!notConnectedReason) throw createError.BadRequest("Missing Not Connected Reason field")
                lead.notconnectedcount++
            }  
            if (lead.notconnectedcount >= settings[orgID]["Not-Connected"][notConnectedReason]["maxTries"]) lead.status = "Lost"
            else lead.status = status

            const Response = await Response.create({
                email: user.email,
                leadID: leadID,
                status: status,
                body: body,
                startTime, startTime,
                endTime: endTime,
                callTime: callTime
            })

            await lead.save()

            res.status(201).json("Response Accepted")

        } catch(err){
            next(err)
        }
    }
}