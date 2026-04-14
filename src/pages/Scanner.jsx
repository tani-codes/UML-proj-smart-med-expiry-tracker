import React, { useRef, useState, useEffect } from "react";

import { supabase } from '../supabaseClient';
import { Camera, Upload, Save, CheckCircle, AlertCircle } from 'lucide-react';

function Scanner() {
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [start, setStart] = useState(null);
  const [rect, setRect] = useState(null);
  const [expiry, setExpiry] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [form, setForm] = useState({
    name: '',
    expiry_date: '',
    quantity: '',
    category: 'Tablet',
    location: ''
  });

  const formatDateForInput = (raw) => {
    if (!raw || raw === "Not found") return "";
    
    const monthMap = { JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06', JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12' };
    const monthMatch = raw.match(/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/);
    if (monthMatch) {
      const month = monthMap[monthMatch[1]];
      return `${monthMatch[2]}-${month}-01`;
    }

    raw = raw.replace(/\s/g, "");
    let m;
    m = raw.match(/(0[1-9]|1[0-2])[\/\-]?(20\d{2})/);
    if (m) return `${m[2]}-${m[1]}-01`;

    m = raw.match(/(0[1-9]|1[0-2])[\/\-]?(\d{2})/);
    if (m) return `20${m[2]}-${m[1]}-01`;

    m = raw.match(/(20\d{2})[\/\-]?(0[1-9]|1[0-2])/);
    if (m) return `${m[1]}-${m[2]}-01`;

    return "";
  };

  // 📸 LOAD IMAGE
  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    
    setFile(f);
    setRect(null);
    setScanned(false);

    const img = new Image();
    img.src = URL.createObjectURL(f);

    img.onload = () => {
      setImage(img);
    };
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);
    }
  }, [image]);

  // 🖱️ START DRAW
  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    const canvasArea = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / canvasArea.width;
    const scaleY = canvasRef.current.height / canvasArea.height;

    setStart({
      x: (e.clientX - canvasArea.left) * scaleX,
      y: (e.clientY - canvasArea.top) * scaleY,
    });
  };

  // 🖱️ DRAW RECTANGLE
  const handleMouseMove = (e) => {
    if (!start || !canvasRef.current) return;

    const canvasArea = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / canvasArea.width;
    const scaleY = canvasRef.current.height / canvasArea.height;

    const x = (e.clientX - canvasArea.left) * scaleX;
    const y = (e.clientY - canvasArea.top) * scaleY;

    const width = x - start.x;
    const height = y - start.y;

    setRect({ x: start.x, y: start.y, width, height });

    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(image, 0, 0);

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 4;
    ctx.strokeRect(start.x, start.y, width, height);
    ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
    ctx.fillRect(start.x, start.y, width, height);
  };

  const handleMouseUp = () => {
    setStart(null);
  };

  // 🔍 OCR ONLY SELECTED AREA
