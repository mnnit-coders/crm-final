const Lead = require('../models/Lead.model');
const User = require('../models/User.model');
const { groupBy } = require('../utils/Helpers');


module.exports = {
    getLeads: async (req, res, next) => {
        try {
            const { orgID, email } = req.user;
            const leads = groupBy(
                await Lead.find({ orgID: orgID, assignedTo: email }),
                'status'
            );
            console.log(leads)
            res.status(200).json({
                leads: leads
            })
        } catch (err) {
            next(err)
        }
    },

    getDialers: async (req, res, next) => {
        try {
            const { orgID } = req.user;
            const dialers = await User.find({ orgID: orgID, role: 'dialer' });
            res.status(200).json(dialers);
        } catch (err) {
            next(err)
        }
    }
}