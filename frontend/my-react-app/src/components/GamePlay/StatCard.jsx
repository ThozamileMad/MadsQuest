function StatCard({ icon, label, value, changeClassname = "", change = 0 }) {
  const getChangeClassname = () => {
    if (change < 0) {
      return "negative";
    } else if (change > 0) {
      return "positive";
    } else {
      return "hide";
    }
  };

  return (
    <div className="stat-item">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">
          {value}
          <span className={"stat-change " + getChangeClassname()}>
            {change > 0 ? `+${change}` : change}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
