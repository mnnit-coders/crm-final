import axios from "axios";
import { toast } from "react-toastify";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI || "https://nsp-backend.onrender.com/api",
  headers: {
    Accept: "application/json",
  },
});

Axios.interceptors.request.use(async(config) => {
  const accessToken = sessionStorage.getItem("accessToken");
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
})

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.code === "ERR_NETWORK"){
      toast.error("SERVER INACTIVE")
      return Promise.reject(error)
    }
    try{
      const errData = error.response.data.error;
      if (errData.status == 401 && errData.message=="Token Expired"){

        const refreshToken = sessionStorage.getItem("refreshToken");
        
        console.log("Refreshing Access Token",refreshToken)
        const res = await Axios.post("/auth/refresh", {
            refreshToken: refreshToken
          }).catch(err=>{
          console.log("ERR",err)
        })

        sessionStorage.setItem("accessToken", res.data.accessToken);

        return Axios.request(error.config)
      }
      return Promise.reject(error)
    }catch(err){
      console.log(err)
      return Promise.reject(error);
    }
  },
);


export default Axios
