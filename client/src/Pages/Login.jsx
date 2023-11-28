import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../Utils/Requests/auth.requsts";
import './styles/login.css';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    try{
      const user = JSON.parse(sessionStorage.getItem("user"));
      const accessToken = sessionStorage.getItem("accessToken");
      const refreshToken = sessionStorage.getItem("refreshToken");
      if (user && accessToken && refreshToken){
        if (user.role == "owner") navigate("/owner")
        else if (user.role === "admin") navigate("/admin/dashboard")
        else if (user.role === "dialer") navigate("/dialer")
      }
    }catch(err){
      console.log(err)
    }
  },[])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    
    await logIn(formData).then(res=>{
      if (res == "owner") navigate("/owner")
      else if (res === "admin") navigate("/admin/dashboard")
      else if (res === "dialer") navigate("/dialer")
    })

  };

  return (
    <div>
      <header className="login-app-header">
        <h1 className="login-container-h1">NSP</h1>
      </header>
      <div className="login-container">
        <h2 className="login-conatiner-h2">Login</h2>
        <form onSubmit={handleSubmit}>
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
            <label className="login-container-label" htmlFor="password">Password:</label>
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
          <button className="login-button" type="submit">Login</button>
        </form>
        <p className="login-p">
          Don't have an account? Register
          <Link className="login-p-a" to="/Register"> User </Link>
          or
          <Link className="login-p-a" to="/OwnerRegister"> Owner </Link>
        </p>
      </div>
    </div>
  );
}
