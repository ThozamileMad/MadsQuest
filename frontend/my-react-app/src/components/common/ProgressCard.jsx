function ProgressCard({
  containerClassName = "",
  labelClassName = "",
  valueClassName = "",
  label = "",
  value = "",
}) {
  return (
    <div className={containerClassName}>
      <div className={labelClassName}>{label}</div>
      <div className={valueClassName}>{value}</div>
    </div>
  );
}

export default ProgressCard;
