import './ResultPanel.css';

function ResultPanel({ data, onReset }) {
  const {
    detected_foods,
    total_calories,
    macros,
    health_score,
    health_score_reason,
    per_item_calories,
    advice,
    healthier_swaps,
    imageFile
  } = data;

  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : null;

  return (
    <div className="result-panel animate-fade-up">
      <div className="result-header">
        {imageUrl && (
          <div className="thumbnail-container">
            <img src={imageUrl} alt="Analyzed meal" className="meal-thumbnail" />
          </div>
        )}
        <div className="headline-stats">
          <div className="stat-badge calorie-badge">
            <span className="stat-value">{total_calories}</span>
            <span className="stat-label">kcal</span>
          </div>
          <div className="stat-badge health-badge">
            <span className="stat-value">{health_score}<span className="of-ten">/10</span></span>
            <span className="stat-label">Health Score</span>
          </div>
        </div>
      </div>

      <div className="detected-foods">
        {detected_foods?.map((food, i) => (
          <span key={i} className="food-tag">{food}</span>
        ))}
      </div>

      <div className="macros-grid">
        <div className="macro-card protein">
          <span className="macro-label">Protein</span>
          <span className="macro-value">{macros?.protein_g}g</span>
        </div>
        <div className="macro-card carbs">
          <span className="macro-label">Carbs</span>
          <span className="macro-value">{macros?.carbs_g}g</span>
        </div>
        <div className="macro-card fat">
          <span className="macro-label">Fat</span>
          <span className="macro-value">{macros?.fat_g}g</span>
        </div>
        <div className="macro-card fiber">
          <span className="macro-label">Fiber</span>
          <span className="macro-value">{macros?.fiber_g}g</span>
        </div>
      </div>

      <div className="details-grid">
        <div className="card calorie-breakdown">
          <h3>Calorie Breakdown</h3>
          <div className="items-list">
            {per_item_calories?.map((item, i) => {
              const percentage = Math.round((item.calories / total_calories) * 100) || 0;
              return (
                <div key={i} className="item-row">
                  <div className="item-info">
                    <span className="item-name">{item.item}</span>
                    <span className="item-cals">{item.calories} kcal</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="advice-section">
          <div className="card advice-card">
            <h3>Personalised Advice</h3>
            <p className="reason-text">{health_score_reason}</p>
            <p className="advice-text">{advice}</p>
          </div>

          {healthier_swaps && healthier_swaps.length > 0 && (
            <div className="card swaps-card">
              <h3>Healthier Swaps</h3>
              <ul className="swaps-list">
                {healthier_swaps.map((swap, i) => (
                  <li key={i}>
                    <span className="swap-icon">↗</span>
                    {swap}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <button onClick={onReset} className="reset-btn">
        ← Analyse another meal
      </button>
    </div>
  );
}

export default ResultPanel;
