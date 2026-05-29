import React from 'react';
import Login from './components/Login';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f1f5f9', // Gris claro formal y profesional (Slate 100)
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      margin: 0,
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <Login />
    </div>
  );
}

export default App;