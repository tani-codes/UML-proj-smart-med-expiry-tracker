import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, Search, AlertTriangle } from 'lucide-react';
import './Scanner.css';

function Scanner() {
  const [file, setFile] = useState(null);

  return (
    <div className="scanner-container fade-in">
      <div className="scanner-header">
        <h1 className="page-title">OCR Medicine Scanner</h1>
        <p className="page-subtitle">Scan medicine packaging to automatically extract expiry dates and details</p>
      </div>

      <div className="scanner-grid">
        {/* Scan Medicine Card */}
        <div className="scan-card glass-panel">
          <h3 className="card-title">Scan Medicine</h3>
          <p className="card-desc">Upload an image or use your camera to scan medicine packaging</p>
          
          <div className="upload-area">
             <div className="upload-icon">
               <Camera size={48} strokeWidth={1.5} color="#2b3d4f"/>
             </div>
             <h4>Upload Medicine Image</h4>
             <p>Take a clear photo of the expiry date on your medicine packaging</p>
             
             <div className="file-input-wrapper">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="file-input"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="file-upload" className="file-label">
                  <span className="choose-btn">Choose File</span>
                  <span className="file-name">{file ? file.name : 'No file chosen'}</span>
                </label>
             </div>
          </div>

          <button className="btn btn-primary start-scan-btn mt-6">
            <Camera size={20} /> Start OCR Scan
          </button>
        </div>

        {/* Scan Results Card */}
        <div className="results-card glass-panel">
          <h3 className="card-title">Scan Results</h3>
          <p className="card-desc">Results will appear here after scanning</p>
          
          <div className="empty-results">
            <Upload size={48} strokeWidth={1} color="#6c7a89"/>
            <p>No scan results yet<br/>Upload an image to get started</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="ocr-how-it-works glass-panel mt-8">
        <h3 className="how-title mb-6">How Our OCR Technology Works</h3>
        <div className="how-steps">
          <div className="how-step text-center">
            <div className="step-number text-cyan-bg">1</div>
            <h4>Image Processing</h4>
            <p>AI enhances image quality and detects text regions</p>
          </div>
          <div className="how-step text-center">
            <div className="step-number text-green-bg">2</div>
            <h4>Text Recognition</h4>
            <p>Advanced OCR extracts dates and medicine information</p>
          </div>
          <div className="how-step text-center">
            <div className="step-number text-purple-bg">3</div>
            <h4>Smart Validation</h4>
            <p>Data validation ensures accuracy and confidence scoring</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
