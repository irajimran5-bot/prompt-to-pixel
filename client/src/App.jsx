import { useState } from "react";
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stylesList = [
    { id: 'cyberpunk', label: '⚡ Cyberpunk', value: 'cyberpunk style, neon lighting, highly detailed, 8k resolution' },
    { id: 'anime', label: '🌸 Anime', value: 'anime aesthetic, studio ghibli vibe, vibrant colors, makoto shinkai' },
    { id: 'cinematic', label: '🎬 Cinematic', value: 'cinematic lighting, 35mm photograph, dramatic atmosphere, photorealistic' },
    { id: '3d', label: '🚀 3D Render', value: 'unreal engine 5 render, blender 3d, claymation style, cute and isometric' },
    { id: 'oil', label: '🎨 Oil Painting', value: 'classic oil painting texture, van gogh brushstrokes, canvas masterpiece' }
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setImage(null);

    try {
      // Combine user prompt with the selected style tag
      const finalPrompt = selectedStyle 
        ? `${prompt}, ${selectedStyle}`
        : prompt;

      const seed = Math.floor(Math.random() * 100000);
      const targetUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;

      // Directly set the source URL to the image state
      setImage(targetUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to map the image path correctly.");
      setLoading(false);
    }
  };

  // Turn off loading spinner only when the HTML image finishes downloading/rendering
  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="background-glow"></div>
      
      <header className="app-header">
        <h1 className="logo-text">Prompt To <span>Pixels</span></h1>
        <p className="developer-tag">Designed by Iraj Imran</p>
      </header>

      <main className="main-content">
        <form onSubmit={handleGenerate} className="glass-card control-panel">
          <div className="input-group">
            <input
              type="text"
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="styled-input"
            />
            <button type="submit" className="glow-btn" disabled={!prompt.trim()}>
              Generate
            </button>
          </div>

          {/* Style Presets Container */}
          <div className="style-section">
            <p className="section-title">Enhance with Style Presets:</p>
            <div className="chips-container">
              {stylesList.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className={`style-chip ${selectedStyle === style.value ? 'active' : ''}`}
                  onClick={() => setSelectedStyle(selectedStyle === style.value ? '' : style.value)}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Display Studio Container */}
        <div className="glass-card display-studio">
          {error && <p className="error-text"> {error}</p>}
          
          {loading && (
            <div className="loader-box">
              <div className="neon-spinner"></div>
              <p className="loading-text">Weaving your pixels together...</p>
            </div>
          )}

          {/* Hidden image logic to handle loading accurate states */}
          {image && (
            <div className={`result-wrapper ${loading ? 'hidden' : 'fade-in'}`}>
              <img 
                src={image} 
                alt={prompt} 
                className="generated-image" 
                onLoad={handleImageLoad}
                onError={() => { setError("Error loading image asset."); setLoading(false); }}
              />
              <div className="action-row">
                <p className="active-prompt-display">" {prompt} "</p>
                <a href={image} target="_blank" rel="noreferrer" className="action-btn download">
                  Open Original / Save
                </a>
              </div>
            </div>
          )}

          {!image && !loading && !error && (
            <div className="placeholder-box">
              <div className="placeholder-icon">🎨</div>
              <p>Your studio is ready. Type a prompt above to turn your imagination into reality.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;