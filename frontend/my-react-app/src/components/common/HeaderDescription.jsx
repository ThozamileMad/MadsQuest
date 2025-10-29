import React from "react";

function HeaderDescription({
  containerClassName = "",
  headerClassName = "",
  descriptionClassName = "",
  title = "",
  description = "",
}) {
  return (
    <section className={containerClassName}>
      <h1 className={headerClassName}>{title}</h1>
      <p className={descriptionClassName}>{description}</p>
    </section>
  );
}

export default HeaderDescription;
