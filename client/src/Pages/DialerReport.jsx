import React, { useState, useEffect, useRef } from 'react';
import './styles/dialer.css';
import './styles/dialer-report.css';
import DialerLayout from '../Components/DialerLayout.jsx';
import { getCallReport, getLoginReport, getDialerCallRecord } from '../Utils/Requests/reports.requests.js';
import { toast } from 'react-toastify';

const DialerReport = () => {

  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const [filteredLoginData, setFilteredLoginData] = useState([{
    time: 120, activity: 'game', description: 'playing', logout: 20
  },
  ]);
  const [callRecord, setCallRecord] = useState([]);

  const [filteredCallData, setFilteredCallData] = useState({});

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



  const [teamMember, setTeamMember] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleTeamMemberChange = (e) => {
    setTeamMember(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };




  // loginData array
  const loginData = [
    { time: '09:00 AM', activity: 'Login', description: 'Logged in to the system' },
    { time: '10:30 AM', activity: 'Logout', description: 'Logged out from the system' },
    // Add more data as needed
  ];





  //callData object
  const callData = {
    attempted: 50,
    connected: 30,
    callTime: '12:30:00',
    avgDuration: '00:04:30',
  };

















  // Function to handle filtering based on team member and date
  const handleFilterClick = async (e) => {
    e.preventDefault();
    if (!selectedDate) return toast.warning('Select Date')
    const loginResponse = await getLoginReport(selectedDate);
    const callResponse = await getCallReport(selectedDate);
    const callRecords = await getDialerCallRecord(selectedDate);
    setCallRecord(callRecords)
    setFilteredCallData(callResponse)
    setFilteredLoginData(loginResponse);
    // setFilteredCallData(filteredCall);
  };







  return (
    <div className="dialer-page">
      {/* <div className="dialer-header">
        Dialer ID/Name
        <div className="dialer-info">
          <h1 className="dialer-name">User</h1>
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
        </div> */}








      <div className="dialer-report-page">
        <div className="filter-box">
          <h2>Filter</h2>
          <div className="filter-section">
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" value={selectedDate} onChange={handleDateChange} />
          </div>
          <div className="filter-section">
            <button className="filter-button" onClick={handleFilterClick}>
              Go
            </button>
          </div>
        </div>


        {/* Login Report Box */}
        <div className="login-report-box">
          <h2>Login Report</h2>
          {filteredLoginData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Login At</th>
                  <th>Logout At</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoginData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.loginAt}</td>
                    <td>{item.logoutAt}</td>
                    <td>{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No history found</p>
          )}
          {/* Add Total Break field */}
        </div>

        {/* Call Report Box */}
        <div className="call-report-box" >
          <h2>Call Report</h2>
          <div className="call-data">
            <div className="call-stat">
              <span className="call-label">Call Attempted: </span>
              <span className="call-value">{filteredCallData.callAttempted}</span>

            </div>
            <div className="call-stat">
              <span className="call-label">Call Connected: </span>
              <span className="call-value">{filteredCallData.callConnected}</span>

            </div>
            <div className="call-stat">
              <span className="call-label">Total Call Time: </span>
              <span className="call-value">{filteredCallData.callDuration}</span>

            </div>
            <div className="call-stat">
              <span className="call-label">Avg Call Duration: </span>
              <span className="call-value">{filteredCallData.avgCallDuration}</span>

            </div>
          </div>
        </div>
      </div>


      <div className="daily-report">
        {callRecord.length == 0 ?
          <><h3 style={{ textAlign: 'center' }}>No history available</h3></> :

          <><h2>Call Records</h2>
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Body</th>
                  <th>Status</th>
                  <th>Started At</th>
                  <th>End At</th>
                  <th>Duration(in second)</th>
                  <th>Responded At</th>
                </tr>
              </thead>
              <tbody>
                {callRecord.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.body}</td>
                    <td>{item.status}</td>
                    <td>{item.startTime}</td>
                    <td>{item.endTime}</td>
                    <td>{item.duration}</td>
                    <td>{item.respondedAt}</td>
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
    <DialerLayout>
      <DialerReport />
    </DialerLayout>
  );
};
