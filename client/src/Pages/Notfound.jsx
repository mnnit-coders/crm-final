
import React from 'react';
import './styles/Notfound.css'; // Import the CSS file

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <button><a href='/' className='home-button'>Home</a></button>
      </div>
    </div>
  );
}

export default NotFound;
