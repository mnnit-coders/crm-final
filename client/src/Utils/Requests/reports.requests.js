import axios from '../axiosService'

export const getCampaignStatistics = async (campaignId) => {
    try {
        const response = await axios.get(`/reports/campaignStats/${campaignId}`)
        return response.data
    } catch (error) {
        toast(error)
        console.log(error)
    }
}