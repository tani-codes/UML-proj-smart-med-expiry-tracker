import React, { useEffect, useState } from 'react';
import { Plus, Package, Search, BarChart2, Filter, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Inventory.css';

function Inventory() {

  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('expiry');

  const [form, setForm] = useState({
    name: '',
    expiry_date: '',
    quantity: '',
    category: 'Tablet',
    location: '',
    ocr_verified: false
  });

  // 🔹 CALCULATE DAYS LEFT
  const getDaysLeft = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  // 🔹 FETCH
  const getMedicines = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*');

    if (!error) {
      const sorted = data.sort(
        (a, b) => new Date(a.expiry_date) - new Date(b.expiry_date)
      );
      setMedicines(sorted);
    }
  };

  useEffect(() => {
    getMedicines();
  }, []);

  // 🔹 ADD
  const addMedicine = async () => {
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return alert("Login required");

    const { error } = await supabase
      .from('medicines')
      .insert([{
        name: form.name,
        expiry_date: form.expiry_date,
        quantity: parseInt(form.quantity),
        category: form.category,
        location: form.location,
        ocr_verified: form.ocr_verified,
        user_id: user.id
      }]);

    if (error) alert(error.message);
    else {
      setShowForm(false);
      setForm({ name: '', expiry_date: '', quantity: '', category: 'Tablet', location: '', ocr_verified: false });
      getMedicines();
    }
  };

  const filteredMedicines = medicines
    .filter((med) => med.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (filterType === 'expiry') {
        return new Date(a.expiry_date) - new Date(b.expiry_date);
      } else if (filterType === 'name') {
        return a.name.localeCompare(b.name);
      } else if (filterType === 'quantity') {
        return b.quantity - a.quantity;
      }
      return 0;
    });

  const totalItems = medicines.length;
  const totalUnits = medicines.reduce((sum, med) => sum + (med.quantity || 0), 0);
  const uniqueCategories = new Set(medicines.map(med => med.category).filter(Boolean));
  const categoriesCount = uniqueCategories.size > 0 ? uniqueCategories.size : 0; 
  const ocrVerifiedCount = medicines.filter(med => med.ocr_verified).length;

  return (
    <div className="inventory-container fade-in">

      <div className="inventory-header flex justify-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title m-0" style={{marginTop: 0}}>Medicine Inventory</h1>
          <p className="page-subtitle text-muted mt-1" style={{marginTop: '0.5rem', marginBottom: 0}}>Complete list of all medicines in your tracking system</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} /> Add Medicine
        </button>
      </div>

      {/* Stats Row */}
      <div className="stats-row mb-8 mt-12" style={{ marginTop: '3.5rem' }}>
        <div className="stat-card glass-panel">
          <h2 className="stat-number">{totalItems}</h2>
          <p className="stat-label">Total Items</p>
        </div>
        <div className="stat-card glass-panel">
          <h2 className="stat-number">{categoriesCount}</h2>
          <p className="stat-label">Categories</p>
        </div>
        <div className="stat-card glass-panel">
          <h2 className="stat-number">{totalUnits}</h2>
          <p className="stat-label">Total Units</p>
        </div>
        <div className="stat-card glass-panel">
          <h2 className="stat-number">{ocrVerifiedCount}</h2>
          <p className="stat-label">OCR Verified</p>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="glass-panel add-med-form p-6 mb-6">
          <h3 className="mb-4">Add New Medicine</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Medicine Name</label>
              <input
                className="glass-input auth-input"
                placeholder="Ex: Amoxicillin"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                className="glass-input auth-input"
                value={form.expiry_date}
                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                className="glass-input auth-input"
                placeholder="Ex: 50"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="glass-input auth-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ appearance: 'none', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                <option value="Tablet">Tablet</option>
                <option value="Liquid">Liquid</option>
                <option value="Powder">Powder</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location (Optional)</label>
              <input
                type="text"
                className="glass-input auth-input"
                placeholder="Ex: First Aid Kit"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', paddingTop: '1.8rem' }}>
              <input
                type="checkbox"
                id="ocr_verified"
                checked={form.ocr_verified}
                onChange={(e) => setForm({ ...form, ocr_verified: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="ocr_verified" style={{ margin: 0, fontWeight: 500, cursor: 'pointer' }}>OCR Verified</label>
            </div>

            <div className="form-group" style={{ paddingTop: '1.8rem' }}>
              <button className="btn btn-primary add-submit-btn" onClick={addMedicine}>Save Medicine</button>
            </div>
          </div>
        </div>
      )}

      {/* Control Row */}
      <div className="controls-row glass-panel mt-8 mb-8">
        <div className="search-box">
          <Search size={18} color="#888" className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by medicine name..." 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filters">
          <button 
            className={`filter-btn ${filterType === 'expiry' ? 'active' : ''}`}
            onClick={() => setFilterType('expiry')}
          >
            <BarChart2 size={16} /> By Expiry
          </button>
          <button 
            className={`filter-btn ${filterType === 'name' ? 'active' : ''}`}
            onClick={() => setFilterType('name')}
          >
            <Filter size={16} /> By Name
          </button>
          <button 
            className={`filter-btn ${filterType === 'quantity' ? 'active' : ''}`}
            onClick={() => setFilterType('quantity')}
          >
            <Package size={16} /> By Quantity
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="table-container">

        {filteredMedicines.length === 0 ? (
          <div className="empty-state text-center glass-panel">
            <Package size={56} />
            <h2>Your inventory is empty</h2>
          </div>
        ) : (
          <div className="med-list-grid">

            {filteredMedicines.map((med) => {
              const days = getDaysLeft(med.expiry_date);

              let status = "";
              let color = "";
              let bg = "";

              if (days <= 0) {
                status = "Expired ❌";
                color = "#dc3545";
                bg = "rgba(220, 53, 69, 0.1)";
              } else if (days <= 7) {
                status = `Expiring soon ⚠️`;
                color = "#fd7e14";
                bg = "rgba(253, 126, 20, 0.1)";
              } else if (days <= 30) {
                status = `Expiring soon (${days} days)`;
                color = "#ffc107";
                bg = "rgba(255, 193, 7, 0.1)";
              } else {
                status = `Safe (${days} days)`;
                color = "#28a745";
                bg = "rgba(40, 167, 69, 0.1)";
              }

              return (
                <div key={med.id} className="med-card glass-panel">
                  
                  {/* Top Row: Title and Icons */}
                  <div className="med-card-header">
                    <h3 className="med-name">{med.name}</h3>
                    <div className="med-actions">
                      <Edit className="action-icon edit-icon" size={22} />
                      <Trash2 className="action-icon trash-icon" size={22} />
                    </div>
                  </div>
                  
                  {/* Tags Row */}
                  <div className="med-tags">
                     <span className="med-badge badge-blue">{med.category || 'Tablet'}</span>
                     {med.ocr_verified ? (
                       <span className="med-badge badge-green">✔ OCR</span>
                     ) : (
                       <span className="med-badge badge-gray">Manual</span>
                     )}
                  </div>

                  {/* Info Row: Expiry and Quantity */}
                  <div className="med-info-grid">
                    <div className="info-block">
                      <p className="info-label">Expiry Date</p>
                      <p className="info-value">{med.expiry_date}</p>
                      <p className="info-sub" style={{color: days <= 7 ? '#dc3545' : '#a0aec0'}}>
                        {days <= 0 ? 'Expired' : `${days} days left`}
                      </p>
                    </div>
                    <div className="info-block">
                      <p className="info-label">Quantity</p>
                      <p className="info-value">{med.quantity} units</p>
                      <p className="info-sub" style={{color: '#a0aec0', textTransform: 'lowercase'}}>{med.category ? `${med.category}s` : 'standard form'}</p>
                    </div>
                  </div>

                  {/* Bottom Row: Location */}
                  <div className="med-location">
                    <Package size={18} />
                    <span>{med.location || 'Medicine Cabinet'}</span>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Inventory;