import { toast } from "react-toastify";
import Axios from "../axiosService"
import { DateTime } from 'luxon'
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
        .then(res=>{
            if(res.data.leads['Not-Connected']){
                res.data.leads['Not-Connected'].map((data)=>(
                    data.tryTime=convertTime(data.tryTime)
                ))
            }
            if(res.data.leads['Follow-up']){
                res.data.leads['Follow-up'].map((data)=>(
                    data.followupdate=convertTime(data.followupdate)
                ))
            }
            return res.data;
        })
        .catch(err=>{
            toast.error(err.response.data.error.message);
            return []
        })
    console.log("getLeads :", response)
    return response
}
function convertTime(data) {
    let date = DateTime.fromISO(data, { zone: 'Asia/Kolkata' }).toLocaleString(DateTime.DATETIME_MED);
    return date;
}