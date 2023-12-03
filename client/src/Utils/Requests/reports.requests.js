import Axios from '../axiosService'
import axios from '../axiosService'
import { toast } from 'react-toastify'
import { DateTime } from 'luxon'
export const getCampaignStatistics = async (campaignId) => {
    try {
        const response = await axios.get(`/reports/campaignStats/${campaignId}`)
        return response.data
    } catch (error) {
        toast(error)
        console.log(error)
    }
}
export const getLoginDetailsforAdmin=async(startDate,endDate,user)=>{
    return await Axios.post(`/reports/loginreport`,{
        startDate,endDate,user
    }).then(res=>{
        const response=res.data.data;
        response.map((data) => (
            data.loginAt = convertTime(data.loginAt),
            data.logoutAt = convertTime(data.logoutAt),
            data.duration = secondsToHHMMSS(data.duration)
        ))
        return response;
    })
    .catch(err=>{
        toast.error(err.response.data.error.message)
            return []
    })
}
export const getDialerCallRecord=async(date)=>{
    return await Axios.post(`/dialer/getcallrecord`,{
        date
    }).then(res=>{
        const response=res.data.data;
        response.map((data)=>(
            data.startTime=convertTime(data.startTime),
            data.endTime=convertTime(data.endTime),
            data.respondedAt=convertTime(data.respondedAt)
        ))
        return response;
    })
    .catch(err=>{
        toast.error(err.response.data.error.message)
            return []
    })
}
export const getLoginReport = async (date) => {
    return await Axios.post(`/reports/loginstats`, {
        date
    })
        .then(res => {
            const response = res.data.data;
            response.map((data) => (
                data.loginAt = convertTime(data.loginAt),
                data.logoutAt = convertTime(data.logoutAt),
                data.duration = secondsToHHMMSS(data.duration)
            ))
            console.log(response);
            return response
        })
        .catch(err => {
            toast.error(err.response.data.error.message)
            return []
        })
}
export const getCallReport=async(date)=>{
    return await Axios.post(`/reports/callstats`, {
        date
    })
        .then(res => {
            var response = res.data.data;
            // response.data.data.callDuration=secondsToHHMMSS(response.data.data.callDuration)
            return response
        })
        .catch(err => {
            toast.error(err.response.data.error.message)
            return {}
        })
}
export const getOrgStatistics = async () => {
    const response = await Axios.get('/reports/adminreport')
        .then(res => {
            return res.data.data
        })
        .catch(err => {
            toast.error(err.response.data.error.message);
            return false
        });
        console.log(response);
        return response;
}
export const getuserreport=async(startDate,endDate,user)=>{
    return await Axios.post(`/reports/userreport`, {
        startDate,endDate,user
    })
        .then(res => {
            const response = res.data.data;
            response.callshistory.map((data) => (
                data.startTime = convertTime(data.startTime),
                data.endTime = convertTime(data.endTime),
                data.duration = secondsToHHMMSS(data.duration),
                data.respondedAt=convertTime(data.respondedAt)
            ))
            return response
        })
        .catch(err => {
            toast.error(err.response.data.error.message)
            return {callshistory:[]};
        })
}
export const getCampaignReportforAdmin=async(startDate,endDate,category)=>{
    return await Axios.post(`/reports/campaignreport`, {
        startDate,endDate,category
    })
        .then(res => {
            const response = res.data.data;
            response.map((data) => (
                data.createdOn=convertTime(data.createdOn)
            ))
            return response
        })
        .catch(err => {
            toast.error(err.response.data.error.message)
            return []
        })
}

function convertTime(data) {
    let date = DateTime.fromISO(data, { zone: 'Asia/Kolkata' }).toLocaleString(DateTime.DATETIME_MED);
    return date;
}

function secondsToHHMMSS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Add leading zeros if needed
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

