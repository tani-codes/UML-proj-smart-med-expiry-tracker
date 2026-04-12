import React from 'react';
import { Search, ShoppingCart, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import './Shop.css';

function ShopPage() {
  return (
    <div className="shop-container fade-in">
      <div className="shop-header mb-8">
        <h1 className="page-title">Live Medicine Price Comparison</h1>
        <p className="page-subtitle">Find the best prices from verified pharmacies and retailers</p>
      </div>

      {/* Search Row */}
      <div className="controls-row glass-panel mt-12 mb-16">
        <div className="search-box">
          <Search size={18} color="#888" className="search-icon" />
          <input type="text" placeholder="Enter medicine name to compare prices..." className="search-input" />
        </div>
        <div className="filters">
           <button className="shop-search-btn">
             <Search size={16} /> Search Retailers
           </button>
        </div>
      </div>

      {/* Medicine Comparison Card 1 */}
      <div className="comparison-section glass-panel">
         <div className="med-header flex justify-between items-center">
            <div className="med-info">
              <h3>Amoxicillin 500mg</h3>
              <p>Dosage: 500mg capsules  &bull;  Pack Size: 10 tablets</p>
            </div>
            <div className="save-badge">Save up to 28%</div>
         </div>

         <div className="prices-list mt-8">
            <h4 className="list-label"><ShoppingCart size={18} /> Best Prices Online</h4>
            
            <div className="price-row mt-4">
               <div className="retailer-info">
                  <div className="retailer-logo pharmeasy"></div>
                  <div>
                    <h4>PharmEasy</h4>
                    <p className="text-green text-sm">&bull; In Stock</p>
                  </div>
               </div>
               <div className="price-info">
                  <div className="price-value">₹129.00</div>
                  <div className="price-tag lowest">Lowest Price</div>
               </div>
               <button className="btn-buy">Buy Now <ExternalLink size={14}/></button>
            </div>

            <div className="price-row mt-4">
               <div className="retailer-info">
                  <div className="retailer-logo mg1"></div>
                  <div>
                    <h4>1mg (Tata 1mg)</h4>
                    <p className="text-green text-sm">&bull; In Stock</p>
                  </div>
               </div>
               <div className="price-info">
                  <div className="price-value">₹145.00</div>
                  <div className="price-tag discount">Save 23%</div>
               </div>
               <button className="btn-buy">Buy Now <ExternalLink size={14}/></button>
            </div>

            <div className="price-row mt-4">
               <div className="retailer-info">
                  <div className="retailer-logo apollo"></div>
                  <div>
                    <h4>Apollo Pharmacy</h4>
                    <p className="text-orange text-sm">&bull; Limited Stock</p>
                  </div>
               </div>
               <div className="price-info">
                  <div className="price-value">₹152.00</div>
                  <div className="price-tag discount">Save 18%</div>
               </div>
               <button className="btn-buy">Buy Now <ExternalLink size={14}/></button>
            </div>
         </div>
         <p className="disclaimer mt-8">&copy; Disclaimer: Prices updated 5 minutes ago. Clicking "Buy Now" will open the retailer's website in a new tab. MeduExp&reg; does not process transactions directly.</p>
      </div>

      {/* Medicine Comparison Card 2 (Emptyish for spacing demo) */}
      <div className="comparison-section glass-panel mt-12">
         <div className="med-header flex justify-between items-center">
            <div className="med-info">
              <h3>Ibuprofen 400mg</h3>
              <p>Dosage: 400mg tablets  &bull;  Pack Size: 15 tablets</p>
            </div>
            <div className="save-badge">Save up to 35%</div>
         </div>
         <div className="prices-list mt-8">
            <h4 className="list-label"><ShoppingCart size={18} /> Top Retailers</h4>
            <div className="price-row mt-4 ghost-row">
               <p>Searching for live prices...</p>
            </div>
         </div>
      </div>

      {/* Trust Banner */}
      <div className="trust-banner glass-panel mt-12 mb-12">
        <div className="flex items-start gap-4">
           <div className="trust-icon-box cyan-bg"><ShieldCheck size={28} /></div>
           <div className="trust-content">
              <h3>Why Trust Our Price Comparisons?</h3>
              <ul>
                <li>&bull; Real-time pricing from verified pharmacies and retailers</li>
                <li>&bull; Updated every 5 minutes to ensure accuracy</li>
                <li>&bull; Transparent pricing with no hidden fees</li>
                <li>&bull; Secure connections to trusted pharmacy partners</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
