import { useState, useEffect, useRef } from 'react';
import './styles/dialer-lead.css';
import DialerLayout from '../Components/DialerLayout.jsx';
import { toast } from 'react-toastify'
import { getLeads } from '../Utils/Requests/lead.requests';
import { sendResponse } from "../Utils/Requests/response.requests";


const DialerLead = () => {

  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [status, setStatus] = useState(null);
  const [formStatus, setFormStatus] = useState("Converted");
  const [responseBody, setResponseBody] = useState("");
  const [leads, setLeads] = useState({ 'Pending': [], 'Follow-up': [], 'Not-Connected': [] })
  const [buttonState, setButtonState] = useState('start');
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [stopTimestamp, setStopTimestamp] = useState(null);
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [followupdate, setfollowupdate] = useState();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef();
  const [isChange, setChange] = useState(false);
  const [notConnectedReason, setnotConnectedReason] = useState("busy");
  const [lostReason, setlostReason] = useState("incorrect-number");
  useEffect(() => {
    getLeads().then(res => {
      if (res) setLeads(res.leads)
    }).catch(err => console.log("ERR :", err))
  }, [isChange])
  console.log("Leads :", leads)

  const handleViewClick = (status) => {
    setStatus(status);
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


  const startTime = () => {
    setStartTimestamp(new Date());
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
  }
  const stopTimer = () => {
    setStopTimestamp(new Date());
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };



  const handleStartClick = async (e) => {
    e.preventDefault()
    if (buttonState === 'start') {

      e.target.style['background-color'] = 'red'
      startTime();
      setButtonState('stop');

    } else if (buttonState === 'stop') {

      e.target.style['background-color'] = 'green'
      stopTimer();
      setButtonState('send');

    } else if (buttonState === 'send') {
      e.target.style['background-color'] = 'blue'
      let data = {
        lead: selectedLead,
        status: formStatus,
        body: responseBody,
        startTime: startTimestamp,
        endTime: stopTimestamp,
        duration: elapsedTime,
        followupdate: followupdate,
        reason: ""
      }
      if (formStatus == "Not-Connected") data.reason = notConnectedReason
      else if (formStatus == "Lost") data.reason = lostReason
      const response = await sendResponse(data)
      if (response) {
        setIsRunning(false);
        setElapsedTime(0);
        setStartTimestamp(null)
        setStopTimestamp(null)
        setResponseBody("");
        clearInterval(intervalRef.current);
        setButtonState('start');
        setSelectedLead(null)
        setChange(!isChange)
        setStatus(false)
      }
    }
  };

  const handleResetClick = (e) => {
    e.preventDefault()
    setIsRunning(false);
    setElapsedTime(0);
    setStartTimestamp(null)
    setStopTimestamp(null)
    clearInterval(intervalRef.current);
    document.getElementById('start-button').style['background-color'] = 'blue'
    setButtonState('start');
    setSelectedLead(null)
    setResponseBody("")
  };

  const handleRowClick = (lead) => {
    setSelectedLead(lead);
  };




  return (
    <div className="dialer-page">
      <div className="leads-container">
        <div className="leads-box">
          <h2>New/Unattempted Leads</h2>
          <ul>
            {leads['Pending']?.map((lead) => (
              <li key={lead._id}>{lead.name}</li>
            ))}
          </ul>
          <div className="leads-actions">
            <button className="view-button" onClick={() => handleViewClick('Pending')}>View</button>
          </div>
        </div>
        <div className="leads-box">
          <h2>Follow-up Leads</h2>
          <ul>
            {leads['Follow-up']?.map((lead) => (
              <li key={lead.id}>{lead.name}</li>
            ))}
          </ul>
          <div className="leads-actions">
            <button className="view-button" onClick={() => handleViewClick('Follow-up')}>View</button>
          </div>
        </div>
        <div className="leads-box">
          <h2>Not Connected Leads</h2>
          <ul>
            {leads['Not-Connected']?.map((lead) => (
              <li key={lead.id}>{lead.name}</li>
            ))}
          </ul>
          <div className="leads-actions">
            <button className="view-button" onClick={() => handleViewClick('Not-Connected')}>View</button>
          </div>
        </div>


        {status && (
          <div className="overlapping-box">

            <div className="modal">
              <div className="modal-content">
                <h2>Lead Details</h2>
                <table className="lead-details-table">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Name</th>
                      <th>Contact Number</th>
                      <th>Body</th>
                      {status=='Follow-up'&&<th>Follow Up Date</th>}
                      {status=='Not-Connected'&&<th>Retry Time</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      leads[status]?.map((lead) => (
                        <tr key={lead._id} onClick={() => handleRowClick(lead)}>
                          <td>
                            <input
                              type="radio"
                              checked={selectedLead === lead}
                              onChange={() => handleRowClick(lead)}
                            />
                          </td>
                          <td>{lead.name}</td>
                          <td>{lead.contact}</td>
                          <td>{lead.body}</td>
                          {status=='Follow-up'&&<td>{lead.followupdate}</td>}
                          {status=='Not-Connected'&&<td>{lead.tryTime}</td>}
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <br />
                <form >
                  <div className="form-controls">
                    <select name="status" value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
                      <option value="Converted">Converted</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Not-Connected">Not-Connected</option>
                      <option value="Lost">Lost</option>
                    </select>


                    <input type="text" name="response" placeholder="Response Body"
                      value={responseBody}
                      onChange={(e) => setResponseBody(e.target.value)}
                    />


                  </div>
                  {formStatus == "Follow-up" && <><h4>Select Follow-up date</h4><input type='date' value={followupdate} onChange={(e) => setfollowupdate(e.target.value)} /></>}
                  {formStatus == "Not-Connected" &&
                    <>
                      <p>Reason for Not connecting</p>
                      <select name="notconnectedreason" value={notConnectedReason} onChange={(e) => setnotConnectedReason(e.target.value)}>
                        <option value="not-pick">Not picking</option>
                        <option value="busy">Busy</option>
                        <option value="user-disconnected">User Disconnected</option>
                        <option value="switch-off">Switch Off</option>
                        <option value="out-of-coverage-area">Out of coverage area</option>
                        <option value="incoming-not-available">Incoming not available</option>
                        <option value="out-of-service">Out of service</option>
                      </select>
                    </>
                  }
                  {formStatus == "Lost" &&
                    <>
                      <p>Reason for Lost</p>
                      <select name="lost" value={lostReason} onChange={(e) => { setlostReason(e.target.value) }}>
                        <option value="incorrect-number">Incorrect Number</option>
                        <option value="not-agree">Not Agree</option>
                      </select>
                    </>
                  }
                  <div className="form-actions">
                    <div className="button-container">
                      <button
                        id="start-button"
                        className={`start-button ${buttonState === 'start' ? 'active' : ''}`}
                        onClick={handleStartClick}
                      >
                        {buttonState === 'start' ? 'Start' : buttonState === 'stop' ? 'Stop' : 'Send'}
                      </button>

                      <h3>Duration : {formatTime(elapsedTime)}</h3>

                      <button className="reset-button" onClick={handleResetClick}>
                        Reset
                      </button>
                      <button className="close-button" onClick={() => {
                        setStatus(false)
                        setIsRunning(false);
                        setElapsedTime(0);
                        setStartTimestamp(null)
                        setStopTimestamp(null)
                        clearInterval(intervalRef.current);
                        document.getElementById('start-button').style['background-color'] = 'blue'
                        setButtonState('start');
                        setSelectedLead(null)
                        setResponseBody("")
                      }}>Close</button>
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
}