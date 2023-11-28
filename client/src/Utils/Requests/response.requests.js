import Axios from '../axiosService'
import { toast } from 'react-toastify'

export const sendResponse = async (data) => {        
    try{
        const responsePayload = {
            leadID: data.leadID,
            status: data.status,
            body: data.body,
            startTime: data.startTime,
            endTime: data.endTime,
        }
        toast("Sending Response")
        if (data.notConnectedReason) responsePayload.notConnectedReason = data.notConnectedReason
        const response = await Axios.post('/responses/create', data)
        .then(res=>{toast.success(res.data.message); return true})
        .catch(err=>{toast.error(err.response.data.error.message); return false})
        return response
    } catch(err){
        toast("Response Failed, Re-Send")
        console.log(err)
        return false
    }
}