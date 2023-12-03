import React, { useState, useEffect, useRef } from 'react';
import './styles/dialer.css';
import './styles/admin.css';

import DialerLayout from "../Components/DialerLayout"

const Dialer = () => {
  const [searchByContact, setSearchByContact] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchByContact(e.target.value);
  };

  const handleOptionsClick = () => {
    setShowOptions(!showOptions);
    console.log('showOptions:', showOptions);
  };

  const handleOutsideClick = (e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);



  return (
    <div className="dialer-page">
      {/* <div className="dialer-header">
        Dialer ID/Name
        <div className="dialer-info">
          <h1 className="dialer-name">Dialer ID/Name</h1>
        </div>

        Search Box and Options
        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by contact"
              value={searchByContact}
              onChange={handleSearchChange}
            />
            <div className="search-icon">
              <i className="fas fa-search"></i>
            </div>
          </div>

          <div className="options"  ref={optionsRef}>
            <div className="option-icon" onClick={handleOptionsClick}>
              <i className="fas fa-bars"></i>
            </div>
            {showOptions && (
              <div className="options-dropdown">
                <ul>
                  <li className="option-title">Option 1</li>
                  <li className="option-title">Option 2</li>
                  <li className="option-title">Option 3</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Rest of the Dialer Page Content */}

      <div className="dialer-welcome-box">
        <div className="welcome-content">
          {/* <h1>Welcome to the Dialer</h1> */}
          {/* <p>Start making calls and connecting with your contacts.</p> */}
        </div>
        <div className="background-image"></div>
      </div>

      <div className="dialer-boxes">
        <div className="dialer-box">
          <a href="/dialer/tasks">
            <div className="box-icon">
              <i className="fas fa-bullhorn"></i>
            </div>
            <h2>Campaigns</h2>
          </a>
        </div>
        <div className="dialer-box">
          <a href="/dialer/leads">
            <div className="box-icon">
              <i className="fas fa-user"></i>
            </div>
            <h2>Leads</h2>
          </a>
        </div>
        <div className="dialer-box">
          <a href="/dialer/reports">
            <div className="box-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <h2>Reports</h2>
          </a>
        </div>
        <div className="dialer-box">
          <a href="/dialer/tasks">
            <div className="box-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <h2>Tasks</h2>
          </a>
        </div>
      </div>






    </div>
  );
};

export default function () {
  return (
    <DialerLayout>
      <Dialer />
    </DialerLayout>
  );
};
