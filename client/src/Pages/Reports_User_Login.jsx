import React, { useEffect, useState, useRef } from 'react';
import './styles/admin.css';
import './styles/reports-login-report.css';
import AdminLayout from '../Components/AdminLayout.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

import { getDialers } from "../Utils/Requests/org.requests";
import { getLoginDetailsforAdmin } from "../Utils/Requests/reports.requests.js";



const Reports_User_Login = () => {



  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchresult, setSearchResult] = useState([]);


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

  useEffect(() => {

    getDialers().then(res => {
      console.log(res);
      if (res.length > 0) {
        setSelectedUser(res[0]._id);
      }
      setUsers(res)
    })


  }, [])


  // Handle user selection change
  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  // Handle filter button click
  const handleFilter = () => {
    getLoginDetailsforAdmin(startDate, endDate, selectedUser).then(res => {
      console.log(res)
      setSearchResult(res)
    }).catch(err => toast("error while getting report"))
  };



  


  
  return (
    <div className="reports-user-login-page">
      <div className="reports-user-login-header">

        <div className="reports-user-login-info">
          <h1 className="reports-user-login">User Call Report</h1>
        </div>

        {/* <button>Download Report</button>

        <div className="options" ref={optionsRef}>
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
        </div> */}
      </div>

      <br />


      {/* First Block: Hourly Report */}
      {/* <div className="hourly-report">
        <h2>Hourly User Login Report</h2>
        <table>
          <thead>
            <tr>
              <th>Hour</th>
              <th>Number of Logins</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>00:00 - 01:00</td>
              <td>25</td>
            </tr>
            <tr>
              <td>01:00 - 02:00</td>
              <td>32</td>
            </tr>
          </tbody>
        </table>
      </div> */}


      {/* Second Block: Filter */}
      <div className="filter-section">
        <h2>Filter</h2>
        <div className="date-picker">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
          />
        </div>
        <select value={selectedUser} onChange={handleUserChange}>
          {users.map((data) => (
            <option value={data._id} key={data._id}>{data.name}</option>
          ))}
        </select>
        <button onClick={handleFilter}>Go</button>
      </div>

      {/* Third Block: Daily Login Period Report */}
      <div className="daily-report">
        {searchresult.length == 0 ?
          <><h3 style={{ textAlign: 'center' }}>No history available</h3></> :

          <><h2>Daily User Login Report</h2>
            <table>
              <thead>
                <tr>
                  <th>Logged in</th>
                  <th>Logout At</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {searchresult.map((item, index) => (
                  <tr key={index}>
                    <td>{item.loginAt}</td>
                    <td>{item.logoutAt}</td>
                    <td>{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table></>}

      </div>





    </div>







  );









};





export default function () {
  return (
    <AdminLayout>
      <Reports_User_Login />
    </AdminLayout>
  );
}