import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './styles/login.css';
import { ownerRegister } from "../Utils/Requests/auth.requsts";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    systemPassword:""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await ownerRegister(formData).then(res=>{
      if (res) navigate("/login");
    })
  
  };

  return (
    <div className="login-page-container">
      <header className="login-app-header">
        <h1 className="login-h1">NSP</h1>
      </header>
      <div className="login-container">
        <h2 className="login-h2">Owner Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label" htmlFor="firstName">First Name:</label>
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
            <label className="login-label" htmlFor="systemPassword">System Password:</label>
            <input
              className="login-input"
              type="password"
              id="systemPassword"
              name="systemPassword"
              value={formData.systemPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button className="login-button" type="submit">Register</button>
        </form>
        <p className="login-p">
          Already have an account? <Link className="login-p-a" to="/login">Login </Link>
          or <Link className="login-p-a" to="/ChangePasswordOwner">Change Password</Link>
        </p>
      </div>
    </div>
  );
}
