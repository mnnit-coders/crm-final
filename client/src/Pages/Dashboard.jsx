import React, { useState, useRef, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faPhone, faUser, faClipboard, faUsers, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import { FaChartBar, FaBullhorn, FaUsers, FaFileAlt } from 'react-icons/fa';
// import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/admin.css';
import AdminLayout from '../Components/AdminLayout.jsx';

  
// Dashboard component
  const Dashboard = () => (
    <div className="block-with-background">
      <h2>Dashboard</h2>     
          <div className="statistics">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Leads</h5>
                <ul className="list-group">
                  <li className="list-group-item">Lead Upload: 100</li>
                  <li className="list-group-item">Open Lead: 50</li>
                  <li className="list-group-item">Pending with Agents: 20</li>
                  <li className="list-group-item">Scheduled: 30</li>
                  <li className="list-group-item">Not Connected: 10</li>
                  <li className="list-group-item">Closed: 40</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Users</h5>
                <ul className="list-group">
                  <li className="list-group-item">Total Users: 200</li>
                  <li className="list-group-item">Active Users: 150</li>
                  <li className="list-group-item">Avg Start Time: 9:00 AM</li>
                  <li className="list-group-item">Avg Login Hours: 7</li>
                  <li className="list-group-item">Avg Break Hours: 1</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Campaigns</h5>
                <ul className="list-group">
                  <li className="list-group-item">Total Campaigns: 30</li>
                  <li className="list-group-item">Active Campaigns: 15</li>
                  <li className="list-group-item">Call Attempted: 500</li>
                  <li className="list-group-item">Call Connected: 250</li>
                  <li className="list-group-item">Avg Call Duration: 2 minutes</li>
                </ul>
              </div>
            </div>
          </div>
    </div>
  );




export default function(){
  return (
      <AdminLayout>
          <Dashboard />
      </AdminLayout>
  )
}



  


