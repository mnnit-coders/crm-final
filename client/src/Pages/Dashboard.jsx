import React, { useState, useRef, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faPhone, faUser, faClipboard, faUsers, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import { FaChartBar, FaBullhorn, FaUsers, FaFileAlt } from 'react-icons/fa';
// import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/admin.css';
import AdminLayout from '../Components/AdminLayout.jsx';
import { getOrgStatistics } from '../Utils/Requests/reports.requests.js';


  
// Dashboard component
  const Dashboard = () => {
    const [data,setData]=useState({
      totalLeads:0,
        converted:0,followup:0,notConnected:0,lost:0,pending:0,
        totalCampaigns:0,callAttempted:0,
        callConnected:0,totalCallDuration:0,totalAverageCallDuration:0,totalUsers:0,activeUsers:0,
        averageLoginDuration:0,
        totalLoginDuration:0
    });
    useEffect(()=>{
      getOrgStatistics()
      .then((res)=>{
       if(!res) return;
       setData(res);
      })
    },[])
    return (
    <div className="block-with-background">
      <h2>Dashboard</h2>     
          <div className="statistics">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Leads</h5>
                <ul className="list-group">
                  <li className="list-group-item">Lead Upload: {data.totalLeads}</li>
                  <li className="list-group-item">Pending with Agents: {data.pending}</li>
                  <li className="list-group-item">Follow-Up : {data.followup}</li>
                  <li className="list-group-item">Converted: {data.converted}</li>
                  <li className="list-group-item">Not Connected: {data.notConnected}</li>
                  <li className="list-group-item">Lost: {data.lost}</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Users</h5>
                <ul className="list-group">
                  <li className="list-group-item">Total Users: {data.totalUsers}</li>
                  <li className="list-group-item">Active Users: {data.activeUsers}</li>
                  <li className="list-group-item">Avg Login Hours: {parseFloat(data.averageLoginDuration/3600).toFixed(1)}</li>
                  <li className="list-group-item">Total Login Hours: {parseFloat(data.totalLoginDuration/3600).toFixed(1)}</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Campaigns</h5>
                <ul className="list-group">
                  <li className="list-group-item">Total Campaigns: {data.totalCampaigns}</li>
                  <li className="list-group-item">Active Campaigns: {data.totalCampaigns}</li>
                  <li className="list-group-item">Call Attempted: {data.callAttempted}</li>
                  <li className="list-group-item">Call Connected: {data.callConnected}</li>
                  <li className="list-group-item">Total Call Duration (in seconds) : {data.totalCallDuration}</li>
                  <li className="list-group-item">Avg Call Duration (in seconds) : {data.totalAverageCallDuration}</li>
                </ul>
              </div>
            </div>
          </div>
    </div>
    )
    }




export default function(){
  return (
      <AdminLayout>
          <Dashboard />
      </AdminLayout>
  )
}



  


