import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPhone, faUser, faClipboard, faUsers, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FaChartBar, FaBullhorn, FaUsers, FaFileAlt } from 'react-icons/fa';
// import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Logo from '../Pages/styles/NSP1.png';
import '../Pages/styles/admin.css';
import { Link, useNavigate } from 'react-router-dom';

import { logOut } from "../Utils/Requests/auth.requsts"


// Main component
const Main = () => (
    <main className="main">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content">
        {props.children}
      </div>
    </main>
  )


// Sidebar component
const Sidebar = () => (
    <aside className="sidebar bg-light">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link active" to="/dialer">
            <FaChartBar className="sidebar-icon" /> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/dialer/leads">
            <FaBullhorn className="sidebar-icon" /> Leads
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/dialer/tasks">
            <FaUsers className="sidebar-icon" /> Tasks
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/dialer/reports">
            <FaFileAlt className="sidebar-icon" /> Reports
          </Link>
        </li>
      </ul>
    </aside>
  );


const Header = ({ adminName }) => {

  const navigate = useNavigate()


  return(
  <header className="header bg-dark text-white">
    {/* <div className="neon-box">
      <h1 className="neon-text">NSP</h1>
    </div> */}

    <div>
        <img src={Logo} alt="Logo" className="logo" />
    </div>


    <div className="admin-name-container">
      <p className="admin-name">{adminName || 'Dialer'}</p>
    </div>

    
      <div className="dialer-logout-button" onClick={()=>{
        logOut().then(res=>{
          if (res) navigate("/login")
        })
      }}>
        
          <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
          <a href="#" style={{ color: '#fff', fontSize: '20px',textDecoration: 'none' }}>
          Logout
        </a>
      </div>

    
  </header>
  );
  };
  

const Admin = (props) => {
  const user = JSON.parse(sessionStorage.getItem('user'))
  console.log("User :", user)
  const adminName = user?.firstName; 
  console.log("Admin Name :", adminName)

  return (
    <div>
      <Header adminName={adminName} />
      <div className="admin-container">
        <Sidebar />
        <div className="content">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Admin;