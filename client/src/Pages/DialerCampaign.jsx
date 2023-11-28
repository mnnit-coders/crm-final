import React, { useState, useEffect, useRef } from 'react';
import './styles/dialer-campaign.css';
import AdminLayout from '../Components/AdminLayout.jsx';


const DialerCampaign = () => {
    
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const [campaigns, setCampaigns] = useState([]);






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



      const fetchCampaigns = async () => {
        try {
            const response = await fetch('/api/campaigns'); // Replace with your API endpoint
            if (response.ok) {
                const data = await response.json();
                setCampaigns(data);
            } else {
                console.error('Failed to fetch campaigns');
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        }
    };




      return (
        <div className="dialer-page">
          <div className="dialer-header">
            {/* Dialer ID/Name */}
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
            </div>



            {/* Campaign Details */}
            {/* dummy campaign */}
            <div className="campaign-details-box">
                <h2>Campaign Details</h2>
                <div className="campaign-list">
                    <div className="campaign-item assigned">
                        <a href="/campaign1">Campaign 1</a>
                    </div>
                    <div className="campaign-item">
                        <a href="/campaign2">Campaign 2</a>
                    </div>
                    <div className="campaign-item assigned">
                        <a href="/campaign3">Campaign 3</a>
                    </div>
                    
                </div>
                    

                {/* <div className="campaign-box">
                <h2>Campaign Details</h2>
                <div className="campaign-list">
                    {campaigns.map((campaign) => (
                        <div className={`campaign-item ${campaign.assigned ? 'assigned' : ''}`} key={campaign.id}>
                            <a href={`/campaigns/${campaign.id}`}>{campaign.name}</a>
                        </div>
                    ))}
                    </div>
                </div>  */}




            </div>



            </div>
);
};

export default function () {
    return (
      <AdminLayout>
        <DialerCampaign />
      </AdminLayout>
    );
  };
