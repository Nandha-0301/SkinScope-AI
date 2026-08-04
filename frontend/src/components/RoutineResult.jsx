function RoutineResult({ data, onDownloadPdf, onFindNearby }) {
  if (!data) return null;

  const confidenceValue = Number.parseFloat(data.accuracy);
  const confidenceTier = Number.isNaN(confidenceValue)
    ? "confidence-medium"
    : confidenceValue >= 80
      ? "confidence-high"
      : confidenceValue >= 50
        ? "confidence-medium"
        : "confidence-low";

  return (
    <div className="diagnosis-content">
      <div className="diagnosis-header">
        <h2>AI Skincare Analysis</h2>
        <span className={`confidence-badge ${confidenceTier}`}>
          {Number.isNaN(confidenceValue) ? data.accuracy : `${confidenceValue}%`}
        </span>
      </div>

      <div className="info-block prediction-highlight">
        <h4>Main Concern</h4>
        <h2 className="disease-name">{data.concerns}</h2>
      </div>

      <div className="diagnosis-grid">
        <div className="info-block">
          <h4>Skin Type Detected</h4>
          <p>{data.skinType}</p>
        </div>
        <div className="info-block">
          <h4>Ingredients to Avoid</h4>
          <p>{data.ingredientsToAvoid}</p>
        </div>
        <div className="info-block">
          <h4>Morning Routine</h4>
          <p>{data.recommendedRoutine?.morning}</p>
        </div>
        <div className="info-block">
          <h4>Evening Routine</h4>
          <p>{data.recommendedRoutine?.evening}</p>
        </div>
        <div className="info-block">
          <h4>Lifestyle Tips</h4>
          <p>{data.lifestyleTips}</p>
        </div>
      </div>

      {data.top3?.length > 0 && (
        <div className="info-block top-predictions">
          <h4>Alternative Predictions</h4>
          <div className="prediction-list">
            {data.top3.map((item, index) => (
              <div className="prediction-row" key={`${item.label}-${index}`}>
                <span>{item.label}</span>
                <div className="bar">
                  <div style={{ width: `${item.confidence}%` }} />
                </div>
                <span>{item.confidence}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="capture-actions">
        <button type="button" className="pdf-button" onClick={onDownloadPdf}>
          Download Routine as PDF
        </button>
        <button type="button" className="map-button" onClick={onFindNearby}>
          Find Dermatologists Nearby
        </button>
      </div>
    </div>
  );
}

export default RoutineResult;
