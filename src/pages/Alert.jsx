import React, { useEffect, useState } from 'react';
import { Search, BarChart2, Filter, Package, AlertCircle, AlertTriangle, ShieldCheck, Mail, Smartphone, Bell, Clock, Send } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Alert.css';

function AlertPage() {
  const [counts, setCounts] = useState({
    expired: 0,
    soon: 0,
    safe: 0
  });

  const [medicines, setMedicines] = useState({
    expired: [],
    soon: [],
    safe: []
  });

  const [toggles, setToggles] = useState({
    email: true,
    push: true,
    inApp: true,
    days30: true,
    days14: false,
    days7: false,
    onExpiry: true
  });

  const getDaysLeft = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const fetchMedicines = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*');

    if (!error && data) {
      let expiredList = [], soonList = [], safeList = [];

      data.forEach((med) => {
        const days = getDaysLeft(med.expiry_date);
        med.daysLeft = days; // attach for rendering

        if (days <= 0) expiredList.push(med);
        else if (days <= 30) soonList.push(med);
        else safeList.push(med);
      });

      setCounts({ expired: expiredList.length, soon: soonList.length, safe: safeList.length });
      setMedicines({ expired: expiredList, soon: soonList, safe: safeList });
    }
  };

  useEffect(() => {
    fetchMedicines();
    // Request notification permission early if turned on
    if (toggles.push && "Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, [toggles.push]);

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendAlerts = async () => {
    if (!toggles.email && !toggles.push) {
      alert("Please enable at least one notification method (Email or Push).");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("You must be logged in to send alerts.");

    let triggered = false;

    // 1. Browser Push Notifications
    if (toggles.push) {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications.");
      } else if (Notification.permission === "granted") {
        new Notification("Medicine Expiry Alert", {
          body: `You have ${counts.expired} expired and ${counts.soon} expiring medicines. Please check your inventory!`,
        });
        triggered = true;
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification("Medicine Expiry Alert", {
            body: `You have ${counts.expired} expired and ${counts.soon} expiring medicines.`,
          });
          triggered = true;
        }
      }
    }

    // 2. Actual Email Notifications (Using Free FormSubmit API)
    if (toggles.email) {
      const expiredList = medicines.expired.map(m => `- ${m.name} (Expired on: ${m.expiry_date})`).join('\n') || "None";
      const soonList = medicines.soon.map(m => `- ${m.name} (Expires on: ${m.expiry_date})`).join('\n') || "None";

      try {
        const res = await fetch(`https://formsubmit.co/ajax/${user.email}`, {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: "⚠️ Smart Medicine Expiry Alert!",
            "Message": "Hello! Here is your medicine expiry report from SmartTracker:",
            "EXPIRED MEDICINES": expiredList,
            "EXPIRING SOON": soonList,
            _template: "box"
          })
        });

        const data = await res.json();
        
        if (data.success) {
            alert(`✅ ACTUAL EMAIL SENT to ${user.email}!\n\n(IMPORTANT: If this is your first time, FormSubmit will send an 'Action Required' activation email. You MUST click 'Activate' in that email to receive the report!)`);
            triggered = true;
        } else {
            alert("Failed to send email: " + data.message);
        }

      } catch (err) {
        console.error("Email error:", err);
        alert("Failed to send email. Check console.");
      }
    }

    if (triggered && toggles.inApp) {
       // Future mock logic for in app if needed
    }
  };

  const Toggle = ({ active, onClick }) => (
    <div className={`custom-toggle ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="toggle-thumb" />
    </div>
  );

  return (
    <div className="alert-page-container fade-in">
      <div className="alert-header mb-8 flex justify-between" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ marginTop: 0 }}>Alerts</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage your notification preferences and alert settings</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleSendAlerts}
          style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#eab308' }}
        >
          <Send size={18} /> Test Alerts Now
        </button>
      </div>

      {/* Top Banner Row */}
      <div className="alert-status-grid">
        <div className="status-banner expired-banner">
          <div className="banner-left">
             <h3>EXPIRED</h3>
             <p>Medicines past expiry date</p>
          </div>
          <div className="banner-count">{counts.expired}</div>
        </div>
        <div className="status-banner soon-banner">
          <div className="banner-left">
             <h3>EXPIRING SOON</h3>
             <p>Within 30 days</p>
          </div>
          <div className="banner-count">{counts.soon}</div>
        </div>
        <div className="status-banner safe-banner">
          <div className="banner-left">
             <h3>SAFE</h3>
             <p>More than 30 days left</p>
          </div>
          <div className="banner-count">{counts.safe}</div>
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
          <div className="alert-row-card expired-row flex-col-card">
            <div className="card-header-flex">
              <div className="row-icon red-icon"><AlertCircle size={22} /></div>
              <div className="row-text">
                 <h4>Expired Medicines</h4>
                 <p>These medicines have passed their expiry date - dispose safely</p>
              </div>
            </div>
            {medicines.expired.length > 0 && (
              <div className="med-alert-list">
                {medicines.expired.map(med => (
                  <div key={med.id} className="med-alert-item red-item">
                     <div className="item-left">
                        <div className="item-icon text-red-500"><AlertCircle size={16} /></div>
                        <div className="item-details">
                           <h5>{med.name}</h5>
                           <span>Expired on: {med.expiry_date}</span>
                        </div>
                     </div>
                     <div className="item-badge red-badge">{Math.abs(med.daysLeft)} days ago</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="alert-row-card soon-row flex-col-card">
            <div className="card-header-flex">
              <div className="row-icon yellow-icon"><AlertTriangle size={22} /></div>
              <div className="row-text">
                 <h4>Expiring Soon</h4>
                 <p>Medicines expiring within the next 30 days</p>
              </div>
            </div>
            {medicines.soon.length > 0 && (
              <div className="med-alert-list">
                {medicines.soon.map(med => (
                  <div key={med.id} className="med-alert-item yellow-item">
                     <div className="item-left">
                        <div className="item-icon text-yellow-500"><AlertTriangle size={16} /></div>
                        <div className="item-details">
                           <h5>{med.name}</h5>
                           <span>Expires: {med.expiry_date}</span>
                        </div>
                     </div>
                     <div className="item-badge yellow-badge">{med.daysLeft} days left</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="alert-row-card safe-row flex-col-card">
            <div className="card-header-flex">
              <div className="row-icon green-icon"><ShieldCheck size={22} /></div>
              <div className="row-text">
                 <h4>Safe Medicines</h4>
                 <p>Medicines with more than 30 days until expiry</p>
              </div>
            </div>
            {medicines.safe.length > 0 && (
              <div className="med-alert-list">
                {medicines.safe.map(med => (
                  <div key={med.id} className="med-alert-item green-item">
                     <div className="item-left">
                        <div className="item-icon text-green-500"><ShieldCheck size={16} /></div>
                        <div className="item-details">
                           <h5>{med.name}</h5>
                           <span>Expires: {med.expiry_date}</span>
                        </div>
                     </div>
                     <div className="item-badge green-badge">{med.daysLeft} days left</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="alert-row-card default-row flex-col-card">
            <div className="card-header-flex">
              <div className="row-icon gray-icon"><Bell size={22} /></div>
              <div className="row-text">
                 <h4>Recent Notifications</h4>
                 <p>Your notification history from the past 30 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="alert-sidebar">
          {/* Notification Settings */}
          <div className="sidebar-card glass-panel">
            <h3>Notification Settings</h3>
            <p className="sidebar-subtitle">Choose how you want to be notified</p>
            
            <div className="setting-item">
              <div className="setting-left">
                <div className="setting-icon blue-bg"><Mail size={18} /></div>
                <div>
                  <h4>Email Notifications</h4>
                  <p>Receive alerts via email</p>
                </div>
              </div>
              <Toggle active={toggles.email} onClick={() => handleToggle('email')} />
            </div>

            <div className="setting-item">
              <div className="setting-left">
                <div className="setting-icon green-bg"><Smartphone size={18} /></div>
                <div>
                  <h4>Push Notifications</h4>
                  <p>Get push alerts on your device</p>
                </div>
              </div>
              <Toggle active={toggles.push} onClick={() => handleToggle('push')} />
            </div>

            <div className="setting-item">
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
            
            <div className="timing-list mt-8">
              <div className="timing-item">
                <div className="timing-label"><Clock size={16} /> 30 days before</div>
                <Toggle active={toggles.days30} onClick={() => handleToggle('days30')} />
              </div>
              <div className="timing-item">
                <div className="timing-label"><Clock size={16} /> 14 days before</div>
                <Toggle active={toggles.days14} onClick={() => handleToggle('days14')} />
              </div>
              <div className="timing-item">
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