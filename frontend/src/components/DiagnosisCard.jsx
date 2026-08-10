function DiagnosisCard({ disease = "Awaiting analysis", confidence = "N/A" }) {
  return (
    <article className="panel diagnosis-card">
      <h2>Possible Condition</h2>
      <p>{disease}</p>
      <p>Confidence: {confidence}</p>
    </article>
  );
}

export default DiagnosisCard;
