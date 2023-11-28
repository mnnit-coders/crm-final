import Axios from "../axiosService";
import { toast } from "react-toastify";

export const ownerRegister = async (owner) => {
    const ownerPayload = {
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        password: owner.password,
        sysPass: owner.systemPassword
    }

    return await Axios.post('/auth/ownerRegister',ownerPayload).then(res=>{
        toast.success("Verification link has sent on e-mail address")
        return true
    }).catch(err=>{
        toast.error(err.response.data.error.message)
        return false
    })
}

export const userRegister = async (user) => {
    try{
        const UserPayload = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            role: user.role,
            orgID: user.orgID,
            orgPass: user.orgPassword
        }

        return await Axios.post('/auth/register',UserPayload).then(res=>{
            toast.success("Verification link has sent on e-mail address")
            return true
        }).catch(err=>{
            toast.error(err.response.data.error.message)
            return false
        })

    }catch(err){
        return false
    }
}

export const logIn = async (user) => {
    const loginPayload = {
        email: user.email,
        password: user.password
    }
  
    return await Axios.post("/auth/login", loginPayload).then(res=>{
        toast.success("Logged In")
        sessionStorage.setItem('user',JSON.stringify(res.data.User))
        sessionStorage.setItem('refreshToken',res.data.refreshToken)
        sessionStorage.setItem('accessToken',res.data.accessToken)
        Axios.defaults.headers['Authorization'] = `Bearer ${res.data.accessToken}`
        return res.data.User.role
    }).catch(err=>{
        toast.error(err.response.data.error.message)
        return false
    })
  }

export const logOut = async () => {
    return await Axios.delete('/auth/logout').then(res=>{
        toast.success("Logged Out")
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('refreshToken')
        return true
    }).catch(err=>{
        toast.error("Loging Out Failed")
        return false
    })
}

export const verifyUser=async (token)=>{
    try {
        const response = await Axios.post('/auth/verifyUser',{token});
        toast.success(response.data.message);
        return true;
    } catch (error) {
        console.log(error.response.data.error.message)
        toast.error(error.response.data.error.message)
        return false;
    }
}