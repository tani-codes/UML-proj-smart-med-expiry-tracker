import React from 'react';
import { Plus, Search, BarChart2, Filter, Package } from 'lucide-react';
import './Inventory.css';

function Inventory() {
  return (
    <div className="inventory-container fade-in">
      <div className="inventory-header flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Medicine Inventory</h1>
          <p className="page-subtitle">Complete list of all medicines in your tracking system</p>
        </div>
        <button className="btn btn-primary add-med-btn">
          <Plus size={18} /> Add Medicine
        </button>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card glass-panel">
          <h2 className="stat-number">0</h2>
          <p className="stat-label">Total Items</p>
        </div>
        <div className="stat-card glass-panel highlight-card">
          <h2 className="stat-number">0</h2>
          <p className="stat-label">Categories</p>
        </div>
        <div className="stat-card glass-panel">
          <h2 className="stat-number">0</h2>
          <p className="stat-label">Total Units</p>
        </div>
        <div className="stat-card glass-panel ocr-card">
          <h2 className="stat-number" style={{visibility: 'hidden'}}>0</h2>
          <p className="stat-label">OCR Verified</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="controls-row glass-panel mt-12">
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

      {/* Table Placeholder */}
      <div className="table-container mt-12">
        <div className="empty-state text-center glass-panel">
           <Package size={56} color="#a0aec0" className="mb-6" />
           <h2 className="mb-4">Your inventory is empty</h2>
           <p className="text-muted">Add medicines manually or use the OCR Scanner</p>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
