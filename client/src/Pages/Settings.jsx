import React, { useState, useRef, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../Components/AdminLayout.jsx';
import './styles/Settings.css'; // Import your CSS file for styling
import {toast} from 'react-toastify';

import { updateCampaign } from '../Utils/Requests/campaign.requests.js';

const Settings = () => {
  const [mappingOptions, setMappingOptions] = useState([
    { label: 'Manually Assigned Leads', priority: 'highest' },
    { label: 'Leads Assigned to User', priority: 'high', draggable: true },
    { label: 'New/Unattempted Leads', priority: 'medium', draggable: true },
    { label: 'Not Connected Leads', priority: 'low', draggable: true },
  ]);

  const handleDrop = (e, targetPriority) => {
    e.preventDefault();
    const optionLabel = e.dataTransfer.getData('optionLabel');
    const optionToMove = mappingOptions.find(
      (option) => option.label === optionLabel
    );
    const updatedMapping = mappingOptions.map((option) =>
      option.label === optionLabel
        ? { ...option, priority: targetPriority }
        : option.priority === targetPriority
        ? { ...option, priority: optionToMove.priority }
        : option
    );
    setMappingOptions(updatedMapping);
  };

  const handleDrag = (e, optionLabel) => {
    e.dataTransfer.setData('optionLabel', optionLabel);
  };

  const renderPriorityOptions = (priority) => {
    return mappingOptions
      .filter((option) => option.priority === priority)
      .map((option) => (
        <div
          key={option.label}
          className={`mapping-option ${option.priority}`}
          onDragStart={(e) => handleDrag(e, option.label)}
          draggable={option.draggable}
        >
        {option.draggable && (
            <div className="draggable-icon">
              <FontAwesomeIcon icon={faArrowsAlt} />
            </div>
          )}
             {option.label}
        </div>
      ));
  };





  
    const [settings, setSettings] = useState({
      "Not-picked": {
        retryEnabled: true,
        retryAfter: [5, 'minute'],
        maxTries: 3
      },
      "Busy": {
        retryEnabled: true,
        retryAfter: [5, 'minute'],
        maxTries: 3
      },
      
      "User-Disconnected": {
        "retryEnabled": true,
        "retryAfter": [ 5, 'minute'],
        "maxTries": 3
      }, 
      "Switch-off": {
        "retryEnabled": true,
        "retryAfter": [ 5, 'minute'],
        "maxTries": 3
      }, 
    "Out-of-coverage-area":{
        "retryEnabled": true,
        "retryAfter": [ 5, 'minute'],
        "maxTries": 3                    
    }, 
    "Incorrect-number":{
        "retryEnabled": true,
        "retryAfter": [ 5, 'minute'],
        "maxTries": 3
    }, 
    "Incoming-not-available":{
        "retryEnabled": true,
        "retryAfter": [ 5, 'minute'],
        "maxTries": 3
    }, 
    "Out-of-service":{
        "retryEnabled": true,
        "retryAfter": [ 5, 'minute'],
        "maxTries": 3
    }
      // ... (repeat for other scenarios)
    });


  const handleSettingChange = (scenario, key, value) => {
    


    setSettings((prevSettings) => ({
      ...prevSettings,
      [scenario]: {
        ...prevSettings[scenario],
        [key]: value
      }
    }));
  };




    // Function to handle the submit button click
    const handleSubmit = () => {
      console.log(settings);
      toast.success('Settings have been applied.'); // Display an alert or perform any other desired action.
    };





  const renderSettingInputs = () => {
    return Object.entries(settings).map(([scenario, options]) => (
      <div key={scenario} className="setting-input">
        <h3>{scenario}</h3>
        <label>
          Retry Enabled:
          <input
            type="checkbox"
            checked={options.retryEnabled}
            onChange={(e) =>
              handleSettingChange(scenario, 'retryEnabled', e.target.checked)
            }
          />
        </label>
        <label>
          Retry After:
          <select
          value={options.retryAfter[0]}
          onChange={(e) =>
            handleSettingChange(scenario, 'retryAfter', [
              parseInt(e.target.value),
              options.retryAfter[1]
            ])
          }
        >
          <option value={5}>5 minutes</option>
          <option value={10}>10 minutes</option>
          <option value={15}>15 minutes</option>
          <option value={1}>1 hour</option>
          <option value={6}>6 hours</option>
          <option value={24}>24 hours</option>
          <option value={1 * 24 * 60}>1 day</option>
          <option value={7 * 24 * 60}>7 days</option>
        </select>
        </label>

        <label>
            Max Tries:
            <input
                type="number"
                value={options.maxTries}
                onChange={(e) =>
                handleSettingChange(scenario, 'maxTries', parseInt(e.target.value))
                }
            />
        </label>

        {/* You can add similar inputs for other properties */}
      </div>
    ));
  };





  const [selectedEmailProvider, setSelectedEmailProvider] = useState('gmail');
  const emailProviders = ['gmail', 'hotmail', 'yahoo', 'custom'];



  const renderEmailFields = () => {
    if (selectedEmailProvider === 'custom') {
      return (
        <div className="custom-email-fields">
          <label>Email:</label>
          <input type="text" placeholder="Enter your email" />
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" />
        </div>
      );
    } else {
      return (
        <div className="default-email-fields">
          <label>Email:</label>
          <input type="text" placeholder={`Enter your ${selectedEmailProvider} email`} />
          <label>Password:</label>
          <input type="password" placeholder={`Enter your ${selectedEmailProvider} password`} />
        </div>
      );
    }
  };




  return (
    <div className="settings-container">
    <h2>Set Priority to Leads</h2>
      <div className="settings-block">
        
        <div className="mapping-interface">
          <div className="priority-column">
            <div className="priority-option highest">Highest</div>
            <div className="priority-option high">High</div>
            <div className="priority-option medium">Medium</div>
            <div className="priority-option low">Low</div>
          </div>
          <div className="mapping-column">
            <div
              className="priority-mapping highest"
              onDrop={(e) => handleDrop(e, 'highest')}
              onDragOver={(e) => e.preventDefault()}
            >
              {renderPriorityOptions('highest')}
            </div>
            <div
              className="priority-mapping high"
              onDrop={(e) => handleDrop(e, 'high')}
              onDragOver={(e) => e.preventDefault()}
            >
              {renderPriorityOptions('high')}
            </div>
            <div
              className="priority-mapping medium"
              onDrop={(e) => handleDrop(e, 'medium')}
              onDragOver={(e) => e.preventDefault()}
            >
              {renderPriorityOptions('medium')}
            </div>
            <div
              className="priority-mapping low"
              onDrop={(e) => handleDrop(e, 'low')}
              onDragOver={(e) => e.preventDefault()}
            >
              {renderPriorityOptions('low')}
            </div>
          </div>
        </div>
      </div>


      <h2>Not Connected Call Settings</h2> 
      <div className="not-connected-call-settings">            
        {renderSettingInputs()}
        {/* The rest of your Not Connected Call Settings JSX */}
      </div>




      {/* <h2>Choose Your Email Provider</h2>
      <div className="email-provider-settings">
        <select
          value={selectedEmailProvider}
          onChange={(e) => setSelectedEmailProvider(e.target.value)}
        >
          {emailProviders.map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>
        {renderEmailFields()}
      </div> */}


      <button
        onClick={handleSubmit}
        className="submit-button"
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '50px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px',
        }}
      >
        SUBMIT
      </button>
    



    </div>
  );
};

export default function() {
  return (
    <AdminLayout>
      <Settings />
    </AdminLayout>
  );
}
