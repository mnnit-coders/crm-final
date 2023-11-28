import React, { useEffect, useState, useRef } from 'react';
import './styles/admin.css';
import './styles/reports-user-call-report.css';
import AdminLayout from '../Components/AdminLayout.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { getDialers } from "../Utils/Requests/org.requests";
import { getuserreport } from '../Utils/Requests/reports.requests.js'
const Reports_User_Call = () => {



  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [searchData, setSearchData] = useState({
    callshistory: [],
    convertedCalls: 0,
    lostCalls: 0,
    followupCalls: 0,
    notConnectedCalls: 0,
    inprogresscalls: 0,
    totalCallAttempted: 0,
    totalConnectedCalls: 0
  });
  useEffect(() => {

    getDialers().then(res => {
      console.log(res);
      if (res.length > 0) {
        setSelectedUser(res[0]._id);
      }
      setUsers(res)
    })


  }, [])







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










  const handleUserChange = (event) => {
    const value = event.target.value;
    setSelectedUser(value)
  };



  const handleClearAll = () => {
    setStartDate(null);
    setEndDate(null);
    setUser([]);

  };


  const applyFilter = () => {
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Selected Users:', users);
    getuserreport(startDate, endDate, selectedUser).then(res => {
      setSearchData(res);
    })
      .catch(err => toast("error while getting data"))
  };




  const userOptions = [
    { value: 'user1', label: 'User 1' },
    { value: 'user2', label: 'User 2' },
    // Add more users as needed
  ];




  const totalCallAttempted = 100;
  const totalCallConnected = 75;
  const totalNotConnected = 25;
  const totalInProgress = 10;
  const totalConverted = 20;
  const totalLost = 5;
  const totalWhatsAppSent = 30;










  return (
    <div className="reports-user-call-page">
      {/* <div className="reports-user-call-header">
            
            <div className="reports-user-call-info">
              <h1 className="reports-user-call">User Call Report</h1>
            </div>
    
        <button>Download Report</button>

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




      <div className="layout-container">

        <div className="left-block">
          <div className="filter-options">
            <h3>Filter Options</h3>
            <div className="date-range">
              <h4>Date Range</h4>
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

            </div>
            <div className="user-selection">
              <h4>User</h4>
              <select value={selectedUser} onChange={handleUserChange}>
                {users.map((data) => (
                  <option value={data._id} key={data._id}>{data.name}</option>
                ))}
              </select>





            </div>

            <div className="buttons">
              <button className="clear-button" onClick={handleClearAll}>Clear All</button>
              <button className="go-button" onClick={applyFilter}>Go</button>
            </div>

          </div>
        </div>



        <div className="right-block">
          <div className="statistics-boxes">
            <div className="statistics-box">
              <h6>Total Call Attempted</h6>
              <p>{searchData.totalCallAttempted}</p>
            </div>
            <div className="statistics-box">
              <h6>Total Call Connected</h6>
              <p>{searchData.totalConnectedCalls}</p>
            </div>
            <div className="statistics-box">
              <h6>Total Not Connected</h6>
              <p>{searchData.notConnectedCalls}</p>
            </div>
            <div className="statistics-box">
              <h6>Total In-Progress</h6>
              <p>{searchData.inprogresscalls}</p>
            </div>
            <div className="statistics-box">
              <h6>Total Follow up</h6>
              <p>{searchData.followupCalls}</p>
            </div>
            <div className="statistics-box">
              <h6>Total Converted</h6>
              <p>{searchData.convertedCalls}</p>
            </div>
            <div className="statistics-box">
              <h6>Total Lost leads</h6>
              <p>{searchData.lostCalls}</p>
            </div>
          </div>

          {searchData.callshistory.length>0?<div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Response</th>
                  <th>Status</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Duration</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {searchData.callshistory.map((data,index) => (
                  <>
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td>{data.body}</td>
                      <td>{data.status}</td>
                      <td>{data.startTime}</td>
                      <td>{data.endTime}</td>
                      <td>{data.duration}</td>
                      <td>{data.respondedAt}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div> :<><h1 style={{textAlign:'center'}}>No calls record available</h1></>}
          
        </div>




      </div>
    </div>








  )


};





export default function () {
  return (
    <AdminLayout>
      <Reports_User_Call />
    </AdminLayout>
  );
}