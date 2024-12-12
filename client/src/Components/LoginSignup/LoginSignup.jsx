import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import { useAuthStore } from '../../store/authStore';

export default function LoginSignup() {
  
  // Individual states for name, email, and password || should I change to an array?
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [action, setAction] = useState("Login"); // Toggle Login or Signup

  /** HANDLES AND CONFIRMS LOGIN AND SIGNUP FUNCTIONS */
  const { login } = useAuthStore();
  const handleLogin = async (e) => {
    e.preventDefault();

    await login(email, password);

    if (!email || !password) {
      alert('Please fill in all required fields.');
      return;
    }
  };

  const { signup } = useAuthStore();
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all required fields.');
      return;
    }

    try{
      await signup(email, password, name);
      navigate('/verify-email')
    } catch(err){
      console.log(err)
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      
      <form className="inputs" onSubmit={action === "Login" ? handleLogin : handleSignup}>
        {action === "Sign Up" && (
          <div className="input">
            <img src={user_icon} alt="" />
            {/* Name input */}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="input">
          <img src={email_icon} alt="" />
          {/* Email input */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BUTTON FOR PASSWORD RETRIEVAL */}
        {action === "Login" && (
          <div className="forgot-password">
            Forgot Password? <span><Link to='/forgot-password'>Click Here!</Link></span>
          </div>
        )}

        {/* THIS IS THE SUBMIT BUTTON */}
        <div className="submit-container">
          <button 
            type="button"
            onClick={action === "Login" ? handleLogin : handleSignup}
          >
            {action === "Login" ? "Login" : "Sign Up"}
          </button>
        </div>

      </form>

      {/* THIS ONE TOGGLE BETWEEN SIGNUP OR LOGIN */}
      <div className="toggle-action">
        {action === "Login" ? (
          <div
            className={`${action === "Login" ? "toggle gray" : "toggle"}`}
            onClick={() => setAction("Sign Up")}
          >
            Don't have an account?
          </div>
        ) : (
          <div
            className={`${action === "Login" ? "toggle" : "toggle gray"}`}
            onClick={() => setAction("Login")}
          >
            Already have an account?
          </div>
        )}
      </div>
    </div>
  );
};