const handleScan = async () => {
  if (!rect) return alert("Please crop expiry area first!");

  setLoading(true);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = Math.abs(rect.width);
  canvas.height = Math.abs(rect.height);

  const cropX = rect.width < 0 ? rect.x + rect.width : rect.x;
  const cropY = rect.height < 0 ? rect.y + rect.height : rect.y;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    Math.abs(rect.width),
    Math.abs(rect.height),
    0,
    0,
    Math.abs(rect.width),
    Math.abs(rect.height)
  );

  const blob = await new Promise((res) => canvas.toBlob(res));

  const formData = new FormData();
  formData.append("image", blob);

  try {
    const response = await fetch("http://localhost:5001/scan", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    console.log("AI RESULT:", data);

    // 🔥 AUTO FILL FORM
    setExpiry(data.expiry || "Not found");

    setForm(prev => ({
      ...prev,
      name: data.name || "",
      expiry_date: formatDateForInput(data.expiry)
    }));

    setScanned(true);

  } catch (err) {
    console.error(err);
    alert("Scan failed");
  }

  setLoading(false);
};
  // 🧠 SMART EXPIRY DETECTION
  const detectExpiry = (raw) => {
    raw = raw.toUpperCase();

    const matches = raw.match(/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*\d{4}/g);
    if (matches && matches.length > 0) return matches[matches.length - 1];

    const numeric = raw.match(/(0[1-9]|1[0-2])[\/\-](20\d{2})/);
    if (numeric) return numeric[0];

    return "Not found";
  };

  const saveToInventory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return alert("Please login first to save to inventory.");

      if (!form.name || !form.expiry_date || !form.quantity) {
        return alert("Please fill required fields: Medicine Name, Expiry Date, and Quantity.");
      }

      const { error } = await supabase
        .from('medicines')
        .insert([{
          name: form.name,
          expiry_date: form.expiry_date,
          quantity: parseInt(form.quantity),
          category: form.category,
          location: form.location,
          user_id: user.id
        }]);

      if (error) throw error;

      alert("✅ Medicine successfully added to inventory!");

      setForm({
        name: '',
        expiry_date: '',
        quantity: '',
        category: 'Tablet',
        location: ''
      });
      setExpiry("");
      setRect(null);
      setImage(null);
      setFile(null);
      setScanned(false);

    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  return (
    <div className="fade-in app-container" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>OCR Medicine Scanner</h1>
        <p style={{ fontSize: '1rem', color: '#64748b' }}>Scan medicine packaging to automatically extract expiry dates and details</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Left Card: Scan Medicine */}
        <div style={{ background: '#dcf0fb', padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 10px 30px rgba(122,179,203,0.1)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.2rem', color: '#1e293b' }}>Scan Medicine</h2>
          <p style={{ color: '#475569', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Upload an image and crop the expiry date region</p>
          
          <div style={{ 
            border: '2px dashed rgba(122, 179, 203, 0.4)', 
            borderRadius: '20px', 
            padding: image ? '1rem' : '2rem 1.5rem', 
            textAlign: 'center',
            marginBottom: '1.5rem',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.3)'
          }}>
            {!image ? (
              <>
                <Camera size={44} color="#334155" style={{ marginBottom: '1rem', strokeWidth: 1.5 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem', color: '#1e293b' }}>Upload Medicine Image</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: '240px', lineHeight: 1.4 }}>Take a clear photo of the expiry date on your medicine packaging</p>
                <div style={{ background: 'white', padding: '0.4rem 0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    style={{ fontSize: '0.8rem', color: '#64748b' }}
                  />
                </div>
              </>
            ) : (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <p style={{ color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.8rem', fontWeight: 500 }}>👉 Drag to crop the expiry area</p>
                
                <div style={{ width: '100%', marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden', border: '2px solid #7ab3cb', background: 'white' }}>
                  <canvas
                    ref={canvasRef}
                    style={{ display: 'block', width: '100%', height: 'auto', cursor: 'crosshair', touchAction: 'none' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                  />
                </div>
                
                <div style={{ background: 'white', padding: '0.4rem 0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    style={{ fontSize: '0.8rem', color: '#64748b' }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => {
              console.log("BUTTON CLICKED");
              handleScan();
            }} 
            disabled={loading || !image} 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              fontSize: '1.05rem', 
              borderRadius: '12px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: '#7ab3cb',
              color: 'white',
              fontWeight: 500,
              boxShadow: '0 4px 14px rgba(122, 179, 203, 0.4)',
              border: 'none',
              cursor: (!image || loading) ? 'not-allowed' : 'pointer',
              opacity: (!image || loading) ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <Camera size={20} />
            {loading ? "Scanning Area..." : "Scan Selected Area"}
          </button>
        </div>

        {/* Right Card: Scan Results */}
        <div style={{ background: '#dcf0fb', padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 10px 30px rgba(122,179,203,0.1)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.2rem', color: '#1e293b' }}>Scan Results</h2>
          <p style={{ color: '#475569', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Results will appear here after scanning</p>
          
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: scanned ? 'flex-start' : 'center',
            alignItems: scanned ? 'stretch' : 'center',
            textAlign: scanned ? 'left' : 'center',
          }}>
            {!scanned ? (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
                <Upload size={56} color="#64748b" style={{ marginBottom: '1rem', strokeWidth: 1 }} />
                <h3 style={{ fontSize: '1rem', color: '#334155', marginBottom: '0.3rem', fontWeight: 500 }}>No scan results yet</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Scan an area to get started</p>
              </div>
            ) : (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.4)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: '#334155', fontWeight: 500, fontSize: '0.85rem' }}>Medicine Name *</label>
                    <input 
                      className="glass-input" 
                      name="name" 
                      placeholder="Enter medicine name..."
                      value={form.name} 
                      onChange={(e) => setForm({...form, name: e.target.value})} 
                      style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem 0.8rem', outline: 'none' }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', color: '#334155', fontWeight: 500, fontSize: '0.85rem' }}>
                      Expiry Date *
                      {expiry === "Not found" ? <AlertCircle size={14} color="var(--danger)" /> : <CheckCircle size={14} color="var(--success)" />}
                    </label>
                    <input 
                      className="glass-input" 
                      type="date"
                      name="expiry_date" 
                      value={form.expiry_date} 
                      style={{ borderColor: expiry === "Not found" ? "rgba(255, 107, 107, 0.5)" : "", background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem 0.8rem', outline: 'none' }}
                      onChange={(e) => setForm({...form, expiry_date: e.target.value})} 
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: '#334155', fontWeight: 500, fontSize: '0.85rem' }}>Quantity *</label>
                    <input 
                      className="glass-input" 
                      type="number" 
                      name="quantity" 
                      min="1"
                      placeholder="Qty"
                      value={form.quantity} 
                      onChange={(e) => setForm({...form, quantity: e.target.value})} 
                      required
                      style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem 0.8rem', outline: 'none' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: '#334155', fontWeight: 500, fontSize: '0.85rem' }}>Category</label>
                    <select 
                      className="glass-input" 
                      name="category" 
                      value={form.category} 
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem 0.8rem', outline: 'none' }}
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Drops">Drops</option>
                      <option value="Ointment">Ointment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: '#334155', fontWeight: 500, fontSize: '0.85rem' }}>Location (Opt.)</label>
                    <input 
                      className="glass-input" 
                      name="location" 
                      placeholder="Shelf A"
                      value={form.location} 
                      onChange={(e) => setForm({...form, location: e.target.value})} 
                      style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem 0.8rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <button 
                  onClick={saveToInventory} 
                  style={{ 
                    width: '100%', 
                    padding: '0.8rem', 
                    fontSize: '0.95rem', 
                    borderRadius: '8px', 
                    marginTop: '0.5rem', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#2b779a',
                    color: 'white',
                    border: 'none',
                    fontWeight: 500,
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(43, 119, 154, 0.3)'
                  }}
                >
                  <Save size={18} />
                  Save to Inventory
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Card: How it works */}
      <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#334155', marginBottom: '1.5rem', letterSpacing: '-0.3px' }}>How Our OCR Technology Works</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '1rem', marginBottom: '0.8rem', letterSpacing: '1px' }}>1</div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Image Processing</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, maxWidth: '250px' }}>AI enhances image quality and detects text regions</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '1rem', marginBottom: '0.8rem', letterSpacing: '1px' }}>2</div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Text Recognition</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, maxWidth: '250px' }}>Advanced OCR extracts dates and medicine information</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '1rem', marginBottom: '0.8rem', letterSpacing: '1px' }}>3</div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Smart Validation</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, maxWidth: '250px' }}>Data validation ensures accuracy and confidence scoring</p>
          </div>
          
        </div>
      </div>

    </div>
  );
}

export default Scanner;