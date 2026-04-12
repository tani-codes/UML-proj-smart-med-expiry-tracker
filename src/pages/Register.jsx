import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // ✅ IMPORTANT
import './Auth.css';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    month: '',
    day: '',
    year: '',
    name: '',
    username: ''
  });

  const [loading, setLoading] = useState(false);

  // 🔐 REAL REGISTER FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("REGISTER CLICKED");
    console.log("FORM DATA:", formData);

    if (!formData.email || !formData.password) {
      alert("Email & password required");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password.trim(),
      options: {
        data: {
          name: formData.name.trim(),
          username: formData.username.trim(),
          birthday_month: formData.month,
          birthday_day: formData.day,
          birthday_year: formData.year
        }
      }
    });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Signup successful ✅");

    setLoading(false);

    // redirect to login
    navigate('/login');
  };

  return (
    <div className="register-container fade-in">

      <h2 className="auth-title mb-6">Get started on MeduExp</h2>

      <form className="register-form" onSubmit={handleRegister}>

        {/* EMAIL */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="glass-input auth-input"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="glass-input auth-input"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        {/* BIRTHDAY */}
        <div className="form-group">
          <label>Birthday</label>

          <div className="birthday-row">

            <select
              className="glass-input auth-input select-input"
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
            >
              <option value="">Month</option>
              {months.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>

            <select
              className="glass-input auth-input select-input"
              onChange={(e) =>
                setFormData({ ...formData, day: e.target.value })
              }
            >
              <option value="">Day</option>
              {days.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              className="glass-input auth-input select-input"
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
            >
              <option value="">Year</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

          </div>
        </div>

        {/* NAME */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="glass-input auth-input"
            placeholder="Full name"
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        {/* USERNAME */}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="glass-input auth-input"
            placeholder="Username"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="btn btn-primary btn-block auth-btn mt-4"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create User"}
        </button>

      </form>

    </div>
  );
}

export default Register;