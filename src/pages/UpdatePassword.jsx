import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Auth.css';
import logo from '../assets/logo_navbar.png';

function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the hash contains access_token from the recovery link
    const handleRecoveryStr = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get('type') === 'recovery' && hashParams.get('access_token')) {
        // Supabase client should automatically extract and set the session
      } else {
        // Optional: you can redirect back somewhere else if not a recovery mode
      }
    };
    handleRecoveryStr();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!password) {
      alert("Please enter a new password");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Update successful, user is already logged in automatically
      alert("Password updated successfully!");
      navigate('/profile'); // auto log in and redirect to profile

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
        <h2 className="auth-title">Create New Password</h2>

        <form className="auth-form" onSubmit={handleUpdatePassword}>
          <input
            type="password"
            className="auth-input"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="btn btn-primary btn-block auth-btn mt-4"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;
