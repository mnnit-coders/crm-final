import React, { useEffect, useState, useRef } from 'react';
import './styles/admin.css';
import './styles/reports-campaign-lead.css';
import AdminLayout from '../Components/AdminLayout.jsx';
import { toast } from 'react-toastify';
import { getCampaignsList } from '../Utils/Requests/campaign.requests';
import { getCampaignStatistics } from '../Utils/Requests/reports.requests';

const Reports_Campaign_Lead = () => {


    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);

    const [campaignList, setCampaignList] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [leadSummary, setLeadSummary] = useState({
      open: 0,
      inProgress: 0,
      closed: 0,
      total: 0,
    });
    const [leadSummaryDetails, setLeadSummaryDetails] = useState({
      open: 0,
      inProgress: 0,
      closed: 0,
      total: 0,
    })

    useEffect(()=>{
      const campaigns = getCampaignsList().then(res=> setCampaignList(res))
    },[])

    const updateStatistics = (id) => {
      if (!id || id === '') {
        toast.warning('Please select a campaign');
      }
      getCampaignStatistics(id)
        .then((res) => {
          // const stats = [];
          setLeadSummary({
            open: res.statusCounts['Pending'],
            inProgress :res.statusCounts['Follow-Up']+res.statusCounts['Not-Connected'],
            closed: res.statusCounts['Lost']+res.statusCounts['Closed'],
            total: res.statusCounts['Pending']+res.statusCounts['Follow-Up']+res.statusCounts['Not-Connected']+res.statusCounts['Lost']+res.statusCounts['Closed'],
          })
          setLeadSummaryDetails({

          })
          // setInProgressData([
          //   { name: 'Not Connected', value: res.statusCounts['Follow-Up'] },
          //   { name: 'Follow-up', value: res.statusCounts['Not-Connected'] },
          // ])
          // setClosedLeadsData([
          //   { name: 'Lost', value: res.statusCounts['Lost'] },
          //   { name: 'Closed', value: res.statusCounts['Closed'] },
          // ])
          // setLeadDistribution(Object.keys(res.assignedCounts).map((idx, person)=>{
          //   return {
          //     name: person,
          //     values: [
          //       res.assignedCounts[person]['Pending'],
          //       res.assignedCounts[person]['Follow-Up'],
          //       res.assignedCounts[person]['Not-Connected'],
          //       res.assignedCounts[person]['Lost'],
          //       res.assignedCounts[person]['Closed'],
          //     ],
          //     colors: ['#FF6384', '#36A2EB', '#FFCE00','#ABCDEF','#FEDCBA'],
          //     labels: ['Pending', 'Follow-Up','Not-Connected','Lost','Closed'],
          //     markings: [50, 80],
          //   }
          // }))
        })
        .catch((err) => {
          console.log("Got Error")
          console.log(err);
        });
    }

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


      const handleCampaignSelect = (event) => {
        setSelectedCampaign(event.target.value);
      };
    
      const handleGenerateReport = () => {
        // Fetch and update lead summary data based on the selected campaign
        // Replace the following example data with your actual data
        const leadSummaryData = {
          open: 25,
          inProgress: 15,
          closed: 40,
          total: 80,
        };
        setLeadSummary(leadSummaryData);
      };









      return (
        <div className="reports-campaign-page">
          {/* <div className="reports-campaign-header">
            
            <div className="reports-campaign-info">
              <h1 className="reports-campaign-name">Campaign Lead Report</h1>
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




                  
      <div className="lead-summary-container">
        <div className="campaign-dropdown">
          <select value={selectedCampaign} onChange={handleCampaignSelect}>
            <option value="">Select Campaign</option>
            {
              campaignList.map((campaign, idx)=>{
                return <option key={idx} value={campaign.campID}>{campaign.name}</option>
              })
            }
          </select>
          <button onClick={()=>updateStatistics(selectedCampaign)}>Go</button>
        </div>
        <div className="lead-summary">
          <div className="lead-summary-item">
            <h3>Open</h3>
            <p>{leadSummary.open}</p>
          </div>
          <div className="lead-summary-item">
            <h3>In-Progress</h3>
            <p>{leadSummary.inProgress}</p>
          </div>
          <div className="lead-summary-item">
            <h3>Closed</h3>
            <p>{leadSummary.closed}</p>
          </div>
          <div className="lead-summary-item">
            <h3>Total</h3>
            <p>{leadSummary.total}</p>
          </div>
        </div>
        <div className="lead-blocks">
          <div className="not-connected-leads">
            <h4>Not Connected</h4>
            <div className="not-connected-stats">
              <p>Lost: X</p>
              <p>Pending: Y</p>
            </div>
          </div>
          <div className="connected-leads">
            <h4>Yes, Connected Leads</h4>
            <div className="connected-stats">
              <p>Follow-Up: A</p>
              <p>Converted: B</p>
              <p>Lost: C</p>
            </div>
          </div>
        </div>
      </div>




</div>
);
};














export default function(){
    return (
        <AdminLayout>
            <Reports_Campaign_Lead />
        </AdminLayout>
    );
  }