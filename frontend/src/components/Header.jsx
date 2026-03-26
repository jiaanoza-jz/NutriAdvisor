import './Header.css';

function Header({ theme, toggleTheme }) {
  return (
    <header className="app-header">
      <div className="container header-content">
        <div className="logo-group">
          <div className="logo-icon">✦</div>
          <div className="logo-text">Nutri<span className="italic">Advisor</span></div>
        </div>
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
          <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
          <span className="theme-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
