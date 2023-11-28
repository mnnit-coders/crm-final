import React, { useEffect, useState } from 'react';
import './styles/admin.css';
import AdminLayout from '../Components/AdminLayout.jsx';
import { getCampaignMembers, getCampaignsList } from '../Utils/Requests/campaign.requests';
import { uploadLeadsFile } from '../Utils/Requests/lead.requests';
import { toast } from 'react-toastify';
import { getDialers } from '../Utils/Requests/org.requests';

const Contacts = () => {
    const [formData, setFormData] = useState({
      contactName: '',
      contactNumber: '',
      city: '',
      address1: '',
      address2: '',
      pin: '',
      donationAmount: '',
    });
  
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [contactSources, setContactSources] = useState({
      fileUpload: false,
      walkInLead: false,
      googleSheet: false,
    });
  
    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleCampaignChange = (e) => {
      setSelectedCampaign(e.target.value);
    };
  
    const handleContactSourceChange = (e) => {
      const { id, checked } = e.target;
      setContactSources((prevSources) => ({
        ...prevSources,
        [id]: checked,
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Perform data submission logic here
      const data = {
        ...formData,
        selectedCampaign,
        contactSources: Object.keys(contactSources).filter(
          (key) => contactSources[key]
        ),
      };
      console.log('Form submitted:', data);
      // Call API to save data or perform any other action
    };

    const [campaignList, setCampaignList] = useState([]);

    useEffect(()=>{
      const campaigns = getCampaignsList().then(res=>{
        setCampaignList(res);
        setSelectedCampaign(res[0].campID)
      })

      getDialers().then(res=>{
        console.log(res)
      })
    },[])

    const [file, setFile] = useState();

    const handleLeadUpload = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('campID',  selectedCampaign);
      
      uploadLeadsFile(formData)
    }

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setFile(file);
    };

    const handleSelectedCampaignChange = e => {
      setSelectedCampaign(e.target.value)
    }

return (
    <div className="contacts-page">
    {/* <div className="admin-container"> */}
      <div className="content">
        <div className="contacts-form">
          <div className="contacts-form-left">
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="highlighted">Contact Details</label>
                </div>
                
              <label>Contact Name</label>
              <div className="form-group">
            <input type="text" placeholder="Contact Name" />
          </div>
              

              <label>Contact Number</label>
              <div className="form-group">
            <input type="text" placeholder="Contact Number" />
          </div>
              

              {/* <label>City</label>
              <div className="form-group">
            <input type="text" placeholder="City" />
          </div>
              

              <label>Address 1</label>
              <div className="form-group">
            <input type="text" placeholder="" />
          </div>
              

              <label>Address 2</label>
              <div className="form-group">
            <input type="text" placeholder="" />
          </div>
              

              <label>Pin</label>
              <div className="form-group">
            <input type="text" placeholder="560004" />
          </div> */}


              <label>Select Campaign</label>
              <select onChange={handleSelectedCampaignChange}>
                {
                  campaignList.map((campaign)=>{
                    return <option value={campaign.campID}>{campaign.name}</option>
                  })
                }
                {/* <option value="campaign1">Campaign 1</option>
                <option value="campaign2">Campaign 2</option> */}
                {/* Add more campaign options */}
              </select>


              

              <label>Donation Amount</label>
              <div className="form-group">
            <input type="text" placeholder="" />
          </div>
              
          <div className="search-button">
              <button type="submit">Search</button>
            </div>
            </form>
          </div>

          {/* Right Side */}
          <div className="contacts-form-right">
            {/* Campaign Dropdown */}
            <form onSubmit={handleLeadUpload} className="campaign-dropdown">
              <label className="highlighted">Select File</label>
              <input type="file" name="file" max="209" onChange={handleFileChange} />
              <label className="highlighted">Select Campaign</label>
              <select onChange={handleSelectedCampaignChange}>
                {
                  campaignList.map((campaign)=>{
                    return <option value={campaign.campID}>{campaign.name}</option>
                  })
                }
                {/* <option value="campaign1">Campaign 1</option>
                <option value="campaign2">Campaign 2</option> */}
                {/* Add more campaign options */}
              </select>
              <button type="submit">Submit</button>
            </form>

            {/* Contact Source */}
            {/* <div className="contact-source">
              <label className="highlighted">Contact Source</label>
              <div className="checkbox-group">
              <label>
                      <input
                        type="checkbox"
                        id="fileUpload"
                        checked={contactSources.fileUpload}
                        onChange={handleContactSourceChange}
                      />
                      File Upload
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        id="walkInLead"
                        checked={contactSources.walkInLead}
                        onChange={handleContactSourceChange}
                      />
                      Walk-In Lead
                    </label> */}




                    {/* <label>
                      <input
                        type="checkbox"
                        id="walkInLead"
                        checked={contactSources.googleSheet}
                        onChange={handleContactSourceChange}
                      />
                      Google Sheet
                    </label> */}

                {/* Add more checkbox options */}
              {/* </div>
              </div>

              <button className="view-more">View More</button> */}
            </div>

            {/* Search Button */}
           
          </div>

          
        </div>
      {/* </div> */}
    </div>
  
);
};

export default function(){
    return (
        <AdminLayout>
            <Contacts />
        </AdminLayout>
    );
  }