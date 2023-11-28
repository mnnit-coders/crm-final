import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import './styles/Owner.css';
import { getOrgs, deleteOrg, addOrg, updateSubscription } from "../Utils/Requests/org.requests"
import { toast } from 'react-toastify';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { logOut } from '../Utils/Requests/auth.requsts';
import { useNavigate } from 'react-router-dom';

const Owner = ({ ownerName }) => {

  const navigate= useNavigate();

  const deletePromptRef = useRef(null);

  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    const orgs = getOrgs().then(res=>setOrgs(res))
    return ()=>{}
  },[])

  useEffect(()=>{
    console.log("Orgs State :", orgs)
  }, [orgs]);

  const [selectedOrganizationIndex, setSelectedOrganizationIndex] = useState(null);
  const [subscriptionDuration, setSubscriptionDuration] = useState('');
  const [customDuration, setCustomDuration] = useState('');
  
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  

  const [selectedDates, setSelectedDates] = useState(orgs.map(() => new Date()));

  const [isAddFormOpen, setAddFormOpen] = useState(false);
  const [newOrganization, setNewOrganization] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    userLimit: '',
    expiry: '',
    description: ''
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const subscriptionRef = useRef(null);

  const beautifyDate = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"][dateObj.getMonth()]
    const day = dateObj.getDate();
    return `${month} ${day}, ${year}`;
  }

  const organizations = [
    {
      name: 'Organization 1',
      description: 'This is organization 1.This is organization 1.This is organization 1.This is organization 1.This is organization 1.This is organization 1.This is organization 1.This is organization 1.',
      userCount: 10,
      expiryDate: '2023-12-31',
    },
    {
      name: 'Organization 2',
      description: 'This is organization 2.',
      userCount: 5,
      expiryDate: '2023-10-15',
    },
    {
      name: 'Organization 4',
      description: 'This is organization 4.',
      userCount: 150,
      expiryDate: '2024-06-31',
    },
    {
      name: 'Organization 5',
      description: 'This is organization 5.',
      userCount: 105,
      expiryDate: '2024-01-31',
    },
    {
      name: 'Organization 6',
      description: 'This is organization 6.',
      userCount: 15,
      expiryDate: '2024-01-31',
    },
    {
      name: 'Organization 7',
      description: 'This is organization 7.',
      userCount: 15,
      expiryDate: '2024-01-31',
    },
    {
      name: 'Organization 8',
      description: 'This is organization 8.',
      userCount: 15,
      expiryDate: '2024-01-31',
    },
  ];

  const handleUpdateSubscription = (index) => {
    setSelectedOrganizationIndex(index);
    setIsUpdatingSubscription(true);
  };

  const handleDeleteOrganization = (index) => {
    setSelectedOrganizationIndex(index);
    setShowDeleteConfirmation(true);
    setShowDeletePrompt(true);
  };

  const handleConfirmDelete = () => {
    console.log("Sending Delete Command ")

    // CALL FOR DELETE
    deleteOrg(orgs[selectedOrganizationIndex].orgID, deletePassword).then(res=>{
      if (res){
        setOrgs(orgs.filter((org, index) => index !== selectedOrganizationIndex))
      }
    })
    

    setShowDeletePrompt(false);
    setShowDeleteConfirmation(false);
    setSelectedOrganizationIndex(null); // Add this line to reset the selectedOrganizationIndex
  };

  const handleDurationChange = (event) => {
    setSubscriptionDuration(event.target.value);
  };

  const handleCustomDurationChange = (event) => {
    setCustomDuration(event.target.value);
  };
  
  const handleConfirmSubscription = () => {
    const duration = subscriptionDuration === 'custom' ? customDuration : subscriptionDuration;
    const selectedOrg = orgs[selectedOrganizationIndex];
    const expiryDate = selectedDates[selectedDates.length-1]

    updateSubscription(selectedOrg.orgID, expiryDate, parseInt(selectedOrg.userLimit)).then(res=>{

      const tempOrgs = [...orgs]

      if (res){
        for (let key of Object.keys(res)) {
          tempOrgs[selectedOrganizationIndex][key] = res[key]
        }
      }

      setOrgs(tempOrgs)

    })

    console.log(
      `Updating subscription for ${organizations[selectedOrganizationIndex].name} with duration ${duration} and user limit ${newOrganization.userLimit}`
    );
    setSelectedOrganizationIndex(null);
    setSubscriptionDuration('');
    setCustomDuration('');

  };

  const handleCancelSubscription = () => {
    setSelectedOrganizationIndex(null);
    setSubscriptionDuration('');
    setCustomDuration('');
    setShowDeleteConfirmation(false);

    setAddFormOpen(false);
  };


  const handleRemoveSubscription = (index) => {
    const selectedOrg = orgs[index];
    const expiry = new Date('2000-01-01')
    updateSubscription(selectedOrg.orgID, expiry, 0).then((res) => {
      // Set userLimit and expiryDate to 0 to represent the subscription is removed.
      const tempOrgs = [...orgs];
      tempOrgs[index] = {
        ...tempOrgs[index],
        userLimit: 0,
        expiryDate: '2000-01-01', // A date in the past to represent removal.
      };
      setOrgs(tempOrgs);
    });
  };
  



  const handleAddOrganization = () => {
    setAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setNewOrganization({
      name: '',
      password: '',
      confirmPassword: '',
      userLimit: '',
      expiry: '',
      description: ''
    });
    setPasswordMatch(true);
    setAddFormOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewOrganization((prevOrg) => ({
      ...prevOrg,
      [name]: value
    }));
  
    // Check if password and confirm password match
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(newOrganization.password === value);
    }
  };
  

  const handleSubmitForm = (event) => {
    event.preventDefault();

    // Validate required fields
    if (
      !newOrganization.name ||
      !newOrganization.password ||
      !newOrganization.confirmPassword ||
      !newOrganization.userLimit ||
      !newOrganization.expiry ||
      !newOrganization.description
    ) {
      alert('Please fill in all the required fields.');
      return;
    }

    // Check if password and confirm password match
    if (!passwordMatch) {
      alert('Passwords do not match.');
      return;
    }

    // Sending Request to add and Updating UI
    addOrg(newOrganization).then(res =>{
      if (res) setOrgs([...orgs, res]) 
    })

    // Logic to handle form submission and add the new organization
    console.log('New organization:', newOrganization);
    setNewOrganization({
      name: '',
      password: '',
      confirmPassword: '',
      userLimit: '',
      expiry: '',
      description: ''
    });
    setAddFormOpen(false);
  };


  

  // function to check if the subscription has expired
  const isSubscriptionExpired = (expiryDate) => {
    const currentDate = new Date();
    const expiryDateObj = new Date(expiryDate);
    return expiryDateObj < currentDate;
  };


  const SubscriptionOptions = ({ index }) => {
    const userLimitInputRef = useRef(null);
    const handleOutsideClick = (event) => {
      if (subscriptionRef.current && !subscriptionRef.current.contains(event.target)) {
        setSelectedOrganizationIndex(null);
        setSubscriptionDuration('');
        setCustomDuration('');
        setShowDeleteConfirmation(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, []);



    const handleDatePickerChange = (date) => {
      handleDateChange(date, index); // Pass the index along with the date
    };



    
    const handleDateChange = (date, index) => {
      const updatedDates = [...selectedDates];
      updatedDates[index] = date;
      setSelectedDates(updatedDates);
    };

    const handleUserLimitChange = (event) => {
      const value = event.target.value;
      orgs[index].userLimit = value; // Update the userLimit property in the orgs array
      userLimitInputRef.current.value = value; // Update the input field value using the ref
    };
    

    return (
      <div className="subscription-overlay">
        <div className="subscription-container" ref={subscriptionRef}>
          <h2>Update Subscription</h2>
          <Form>
            {/* <Form.Group controlId="durationSelect">
              <Form.Label>Select Duration:</Form.Label> */}
              {/* <Form.Control
                as="select"
                value={subscriptionDuration}
                onChange={handleDurationChange}
              >
                <option value={0}>Choose...</option>
                <option value={30}>1 Month</option>
                <option value={90}>3 Months</option>
                <option value={180}>6 Months</option>
                <option value={365}>1 Year</option>
                <option value="custom">Custom</option>
              </Form.Control> */}
            {/* </Form.Group>
            {subscriptionDuration === 'custom' && (
              <Form.Group controlId="customDurationInput">
                <Form.Label>Enter Custom Duration:</Form.Label>
                <Form.Control
                  type="number"
                  min=""
                  step="1"
                  value={customDuration}
                  onChange={handleCustomDurationChange}
                  autoComplete="off"
                  onFocus={(e) => e.target.setAttribute('autocomplete', 'off')}
                  // key={subscriptionDuration}
                />
              </Form.Group>
            )} */}





               {/* Date picker for custom subscription duration  */}
          {/* {subscriptionDuration === 'custom' && ( */}
          {selectedDates && (
            
            <Form.Group controlId="customDatePicker">
              <Form.Label>Select Expiry Date:</Form.Label>
              <DatePicker
                selected={selectedDates[index]}
                onChange={handleDatePickerChange}
                minDate={new Date()} // Set minDate to the current date to disallow past dates
                dateFormat="yyyy-MM-dd"
              />
            </Form.Group>
            
          )}
          {/* )} */}










          <Form.Group controlId="userLimitInput">
            <Form.Label>Update User Limit:</Form.Label>
            <Form.Control
              type="number"
              // min="1"
              // step="1"
              ref={userLimitInputRef}
              value={orgs[index].userLimit}
              onChange={handleUserLimitChange}

              // autoComplete="off"
              // onFocus={(e) => e.target.setAttribute('autocomplete', 'off')}
            />
          </Form.Group>




            <div className="subscription-button-container">
              <Button variant="primary" onClick={handleConfirmSubscription}>
                Confirm
              </Button>
              <Button variant="secondary" onClick={handleCancelSubscription}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  };


  const handleDeleteOutsideClick = (event) => {
    if (
      deletePromptRef.current &&
      !deletePromptRef.current.contains(event.target) &&
      selectedOrganizationIndex === index &&
      !showDeletePrompt 
    ) {
      setSelectedOrganizationIndex(null);
      setShowDeleteConfirmation(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDeleteOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleDeleteOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    logOut().then(res=>{
      if (res) navigate("/")
    })
    console.log('Logged out');
  };

  return (
    <div className='body'>
    <div className="Owner-organization-list-container">
      <div className="header-container">
        <span>Welcome, {ownerName || "Owner"}</span>
        <Button className="logout-button" onClick={handleLogout}>Logout</Button>
      </div>

      {orgs && orgs.map((organization, index) => (
        <Card key={index} className="Owner-organization-card">
          <Card.Body>
            {/* First Row */}
            {/* <div className="row">
              <div className="col-md-8"> */}
                <div>
                  <Card.Title className="Owner-mb-0 title">{organization.name}</Card.Title>
                  <Card.Text className="Owner-card-text">
                    Organization ID: {organization.orgID}   | |
                    User Count: {organization.userCount} | | Expiry Date: {beautifyDate(organization.expiryDate)}
                  {isSubscriptionExpired(organization.expiryDate) && (
                  <strong style={{ color: 'red' }}> (Subscription Expired)</strong>
                  )}
                  </Card.Text>
                </div>
                <div>
                <Card.Text>{organization.description}</Card.Text>
                </div>
              
              
                <div className="Owner-button-container">
                  <Button variant="primary" onClick={() => handleUpdateSubscription(index)}>
                    Update Subscription
                  </Button>

                  <Button variant="warning" onClick={() => handleRemoveSubscription(index)}>
                    Deactive Subscription
                  </Button>

                  <Button variant="danger" onClick={() => handleDeleteOrganization(index)}>
                    Delete Organization
                  </Button>
                </div>
                           
                {isUpdatingSubscription && selectedOrganizationIndex === index  && (
                  <SubscriptionOptions index={index} />
                  )}




            
{showDeleteConfirmation && selectedOrganizationIndex === index &&  (
              <div className="Owner-delete-confirmation" ref={deletePromptRef}>
                <h4>Confirm Deletion</h4>
                <p>Are you sure you want to delete this organization?</p>
                <p>Please enter your password to confirm:</p>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <div className="Owner-delete-buttons">
                  <Button variant="danger" onClick={handleConfirmDelete}>
                    Confirm
                  </Button>
                  <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}





          </Card.Body>
        </Card>
      
      ))}
      {isAddFormOpen && (
        <div className="add-form-overlay">
          <div className="add-form-container">
            <h2>Add Organization</h2>
            <Form onSubmit={handleSubmitForm}>
              <Form.Group controlId="organizationName">
                <Form.Label>Organization Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newOrganization.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="organizationPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={newOrganization.password}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="organizationConfirmPassword">
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={newOrganization.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {!passwordMatch && (
                  <small className="text-danger">Passwords do not match.</small>
                )}
              </Form.Group>
              <Form.Group controlId="organizationUserLimit">
                <Form.Label>User Limit:</Form.Label>
                <Form.Control
                  type="number"
                  name="userLimit"
                  value={newOrganization.userLimit}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="organizationExpiry">
                <Form.Label>Expiry Date:</Form.Label>
                <Form.Control
                  type="date"
                  name="expiry"
                  value={newOrganization.expiry}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="organizationDescription">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={newOrganization.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Add
              </Button>
              <Button variant="secondary" onClick={handleCloseForm}>
                Close
              </Button>
            </Form>
          </div>
        </div>
      )}

      


      <button className="add-button" onClick={handleAddOrganization}>
        +
      </button>
    </div>
    </div>
  );
};

export default Owner;