import React from "react";

function StoryText({ textSizeClassName, themeClassName, paragraphs }) {
  return (
    <div className={`story-text ${textSizeClassName} ${themeClassName}`}>
      {paragraphs.map((text, index) => {
        return <p key={index}>{text}</p>;
      })}
    </div>
  );
}

export default StoryText;
