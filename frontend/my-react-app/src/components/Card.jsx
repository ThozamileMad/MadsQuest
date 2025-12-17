import React from "react";

function Card({
  containerClassName,
  iconClassName,
  headerClassName,
  descriptionClassName,
  icon,
  title,
  description,
}) {
  return (
    <div className={containerClassName}>
      <div className={iconClassName}>{icon}</div>
      <h3 className={headerClassName}>{title}</h3>
      <p className={descriptionClassName}>{description}</p>
    </div>
  );
}

export default Card;
