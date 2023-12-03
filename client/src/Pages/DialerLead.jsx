import React, { useState, useEffect, useRef } from 'react';
import './styles/dialer-lead.css';
import DialerLayout from '../Components/DialerLayout.jsx';
import { toast } from 'react-toastify'
import { getLeads } from '../Utils/Requests/lead.requests';
import { sendResponse } from "../Utils/Requests/response.requests";

const DialerLead = () => {
    
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    // const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [formStatus, setFormStatus] = useState("Pending");
    const [responseBody, setResponseBody] = useState("");
    // const [newLeads, setNewLeads] = useState([]);
    // const [followUpLeads, setFollowUpLeads] = useState([]);
    // const [notConnectedLeads, setNotConnectedLeads] = useState([]);
    const [leads, setLeads] = useState({'Pending':[], 'Follow-up':[], 'Not-Connected':[]})
    const [buttonState, setButtonState] = useState('start');
    // const startTime = useRef()
    // const endTime = useRef()

    useEffect(()=>{
      getLeads().then(res=>{
        if(res) setLeads(res.leads)
        console.log(res.leads)
      }).catch(err=>console.log("ERR :", err))
    },[])
    console.log("Leads :",leads)

    const handleViewClick = (lead) => {
        // setSelectedLead(lead);
        // Reset form status and response body
        // setFormStatus("Pending");
        // setResponseBody("");
      //dummy data
      setSelectedLead({
        name: 'John Doe',
        contact: '123-456-7890',
        body: 'Lorem ipsum ',
        status: 'Follow-up',
        lastResponse: 'Spoke to the lead.'
      });
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      const Response = {

      }
      sendResponse(Response)
      
      // setLeads(updatedLeads);
      setFormStatus("Pending");
      setResponseBody("");
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



      // const handleViewClick = (lead) => {
      //   // Implement logic to handle the "View" button
      //   console.log(`View clicked for lead: ${lead.name}`);
      // };
    
      const handleCallClick = (lead) => {
        // Implement logic to handle the "Start Calling" button
        console.log(`Start Calling clicked for lead: ${lead.name}`);
      };

      // const handleStartClick = () => {
      //   // Implement logic to handle the "Start" button click
      //   console.log("Start button clicked");
      // };

      
      const handleStopClick = () => {
        // Implement logic to handle the "Start" button click
        console.log("Stop button clicked");
      };
      



    //   useEffect(() => {
    //     // leads from the backend and update state
    //    
    //     const fetchLeads = async () => {
    //       try {
    //         const response = await fetch('your-backend-url');
    //         const data = await response.json();
    //         setNewLeads(data.newLeads);
    //         setFollowUpLeads(data.followUpLeads);
    //         setNotConnectedLeads(data.notConnectedLeads);
    //       } catch (error) {
    //         console.error('Error fetching leads:', error);
    //       }
    //     };
    
    //     fetchLeads();
    //   }, []);






      // Dummy lead data for each category
        const newLeads = [
            { id: 1, name: 'John Doe', status: 'New' },
            { id: 2, name: 'Jane Smith', status: 'New' },
            // Add more leads as needed
        ];

        const followUpLeads = [
            { id: 3, name: 'Alice Johnson', status: 'Follow-up' },
            { id: 4, name: 'Bob Williams', status: 'Follow-up' },
            // Add more leads as needed
        ];

        const notConnectedLeads = [
            { id: 5, name: 'Michael Brown', status: 'Not Connected' },
            { id: 6, name: 'Emily Davis', status: 'Not Connected' },
            // Add more leads as needed
        ];

        const handleStartClick = (e) => {
          if (buttonState === 'start') {
            e.target.style['background-color'] = 'red'
            // Logic to perform when Start button is clicked
            console.log('Start button clicked');
            setButtonState('stop');
          } else if (buttonState === 'stop') {
            e.target.style['background-color'] = 'green'
            // Logic to perform when Stop button is clicked
            console.log('Stop button clicked');
            setButtonState('send');
          } else if (buttonState === 'send') {
            e.target.style['background-color'] = 'blue'
            // Logic to perform when Send button is clicked
            console.log('Send button clicked');
            setButtonState('start');
          }
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



        <div className="leads-container">
                <div className="leads-box">
                    <h2>New/Unattempted Leads</h2>
                    {/* Display lead details */}
                    <ul>
                    {newLeads.map((lead) => (
                        <li key={lead.id}>{lead.name}</li>
                     ))}
                     </ul>
                    <div className="leads-actions">
                        <button className="view-button" onClick={() => handleViewClick(leads)}>View</button>
                        {/* <button className="call-button" onClick={() => handleCallClick(leads)}>Start Calling</button> */}
                    </div>
                </div>
                <div className="leads-box">
                    <h2>Follow-up Leads</h2>
                    {/* Display lead details */}
                    <ul>
                        {followUpLeads.map((lead) => (
                        <li key={lead.id}>{lead.name}</li>
                        ))}
                    </ul>
                    <div className="leads-actions">
                        <button className="view-button" onClick={() => handleViewClick(leads)}>View</button>
                        {/* <button className="call-button" onClick={() => handleCallClick(leads)}>Start Calling</button> */}
                    </div>
                </div>
                <div className="leads-box">
                    <h2>Not Connected Leads</h2>
                    {/* Display lead details */}
                    <ul>
                        {notConnectedLeads.map((lead) => (
                        <li key={lead.id}>{lead.name}</li>
                        ))}
                    </ul>
                    <div className="leads-actions">
                        <button className="view-button" onClick={() => handleViewClick(leads)}>View</button>
                        {/* <button className="call-button" onClick={() => handleCallClick(leads)}>Start Calling</button> */}
                    </div>
                </div>

            {selectedLead && (
        <div className="overlapping-box">

        <div className="modal">
          <div className="modal-content">
            <h2>Lead Details</h2>
            {/* Render the table with lead details */}
            {/* Use selectedLead to populate the table */}
           

          <table className="lead-details-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Number</th>
                <th>Body</th>
                {selectedLead.status === 'Follow-up' && <th>Last Response</th>}
              </tr>
            </thead>
            <tbody>
              {
                leads['Pending']?.map((lead) => {
                  return (
                    <tr key={lead.name}>
                      <td>{lead.name}</td>
                      <td>{lead.contact}</td>
                      <td>{lead.body}</td>
                      {lead.status === 'Follow-up' && <td>{lead.lastResponse}</td>}
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          <form onSubmit={handleFormSubmit}>
          <div className="form-controls">
            <select name="status" value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Not-Connected">Not-Connected</option>
              {/* Add more status options as needed */}
            </select>
            <input type="text" name="response" placeholder="Response Body" 
            value={responseBody}
            onChange={(e) => setResponseBody(e.target.value)}
            />
            </div>
            <div className="form-actions">
            <div className="button-container">


            <button
          className={`start-button ${buttonState === 'start' ? 'active' : ''}`}
          onClick={handleStartClick}
          // disabled={buttonState === 'send'} // Disable the button when it's in "send" state
        >
          {buttonState === 'start' ? 'Start' : buttonState === 'stop' ? 'Stop' : 'Send'}
        </button>


            {/* <button className="start-button" onClick={handleStartClick}>
                Start
              </button>
              <button className="stop-button" onClick={handleStopClick}>
                Stop
              </button>
            <button className="send-button" type="submit">Send</button>           */}
            <button className="close-button" onClick={() => setSelectedLead(null)}>Close</button>
            </div>
            </div>
          </form>
          </div>
        </div>
      </div>
        )}
     </div>

        </div>

);
};


export default function Leads() {
    return (
      <DialerLayout>
        <DialerLead />
      </DialerLayout>
    );
  };