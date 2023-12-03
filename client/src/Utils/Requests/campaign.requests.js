import { toast } from 'react-toastify';
import Axios from '../axiosService'


export const createCampaign = async (campaign) => {
    console.log("creating campaign :", campaign)
    return await Axios.post('/campaign/create',{
        name: campaign.name,
        members: campaign.members || [],
        category: campaign.category,
        priority: campaign.priority || 1
    }).then(res=>{
        toast.success("Campaign created successfully")
        return res.data
    }).catch(err=>{
        toast.error(err.response.data.error.message)
    })
}

export const getCampaignMembers = async(campID) => {
    return await Axios
    .get('/campaign/listMembers/'+campID)
    .then(res=>res.data)
    .catch(err=>{
        toast.error(err.response.data.error.message);
        return []
    })
}

export const getCampaignsList = async() => {
    const response = await Axios
        .get('/campaign/list')
        .then(res=>res.data)
        .catch(err=>{
            toast.error(err.response.data.error.message);
            return []
        })
        
    return response.map(campaign => {
        return {
            campID: campaign.campID,
            name: campaign.name
        }   
    })
}

export const getCampaigns = async() => {
    const response = await Axios
        .get('/campaign/list')
        .then(res=>res.data)
        .catch(err=>{
            toast.error(err.response.data.error.message);
            return []
        })
    return response
}

export const deleteCampaign = async(campID) => {
    await Axios.delete('/campaign/remove/'+campID).then(res=>{
        toast.success("Campaign deleted successfully")
    }).catch(err=>{
        console.log(err)
        toast(err.response.data.error.message)
    })
}

export const updateCampaign = async(settingsPayload) => {
    await Axios.put('/campaign/update/', settingsPayload)
    .then(res=>{
        toast("Settings have been applied")
    }).catch(err=>{
        toast.error(err.response.data.error.message)
    })
}