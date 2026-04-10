import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Clock, Trash2, ShieldCheck, Smartphone, TrendingUp, Phone, Mail } from 'lucide-react';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container fade-in">
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="shield-bg-watermark">
          <ShieldCheck size={400} color="rgba(255,255,255,0.2)" strokeWidth={0.5} />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Your Home Pharmacy, Smarter !</h1>
          <h3 className="hero-subtitle">Never waste medicines again !</h3>
          <p className="hero-desc">
            Advanced OCR technology meets smart inventory management. Track expiry dates, reduce waste, and keep your family safe with intelligent medicine monitoring.
          </p>
          <div className="hero-buttons flex justify-center gap-6 mt-8">
            <button className="btn btn-outline home-auth-btn" onClick={() => navigate('/login')}>SIGN IN</button>
            <button className="btn btn-outline home-auth-btn" onClick={() => navigate('/register')}>REGISTER</button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="info-section">
        <div className="text-center mb-8">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to smarter medicine management</p>
        </div>
        <div className="card-grid">
          <div className="glass-panel info-card">
            <div className="icon-wrapper text-cyan"><Camera size={28}/></div>
            <p className="step-text">Step 1</p>
            <h4>Scan Medicine</h4>
            <p>Use advanced OCR to auto-extract expiry dates from packaging. Simply point your camera at the label and let AI do the rest.</p>
          </div>
          <div className="glass-panel info-card">
            <div className="icon-wrapper text-green"><Clock size={28}/></div>
            <p className="step-text">Step 2</p>
            <h4>Track & Notify</h4>
            <p>Get timely alerts for upcoming and recent expiries. Never let medicine go to waste or risk taking expired medication.</p>
          </div>
          <div className="glass-panel info-card">
            <div className="icon-wrapper text-red"><Trash2 size={28}/></div>
            <p className="step-text">Step 3</p>
            <h4>Reduce Waste</h4>
            <p>Optimize your inventory and save money. See analytics on usage patterns and reduce unnecessary purchases.</p>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="info-section why-choose">
        <h2 className="section-title text-center mb-8">Why choose MeduExp ?</h2>
        <div className="card-grid">
          <div className="glass-panel info-card centered-card">
            <div className="icon-wrapper soft-blue"><ShieldCheck size={28}/></div>
            <h4>Safe & Trustworthy</h4>
            <p>HIPAA-compliant security ensures your health data stays private and protected.</p>
          </div>
          <div className="glass-panel info-card centered-card">
            <div className="icon-wrapper soft-green"><Smartphone size={28}/></div>
            <h4>Mobile Ready</h4>
            <p>Access your medicine inventory anywhere, anytime on any device.</p>
          </div>
          <div className="glass-panel info-card centered-card">
            <div className="icon-wrapper soft-purple"><TrendingUp size={28}/></div>
            <h4>Smart Analytics</h4>
            <p>Get insights on medication usage and optimize your home pharmacy.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of families who are already managing their medicine smarter</p>
        <button className="btn btn-primary cta-btn" onClick={() => navigate('/inventory')}>Start Tracking Now !</button>
      </section>

      {/* Footer */}
      <footer className="footer glass-panel">
        <div className="footer-content">
          <div className="footer-left">
            <h4 className="footer-title">For further enquiry:</h4>
            <div className="contact-item">
              <Phone size={16}/>
              <div className="contact-text">
                <span>+91 8422973044</span>
                <span>+91 8097357019</span>
              </div>
            </div>
            <div className="contact-item mt-4">
              <Mail size={16}/>
              <div className="contact-text">
                <span>bandodkartanish@gmail.com</span>
                <span>mail s.niharika@gmail.com</span>
              </div>
            </div>
            <div className="copyright mt-8">
              MeduExp WebVersion v.1.0<br/>
              © 2026 MeduExp. All rights reserved.
            </div>
          </div>
          <div className="footer-right">
            <ul>
              <li>About us</li>
              <li>How MeduExp works?</li>
              <li>Why choose MeduExp?</li>
              <li>Let's get started</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
