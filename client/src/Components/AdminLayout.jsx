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
const Sidebar = () =>
{

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };





  return (
    <aside className="sidebar bg-light">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link active" to="/admin/dashboard">
            <FaChartBar className="sidebar-icon" /> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/campaigns">
            <FaBullhorn className="sidebar-icon" /> Campaign
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/contacts">
            <FaUsers className="sidebar-icon" /> Contacts
          </Link>
        </li>
        <li className="nav-item">
        <a className="nav-link" href="#" >
            <FaFileAlt className="sidebar-icon" /> Reports
          </a>
          
            <div className="report-dialog">
                 <a className="report-link"
                  style={{
                    color: '#fff',
                    padding: '2px',
                    textDecoration: 'none',
                    fontSize: '20px',
                    transition: 'color 0.3s',
                    ':hover': {
                      color: '##141E61' // Change this to your desired hover color
                    }
                  }}
                 href="/admin/reports_campaign">Campaign </a>

                  <a className="report-link"
                    style={{
                      color: '#fff',
                      padding: '2px',
                      textDecoration: 'none',
                      fontSize: '20px',
                      transition: 'color 0.3s'
                    }}
                  href="/admin/reports_campaign_lead">Campaign Lead </a>  



                  <a className="report-link"
                    style={{
                      color: '#fff',
                      padding: '2px',
                      textDecoration: 'none',
                      fontSize: '20px',
                      transition: 'color 0.3s'
                    }}
                  href="/admin/reports_user_call">User Call </a>


                  <a className="report-link"
                    style={{
                      color: '#fff',
                      padding: '2px',
                      textDecoration: 'none',
                      fontSize: '20px',
                      transition: 'color 0.3s'
                    }}
                  href="/admin/reports_user_login">User Login </a>               
                {/* Add more report links as needed */}
              
              {/* <button  className="report-close-button" onClick={closeDialog}>Close</button> */}
              </div>
            
          
        </li>
        {/* <div onClick={logOut}>
          LOGOUT
        </div> */}
      </ul>
    </aside>
  );

      };


const Header = ({ adminName }) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (menuRef.current !== null) {
      const { top, left } = menuRef.current.getBoundingClientRect();
      setMenuPosition({ top, left });
    }
  }, [isMenuOpen]);



  const handleOutsideClick = (event) => {
    return
    // if (menuRef.current && !menuRef.current.contains(event.target)) {
    //   setIsMenuOpen(false);
    // }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);



  return(
  <header className="header bg-dark text-white">
    {/* <div className="neon-box">
      <h1 className="neon-text">NSP</h1>
    </div> */}
    <div>
        <img src={Logo} alt="Logo" className="logo" />
    </div>
    <div className="admin-name-container">
      <p className="admin-name">{adminName}</p>
    </div>

    <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} ref={menuRef}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {isMenuOpen ? (
        <div className="menu" style={{ top: menuPosition.top, left: menuPosition.left }}>
          <div className="menu-items">
            {/* <li>
              <a href="#">
                <FontAwesomeIcon icon={faPhone} className="menu-icon" />
                Switch to Dialer
              </a>
            </li> */}
            {/* <li>
              <a href="#">
                <FontAwesomeIcon icon={faUser} className="menu-icon" />
                Profile
              </a>
            </li> */}
            <li>
              <a href="#">
                <FontAwesomeIcon icon={faClipboard} className="menu-icon" />
                Custom Lead Form
              </a>
            </li>
            <li>
              <a href="#">
                <FontAwesomeIcon icon={faUsers} className="menu-icon" />
                Manage Users
              </a>
            </li>
            <li>
              <a href="#">
                <FontAwesomeIcon icon={faCog} className="menu-icon" />
                Settings
              </a>
            </li>
            <li onClick={()=>{
              logOut().then(res=>{
                if (res) navigate("/login")
              })
            }}>
              <a href="#">
                <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                Logout
              </a>
            </li>
          </div>
        </div>
      ): null}

    
  </header>
  );
  };
  

const Admin = (props) => {
  
  const adminName = "Admin"; 
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



