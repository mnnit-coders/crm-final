import React, { useState } from "react";
import { Link } from "react-router-dom";
import './styles/login.css';

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log("Current Password:", formData.currentPassword);
    console.log("New Password:", formData.newPassword);
    console.log("Confirm New Password:", formData.confirmPassword);
    
  };

  return (
    <div className="login-page-container">
      <header className="login-app-header">
        <h1>NSP</h1>
      </header>
      <div className="login-container">
        <h2 className="login-h2">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label" htmlFor="currentPassword">Current Password:</label>
            <input
                className="login-input"
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="login-form-group">
            <label className="login-label" htmlFor="newPassword">New Password:</label>
            <input
              className="login-input"
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="login-form-group">
            <label className="login-label" htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              className="login-input"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button className="login-button" type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
}
