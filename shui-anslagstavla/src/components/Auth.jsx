import { useState } from 'react';

export default function Auth({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false); 

  const baseUrl = '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isLoginMode ? '/login' : '/signup'; 

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Du har angett fel användarnamn och/eller lösenord eller att kontot ej existerar.');
        } else if (response.status === 401) {
          throw new Error('Fel användarnamn eller lösenord.');
        } else if (response.status === 409) {
          throw new Error('Användarnamnet är redan upptaget.');
        } else {
          throw new Error('Något gick fel på servern. Försök igen om en stund.');
        }
      }

      const data = await response.json();

     if (isLoginMode) {
        const actualToken = typeof data === 'string' ? data : data.token;

        if (actualToken) { 
          // Spara säkert i Session Storage
          sessionStorage.setItem('shui_token', actualToken);
          // Uppdatera app-state så vi loggas in
          setToken(actualToken);
        } else {
          throw new Error('Inloggningen lyckades, men vi fick ingen token tillbaka.');
        }
      } else {
        alert('Ditt konto är skapat! Du kan nu logga in.');
        setIsLoginMode(true);
        setPassword('');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-container card">
      <h2>{isLoginMode ? 'Logga in' : 'Skapa konto'}</h2>
      
      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Användarnamn</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            placeholder="Ditt unika användarnamn"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Lösenord</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Ditt hemliga lösenord"
          />
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Laddar...' : (isLoginMode ? 'Logga in' : 'Skapa konto')}
        </button>
      </form>

      <p className="toggle-text">
        {isLoginMode ? 'Har du inget konto?' : 'Har du redan ett konto?'}
        <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="link-btn">
          {isLoginMode ? 'Skapa ett här' : 'Logga in här'}
        </button>
      </p>
    </section>
  );
}