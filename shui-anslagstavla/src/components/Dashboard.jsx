import { useState, useEffect } from 'react';

export default function Dashboard({ token }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const baseUrl = '/api';

  const sanitizeInput = (input) => {
    if (!input) return '';
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

const fetchPosts = async () => {
    try {
      const response = await fetch(`${baseUrl}/posts`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        throw new Error('Kunde inte hämta inläggen. Är du säker på att du är inloggad?');
      }

      const data = await response.json();
      
      console.log("Svar från API när vi hämtar inlägg:", data);

      if (Array.isArray(data)) {
        setPosts(data);
      } else if (data && Array.isArray(data.posts)) {
        setPosts(data.posts);
      } else {
        console.error("Oväntat format från API:", data);
        setPosts([]);
      }
      
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const safeTitle = sanitizeInput(title);
    const safeContent = sanitizeInput(content);

    try {
      const response = await fetch(`${baseUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
    
        body: JSON.stringify({ 
          title: safeTitle, 
          content: safeContent 
        })
      });

      if (!response.ok) {
        throw new Error('Kunde inte publicera inlägget.');
      }

      setSuccess('Inlägget har publicerats!');
      setTitle(''); 
      setContent('');
      fetchPosts();

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <section className="card post-section">
        <h2>Skriv ett nytt inlägg</h2>
        
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <form onSubmit={handleCreatePost}>
          <div className="form-group">
            <label>Titel</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Innehåll</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="4" required />
          </div>
          <button type="submit" className="primary-btn">Posta inlägg</button>
        </form>
      </section>

      <section className="view-posts-section">
        <h2>Dina inlägg</h2>
        {posts.length === 0 ? (
          <p>Det finns inga inlägg att visa ännu.</p>
        ) : (
          <div className="posts-list">
            {posts.map((post, index) => (
              <article key={index} className="card post-card">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}