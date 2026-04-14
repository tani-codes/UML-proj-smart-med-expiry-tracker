import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // IMPORTANT
import './Auth.css';
import logo from '../assets/logo_navbar.png';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.identifier) {
      alert("Invalid email id or username, enter again");
      return;
    }

    if (!formData.password) {
      alert("Invalid password, enter again");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.identifier, // using email login
        password: formData.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('credential')) {
           alert("Invalid email id or password, enter again");
        } else {
           alert(error.message);
        }
        setLoading(false);
        return;
      }

      // ✅ Store session (optional but useful)
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Navigate after login
      navigate('/profile');

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-left text-center">
        <div className="big-logo-container">
          <img src={logo} alt="MeduExp Logo" className="auth-big-logo" />
        </div>
        <h1 className="auth-brand">MeduExp&reg;</h1>
        <p className="auth-tagline">Smart Medicine Expiry Tracker</p>
      </div>

      <div className="auth-right">
        <h2 className="auth-title">Log into MeduExp</h2>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="text"
            className="auth-input"
            placeholder="Enter email or username"
            value={formData.identifier}
            onChange={(e) =>
              setFormData({ ...formData, identifier: e.target.value })
            }
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button
            type="submit"
            className="btn btn-primary btn-block auth-btn mt-4"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="forgot-password text-center w-100">
          Forgot Password?
        </p>

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