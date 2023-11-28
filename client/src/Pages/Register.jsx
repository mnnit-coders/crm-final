import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userRegister } from "../Utils/Requests/auth.requsts"
import './styles/login.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "dialer",
    orgID: "",
    orgPassword:""
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
   
    console.log("First Name:", formData.firstName);
    console.log("Last Name:", formData.lastName);
    console.log("Email:", formData.email);
    console.log("Password:", formData.password);
    console.log("Role:", formData.role);
    console.log("Org ID:", formData.orgID);
    console.log("Org Password:", formData.orgPassword);

    userRegister(formData).then(res=>{
      if (res) navigate("/login");
    })
    
    // navigate("/"); 
  };

  return (
    <div className="login-page-container">
      <header className="login-app-header">
        <h1 className="login-h1">NSP</h1>
      </header>
      <div className="login-register-container">
        <h2 className="login-register-h2">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
            className="login-input"
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="login-form-group">
            <label className="login-label" htmlFor="lastName">Last Name:</label>
            <input
            className="login-input"
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="login-form-group">
            <label className="login-label" htmlFor="email">Email:</label>
            <input
                className="login-input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="login-form-group">
            <label className="login-label" htmlFor="password">Password:</label>
            <input
            className="login-input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="login-form-group">            
            <label className="login-label" htmlFor="role">Role:</label>
            <select
              className="login-input"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="dialer">Dialer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="login-form-group">
            <label className="login-label" htmlFor="orgID">Org ID:</label>
            <input
            className="login-input"
              type="text"
              id="orgID"
              name="orgID"
              value={formData.orgID}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="login-form-group">
            <label className="login-label" htmlFor="orgPassword"> Organization Password:</label>
            <input
            className="login-input"
              type="password"
              id="orgPassword"
              name="orgPassword"
              value={formData.orgPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button className="login-button" type="submit">Register</button>
        </form>
        <p className="login-p">
          Already have an account? <Link className="login-p-a" to="/login">Login </Link>
          or <Link className="login-p-a" to="/changePassword">Change Password</Link>
        </p>
      </div>
    </div>
  );
}
