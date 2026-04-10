import React, { useState } from 'react';
import { Search, BarChart2, Filter, Package, AlertCircle, AlertTriangle, ShieldCheck, Mail, Smartphone, Bell, Clock } from 'lucide-react';
import './Alert.css';

function AlertPage() {
  const [toggles, setToggles] = useState({
    email: true,
    push: true,
    inApp: true,
    days30: true,
    days14: false,
    days7: false,
    onExpiry: true
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ active, onClick }) => (
    <div className={`custom-toggle ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="toggle-thumb" />
    </div>
  );

  return (
    <div className="alert-page-container fade-in">
      <div className="alert-header mb-8">
        <h1 className="page-title">Alerts</h1>
        <p className="page-subtitle">Manage your notification preferences and alert settings</p>
      </div>

      {/* Top Banner Row */}
      <div className="alert-status-grid">
        <div className="status-banner expired-banner">
          <div className="banner-left">
             <h3>EXPIRED</h3>
             <p>Medicines past expiry date</p>
          </div>
          <div className="banner-count">1</div>
        </div>
        <div className="status-banner soon-banner">
          <div className="banner-left">
             <h3>EXPIRING SOON</h3>
             <p>Within 30 days</p>
          </div>
          <div className="banner-count">2</div>
        </div>
        <div className="status-banner safe-banner">
          <div className="banner-left">
             <h3>SAFE</h3>
             <p>More than 30 days left</p>
          </div>
          <div className="banner-count">4</div>
        </div>
      </div>

      {/* Control Row */}
      <div className="controls-row glass-panel mt-12 mb-16">
        <div className="search-box">
          <Search size={18} color="#888" className="search-icon" />
          <input type="text" placeholder="Search by medicine name or category..." className="search-input" />
        </div>
        <div className="filters">
          <button className="filter-btn active">
            <BarChart2 size={16} /> By Expiry
          </button>
          <button className="filter-btn">
            <Filter size={16} /> By Name
          </button>
          <button className="filter-btn">
            <Package size={16} /> By Quantity
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="alert-content-grid">
        <div className="alert-main-list">
          <div className="alert-row-card expired-row">
            <div className="row-icon red-icon"><AlertCircle size={22} /></div>
            <div className="row-text">
               <h4>Expired Medicines</h4>
               <p>These medicines have passed their expiry date - dispose safely</p>
            </div>
          </div>

          <div className="alert-row-card soon-row mt-6">
            <div className="row-icon yellow-icon"><AlertTriangle size={22} /></div>
            <div className="row-text">
               <h4>Expiring Soon</h4>
               <p>Medicines expiring within the next 30 days</p>
            </div>
          </div>

          <div className="alert-row-card safe-row mt-6">
            <div className="row-icon green-icon"><ShieldCheck size={22} /></div>
            <div className="row-text">
               <h4>Safe Medicines</h4>
               <p>Medicines with more than 30 days until expiry</p>
            </div>
          </div>

          <div className="alert-row-card default-row mt-6">
            <div className="row-icon gray-icon"><Bell size={22} /></div>
            <div className="row-text">
               <h4>Recent Notifications</h4>
               <p>Your notification history from the past 30 days</p>
            </div>
          </div>
        </div>

        <div className="alert-sidebar">
          {/* Notification Settings */}
          <div className="sidebar-card glass-panel">
            <h3>Notification Settings</h3>
            <p className="sidebar-subtitle">Choose how you want to be notified</p>
            
            <div className="setting-item mt-6">
              <div className="setting-left">
                <div className="setting-icon blue-bg"><Mail size={18} /></div>
                <div>
                  <h4>Email Notifications</h4>
                  <p>Receive alerts via email</p>
                </div>
              </div>
              <Toggle active={toggles.email} onClick={() => handleToggle('email')} />
            </div>

            <div className="setting-item mt-6">
              <div className="setting-left">
                <div className="setting-icon green-bg"><Smartphone size={18} /></div>
                <div>
                  <h4>Push Notifications</h4>
                  <p>Get push alerts on your device</p>
                </div>
              </div>
              <Toggle active={toggles.push} onClick={() => handleToggle('push')} />
            </div>

            <div className="setting-item mt-6">
              <div className="setting-left">
                <div className="setting-icon purple-bg"><Bell size={18} /></div>
                <div>
                  <h4>In-App Alerts</h4>
                  <p>Show notifications in the app</p>
                </div>
              </div>
              <Toggle active={toggles.inApp} onClick={() => handleToggle('inApp')} />
            </div>
          </div>

          {/* Alert Timing */}
          <div className="sidebar-card glass-panel mt-12">
            <h3>Alert Timing</h3>
            <p className="sidebar-subtitle">When to send expiry reminders</p>
            
            <div className="timing-list mt-6">
              <div className="timing-item mb-4">
                <div className="timing-label"><Clock size={16} /> 30 days before</div>
                <Toggle active={toggles.days30} onClick={() => handleToggle('days30')} />
              </div>
              <div className="timing-item mb-4">
                <div className="timing-label"><Clock size={16} /> 14 days before</div>
                <Toggle active={toggles.days14} onClick={() => handleToggle('days14')} />
              </div>
              <div className="timing-item mb-4">
                <div className="timing-label"><Clock size={16} /> 7 days before</div>
                <Toggle active={toggles.days7} onClick={() => handleToggle('days7')} />
              </div>
              <div className="timing-item">
                <div className="timing-label"><Clock size={16} /> On expiry day</div>
                <Toggle active={toggles.onExpiry} onClick={() => handleToggle('onExpiry')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertPage;
