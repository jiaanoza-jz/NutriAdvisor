import { useState, useRef } from 'react';
import './UploadPanel.css';

const GOALS = ['General Health', 'Weight Loss', 'Muscle Gain', 'Maintenance'];

function UploadPanel({ onAnalyze, isLoading, error }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [goal, setGoal] = useState('General Health');
  const [notes, setNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onAnalyze(file, goal, notes);
    }
  };

  return (
    <div className="upload-panel animate-fade-up">
      <h1 className="hero-heading">
        Know what's on <br /><span className="italic accent-text">your plate</span>
      </h1>
      
      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} className="upload-form card">
        <div 
          className={`drop-zone ${isDragging ? 'dragging' : ''} ${preview ? 'has-image' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !preview && fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Food preview" className="image-preview" />
              <button 
                type="button" 
                className="remove-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
              >✕</button>
            </div>
          ) : (
            <div className="drop-content">
              <div className="upload-icon">📸</div>
              <p>Click or drag an image here</p>
              <span className="file-hint">JPG, PNG, WEBP up to 5MB</span>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFile(e.target.files?.[0])} 
            accept="image/jpeg, image/png, image/webp" 
            hidden 
          />
        </div>

        <div className="form-section">
          <h3>Your Goal</h3>
          <div className="goal-chips">
            {GOALS.map(g => (
              <button
                key={g}
                type="button"
                className={`chip ${goal === g ? 'active' : ''}`}
                onClick={() => setGoal(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Dietary Notes <span className="optional">(optional)</span></h3>
          <input 
            type="text" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. vegetarian, gluten-free, low sodium"
            className="notes-input"
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={!file || isLoading}
        >
          {isLoading ? <span className="spinner"></span> : 'Analyse Nutrition →'}
        </button>
      </form>
    </div>
  );
}

export default UploadPanel;
