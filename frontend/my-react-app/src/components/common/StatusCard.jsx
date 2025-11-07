function StatusCard({
  containerClassName = "",
  thirdDescriptionClassname = "",

  firstDescription = "",
  secondDescription = "",
  thirdDescription = "",
}) {
  return (
    <div className={containerClassName} _>
      <p>{firstDescription}</p>
      <p>{secondDescription}</p>
      <div className={thirdDescriptionClassname}>{thirdDescription}</div>
    </div>
  );
}

export default StatusCard;
