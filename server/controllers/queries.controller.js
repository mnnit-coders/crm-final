const Query = require('../models/Lead.model.js');
const createError = require('http-errors');

module.exports = {
    newQuery: async function(req, res, next) {
        try {
            // const { user, query } = req.body;
            // const newQuery =  await Query.create({ user, query });
            res.status(201).json({ message: "Query created successfully", data: "New Query" });
        } catch (error) {
            next(error);
        }
    },

    getAllQueries: async function(req, res, next) {
        try {
            const queries = await Query.find().populate('user');
            res.status(200).json({ message: "All queries", data: queries });
        } catch (error) {
            next(error);
        }
    },

    deleteQuery: async function(req, res, next) {
        try {
            const { id } = req.body;
            const deletedQuery = await Query.deleteOne({_id:id});
            res.status(200).json({ message: "Query deleted successfully", data: deletedQuery });
        } catch (error) {
            next(error);
        }
    }
}
