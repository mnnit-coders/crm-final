import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import AdminLayout from "../Components/AdminLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faInfoCircle, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { createCampaign, deleteCampaign, getCampaigns } from "../Utils/Requests/campaign.requests"
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/admin.css';
import { getDialers } from "../Utils/Requests/org.requests";


const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    const campaigns = getCampaigns().then(res => {
      if(res) setCampaigns(res);
    })
    const interval = setInterval(() => {
      getCampaigns().then(res => {
        console.log(res)
        setCampaigns(res);
      });
    }, 3600000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  const [searchQuery, setSearchQuery] = useState('');
  const [activeCampaignId, setActiveCampaignId] = useState(null);
   // New state to track the open status of the dropdown
  //  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
   const [activeCampaign, setActiveCampaign] = useState(null);
   const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectMembers, setselectMembers] = useState([]);

  const [newCampaignData, setNewCampaignData] = useState({
    name: '',
    members: [],
    category: '',
    priority: ''
  });

  const [allMembers, setAllMembers] = useState([])

  const handleAddCampaign = (e) => {
    e.preventDefault();
    const newCampaign = {
      id:campaigns.length+1,
      ...newCampaignData,
      members:selectMembers
    };
    console.log(newCampaign)
    createCampaign(newCampaign).then(res =>{
      console.log("Created:", res)
      setCampaigns([...campaigns, {
        id: res.campID,
        name: res.name,
        category: res.category
      }])
    }).catch(err=>toast("Error creating campaign"))
  
    // Update the campaigns state with the new campaign
    setCampaigns([...campaigns, newCampaign]);
  
    // Clear the form input values
    setNewCampaignData({
      name: '',
      members: [],
      category: '',
      priority: ''
    });
  

  // Hide the form after adding the campaign
  toggleAddForm();

  };
  


   // Function to handle the dropdown toggle
   const handleDropdownToggle = (id) => {
    setActiveCampaign((prevId) => (prevId === id ? null : id));
  };


  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };
  

   // Ref to capture the dropdown menu container element
   const dropdownMenuRef = useRef(null);

   // Function to toggle the dropdown menu
   const toggleDropdownMenu = (id) => {
     setActiveCampaignId(id);
     setIsMenuOpen((prevState) => !prevState);
   };
 
   // Event listener to close the dropdown menu when clicking outside
   useEffect(() => {
     const handleOutsideClick = (event) => {
       if (dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target)) {
         setIsMenuOpen(false);
       }
     };

     getDialers().then(res=>{
      setAllMembers(res)
     })
 
     document.addEventListener("mousedown", handleOutsideClick);
     return () => {
       document.removeEventListener("mousedown", handleOutsideClick);
     };
   }, []);




  // Function to handle option click
  const handleOptionClick = (id, event) => {
    if (activeCampaignId === id) {
      setActiveCampaignId(null);
    } else {
      setActiveCampaignId(id);
      // Calculate the position based on the event's click coordinates
      setDropdownTop(event.clientY);
      setDropdownLeft(event.clientX);
    }
  };

  //  An array of unique categories
  const categories = [...new Set(campaigns.map((campaign) => campaign.category))];




  const handleViewCampaign = (id) => {
    //  logic to view the campaign with the given id
    console.log("View campaign with id:", id);
  };
  
  const handleEditCampaign = (id) => {
    //  logic to edit the campaign with the given id
    console.log("Edit campaign with id:", id);
  };
  
  const handleDeleteCampaign = (id) => {
    // Display a confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this campaign?");
    if (confirmDelete) {
      deleteCampaign(id).then(res=>{
        setCampaigns(campaigns => campaigns.filter(campaign => campaign.campID !== id))
      })
    } else {
      console.log("Canceled campaign deletion.");
    }
  };

  // Function to handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter campaigns based on the search query
  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (email) => {
    // Create a copy of the selectedCheckboxes array
    const updatedSelectedCheckboxes = [...selectMembers];
    
    if (updatedSelectedCheckboxes.includes(email)) {
      // If the email is already in the array, remove it (uncheck)
      updatedSelectedCheckboxes.splice(updatedSelectedCheckboxes.indexOf(email), 1);
    } else {
      // If the email is not in the array, add it (check)
      updatedSelectedCheckboxes.push(email);
    }

    // Update the state with the new selected checkboxes array
    setselectMembers(updatedSelectedCheckboxes);
  };

  return (
    <div className="campaign-page">
      <h2>Campaign Page</h2>
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Campaigns"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>


      <div className="campaign-statistics">
        {categories.map((category) => (
          <div className="card" key={category}>
            <div className="card-body">
              <h5 className="card-title">{category}</h5>
              <ul className="campaign-list">
                {
                  filteredCampaigns.length > 0 ?
                  filteredCampaigns.map((campaign) =>
                    campaign.category === category ? (
                      <li key={campaign.id}>
                      
                      <Link to={`/admin/campaigns/${campaign.campID}`}
                        className="campaign-link"
                        > {/* Use the appropriate path */}
                        {campaign.name}
                      </Link>

                        {/* <span
                          className="option-icons"
                          onClick={() => toggleDropdownMenu(campaign.id)}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </span> */}
                        {/* {activeCampaignId === campaign.id  && isMenuOpen && (
                          <div
                            ref={dropdownMenuRef}
                            className="dropdown-menu"
                            style={{
                              
                              // border: '1px solid black', 
                              right: '0',
                              top: dropdownTop + "px",
                              left: dropdownLeft + "px",
                              zIndex: 999,
                              backgroundColor:"#EEEEEE",
                              width:"85px",
                              // borderRadius: "8px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              // padding: "10px 0",
                              // minWidth: "100px",
                              animation: "fadeIn 0.3s ease",
                              // other styles as needed
                            }}
                          > */}
                            {/* Add the dropdown menu items */}
                            {/* <button onClick={() => handleViewCampaign(campaign.id)}>View</button>
                            <button onClick={() => handleEditCampaign(campaign.id)}>Edit</button> */}
                              <button
                                className="delete-button"
                                onClick={(e) => handleDeleteCampaign(campaign.campID)}
                              >
                                Delete
                              </button>
                          {/* </div> */}
                        {/* )} */}
                      </li>
                    ) : null
                  ): <h4>No Campaigns available ...</h4>}
              </ul>
            </div>
          </div>
        ))}
      </div>

     {/* Floating Add Button */}
    <div className="add-button" onClick={toggleAddForm}>
      <FontAwesomeIcon icon={faPlus} />
    </div>
    
    {/* Campaign Creation Form */}
    {showAddForm && (
      <div className="campaign-form">
        <div className="campaign-form-inner">
        <h3>Add Campaign </h3>
        <form onSubmit={handleAddCampaign}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newCampaignData.name}
              onChange={(e) => setNewCampaignData({ ...newCampaignData, name: e.target.value })}
            />
            <label>Members:</label>
            <ul>
              {
                allMembers.map((user, index)=>{
                  return <div key={index}>
                    <input key={index} type="checkbox" value={user.email} checked={selectMembers.includes(user.email)} onChange={() => handleCheckboxChange(user.email)}/>
                    <span>{user.name}</span>
                  </div>
                })
              }
            </ul>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={newCampaignData.category}
              onChange={(e) => setNewCampaignData({ ...newCampaignData, category: e.target.value })}
            />

            <label>Priority:</label>
            <input
              type="text"
              name="priority"
              value={newCampaignData.priority}
              onChange={(e) => setNewCampaignData({ ...newCampaignData, priority: e.target.value })}
            />

            <button type="submit">Add Campaign</button>

            <button type="close" onClick={toggleAddForm}>Close</button>
          </form>

        </div>
      </div>
    )}
  
    </div>
  );
};



export default function(){
    return (
        <AdminLayout>
            <Campaign />
        </AdminLayout>
    )
}