import { toast } from 'react-toastify'
import Axios from '../axiosService'

export const getOrgs = async ()=> {

    const res = await Axios
      .get('/org/orgs')
      .then(res=>{
        console.log(res)
        return res.data
      })
      .catch(err=>{
        toast.error(err.response.data.error.message)
        console.log("Error :", err.response.data.message)
      })

    console.log("Res :", res)

    return res.map(org => {
        return {
            orgID : org.orgID,
            name: org.name,
            description: org.description,
            expiryDate: org.expiry.split('T')[0],
            userCount: `${org.activeUsers} / ${org.maxUsers}`
        }
    })
}

export const deleteOrg = async (orgID, password) => {
    return await Axios
        .delete("/org/removeOrg",{
            data: {
                orgID: orgID,
                password: password
            }
        }).then(res=>{
            toast.success("Organization Deleted")
            console.log(res.data)
            return true
        }).catch(err=>{
            toast.error(err.response.data.error.message)
            return false
        })
}

export const getDialers = async() => {
    return await Axios
    .get('/org/getDialers')
    .then(res=>res.data)
    .catch(err=>{
        toast.error(err.response.data.error.message);
        return []
    })
}

export const addOrg = async (org) => {

    const createdID = org.name.split(' ').join('-').toLowerCase();

    const requestPayload = {
        orgID: createdID,
        name: org.name,
        description: org.description,
        expiry: org.expiry,
        maxUsers: org.userLimit,
        password: org.password
    }

    // Making REQUEST
    return await Axios.post("/org/addOrg", requestPayload)
        .then(res=> {
            res = res.data
            res.userCount = `${res.activeUsers} / ${res.maxUsers}`
            res.expiryDate = res.expiry.split('T')[0]
            toast.success("Organization Added")
            return res
        })
        .catch(err=>{
            toast.error(err.response.data.error.message)
        })
}

export const updateSubscription = async (orgID, expiry, maxUsers) => {
    
    console.log(`Updating ...\nORG : ${orgID}\n EXP ${expiry} \nMAX : ${maxUsers}`)

    const requestPayload = { orgID: orgID }
    if(maxUsers) requestPayload.maxUsers = maxUsers;
    if(expiry) requestPayload.expiry = expiry;

    console.log("Request Payload :", requestPayload)

    return await Axios.put("/org/updateSubscription", requestPayload)
    .then(res=>res.data.org)
    .then(res=>{
        console.log("RES :", res)
        toast.success("Subscription Updated")
        return {
            userCount: `${res.activeUsers} / ${res.maxUsers}`,
            expiryDate: res.expiry.split('T')[0]
        }
    })
    .catch(err=>{
        if (err.response) toast.error(err.response.data.error.message)
        else toast.error(err.message)
        console.log("ERROR :",err.response.data.error.message)
        return undefined
    })
}

const getLeads = async (orgID) => {
    return await Axios.get(`/org/getLeads/${orgID}`)
    .then(res=>res.data)
    .catch(err=>{
        toast.error(err.response.data.error.message)
        return []
    })
}