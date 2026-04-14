import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { User, Lock, Bell, Database, HelpCircle, Trash2, LogOut, ChevronRight, Mail, Phone, Fingerprint, Shield, Smartphone } from 'lucide-react';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [toggles, setToggles] = useState({
    twoFactor: false,
    biometric: false,
    email: true,
    push: true,
    weekly: false,
    backup: true
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          name: currentUser.user_metadata?.name || currentUser.user_metadata?.username || '',
          email: currentUser.email || '',
          phone: currentUser.user_metadata?.phone || ''
        });
      } else {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const Toggle = ({ active, onClick }) => (
    <div className={`custom-toggle-settings ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="toggle-thumb" />
    </div>
  );

  return (
    <div className="settings-container fade-in">
      <div className="settings-header mb-8">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and application settings</p>
      </div>

      {/* Account Info */}
      <div className="settings-section glass-panel">
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
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="settings-input" 
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={formData.email} 
              readOnly 
              className="settings-input" 
            />
          </div>
          <div className="input-group full-width">
            <label>Phone Number</label>
            <input 
              type="text" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              className="settings-input" 
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="settings-section glass-panel mt-8">
        <div className="section-head">
          <div className="section-icon-wrap green-bg"><Lock size={20} /></div>
          <div className="section-title-wrap">
            <h3>Security & Privacy</h3>
            <p>Manage your security preferences</p>
          </div>
        </div>
        <div className="settings-list mt-6">
           <div className="settings-item-row">
             <div className="item-info">
               <h4>Change Password</h4>
               <p>Update your password regularly for security</p>
             </div>
             <button className="btn-small-outline">Update</button>
           </div>
           <div className="settings-item-row">
             <div className="item-info">
               <h4>Two-Factor Authentication</h4>
               <p>Add an extra layer of security</p>
             </div>
             <Toggle active={toggles.twoFactor} onClick={() => handleToggle('twoFactor')} />
           </div>
           <div className="settings-item-row">
             <div className="item-info">
               <h4>Biometric Login</h4>
               <p>Use fingerprint or face recognition</p>
             </div>
             <Toggle active={toggles.biometric} onClick={() => handleToggle('biometric')} />
           </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section glass-panel mt-8">
        <div className="section-head">
          <div className="section-icon-wrap purple-bg"><Bell size={20} /></div>
          <div className="section-title-wrap">
            <h3>Notification Preferences</h3>
            <p>Control how you receive notifications</p>
          </div>
        </div>
        <div className="settings-list mt-6">
           <div className="settings-item-row">
             <div className="item-info-with-icon">
               <Mail size={18} color="#2b779a" />
               <div>
                 <h4>Email Notifications</h4>
                 <p>Receive expiry alerts via email</p>
               </div>
             </div>
             <Toggle active={toggles.email} onClick={() => handleToggle('email')} />
           </div>
           <div className="settings-item-row">
             <div className="item-info-with-icon">
               <Smartphone size={18} color="#22c55e" />
               <div>
                 <h4>Push Notifications</h4>
                 <p>Get alerts on your device</p>
               </div>
             </div>
             <Toggle active={toggles.push} onClick={() => handleToggle('push')} />
           </div>
           <div className="settings-item-row">
             <div className="item-info-with-icon">
               <Bell size={18} color="#8b5cf6" />
               <div>
                 <h4>Weekly Summary</h4>
                 <p>Get a weekly report of your inventory</p>
               </div>
             </div>
             <Toggle active={toggles.weekly} onClick={() => handleToggle('weekly')} />
           </div>
        </div>
      </div>

      {/* Data & Storage */}
      <div className="settings-section glass-panel mt-8">
        <div className="section-head">
          <div className="section-icon-wrap orange-bg"><Database size={20} /></div>
          <div className="section-title-wrap">
            <h3>Data & Storage</h3>
            <p>Manage your data and backups</p>
          </div>
        </div>
        <div className="settings-list mt-6">
           <div className="settings-item-row">
             <div className="item-info">
               <h4>Auto-Backup</h4>
               <p>Automatically backup your data</p>
             </div>
             <Toggle active={toggles.backup} onClick={() => handleToggle('backup')} />
           </div>
           <div className="storage-info mt-4">
             <div className="flex justify-between mb-2">
               <h4>Storage Usage</h4>
             </div>
             <div className="progress-bar-container">
               <div className="progress-bar" style={{width: '15%'}}></div>
             </div>
             <div className="flex justify-between mt-2 storage-labels">
               <span>Used: 24.5 MB</span>
               <span>Available: 512.0 MB</span>
             </div>
           </div>
        </div>
      </div>

      {/* Support */}
      <div className="settings-section glass-panel mt-8">
        <div className="section-head">
          <div className="section-icon-wrap pink-bg"><HelpCircle size={20} /></div>
          <div className="section-title-wrap">
            <h3>Help & Support</h3>
            <p>Get help and view app information</p>
          </div>
        </div>
        <div className="settings-link-list mt-6">
           <div className="link-item">
             <div className="link-left"><HelpCircle size={18} /> Help Center</div>
             <ChevronRight size={18} />
           </div>
           <div className="link-item">
             <div className="link-left"><Mail size={18} /> Contact Support</div>
             <ChevronRight size={18} />
           </div>
        </div>
        <div className="version-info mt-6 text-center">
          <p>MeduExp® Version 2.1.0</p>
          <p>© 2026 MeduExp. All rights reserved.</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="danger-zone-card mt-12 mb-10">
        <h3 className="danger-title">Danger Zone</h3>
        <p className="danger-desc">Irreversible actions</p>
        <div className="danger-actions mt-6">
           <div className="danger-action-row">
             <div className="action-text">
               <h4>Clear All Data</h4>
               <p>Permanently delete all your medicines and data</p>
             </div>
             <button className="btn-danger-outline">Clear</button>
           </div>
           <div className="danger-action-row mt-4">
             <div className="action-text">
               <h4>Delete Account</h4>
               <p>Permanently delete your account and all associated data</p>
             </div>
             <button className="btn-danger-outline">Delete</button>
           </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="flex justify-center mb-10">
        <button className="sign-out-btn" onClick={handleSignOut}>
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default Settings;
