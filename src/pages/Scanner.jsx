import React, { useState } from 'react';
import { Camera, Upload, CheckCircle } from 'lucide-react';
import Tesseract from 'tesseract.js';
import './Scanner.css';

function Scanner() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [expiry, setExpiry] = useState("");
  const [progress, setProgress] = useState(0);

  // 🔍 BETTER expiry detection
  const extractExpiry = (text) => {
    const patterns = [
      /\d{2}\/\d{2}\/\d{4}/,   // 12/05/2026
      /\d{2}-\d{2}-\d{4}/,     // 12-05-2026
      /\d{2}\/\d{2}\/\d{2}/,   // 12/05/26
      /\d{2}-\d{2}-\d{2}/,     // 12-05-26
    ];

    for (let pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }

    return "Not found";
  };

  // 📷 OCR FUNCTION
  const handleScan = async () => {
    console.log("SCAN CLICKED");

    if (!file) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);
    setText("");
    setExpiry("");

    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m) => {
            console.log(m);
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      const extractedText = result.data.text;

      console.log("OCR TEXT:", extractedText);

      setText(extractedText);

      const extractedExpiry = extractExpiry(extractedText);
      setExpiry(extractedExpiry);

    } catch (err) {
      console.error("OCR ERROR:", err);
      alert("OCR failed. Try a clearer image.");
    }

    setLoading(false);
  };

  return (
    <div className="scanner-container fade-in">

      <div className="scanner-header">
        <h1 className="page-title">OCR Medicine Scanner</h1>
        <p className="page-subtitle">
          Scan medicine packaging to extract expiry dates
        </p>
      </div>

      <div className="scanner-grid">

        {/* LEFT */}
        <div className="scan-card glass-panel">
          <h3 className="card-title">Scan Medicine</h3>

          <div className="upload-area">
            <div className="upload-icon">
              <Camera size={48} />
            </div>

            <h4>Upload Image</h4>

            <div className="file-input-wrapper">
              <input
                type="file"
                id="file-upload"
                className="file-input"
                accept="image/*"
                onChange={(e) => {
                  console.log("FILE SELECTED:", e.target.files[0]);
                  setFile(e.target.files[0]);
                }}
              />

              <label htmlFor="file-upload" className="file-label">
                <span className="choose-btn">Choose File</span>
                <span className="file-name">
                  {file ? file.name : 'No file chosen'}
                </span>
              </label>
            </div>
          </div>

          <button
            className="btn btn-primary start-scan-btn mt-6"
            onClick={handleScan}
          >
            {loading ? `Scanning... ${progress}%` : <><Camera size={20} /> Start OCR Scan</>}
          </button>
        </div>

        {/* RIGHT */}
        <div className="results-card glass-panel">
          <h3 className="card-title">Scan Results</h3>

          {!text ? (
            <div className="empty-results">
              <Upload size={48} />
              <p>No scan results yet</p>
            </div>
          ) : (
            <div className="results-content">

              <div className="result-item">
                <h4>Extracted Expiry</h4>
                <p style={{ color: "green", fontWeight: "bold" }}>
                  {expiry}
                </p>
              </div>

              <div className="result-item">
                <h4>Full Text</h4>
                <pre style={{ maxHeight: "200px", overflow: "auto" }}>
                  {text}
                </pre>
              </div>

              <div className="result-item">
                <CheckCircle color="green" />
                <p>Scan Complete</p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Scanner;