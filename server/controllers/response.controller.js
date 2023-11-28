const Response = require("../models/Response.model")
const Lead = require("../models/Lead.model")
const Org = require("../models/Org.model")
const Campaign = require("../models/Campaign.model")
const createError = require("http-errors")

// settings = {}

module.exports = {
    // settings: settings,

    createResponse: async (req, res, next) => {
        try {
            const user = req.user
            const orgID = user.orgID
            console.log(req.body);
            const { lead, status, body, startTime, endTime, reason, duration, followupdate } = req.body
            if (!lead || !lead._id || !lead.campID || !body || !startTime || !endTime || !duration || !status) throw createError.BadRequest("Missing required fields")
            const doesexist = await Campaign.exists({ campID: lead.campID });
            if (!doesexist) throw createError.Conflict('Campaign for this lead not exist')
            let settings = (await Campaign.findOne({ campID: lead.campID })).settings;
            settings = settings.NotConnected
            console.log((await Campaign.findOne({ campID: lead.campID })).settings)
            const leadData = await Lead.findOne({ leadID: lead.leadID, campID: lead.campID })
            if (!leadData) throw createError.NotFound("Lead not found")
            if (status == "Converted") {
                const response = await Response.create({
                    leadid: lead._id,
                    body,
                    status,
                    startTime,
                    endTime,
                    duration,
                    respondedBy: user.uid,
                    campID:lead.campID,
                    orgID
                });
                leadData.status = status;
                leadData.isResolved = true
                leadData.history.unshift(response._id);
                await leadData.save();
            }
            else if (status == "Follow-up") {
                if (!followupdate) throw createError.BadRequest("Follow up date is required")
                const response = await Response.create({
                    leadid: lead._id,
                    body,
                    status,
                    startTime,
                    endTime,
                    duration,
                    respondedBy: user.uid,
                    campID:lead.campID,
                    orgID
                })
                leadData.status = status;
                leadData.followupdate = followupdate;
                leadData.history.unshift(response._id);
                await leadData.save();
            }
            else if (status == "Not-Connected") {
                if (!reason) throw createError.BadRequest("Reason required")
                const response = await Response.create({
                    leadid: lead._id,
                    body,
                    status,
                    startTime,
                    endTime,
                    duration,
                    respondedBy: user.uid,
                    campID:lead.campID,
                    orgID
                })
                leadData.notconnectedcount++;
                console.log(settings[reason])
                if (leadData.notconnectedcount >= settings[reason].maxTries || !settings[reason].retryEnabled) {
                    leadData.status = "Lost";
                    leadData.history.unshift(response._id);
                    leadData.reason = "Exceed Limit";
                    await leadData.save();
                }
                else {
                    leadData.status = status;
                    leadData.history.unshift(response._id);
                    leadData.reason = reason;
                    const currentDate = new Date();
                    const tryTime = new Date(currentDate.getTime() + settings[reason].retryAfter[0] * 60000);
                    leadData.tryTime = tryTime;
                    await leadData.save();
                }


            }
            else if (status == "Lost") {
                if (!reason) throw createError.BadRequest("Reason required");
                const response = await Response.create({
                    leadid: lead._id,
                    body,
                    status,
                    startTime,
                    endTime,
                    duration,
                    respondedBy: user.uid,
                    campID:lead.campID,
                    orgID
                })
                leadData.status = status;
                leadData.reason = reason;
                leadData.history.unshift(response._id);
                await leadData.save();
            }
            res.status(201).json({ message: "Status updated about this Lead" })

        } catch (err) {
            console.log(err.message);
            next(err)
        }
    }
}