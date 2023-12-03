import Axios from '../axiosService'

export const sendResponse = async (data) => {        
    try{
        const responsePayload = {
            leadID: data.leadID,
            status: data.status,
            body: data.body,
            startTime: data.startTime,
            endTime: data.endTime,
        }
        if (data.notConnectedReason) responsePayload.notConnectedReason = data.notConnectedReason
        const response = await Axios.post('/responses/create', responsePayload)
        .then(res=>toast(res))
        .catch(err=>toast(err.response.data.error.message))
    } catch(err){
        toast("Response Failed, Re-Send")
        console.log(err)
    }
}