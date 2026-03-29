import { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './App.css';
import logoUrl from './assets/logotyp.shui.png';

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('shui_token') || null);

  const handleLogout = () => {
    sessionStorage.removeItem('shui_token');
    setToken(null);
  };

  return (
    <div className="app-container">
      <header>
      <img 
          src={logoUrl}
          alt="Shui Logotyp" 
          className="logo" 
        />
        
        {token && <button onClick={handleLogout}>Logga ut</button>}
      </header>

      <main>
        {!token ? (
          <Auth setToken={setToken} /> 
        ) : (
          <Dashboard token={token} />
        )}
      </main>
    </div>
  );
}

export default App;