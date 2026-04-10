import React from 'react';

function Placeholder({ title }) {
  return (
    <div className="placeholder-container glass-panel fade-in" style={{ padding: '4rem', textAlign: 'center', margin: '2rem 0' }}>
      <h1>{title} Page</h1>
      <p style={{ marginTop: '1rem', color: '#5a6d80' }}>This feature is coming soon to MeduExp!</p>
    </div>
  );
}

export const Shop = () => <Placeholder title="Shop" />;
export const Alert = () => <Placeholder title="Alerts" />;
export const Settings = () => <Placeholder title="Settings" />;
