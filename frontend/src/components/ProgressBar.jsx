function ProgressBar({ value, total }) {
  const percentage = total > 0 ? Math.max((value / total) * 100, 2) : 0;

  return (
    <div className="progress-wrap">
      <div className="progress-bar">
        <span className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <p className="progress-text">
        {value}/{total} answered
      </p>
    </div>
  );
}

export default ProgressBar;
