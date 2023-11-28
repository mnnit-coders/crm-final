import React, { useState, useEffect, useRef } from 'react';
import './styles/dialer-task.css';

import DialerLayout from "../Components/DialerLayout"


const DialerTask = () => {
    
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const [taskStatusOptions, setTaskStatusOptions] = useState([]);
    const [campaignOptions, setCampaignOptions] = useState([]);
    const [reportOptions, setReportOptions] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [selectedReport, setSelectedReport] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);


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
    

      const handleTaskClick = (task) => {
        setSelectedTask(task);
        // Fetch task details based on selected task
      };


      const fetchFilterOptions = async () => {
        try {
          // Fetch filter options from the backend
          const response = await fetch('your_backend_api_url_here');
          const data = await response.json();
          setTaskStatusOptions(data.taskStatus);
          setCampaignOptions(data.campaigns);
          setReportOptions(data.reports);
        } catch (error) {
          console.error('Error fetching filter options:', error);
        }
      };
    
      useEffect(() => {
        fetchFilterOptions();
      }, []);
    
      const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
      };
    
      const handleCampaignChange = (e) => {
        setSelectedCampaign(e.target.value);
      };
    
      const handleReportChange = (e) => {
        setSelectedReport(e.target.value);
      };
    
      const handleSelectAll = () => {
        // Implement select all logic
      };



    // Sample data for selected task (replace this with actual fetched data)
  const sampleSelectedTask = {
    id: 1,
    taskName: 'Sample Task',
    description: 'This is a sample task description.',
    status: 'Pending',
    campaign: 'Sample Campaign',
    report: 'Sample Report',
  };

  useEffect(() => {
    // Fetch selected task details based on the selectedTaskId
    // For now, using sample data
    setSelectedTask(sampleSelectedTask);
  }, []);









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


        <div className="dialer-tasks-page">
        {/* Filter Box */}
        <div className="dialer-tasks-filter">
          {/* <div className="filter-section">
            <label htmlFor="taskStatus">Task Status:</label>
            <select id="taskStatus"  value={selectedStatus} onChange={handleStatusChange}>
              Add task status options
              <option value="">Select</option>

              {taskStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
                ))}

              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              Add more options as needed
            </select>
          </div> */}
          <div className="filter-section">
            <label htmlFor="campaignName">Campaign Name:</label>

            <select id="campaign" value={selectedCampaign} onChange={handleCampaignChange}>
            <option value="">Select</option>
            {campaignOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
                ))}
            </select>

          </div>
          {/* <div className="filter-section">
            <label htmlFor="reportName">Report Name:</label>

            <select id="report" value={selectedReport} onChange={handleReportChange}>
            <option value="">Select</option>
            {reportOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
                ))}
            </select>

          </div> */}
          <div className="filter-section">
            <button className="filter-button" onClick={handleSelectAll}>Select All</button>
          </div>
        </div>







        {/* Task Details */}
        <div className="dialer-tasks-list">
          {/* Map through tasks and display task details */}

        

          <div className="dialer-task-details">
          {/* Task Details Container */}
          {selectedTask && (
            <div className="task-details">
              <h2>Task Details</h2>
              <p><strong>Task Name:</strong> {selectedTask.taskName}</p>
              <p><strong>Description:</strong> {selectedTask.description}</p>
              <p><strong>Status:</strong> {selectedTask.status}</p>
              <p><strong>Campaign:</strong> {selectedTask.campaign}</p>
              <p><strong>Report:</strong> {selectedTask.report}</p>
            </div>
          )}
        </div>



        </div>
      </div>






        </div>
);
};

export default function () {
    return (
      <DialerLayout>
        <DialerTask />
      </DialerLayout>
    );
  };