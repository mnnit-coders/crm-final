import React, { useState, useEffect, useRef } from 'react';
import './styles/admin.css';
import './styles/dialer.css';
import AdminLayout from '../Components/AdminLayout.jsx';




const ManageUser = () => {








    const [userData, setUserData] = useState([
        {
          id: 1,
          username: 'JohnDoe',
          mobileNumber: '1234567890',
          employeeId: 'E123',
          email: 'john@example.com',
          campaigns: 'Campaign A, Campaign B',
          role: 'Agent',
          status: 'Logged In',
          expiryDate: '2023-12-31',
        },
        {
            id: 2,
            username: 'JohnDoe',
            mobileNumber: '1234567890',
            employeeId: 'E123',
            email: 'john@example.com',
            campaigns: 'Campaign A, Campaign B',
            role: 'Agent',
            status: 'Logged Out',
            expiryDate: '2023-12-31',
          },
          {
            id: 3,
            username: 'JohnDoe',
            mobileNumber: '1234567890',
            employeeId: 'E123',
            email: 'john@example.com',
            campaigns: 'Campaign A, Campaign B',
            role: 'Agent',
            status: 'Active',
            expiryDate: '2023-12-31',
          },
          {
            id: 4,
            username: 'JohnDoe',
            mobileNumber: '1234567890',
            employeeId: 'E123',
            email: 'john@example.com',
            campaigns: 'Campaign A, Campaign B',
            role: 'Agent',
            status: 'On Break',
            expiryDate: '2023-12-31',
          },
          {
            id: 5,
            username: 'JohnDoe',
            mobileNumber: '1234567890',
            employeeId: 'E123',
            email: 'john@example.com',
            campaigns: 'Campaign A, Campaign B',
            role: 'Agent',
            status: 'Active',
            expiryDate: '2023-12-31',
          },
          {
            id: 6,
            username: 'JohnDoe',
            mobileNumber: '1234567890',
            employeeId: 'E123',
            email: 'john@example.com',
            campaigns: 'Campaign A, Campaign B',
            role: 'Agent',
            status: 'Logged In',
            expiryDate: '2023-12-31',
          },
          {
            id: 7,
            username: 'JohnDoe',
            mobileNumber: '1234567890',
            employeeId: 'E123',
            email: 'john@example.com',
            campaigns: 'Campaign A, Campaign B',
            role: 'Agent',
            status: 'Logged Out',
            expiryDate: '2023-12-31',
          },
          {
            id: 8,
            username: 'JohnDoe',
            mobileNumber: '1234567890',
            employeeId: 'E123',
            email: 'john@example.com',
            campaigns: 'Campaign A, Campaign B',
            role: 'Agent',
            status: 'Logged In',
            expiryDate: '2023-12-31',
          },
          {
            id: 9,
            username: 'JohnDoe',
            mobileNumber: '1234567890',
            employeeId: 'E123',
            email: 'john@example.com',
            campaigns: 'Campaign A, Campaign B',
            role: 'Agent',
            status: 'Active',
            expiryDate: '2023-12-31',
          },
        // Add more user data as needed
      ]);











    const [searchByContact, setSearchByContact] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [showOption, setShowOption] = useState(new Array(userData.length).fill(false));
    const optionsRef = useRef(null);
    const optionRef = useRef(null);
    const [openOptionIndex, setOpenOptionIndex] = useState(null);
    const optionDropdownRef = useRef(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

     // Calculate range for current page
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;

  // Slice userData to display only the current page's entries
  const displayedUsers = userData.slice(startIndex, endIndex);


  
    const handleSearchChange = (e) => {
      setSearchByContact(e.target.value);
    };
  
    const handleOptionsClick = () => {
      setShowOptions(!showOptions);
      console.log('showOptions:', showOptions);
    };

    const handleOptions = (index) => {
        setOpenOptionIndex(index === openOptionIndex ? null : index);
        setShowOption(false);
        console.log('showOption:', showOption);
      };
  
    const handleOutsideClick = (e) => {
      if (
        (optionsRef.current && !optionsRef.current.contains(e.target)) &&
        (optionRef.current && !optionRef.current.contains(e.target))
        ) {
      setShowOptions(false);
      setShowOption(null); 
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', handleOutsideClick);
  
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, []);


    const handleOutsideOptionClick = (e) => {
        if (optionDropdownRef.current && !optionDropdownRef.current.contains(e.target)) {
          setOpenOptionIndex(null);
        }
      };

      useEffect(() => {
        document.addEventListener('mousedown', handleOutsideOptionClick);
      
        return () => {
          document.removeEventListener('mousedown', handleOutsideOptionClick);
        };
      }, []);
      
      


    const handleAddUser = () => {
        // Implement the logic for adding a user
        console.log('Add User clicked');
      };
    
      const handleRefresh = () => {
        // Implement the logic for refreshing user data
        console.log('Refresh clicked');
      };





      
    
      const renderStatusColor = (status) => {
        switch (status) {
          case 'Logged In':
            return 'green';
          case 'Logged Out':
            return 'grey';
          case 'Active':
            return 'blue';
          case 'On Break':
            return 'orange';
          default:
            return '';
        }
      };
    
      const renderCampaignDetails = (campaigns) => {
        // Logic to render campaign details
      };
    









return (
    <div className="dialer-page">
      <div className="dialer-header">
        {/* Dialer ID/Name */}
        <div className="dialer-info">
          <h1 className="dialer-name">User</h1>
        </div>


        {/* Add User and Refresh Buttons */}
        <div className="header-buttons">
          <button className="header-button add-user-button" onClick={handleAddUser}>
            <i className="fas fa-user-plus"></i> Add User
          </button>
          <button className="header-button refresh-button" onClick={handleRefresh}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        <div className="header-spacing"></div>

        {/* Search Box and Options */}
        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by contact"
              value={searchByContact}
              onChange={handleSearchChange}
            />
            <div className="search-icon">
              <i className="fas fa-search"></i>
            </div>
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
      </div>








<div className="legend-box">
  <div className="legend">
    <div className="legend-item">
      <span className="status-dot" style={{ backgroundColor: '#00ff7f' }}></span> Logged In
    </div>
    <div className="legend-item">
      <span className="status-dot" style={{ backgroundColor: '#232222' }}></span> Logged Out
    </div>
    <div className="legend-item">
      <span className="status-dot" style={{ backgroundColor: '#1e90ff' }}></span> Active
    </div>
    <div className="legend-item">
      <span className="status-dot" style={{ backgroundColor: '#ffa500' }}></span> On Break
    </div>
  </div>
</div>




      <div className="user-table-container">
      <table className="user-details-table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Serial No.</th>
          <th>Username</th>
          <th>Mobile Number</th>
          <th>Employee ID</th>
          <th>Email</th>
          <th>Campaigns</th>
          <th>Role</th>
          <th>Active</th>
          <th>Expiry Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      {displayedUsers.map((user, index) => (
          <tr key={user.id}>
            <td>
              <div className={`status-dot ${renderStatusColor(user.status)}`} />
            </td>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.mobileNumber}</td>
            <td>{user.employeeId}</td>
            <td>{user.email}</td>
            <td>
              <a href="#" onClick={() => renderCampaignDetails(user.campaigns)}>
                View
              </a>
            </td>
            <td>{user.role}</td>
            <td>{user.status}</td>
            <td>{user.expiryDate}</td>
            <td>
              <div className="action-dropdown" ref={optionRef}>
                <i className="fas fa-ellipsis-v" onClick={() => handleOptions(index)}></i>
                {index === openOptionIndex && (
                <div className="option-dropdown" ref={optionDropdownRef}>
                  <ul>
                    <li className="option-title">Edit</li>
                    <li className="option-title">Change Password</li>
                    <li className="option-title">Reassign Leads</li>
                    <li className="option-title">Delete</li>
                  </ul>
                </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      </table>

      <div className="pagination-controls">
        <button
          className="pagination-button prev-button"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          className="pagination-button next-button"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={endIndex >= userData.length}
        >
          Next
        </button>
      </div>

      </div>






      </div>
  );
};




export default function () {
    return (
      <AdminLayout>
        <ManageUser />
      </AdminLayout>
    );
  };