import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if(formData.identifier && formData.password) {
      // Dummy auth
      navigate('/inventory');
    } else {
      alert("Please enter credentials");
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-left text-center">
        <div className="big-logo-container">
          <ShieldCheck size={120} color="#2b779a" strokeWidth={1} className="big-shield"/>
        </div>
        <h1 className="auth-brand">MeduExp&reg;</h1>
        <p className="auth-tagline">Smart Medicine Expiry Tracker</p>
      </div>

      <div className="auth-right">
        <h2 className="auth-title">Log into MeduExp</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <input 
            type="text" 
            className="glass-input auth-input" 
            placeholder="Phone Number, username or email" 
            value={formData.identifier}
            onChange={(e) => setFormData({...formData, identifier: e.target.value})}
          />
          <input 
            type="password" 
            className="glass-input auth-input" 
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" className="btn btn-primary btn-block auth-btn mt-4">Log In</button>
        </form>
        <p className="forgot-password text-center w-100">Forgot Password?</p>
        <button 
          className="btn btn-primary btn-block auth-btn mt-4" 
          onClick={() => navigate('/register')}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;
