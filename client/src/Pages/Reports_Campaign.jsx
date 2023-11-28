import React, { useEffect, useState, useRef } from 'react';
import './styles/admin.css';
import './styles/reports-campaign.css';
import AdminLayout from '../Components/AdminLayout.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import {getCampaignByCategory} from '../Utils/Requests/campaign.requests.js'
import {getCampaignReportforAdmin} from '../Utils/Requests/reports.requests.js'


const Reports_Campaign = () => {


  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [campaignTypes, setCampaignTypes] = useState([]);
  const [campaignStatus, setCampaignStatus] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [campaignCategory,setcampaignCategory]=useState([]);
  const [data,setData]=useState([]);
  // campaign data (an array of objects) fetched from your backend
  // initialize filteredCampaigns with this data initially
  useEffect(() => {
    // Fetch or initialize your campaign data here
    const initialCampaignData = [
      // Your campaign objects here
      { id: 1, name: 'Campaign 1', type: 'Sales', date: '2023-09-15' },
      { id: 2, name: 'Campaign 2', type: 'Support', date: '2023-09-16' },
      // ...
    ];

    // Initialize filteredCampaigns with the initial data
    setFilteredCampaigns(initialCampaignData);
  }, []);


  useEffect(()=>{
    getCampaignByCategory().then(res=>setcampaignCategory(res));
  },[])






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


  const handleCampaignTypeChange = (event) => {
    const value = event.target.value;
    if (campaignTypes.includes(value)) {
      setCampaignTypes(campaignTypes.filter((type) => type !== value));
    } else {
      setCampaignTypes([...campaignTypes, value]);
    }
  };

  const handleCampaignStatusChange = (event) => {
    const value = event.target.value;
    if (campaignStatus.includes(value)) {
      setCampaignStatus(campaignStatus.filter((status) => status !== value));
    } else {
      setCampaignStatus([...campaignStatus, value]);
    }
  };


  const handleClearAll = () => {
    setStartDate(null);
    setEndDate(null);
    setCampaignTypes([]);
    setCampaignStatus([]);
  };


  const applyFilter = () => {
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Campaign Types:', campaignTypes);
    getCampaignReportforAdmin(startDate,endDate,campaignTypes).then(res=>{
      setData(res);
    })
  };




  const filterCampaigns = () => {
    // Filter the campaigns based on the selected criteria (startDate, endDate, campaignTypes, campaignStatus)
    const filteredCampaigns = campaigns.filter((campaign) => {
      const campaignDate = new Date(campaign.date);
      const isWithinDateRange =
        (!startDate || campaignDate >= startDate) &&
        (!endDate || campaignDate <= endDate);

      const isSelectedCampaignType =
        campaignTypes.length === 0 || campaignTypes.includes(campaign.type);

      const isSelectedCampaignStatus =
        campaignStatus.length === 0 || campaignStatus.includes(campaign.status);

      return isWithinDateRange && isSelectedCampaignType && isSelectedCampaignStatus;
    });

    // Update the table with the filtered campaigns
    updateTable(filteredCampaigns);
  };

  //   const updateTable = (filteredCampaigns) => {
  // // Get the table body element
  // const tableBody = document.getElementById("campaign-table-body");

  // // Clear the existing table rows
  // tableBody.innerHTML = "";

  // // Iterate through the filtered campaigns and create table rows
  // filteredCampaigns.forEach((campaign, index) => {
  //   const row = tableBody.insertRow();
  // // Create and append table cells (s.no, name, type, date, etc.) to the row
  // // Add your code here to create and populate table cells
  //     });
  //   };


  // // Add event listeners to filter elements
  // document.getElementById("start-date").addEventListener("change", filterCampaigns);
  // document.getElementById("end-date").addEventListener("change", filterCampaigns);

  // // Add event listeners to campaign type checkboxes
  // document.querySelectorAll(".campaign-type-checkbox").forEach((checkbox) => {
  // checkbox.addEventListener("change", filterCampaigns);
  // });

  // // Add event listeners to campaign status checkboxes
  // document.querySelectorAll(".campaign-status-checkbox").forEach((checkbox) => {
  // checkbox.addEventListener("change", filterCampaigns);
  // });

  // // Add event listener to "Go" button
  // document.getElementById("filter-go-button").addEventListener("click", filterCampaigns);










  return (
    <div className="reports-campaign-page">
      {/* <div className="reports-campaign-header">

        <div className="reports-campaign-info">
          <h1 className="reports-campaign-name">Campaign Report</h1>
        </div>

        <button>Download Report</button>

        <div className="options" ref={optionsRef}>
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
            <div className="campaign-type">
              <h4>Campaign Type</h4>
              {campaignCategory.map((data)=>(
                <>
                <label>
                <input
                  type="checkbox"
                  value={data}
                  checked={campaignTypes.includes(data)}
                  onChange={handleCampaignTypeChange}
                />{" "}
                {data}
              </label>
                </>
              ))}
            </div>
            {/* <div className="campaign-status">
              <h4>Campaign Status</h4>
              <label>
                <input
                  type="checkbox"
                  value="active"
                  checked={campaignStatus.includes("active")}
                  onChange={handleCampaignStatusChange}
                />{" "}
                Active
              </label>
              <label>
                <input
                  type="checkbox"
                  value="paused"
                  checked={campaignStatus.includes("paused")}
                  onChange={handleCampaignStatusChange}
                />{" "}
                Paused
              </label>
            </div> */}
            <div className="buttons">
              <button className="clear-button" onClick={handleClearAll}>Clear All</button>
              <button className="go-button" onClick={applyFilter}>Go</button>
            </div>
          </div>
        </div>




        <div className="right-block">
          <h2>Campaign Reports</h2>
          {data.length>0?<><div className="table-container">
            <table className="campaign-report-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Campaign Type</th>
                  <th>Date</th>
                  <th>Total Calls Attempted</th>
                  <th>Total Calls Connected</th>
                  <th>Total Leads Converted</th>
                  {/* <th>Follow Up Leads</th> */}
                  <th>Not Connected Leads</th>
                </tr>
              </thead>
              <tbody>
                {data.map((campaign, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{campaign.name}</td>
                    <td>{campaign.category}</td>
                    <td>{campaign.createdOn}</td>
                    <td>{campaign.callAttempted}</td>
                    <td>{campaign.callConnected}</td>
                    <td>{campaign.callConverted}</td>
                    {/* <td>{campaign.callFollowup}</td> */}
                    <td>{campaign.callnotconnected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div></>:<><h3>No Data Available</h3></>}
        </div>
      </div>







    </div>


  )


};





export default function () {
  return (
    <AdminLayout>
      <Reports_Campaign />
    </AdminLayout>
  );
}