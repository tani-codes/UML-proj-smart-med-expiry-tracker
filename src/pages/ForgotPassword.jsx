import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Auth.css';
import logo from '../assets/logo_navbar.png';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Use the origin so it works correctly on local or prod
      const resetUrl = `${window.location.origin}/update-password`;
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      setMessage('Password reset link has been sent to your email.');
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
        <h2 className="auth-title">Reset Password</h2>

        {message ? (
          <div className="auth-form">
            <p className="text-center" style={{ color: '#2b779a', fontWeight: 'bold' }}>
              {message}
            </p>
            <button
              className="btn btn-primary btn-block auth-btn mt-4"
              onClick={() => navigate('/login')}
            >
              Back to Log In
            </button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <p style={{ fontSize: '0.9rem', color: '#5a6d80', marginBottom: '1rem', textAlign: 'center' }}>
              Enter your email and we'll send you a link to reset your password.
            </p>
            <input
              type="email"
              className="auth-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              className="btn btn-primary btn-block auth-btn mt-4"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              className="btn btn-primary btn-block auth-btn mt-4"
              onClick={() => navigate('/login')}
              style={{ background: 'rgba(255, 255, 255, 0.4)' }}
            >
              Back to Log In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
