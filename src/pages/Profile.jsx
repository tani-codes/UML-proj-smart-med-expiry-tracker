import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Camera, Package, AlertTriangle, ArrowUpRight } from 'lucide-react';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();

  return (
    <div className="profile-container fade-in">
      <div className="profile-header flex justify-between items-center mb-8">
        <div>
          <h1 className="welcome-title">Welcome Back, User !</h1>
          <p className="welcome-subtitle">Here's your medicine inventory overview</p>
        </div>
        <button className="btn btn-primary add-med-btn-profile" onClick={() => navigate('/inventory')}>
          <Plus size={20} /> Add Medicine
        </button>
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
          <div className="stat-value">0</div>
          <p className="stat-desc">Active items in inventory</p>
        </div>

        <div className="stat-box glass-panel">
          <div className="stat-top flex justify-between">
            <h4 className="stat-title">Upcoming Alerts</h4>
            <AlertTriangle size={24} color="#ff6b6b" className="stat-icon-top" />
          </div>
          <div className="stat-value">0</div>
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
