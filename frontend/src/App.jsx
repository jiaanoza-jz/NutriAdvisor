import { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadPanel from './components/UploadPanel';
import ResultPanel from './components/ResultPanel';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAnalyze = async (imageFile, goal, notes) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('goal', goal);
      formData.append('dietary_notes', notes || '');

      // 1. Grab the Vercel URL if deployed, otherwise fallback to local testing
      // Note: Make sure your VITE_API_URL in Vercel does NOT end with a slash (/)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      // 2. Use the dynamic URL for the fetch request
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to analyze the image');
      }

      const data = await response.json();
      setAnalysisResult({ ...data, imageFile });
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="app-container">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container main-content">
        {!analysisResult ? (
          <UploadPanel 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading} 
            error={error} 
          />
        ) : (
          <ResultPanel 
            data={analysisResult} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
