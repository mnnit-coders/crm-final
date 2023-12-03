import React, { useState, useEffect, useRef } from 'react';
import './styles/dialer.css';
import './styles/dialer-report.css';
import DialerLayout from '../Components/DialerLayout.jsx';


const DialerReport = () => {
    
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const [filteredLoginData, setFilteredLoginData] = useState([]);
    const [filteredCallData, setFilteredCallData] = useState([]);

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




   // Fetch team member data from the backend
   useEffect(() => {
    // Replace with API call to fetch team member data
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('TEAM_MEMBERS_API_ENDPOINT');
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team member data:', error);
      }
    };

    fetchTeamMembers();
  }, []);



   // Fetch login report data from the backend
   useEffect(() => {
    // Replace with  API call to fetch login report data
    const fetchLoginData = async () => {
      try {
        const response = await fetch('LOGIN_REPORT_API_ENDPOINT');
        const data = await response.json();
        setLoginData(data);
      } catch (error) {
        console.error('Error fetching login report data:', error);
      }
    };

    fetchLoginData();
  }, []);





   // Fetch call report data from the backend
   useEffect(() => {
    // Replace with  API call to fetch call report data
    const fetchCallData = async () => {
      try {
        const response = await fetch('CALL_REPORT_API_ENDPOINT');
        const data = await response.json();
        setCallData(data);
      } catch (error) {
        console.error('Error fetching call report data:', error);
      }
    };

    fetchCallData();
  }, []);



    // Function to handle filtering based on team member and date
    const handleFilterClick = () => {
      // Implement your filtering logic here
      // For example, filter loginData and callData based on selectedTeamMember and selectedDate
      const filteredLogin = loginData.filter((item) => {
        // Example filtering logic, you can replace this with your actual logic
        return (
          (!teamMember || item.teamMember === teamMember) &&
          (!selectedDate || item.date === selectedDate)
        );
      });
  
      const filteredCall = callData.filter((item) => {
        // Example filtering logic, you can replace this with your actual logic
        return (
          (!teamMember || item.teamMember === teamMember) &&
          (!selectedDate || item.date === selectedDate)
        );
      });
  
      // Update the filtered data states
      setFilteredLoginData(filteredLogin);
      setFilteredCallData(filteredCall);
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
       {/* Filter Box */}
       <div className="filter-box">
       <h2>Filter</h2>
        {/* <div className="filter-section">
          <label htmlFor="teamMember">Team Member:</label>
          <select id="teamMember" value={teamMember} onChange={handleTeamMemberChange}>
           
            <option value="">Select</option>
            <option value="user1">User 1</option>
            <option value="user2">User 2</option>
            
          </select>
        </div> */}
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
              <th>Time</th>
              <th>Activity</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoginData.map((item, index) => (
              <tr key={index}>
                <td>{item.time}</td>
                <td>{item.activity}</td>
                <td>{item.description}</td>
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
          <span className="call-value">{filteredCallData.attempted}</span>
          
        </div>
        <div className="call-stat">
        <span className="call-label">Call Connected: </span>
          <span className="call-value">{filteredCallData.connected}</span>
          
        </div>
        <div className="call-stat">
        <span className="call-label">Call Time: </span>
          <span className="call-value">{filteredCallData.callTime}</span>
          
        </div>
        <div className="call-stat">
        <span className="call-label">Avg Call Duration: </span>
          <span className="call-value">{filteredCallData.avgDuration}</span>
          
        </div>
      </div>
    </div>
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
  