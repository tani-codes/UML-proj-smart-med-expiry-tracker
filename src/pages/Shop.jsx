import React, { useState } from 'react';
import { Search, ExternalLink, Activity, Info, CheckCircle2, TrendingDown, Store, Medal, Pill, Box, Microscope } from 'lucide-react';
import './Shop.css';
import fullMedicines from '../data/medicinesDb.json';

function ShopPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Initialize with Amoxicillin visible on load as shown in the screenshot
  const [displayData, setDisplayData] = useState(fullMedicines.slice(0, 2));

  const handleSearch = () => {
    if (!query.trim()) {
      setDisplayData(fullMedicines);
      return;
    }
    const filtered = fullMedicines.filter(m =>
      m.name.toLowerCase().includes(query.toLowerCase())
    );
    setDisplayData(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const getPharmacyLogo = (logoKey) => {
    switch(logoKey) {
      case 'pharmeasy': return <Box size={22} color="#d946ef" />;
      case '1mg': return <Pill size={22} color="#ef4444" />;
      case 'apollo': return <Activity size={22} color="#3b82f6" />;
      case 'netmeds': return <Microscope size={22} color="#8b5cf6" />;
      default: return <Box size={22} color="#94a3b8" />;
    }
  };

  return (
    <div className="fade-in app-container" style={{ padding: '0 2rem 4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '2.5rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>Live Medicine Price Comparison</h1>
        <p style={{ fontSize: '1rem', color: '#475569', fontWeight: 500 }}>Find the best prices from verified pharmacies and retailers</p>
      </div>

      {/* SEARCH BOX */}
      <div style={{ 
        background: 'white', 
        borderRadius: '50px', 
        display: 'flex', 
        padding: '0.4rem', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)', 
        marginBottom: '3.5rem',
        border: '1px solid #f1f5f9'
      }}>
        <input
          type="text"
          placeholder="Enter medicine name to Compare..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if(e.target.value === '') setDisplayData(fullMedicines);
          }}
          onKeyDown={handleKeyDown}
          style={{ 
            flex: 1, 
            border: 'none', 
            background: 'transparent', 
            padding: '0 1.5rem', 
            outline: 'none', 
            fontSize: '1rem',
            color: '#334155'
          }}
        />
        <button 
          onClick={handleSearch}
          style={{ 
            background: '#bae6fd', 
            color: '#0369a1', 
            borderRadius: '50px', 
            padding: '0.8rem 2.2rem', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          <Search size={18} /> Search
        </button>
      </div>

      {/* RESULTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {displayData.map((med, i) => {
          // Math calculations
          const lowestPrice = Math.min(...med.prices.map(p => p.price));
          const sortedPrices = [...med.prices].sort((a, b) => a.price - b.price);
          
          // Calculate max savings for the banner
          const maxSavingsObj = sortedPrices[0];
          const maxSavingsPercent = Math.round(((maxSavingsObj.mrp - maxSavingsObj.price) / maxSavingsObj.mrp) * 100);

          return (
            <div key={i} className="fade-in" style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              
              {/* TOP HEADER SECTION */}
              <div style={{ background: '#f0fdfa', padding: '1.8rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #ccfbf1' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.6rem 0' }}>{med.name}</h2>
                  <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
                    <span>Dosage: {med.dosage}</span>
                    <span style={{ color: '#cbd5e1' }}>•</span>
                    <span>Pack Size: {med.packSize}</span>
                  </div>
                </div>
                <div style={{ background: '#06b6d4', color: 'white', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 10px rgba(6, 182, 212, 0.3)' }}>
                  <TrendingDown size={14} /> Save up to {maxSavingsPercent}%
                </div>
              </div>

              {/* TABLE AREA */}
              <div style={{ padding: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.05rem', color: '#1e293b', marginBottom: '1.5rem', fontWeight: 700 }}>
                  <Store size={18} color="#0284c7" /> Best Prices Online
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {sortedPrices.map((p, idx) => {
                    const isBest = p.price === lowestPrice;
                    const savePercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                    
                    return (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '1.2rem', 
                        border: '1px solid #f1f5f9', 
                        borderRadius: '16px', 
                        background: '#fafaf9',
                        transition: 'all 0.2s',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', minWidth: '200px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                            {getPharmacyLogo(p.logo)}
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#334155' }}>{p.site}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: p.stock.includes("Out") ? '#ef4444' : '#10b981', fontSize: '0.8rem', marginTop: '0.2rem', fontWeight: 500 }}>
                              <CheckCircle2 size={12} /> {p.stock}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                          <div style={{ textAlign: 'right', minWidth: '80px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>₹{p.price.toFixed(2)}</h3>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 500 }}>₹{p.mrp.toFixed(2)}</span>
                          </div>

                          <div style={{ minWidth: '100px', display: 'flex', justifyContent: 'center' }}>
                            {isBest ? (
                              <span style={{ background: '#cffafe', color: '#0891b2', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Medal size={14} /> Lowest Price
                              </span>
                            ) : (
                              <span style={{ background: '#ffedd5', color: '#ea580c', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                                Save {savePercent}%
                              </span>
                            )}
                          </div>

                          <a 
                            href={p.link} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ 
                              background: '#cffafe', 
                              color: '#0891b2', 
                              border: 'none', 
                              padding: '0.6rem 1.2rem', 
                              borderRadius: '50px', 
                              fontWeight: 600, 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem', 
                              fontSize: '0.85rem',
                              textDecoration: 'none',
                              transition: 'all 0.2s',
                              pointerEvents: p.stock.includes("Out") ? 'none' : 'auto',
                              opacity: p.stock.includes("Out") ? 0.5 : 1
                            }}
                          >
                            Buy Now <ExternalLink size={14} />
                          </a>
                        </div>

                      </div>
                    );
                  })}
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem 1.2rem', borderRadius: '12px', marginTop: '1.8rem', color: '#64748b', fontSize: '0.75rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start', border: '1px solid #f1f5f9' }}>
                  <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} /> 
                  <span style={{ lineHeight: 1.5 }}>Disclaimer: Prices updated 5 minutes ago. Clicking "Buy Now" will open the retailer's website in a new tab. MeduExp® does not process transactions directly.</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {displayData.length === 0 && (
         <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
            <p style={{ fontSize: '1.1rem' }}>No medicines found. Try searching for "Amoxicillin" or "Dolo".</p>
         </div>
      )}

    </div>
  );
}

export default ShopPage;