import React, { useState, useRef, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../Components/AdminLayout.jsx';
import './styles/Settings.css'; // Import your CSS file for styling
import { toast } from 'react-toastify';
import { getDialers } from '../Utils/Requests/org.requests.js';
import { updateCampaign,getCampaignByID } from '../Utils/Requests/campaign.requests.js';
import { useParams } from 'react-router-dom';
const Settings = () => {
  const {id}=useParams();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [members, setMembers] = useState([]);
  const [selectMembers, setselectMembers] = useState([]);

  const handleCheckboxChange = (email) => {
    const updatedSelectedCheckboxes = [...selectMembers];
    if (updatedSelectedCheckboxes.includes(email)) {
      updatedSelectedCheckboxes.splice(updatedSelectedCheckboxes.indexOf(email), 1);
    } else {
      updatedSelectedCheckboxes.push(email);
    }
    setselectMembers(updatedSelectedCheckboxes);
  };



  useEffect(() => {
    getDialers().then(res => {
      setMembers(res)
    })
    getCampaignByID(id).then(res=>{
      console.log(res)
      setName(res.name)
      setselectMembers(res.members)
      setCategory(res.category)
      setSettings(res.settings.NotConnected)
    })
  }, []);


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
      "retryAfter": [5, 'minute'],
      "maxTries": 3
    },
    "Switch-off": {
      "retryEnabled": true,
      "retryAfter": [5, 'minute'],
      "maxTries": 3
    },
    "Out-of-coverage-area": {
      "retryEnabled": true,
      "retryAfter": [5, 'minute'],
      "maxTries": 3
    },
    "Incorrect-number": {
      "retryEnabled": true,
      "retryAfter": [5, 'minute'],
      "maxTries": 3
    },
    "Incoming-not-available": {
      "retryEnabled": true,
      "retryAfter": [5, 'minute'],
      "maxTries": 3
    },
    "Out-of-service": {
      "retryEnabled": true,
      "retryAfter": [5, 'minute'],
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
    var newmember=members.map((data)=>{
      return data.email
    })
    const updatedCampaign={
      campID:id,
      name:name,
      members:newmember,
      category:category,
      newSettings:settings
    }
    updateCampaign(updatedCampaign)
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
                'minute'
              ])
            }
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={60}>1 hour</option>
            <option value={6*60}>6 hours</option>
            <option value={1 * 24 * 60}>1 day</option>
            <option value={2 * 24 * 60}>2 day</option>
            <option value={3 * 24 * 60}>3 day</option>
            <option value={4 * 24 * 60}>4 day</option>
            <option value={5 * 24 * 60}>5 day</option>
            <option value={6 * 24 * 60}>6 day</option>
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
      <h2>Name, Member, and Category Settings</h2>
      <div className="name-member-category-settings">
        <div className="name-setting">
          <label>Name:</label>
          <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="member-setting">
          <label>Select Members:</label>
          {members.length==0?<><h6>No Members</h6></>:<ul>
            {
              members.map((user, index) => {
                return <div key={index}>
                  <input key={index} type="checkbox" value={user.email} checked={selectMembers.includes(user.email)} onChange={() => handleCheckboxChange(user.email)} />
                  <span>{user.name}</span>
                </div>
              })
            }
          </ul>}
          
        </div>
        <div className="category-setting">
          <label>Category:</label>
          <input type="text" placeholder="Enter category" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
      </div>



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

export default function () {
  return (
    <AdminLayout>
      <Settings />
    </AdminLayout>
  );
}
