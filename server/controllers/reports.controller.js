const Lead = require("../models/Lead.model")
const Response = require("../models/Response.model")
const Campaign = require("../models/Campaign.model")
const createError = require('http-errors')
const Session = require('../models/Session.model')
const User = require('../models/User.model')
const Org = require('../models/Org.model')
const { DateTime } = require('luxon')
const { response } = require("express")
function isValidDateFormat(dateString) {
  // Regular expression to match "YYYY-MM-DD" format
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateFormatRegex.test(dateString);
}


module.exports = {
  getCampaignStatistics: async (req, res, next) => {
    try {
      if (req.user.role !== 'admin') return res.status(403).json({ message: "You are not an admin" })
      if (!req.params.id) return res.status(400).json({ message: "Missing required fields" })

      const orgID = req.user.orgID
      const campID = req.params.id

      const allStatuses = ['Pending', 'Follow-up', 'Not-Connected', 'Converted', 'Lost']

      const result = await Lead.aggregate([
        { $match: { orgID, campID } },
        { $group: { _id: { status: "$status", assignedTo: "$assignedTo" }, count: { $sum: 1 } } }
      ]);
      console.log(result);
      const statusCounts = {};
      const assignedStatusCounts = {};

      result.forEach(item => {
        const { status, assignedTo } = item._id;
        const count = item.count;

        // Populate the statusCounts dictionary
        if (!statusCounts[status]) statusCounts[status] = 0;
        statusCounts[status] += count;

        // Populate the assignedStatusCounts dictionary
        if (!assignedStatusCounts[assignedTo]) assignedStatusCounts[assignedTo] = {};
        assignedStatusCounts[assignedTo][status] = count;
      });

      for (let key of allStatuses) statusCounts[key] = statusCounts[key] || 0
      for (let key in assignedStatusCounts) {
        for (let keyStatus of allStatuses) assignedStatusCounts[key][keyStatus] = assignedStatusCounts[key][keyStatus] || 0
      }

      console.log(statusCounts)
      console.log(assignedStatusCounts);

      res.status(200).json({
        statusCounts,
        assignedStatusCounts
      })
    } catch (error) {
      next(error)
    }

  },

  getOrgStatistics: async (req, res, next) => {
    try {
      const orgID = req.user.orgID
      const totCampaigns = await Campaign.countDocuments({ orgID: orgID })
      const totLeads = await Lead.countDocuments({ orgID: orgID })
      const PendingLeads = await Lead.countDocuments({ orgID: orgID, status: "Pending" })
      const FollowUpLeads = await Lead.countDocuments({ orgID: orgID, status: "Follow-Up" })
      const NotConnectedLeads = await Lead.countDocuments({ orgID: orgID, status: "Not-Connected" })
      const ClosedLeads = await Lead.countDocuments({ orgID: orgID, status: "Closed" })
      const LostLeads = await Lead.countDocuments({ orgID: orgID, status: "Lost" })
      const allStatuses = ['Pending', 'Follow-Up', 'Not-Connected', 'Closed', 'Lost']
      const statusCounts = { 'Pending': PendingLeads, 'Follow-Up': FollowUpLeads, 'Not-Connected': NotConnectedLeads, 'Closed': ClosedLeads, 'Lost': LostLeads }
      for (let key of allStatuses) statusCounts[key] = statusCounts[key] || 0
      res.status(200).json({
        data: {
          totCampaigns: totCampaigns,
          totLeads: totLeads,
          leadStatusCounts: statusCounts
        }
      })
    } catch (err) {
      console.log(err.message);
      next(err)
    }
  },

  getReports: async (req, res) => {
    try {
      const query = {};

      if (req.query.userId) query.respondedBy = req.query.userId;
      if (req.query.status) query.status = req.query.status;

      if (req.query.callTime) query.callTime = new Date(req.query.callTime);
      if (req.query.callFrom) query.callFrom = new Date(req.query.callFrom);

      if (req.query.callTill) query.callTill = new Date(req.query.callTill);

      if (req.query.startDate && req.query.endDate) {
        query.respondedAt = {
          $gte: new Date(req.query.startDate),
          $lte: new Date(req.query.endDate),
        };
      }

      const responses = await Response.find(query);
      res.json(responses);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  averageCallTime: async (req, res) => {
    try {
      const userId = req.params.userId;

      // Filter responses for the specified user
      const userResponses = await Response.find({ respondedBy: userId });

      // Group responses by date (assuming respondedAt is a Date field)
      const responsesByDate = {};

      userResponses.forEach((response) => {
        const date = response.respondedAt.toISOString().split('T')[0]; // Extract date in 'YYYY-MM-DD' format
        if (!responsesByDate[date]) {
          responsesByDate[date] = [];
        }
        responsesByDate[date].push(response);
      });

      // Calculate average call time per day
      const averageCallTimeByDay = {};

      for (const date in responsesByDate) {
        const responses = responsesByDate[date];

        // Calculate total call time for the day
        const totalCallTime = responses.reduce((sum, response) => {
          const callDuration = response.callTill - response.callFrom;
          return sum + callDuration;
        }, 0);

        // Calculate average call time for the day
        const averageCallTime = totalCallTime / responses.length;

        averageCallTimeByDay[date] = averageCallTime;
      }

      res.json(averageCallTimeByDay);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  generateReportsForUsers: async (userIds) => {
    try {
      const reports = [];

      for (const userId of userIds) {
        const user = await User.findById(userId);
        const userResponses = await Response.find({ respondedBy: userId });
        const totalCallTime = userResponses.reduce((sum, response) => {
          const callDuration = response.callTill - response.callFrom;
          return sum + callDuration;
        }, 0);
        const averageCallTime = totalCallTime / userResponses.length;

        const callsPerDay = userResponses.length / userResponses.reduce((days, response) => {
          const date = response.respondedAt.toISOString().split('T')[0];
          if (!days.includes(date)) {
            days.push(date);
          }
          return days;
        }, []).length;

        const averageTimePerCall = totalCallTime / userResponses.length;
        const averageWasteTime = 24 * 60 * 60 * 1000 - totalCallTime;
        const loginTime = userResponses.length > 0 ? userResponses[0].callFrom : null;
        const logoutTime = userResponses.length > 0 ? userResponses[userResponses.length - 1].respondedAt : null;
        const activityTime = userResponses.reduce((sum, response) => {
          const callDuration = response.callTill - response.callFrom;
          return sum + callDuration;
        }, 0);
        const averageActivityTime = activityTime / userResponses.length;

        const statusDistribution = userResponses.reduce((distribution, response) => {
          const date = response.respondedAt.toISOString().split('T')[0];
          if (!distribution[date]) {
            distribution[date] = {};
          }
          const status = response.status;
          distribution[date][status] = (distribution[date][status] || 0) + 1;
          return distribution;
        }, {});

        const userReport = {
          userId: userId,
          username: user.username,
          callHistory: userResponses,
          averageCallTime: averageCallTime,
          callsPerDay: callsPerDay,
          averageTimePerCall: averageTimePerCall,
          averageWasteTime: averageWasteTime,
          loginTime: loginTime,
          logoutTime: logoutTime,
          averageActivityTime: averageActivityTime,
          totalCallTime: totalCallTime,
          statusDistribution: statusDistribution,
        };

        reports.push(userReport);
      }

      return reports;
    } catch (err) {
      throw err;
    }
  },

  getCallReport: async (req, res, next) => {
    try {
      const { uid } = req.user;
      const { date } = req.body;
      if (!date) throw createError.BadRequest('Select Date');
      if (!isValidDateFormat(date)) throw createError.BadRequest('Invalid date format');
      const searchDate = new Date(date);
      const callAttempted = await Response.find({
        respondedBy: uid,
        respondedAt: {
          $gte: searchDate,
          $lte: new Date(searchDate.getTime() + 86400000)
        }
      });
      const callConnected = await Response.countDocuments({
        respondedBy: uid,
        respondedAt: {
          $gte: searchDate,
          $lte: new Date(searchDate.getTime() + 86400000)
        },
        status: { $ne: "Not-Connected" }
      });
      console.log(callAttempted, callConnected);
      let totalDuration = callAttempted.reduce((acc, obj) => acc + obj.duration, 0);
      let sizeofCallAtempted = callAttempted.length;
      // let avgCallDuration = Math.floor((totalDuration / sizeofCallAtempted))
      let avgCallDuration =
        sizeofCallAtempted !== 0
          ? (totalDuration / sizeofCallAtempted).toFixed(1)
          : 0;
      console.log(avgCallDuration)
      return res.status(200).json({
        data: {
          callAttempted: callAttempted.length,
          callConnected,
          callDuration: totalDuration,
          avgCallDuration
        }
      })
    } catch (error) {
      next(error)
    }


  },
  getLoginReport: async (req, res, next) => {
    try {
      const { uid } = req.user;
      const { date } = req.body;
      if (!isValidDateFormat(date)) throw createError.BadRequest('Invalid date format');
      const searchDate = new Date(date);
      const response = await Session.find({
        user: uid,
        loginAt: {
          $gte: searchDate,
          $lt: new Date(searchDate.getTime() + 86400000)
        },
        logoutAt: { $exists: true }
      });

      return res.status(200).json({
        data: response
      });
    } catch (error) {
      next(error);
    }
  },
  getLoginReportForAdmin: async (req, res, next) => {
    try {
      let { startDate, endDate, user } = req.body;
      if (!startDate || !endDate || !user) throw createError.BadRequest("All fields required");
      // console.log(req.body)
      endDate = new Date(endDate)
      // console.log(endDate);
      endDate.setHours(23, 59, 59, 999);
      const response = await Session.find({
        user: user,
        loginAt: {
          $gte: startDate,
          $lt: endDate
        },
        logoutAt: { $exists: true }
      });
      // console.log(response)
      return res.status(200).json({
        data: response
      });
    } catch (error) {
      next(error)
    }
  },
  generateCallReportForAdmin: async (req, res, next) => {
    try {
      var { startDate, endDate, user } = req.body;
      if (!startDate || !endDate || !user) throw createError.BadRequest("All fields required");
      endDate = new Date(endDate)
      endDate.setHours(23, 59, 59, 999);
      const response = await Response.find({
        respondedBy: user,
        respondedAt: {
          $gte: startDate,
          $lt: endDate
        }
      });
      let convertedCalls = response.filter(data => data.status === "Converted");
      convertedCalls = convertedCalls.length;
      let lostCalls = response.filter(data => data.status === "Lost");
      lostCalls = lostCalls.length;
      let followupCalls = response.filter(data => data.status == "Follow-up");
      followupCalls = followupCalls.length;
      let notConnectedCalls = response.filter(data => data.status === "Not-Connected");
      notConnectedCalls = notConnectedCalls.length;
      let inprogresscalls = followupCalls + notConnectedCalls;
      let totalCallAttempted = response.length;
      let totalConnectedCalls = convertedCalls + followupCalls + lostCalls;
      let data = {
        callshistory: response,
        convertedCalls, lostCalls, followupCalls, notConnectedCalls, inprogresscalls, totalCallAttempted, totalConnectedCalls
      }
      return res.status(200).json({
        data: data
      });
    } catch (error) {
      next(error);
    }
  },
  getCampaignReport: async (req, res, next) => {
    try {
      const { orgID } = req.user;
      let { category, startDate, endDate } = req.body;
      if (!startDate || !endDate || !category) throw createError.BadRequest("All fields required");
      endDate = new Date(endDate)
      endDate.setHours(23, 59, 59, 999);
      const responsecampaigns = await Campaign.find({ orgID: orgID, category: { $in: category } });

      const campaigns = responsecampaigns.map((data) => {
        return data.campID
      });


      const response = await Response.find({
        orgID: orgID,
        campID: { $in: campaigns },
        respondedAt: {
          $gte: startDate,
          $lt: endDate
        }
      }).populate('leadid');

      var finalResponse = [];
      for (let index = 0; index < campaigns.length; index++) {
        const tempresponse = response.filter(data =>
          data.campID == campaigns[index]
        );
        let callAttempted = tempresponse.length;
        let callFollowup = tempresponse.filter(data => (data.status == 'Follow-up')).length;
        let callConverted = tempresponse.filter(data => data.status == 'Converted').length;
        let callConnected = callFollowup + callConverted;
        let { name, category, createdOn } = responsecampaigns.filter(data => data.campID == campaigns[index])[0];
        let temp = responsecampaigns.filter(data => data.campID == campaigns[index]);
        let callnotconnected = tempresponse.filter(data => data.status == 'Not-Connected').length;
        let callLost = tempresponse.filter(data => data.status == 'Lost').length;
        let data = {
          callAttempted, callConnected, callConverted, category, name, createdOn, callFollowup, callnotconnected, callLost
        }
        finalResponse.push(data);
      }

      console.log(finalResponse);
      return res.status(200).json({
        data: finalResponse
      })
    } catch (error) {
      next(error);
    }
  },
  getAdminReport: async (req, res, next) => {
    try {
      const { orgID } = req.user;
      const leads = await Lead.find({ orgID });
      const converted = leads.filter(data => data.status == 'Converted').length
      const followup = leads.filter(data => data.status == 'Follow-up').length
      const notConnected = leads.filter(data => data.status == 'Not-Connected').length
      const lost = leads.filter(data => data.status == 'Lost').length
      const pending = leads.filter(data => data.status == 'Pending').length

      const campaigns = await Campaign.find({ orgID: orgID });
      const responses = await Response.find({ orgID });
      const Connected = responses.filter(data => data.status == "Converted").length + responses.filter(data => data.status == "Follow-up").length;
      const totalDuration = responses.reduce((sum, obj) => sum + obj.duration, 0);
      const averageDuration = totalDuration / Connected;

      const users = await User.find({ orgID });
      const { _id } = await Org.findOne({ orgID });
      console.log(_id);
      const usersactive = await Session.find({logoutAt:{$exists:false},org:_id});
      const sessions=await Session.find({logoutAt:{$exists:true},org:_id});
      console.log(usersactive);
      var totalLoginDuration=sessions.reduce((sum,obj)=>sum=sum+obj.duration,0);
      averageLoginDuration=totalLoginDuration/sessions.length;
      const data={
        totalLeads:leads.length,
        converted,followup,notConnected,lost,pending,totalCampaigns:campaigns.length,callAttempted:responses.length,
        callConnected:Connected,totalCallDuration:totalDuration,totalAverageCallDuration:averageDuration,totalUsers:users.length,
        activeUsers:usersactive.length,
        averageLoginDuration:parseFloat(averageLoginDuration).toFixed(0),
        totalLoginDuration
      }
      return res.status(200).json({
        data,
        message:"hello"
      })
    } catch (error) {
      next(error);
    }
  }
}