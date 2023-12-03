const Lead = require("../models/Lead.model")
const Response = require("../models/Response.model")

module.exports = {
    getCampaignStatistics: async (req, res) => {

        if (req.user.role!=='admin') return res.status(403).json({ message: "You are not an admin" })
        if (!req.params.id) return res.status(400).json({ message: "Missing required fields" })

        const orgID = req.user.orgID
        const campID = req.params.id

        const allStatuses = ['Pending', 'Follow-Up', 'Not-Connected', 'Closed', 'Lost']

        const result = await Lead.aggregate([
            { $match: { orgID, campID } },
            { $group: { _id: { status: "$status", assignedTo: "$assignedTo" }, count: { $sum: 1 } } }
        ]);
        
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

        console.table(statusCounts)
        console.table(assignedStatusCounts);

        res.status(200).json({
            statusCounts,
            assignedStatusCounts
        })
    },

    getOrgStatistics: async (req, res) => {
        try{
            const orgID = req.user.orgID
            const totCampaigns = await Campaign.countDocuments({orgID: orgID})
            const totLeads = await Lead.countDocuments({orgID: orgID})
        } catch(err){
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

    generateReport : async (userIds) => {
        try {
          const reports = [];
      
          for (const userId of userIds) {
            // Get user details (you may need to customize this part)
            const user = await User.findById(userId);
      
            // Filter responses for the specified user
            const userResponses = await Response.find({ respondedBy: userId });
      
            // Calculate total call time
            const totalCallTime = userResponses.reduce((sum, response) => {
              const callDuration = response.callTill - response.callFrom;
              return sum + callDuration;
            }, 0);
      
            // Calculate average call time
            const averageCallTime = totalCallTime / userResponses.length;
      
            // Calculate average no. of calls per day
            const callsPerDay = userResponses.length / userResponses.reduce((days, response) => {
              const date = response.respondedAt.toISOString().split('T')[0];
              if (!days.includes(date)) {
                days.push(date);
              }
              return days;
            }, []).length;
      
            // Calculate average time per call
            const averageTimePerCall = totalCallTime / userResponses.length;
      
            // Calculate average waste time (break time)
            const averageWasteTime = 24 * 60 * 60 * 1000 - totalCallTime; // Total time in a day - total call time
      
            // Calculate login time (first report's start time)
            const loginTime = userResponses.length > 0 ? userResponses[0].callFrom : null;
      
            // Calculate logout time (last report's response time)
            const logoutTime = userResponses.length > 0 ? userResponses[userResponses.length - 1].respondedAt : null;
      
            // Calculate average activity time (average time of activity in the day)
            const activityTime = userResponses.reduce((sum, response) => {
              const callDuration = response.callTill - response.callFrom;
              return sum + callDuration;
            }, 0);
            const averageActivityTime = activityTime / userResponses.length;
      
            // Calculate status distribution of responses on the day
            const statusDistribution = userResponses.reduce((distribution, response) => {
              const date = response.respondedAt.toISOString().split('T')[0];
              if (!distribution[date]) {
                distribution[date] = {};
              }
              const status = response.status;
              distribution[date][status] = (distribution[date][status] || 0) + 1;
              return distribution;
            }, {});
      
            // Create the report object for the user
            const userReport = {
              userId: userId,
              username: user.username, // Assuming you have a 'username' field in your User model
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
              // Add more metrics as needed
            };
      
            reports.push(userReport);
          }
      
          return reports;
        } catch (err) {
          throw err;
        }
      },

      getCallReport: async (req, res, next) => {
        const { userIds } = req.params.userIDs;
      }
}