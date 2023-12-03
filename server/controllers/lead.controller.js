const Lead = require('../models/Lead.model');
const Campaign = require('../models/Campaign.model');
const User = require('../models/User.model');

const createError = require('http-errors')
const csvParser = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');

const { generateRandomId } = require('../utils/Helpers');


// UTILITY FUNCTIONS
const getExt = f => f.substring(f.lastIndexOf('.') + 1);

const fileParse = async (fileName) => {
    const format = getExt(fileName);

    let results = [];

    // PARSING CSV FILE
    if(format == 'csv'){
        results = [];
        await new Promise((resolve, reject) =>{ 
            fs.createReadStream(fileName)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', resolve)
            .on('error',err => reject(err))
        })
    } else if (format == 'xlsx'){
        const workbook = xlsx.readFile(fileName);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        results = xlsx.utils.sheet_to_json(sheet);
    } else if (format == 'json') {
        results = []
    } else {
        await new Promise((resolve, reject) =>{
            fs.unlink(fileName, (err) => {
                if (err) {
                    console.log("Not Deleted", err);
                    reject(err);
                } else {
                    console.log("Deleted");
                    resolve();
                }
            });
        })
        throw createError.BadRequest("Invalid File Format")
    }
    return results;
}

const checkAndCreateLead = async (lead) => {
    const user = await User.findOne({email: lead.assignedTo});
    if (!user || user.role!='dialer') throw createError.BadRequest("Invalid Assigned User")
    return await Lead.create(lead);
}

// CONTROLLERS
module.exports = {
    uploadLeads: async (req, res, next) => {
        
        try{
            const { campID } = req.body;
            const orgID = req.user.orgID;
            if (!campID) throw createError.BadRequest("Invalid Parameters")
            
            if (!req.file) throw createError.BadRequest("No file attached")
            const fileName = './uploads/'+req.file.originalname;
            
            const camp = await Campaign.findOne({campID: campID});
            if (!camp) throw createError.BadRequest("Invalid Campaign ID")
            const members = camp.members;
            var ctr = 0;

            if (!members || members.length==0) throw createError.BadRequest("No members in the campaign")

            // console.log("Res :",results)
            const data = await fileParse(fileName).then(res=>res).then(res=>
                res.map(item=>{
                    item.assignedTo = members[(ctr++)%members.length];
                    return item
                })
            )

            var success = 0;

            await new Promise(async (resolve, reject) => {
                for (let leadData of data){
                    const { name, body, contact, assignedTo } = leadData;
                    const leadID = campID + "::" + generateRandomId(32);
                    const lead = await Lead.create({leadID, campID, orgID, contact, name, body, assignedTo})
                                           .catch(err => console.log(err.message))
                    if (lead) success++;
                }

                // REMOVING File and UPDATING records
                fs.unlink(fileName, (err) => {
                    if (err) {
                        console.log("Not Deleted", err); reject(err);
                    } else {
                        console.log("Deleted"); resolve();
                    }
                });
            }).catch(err=>{
                throw createError.BadRequest("Invalid Data Format")
            })
            res.status(201).json({
                'message': `Created ${success} leads`,
            })
        }catch(err){
            next(err)
        }
    },

    createLead: async (req, res, next) => {
        try{
            const orgID = req.user.orgID;
            const { campID, name, body, assignedTo } = req.body;
            if (!campID || !name || !body || !assignedTo) throw createError.BadRequest("Invalid Parameters")
            if (! (await Campaign.exists({campID:campID}))) throw createError.BadRequest("Invalid Campaign ID")
            const leadID = campID + "::" + generateRandomId(32);
            
            const lead = await checkAndCreateLead({leadID, campID, orgID, name, body, assignedTo})
            res.status(201).json({
                'message': 'Lead created successfully',
                'lead': lead
            })
            
        }catch(err){
            next(err)
        }
    },
    
    deleteLead: async (req, res, next) => {
        try{
            const orgID = req.user.orgID;
            const { leadID } = req.body;
            if (!leadID) throw createError.BadRequest("Invalid Parameters for Lead ID")
            await Lead.deleteOne({orgID:orgID ,leadID: leadID});
            res.status(200).json({
                'message': 'Lead removed successfully'
            })
        }catch(err){
            next(err)
        }
    },
    
    getAllLeads: async (req, res, next) => {
        try{
            const orgID = req.user.orgID;
            const leads = await Lead.find({orgID: orgID});
            res.status(200).json(leads)
        } catch (err){
            next(err)
        }
    },

    getLeadsByPerson: async (req, res, next) => {
        try{
            const orgID = req.user.orgID;
            const { email } = req.body;
            if (!email) throw createError.BadRequest("Invalid Parameters")
            const leads = await Lead.find({orgID: orgID, assignedTo: email});
            res.status(200).json(leads)
        } catch (err){
            next(err)
        }
    },

    getLeadsByCampaign: async (req, res, next) => {
        try{
            const { campID } = req.body;
            const orgID = req.user.orgID;
            if (!campID) throw createError.BadRequest("Invalid Parameters for Campaign ID")
            const leads = await Lead.find({orgID:orgID ,campID: campID});

            res.status(200).json(leads)
        } catch(err){
            next(err)
        }
    },

    getLeadsByStatus: async (req, res, next) => {
        try{
            const orgID = req.user.orgID;
            const { status } = req.body;
            if (!status) throw createError.BadRequest("Invalid Parameters for Status")
            const leads = await Lead.find({orgID:orgID ,status: status});
            res.status(200).json(leads)
        } catch(err) { next(err) }
    },

    getLeadsByCategory: async (req, res, next) => {
        try{
            const orgID = req.user.orgID;
            const { category } = req.body;
            if (!category) throw createError.BadRequest("Invalid Parameters for Category")
            const campaigns = await Campaign.find({orgID:orgID ,category: category});
            console.log("Campaigns :", campaigns)
            if (!campaigns || campaigns.length==0) throw createError.BadRequest("No Campaigns in this category")
            const leads = await Lead.find({orgID:orgID ,campID: {$in: campaigns.map(camp=>camp.campID)}});
            res.status(200).json(leads)
        }catch(err){
            next(err)
        }
    }

}