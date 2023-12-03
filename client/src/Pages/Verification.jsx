import React,{useEffect} from 'react'
import { useParams } from 'react-router-dom';
import {verifyUser} from '../Utils/Requests/auth.requsts.js'
import { useNavigate } from 'react-router-dom';
export default function Verification() {
  const {id}=useParams();
  const navigate = useNavigate();
  useEffect(()=>{
    const response=async (id)=>{
      const result=await verifyUser(id);
      if(result) navigate('/login')
    }
    response(id);
  })
  return (
    <div>
      <h1>hello verification page is here</h1>
    </div>
  )
}
