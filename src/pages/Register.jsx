import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contact: '', password: '', month: '', day: '', year: '', name: '', username: ''
  });

  const handleRegister = (e) => {
    e.preventDefault();
    if(formData.contact && formData.password) {
      navigate('/login');
    } else {
      alert("Please fill required fields");
    }
  };

  return (
    <div className="register-container fade-in">
      <h2 className="auth-title mb-6">Get started on MeduExp</h2>
      
      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label>Mobile number or email</label>
          <input type="text" className="glass-input auth-input" placeholder="Mobile number or email"
            onChange={(e) => setFormData({...formData, contact: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" className="glass-input auth-input" placeholder="Password"
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Birthday</label>
          <div className="birthday-row">
            <select className="glass-input auth-input select-input" onChange={(e) => setFormData({...formData, month: e.target.value})}>
              <option value="">Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
            </select>
            <select className="glass-input auth-input select-input" onChange={(e) => setFormData({...formData, day: e.target.value})}>
              <option value="">Day</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            <select className="glass-input auth-input select-input" onChange={(e) => setFormData({...formData, year: e.target.value})}>
              <option value="">Year</option>
              <option value="2000">2000</option>
              <option value="1999">1999</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Name</label>
          <input type="text" className="glass-input auth-input" placeholder="Full name"
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input type="text" className="glass-input auth-input" placeholder="Username"
            onChange={(e) => setFormData({...formData, username: e.target.value})} />
        </div>
        
        <button type="submit" className="btn btn-primary auth-btn mt-4" style={{display:'none'}}>Submit</button>
      </form>
    </div>
  );
}

export default Register;
