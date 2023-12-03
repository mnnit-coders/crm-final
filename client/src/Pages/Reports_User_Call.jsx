import React, { useEffect, useState, useRef } from 'react';
import './styles/admin.css';
import './styles/reports-user-call-report.css';
import AdminLayout from '../Components/AdminLayout.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import { toast } from 'react-toastify';



const Reports_User_Call = () => {



    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [users, setUsers] = useState([]);









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
        if (userTypes.includes(value)) {
          setUserTypes(userTypes.filter((type) => type !== value));
        } else {
          setUserTypes([...userTypes, value]);
        }
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
            {/* Date range input here */}

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
            {/* Replace with data from backend */}



          
         
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
                <p>{totalCallAttempted}</p>
              </div>
              <div className="statistics-box">
                <h6>Total Call Connected</h6>
                <p>{totalCallConnected}</p>
              </div>
              <div className="statistics-box">
                <h6>Total Not Connected</h6>
                <p>{totalNotConnected}</p>
              </div>
              <div className="statistics-box">
                <h6>Total In-Progress</h6>
                <p>{totalInProgress}</p>
              </div>
              <div className="statistics-box">
                <h6>Total Converted</h6>
                <p>{totalConverted}</p>
              </div>
              <div className="statistics-box">
                <h6>Total Lost</h6>
                <p>{totalLost}</p>
              </div>
            </div>


          <div className="table-container"> 
            <table className="data-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Total Call Attempted</th>
                  <th>Total Call Connected</th>
                  <th>Total Calls Not Connected</th>
                  <th>Total In-Progress Leads</th>
                  <th>Total Converted Leads</th>
                  <th>Total Lost Leads</th>
                  <th>Start Calling Time</th>
                  <th>Total WhatsApp Sent</th>
                  <th>Total Call Time</th>
                  <th>Avg. Call Duration</th>
                  <th>Avg. Form Filling Time</th>
                </tr>
              </thead>
              <tbody>
                {/* Add your table rows here */}
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>2023-09-14</td>
                  <td>50</td>
                  <td>30</td>
                  <td>10</td>
                  <td>5</td>
                  <td>10</td>
                  <td>5</td>
                  <td>09:00 AM</td>
                  <td>20</td>
                  <td>120 min</td>
                  <td>4 min</td>
                  <td>2 min</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>2023-09-14</td>
                  <td>50</td>
                  <td>30</td>
                  <td>10</td>
                  <td>5</td>
                  <td>10</td>
                  <td>5</td>
                  <td>09:00 AM</td>
                  <td>20</td>
                  <td>120 min</td>
                  <td>4 min</td>
                  <td>2 min</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>2023-09-14</td>
                  <td>50</td>
                  <td>30</td>
                  <td>10</td>
                  <td>5</td>
                  <td>10</td>
                  <td>5</td>
                  <td>09:00 AM</td>
                  <td>20</td>
                  <td>120 min</td>
                  <td>4 min</td>
                  <td>2 min</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>2023-09-14</td>
                  <td>50</td>
                  <td>30</td>
                  <td>10</td>
                  <td>5</td>
                  <td>10</td>
                  <td>5</td>
                  <td>09:00 AM</td>
                  <td>20</td>
                  <td>120 min</td>
                  <td>4 min</td>
                  <td>2 min</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>2023-09-14</td>
                  <td>50</td>
                  <td>30</td>
                  <td>10</td>
                  <td>5</td>
                  <td>10</td>
                  <td>5</td>
                  <td>09:00 AM</td>
                  <td>20</td>
                  <td>120 min</td>
                  <td>4 min</td>
                  <td>2 min</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>2023-09-14</td>
                  <td>50</td>
                  <td>30</td>
                  <td>10</td>
                  <td>5</td>
                  <td>10</td>
                  <td>5</td>
                  <td>09:00 AM</td>
                  <td>20</td>
                  <td>120 min</td>
                  <td>4 min</td>
                  <td>2 min</td>
                </tr>
                
                {/* Add more table rows as needed */}
              </tbody>
            </table>
          </div>
          </div>




            </div>
        </div>
    




        


)


};





export default function(){
    return (
        <AdminLayout>
          <Reports_User_Call />
        </AdminLayout>
    );
  }