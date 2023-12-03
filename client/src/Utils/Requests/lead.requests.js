import { toast } from "react-toastify";
import Axios from "../axiosService"

export const uploadLeadsFile = async (formData) => {
    
    await Axios.post('/lead/uploadLeads', formData, {
    onUploadProgress: (progressEvent) => {
        console.log(progressEvent);
    },
    }).then(res=>{
        toast.success(res.data.message)
        console.log("Success :",res.data)
    }).catch(err=>{
        toast.error(err.response.data.error.message)
        console.log("Error :",err)
    })
  
}

export const getLeads = async() => {
    const response = await Axios
        .get('/dialer/getLeads')
        .then(res=>res.data)
        .catch(err=>{
            toast.error(err.response.data.error.message);
            return []
        })
    console.log("getCampaigns :", response)
    return response
}