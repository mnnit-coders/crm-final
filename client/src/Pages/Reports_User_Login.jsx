import React, { useEffect, useState, useRef } from 'react';
import './styles/admin.css';
import './styles/reports-login-report.css';
import AdminLayout from '../Components/AdminLayout.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import { toast } from 'react-toastify';





const Reports_User_Login = () => {



    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedUser, setSelectedUser] = useState("");
    const [hourlyData, setHourlyData] = useState([]);
    const [dailyData, setDailyData] = useState([]);





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



        // Handle user selection change
            const handleUserChange = (event) => {
                setSelectedUser(event.target.value);
            };

            // Handle filter button click
            const handleFilter = () => {
                console.log('Start Date:', startDate);
                console.log('End Date:', endDate);
                console.log('Selected User:', selectedUser);
                // Add code to fetch and display filtered data here
            };



            useEffect(() => {
                // Function to fetch hourly data from the backend API
                const fetchHourlyData = async () => {
                  try {
                    const response = await fetch('backend_api_url/hourly_report');
                    if (response.ok) {
                      const data = await response.json();
                      setHourlyData(data); // Update the state with fetched data
                    } else {
                      console.error('Failed to fetch hourly data');
                    }
                  } catch (error) {
                    console.error('Error fetching hourly data:', error);
                  }
                };
            
                fetchHourlyData(); // Call the function when the component mounts
              }, []);


              useEffect(() => {
                // Function to fetch daily data from the backend API
                const fetchDailyData = async () => {
                  try {
                    const response = await fetch('backend_api_url/daily_report');
                    if (response.ok) {
                      const data = await response.json();
                      setDailyData(data); // Update the state with fetched daily data
                    } else {
                      console.error('Failed to fetch daily data');
                    }
                  } catch (error) {
                    console.error('Error fetching daily data:', error);
                  }
                };
            
                fetchDailyData(); // Call the function when the component mounts
              }, []);




              const handleFilterClick = () => {
                // Function to fetch filtered data based on startDate, endDate, and selectedUser
                const fetchFilteredData = async () => {
                  try {
                    const response = await fetch(
                      `backend_api_url/filter_report?startDate=${startDate}&endDate=${endDate}&user=${selectedUser}`
                    );
                    if (response.ok) {
                      const data = await response.json();
                      setFilteredData(data); // Update the state with filtered data
                    } else {
                      console.error('Failed to fetch filtered data');
                    }
                  } catch (error) {
                    console.error('Error fetching filtered data:', error);
                  }
                };
            
                fetchFilteredData(); // Call the function when the Go button is clicked
              };


              



      return (
        <div className="reports-user-login-page">
          <div className="reports-user-login-header">
            
            <div className="reports-user-login-info">
              <h1 className="reports-user-login">User Call Report</h1>
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
            </div>




                  {/* First Block: Hourly Report */}
                  <div className="hourly-report">
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
                        {/* Add more rows for each hour */}
                        </tbody>
                    </table>
                    </div>


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
          {/* Populate user options */}
          <option value="">Select User</option>
          <option value="user1">User 1</option>
          <option value="user2">User 2</option>
          {/* Add more users as needed */}
        </select>
        <button onClick={handleFilter}>Go</button>
      </div>

      {/* Third Block: Daily Login Period Report */}
      <div className="daily-report">
        <h2>Daily User Login Report</h2>
        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Total Logins</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>2023-09-14</td>
                <td>150</td>
            </tr>
            <tr>
                <td>2023-09-13</td>
                <td>120</td>
            </tr>
            {/* Add more rows for each day */}
            </tbody>
        </table>
        </div>





</div>







);









    };





    export default function(){
        return (
            <AdminLayout>
                <Reports_User_Login />
            </AdminLayout>
        );
      }