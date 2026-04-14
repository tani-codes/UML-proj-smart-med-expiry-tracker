import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Plus, Camera, Package, AlertTriangle, ArrowUpRight, User } from 'lucide-react';
import './Profile.css';
import './Settings.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, alerts: 0 });

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Fetch medicines for stats
        const { data } = await supabase.from('medicines').select('*').eq('user_id', user.id);
        if (data) {
           let alertsCount = 0;
           const today = new Date();
           data.forEach(med => {
             const expiry = new Date(med.expiry_date);
             const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
             if (days <= 30) alertsCount++;
           });
           setStats({ total: data.length, alerts: alertsCount });
        }
      } else {
        navigate('/login');
      }
    };
    fetchProfileData();
  }, [navigate]);

  const displayName = user?.user_metadata?.name || user?.user_metadata?.username || user?.email?.split('@')[0] || "User";

  return (
    <div className="profile-container fade-in">
      <div className="profile-header flex justify-between items-center mb-8">
        <div>
          <h1 className="welcome-title">Welcome Back, {displayName}!</h1>
          <p className="welcome-subtitle">Here's your medicine inventory overview</p>
        </div>
        <button className="btn btn-primary add-med-btn-profile" onClick={() => navigate('/inventory')}>
          <Plus size={20} /> Add Medicine
        </button>
      </div>

     {/* Account Info matching Settings UI */}
      <div className="settings-section glass-panel mb-8">
        <div className="section-head">
          <div className="section-icon-wrap cyan-bg"><User size={20} /></div>
          <div className="section-title-wrap">
            <h3>Account Information</h3>
            <p>Update your personal details</p>
          </div>
        </div>
        <div className="account-form-grid mt-6">
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" readOnly value={user?.user_metadata?.name || user?.user_metadata?.username || 'TaNi'} className="settings-input" />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" readOnly value={user?.email || 'tani@gmail.com'} className="settings-input" />
          </div>
          <div className="input-group full-width">
            <label>Phone Number</label>
            <input type="text" readOnly value={user?.user_metadata?.phone || '8422973044'} className="settings-input" />
          </div>
        </div>
      </div>

      {/* Banner Action Card */}
      <div className="banner-card glass-panel" onClick={() => navigate('/scanner')}>
        <div className="banner-content">
          <div className="banner-icon">
            <Camera size={32} color="#2b3d4f"/>
          </div>
          <div className="banner-text">
            <h3>Scan New Medicine</h3>
            <p>Use OCR to automatically extract expiry dates</p>
          </div>
        </div>
        <ArrowUpRight size={40} className="banner-arrow" />
      </div>

      {/* Stats Row */}
      <div className="profile-stats-grid mt-12">
        <div className="stat-box glass-panel">
          <div className="stat-top flex justify-between">
            <h4 className="stat-title">Total Medicines</h4>
            <Package size={24} color="#2b779a" className="stat-icon-top" />
          </div>
          <div className="stat-value">{stats.total}</div>
          <p className="stat-desc">Active items in inventory</p>
        </div>

        <div className="stat-box glass-panel">
          <div className="stat-top flex justify-between">
            <h4 className="stat-title">Upcoming Alerts</h4>
            <AlertTriangle size={24} color="#ff6b6b" className="stat-icon-top" />
          </div>
          <div className="stat-value">{stats.alerts}</div>
          <p className="stat-desc">Expiring within 30 days</p>
        </div>
      </div>

      {/* Horizontal List Cards */}
      <div className="list-cards mt-12">
        <div className="list-card glass-panel flex justify-between items-center">
          <div className="list-card-content">
            <h3>Near Expiry Items</h3>
            <p>Medicines expiring in the next 400 days</p>
          </div>
          <button className="btn-outline-list" onClick={() => navigate('/alert')}>View All Alerts</button>
        </div>

        <div className="list-card glass-panel flex justify-between items-center mt-6">
          <div className="list-card-content">
            <h3>Complete Medicine Inventory</h3>
            <p>All medicines currently tracked in your system</p>
          </div>
          <button className="btn-outline-list" onClick={() => navigate('/inventory')}>Full Inventory View</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
