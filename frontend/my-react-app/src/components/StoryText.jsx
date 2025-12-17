import React from "react";

function StoryText({ paragraphs }) {
  return (
    <div className="story-text">
      {paragraphs.map((item, key) => {
        return <p key={key}>{item}</p>;
      })}
    </div>
  );
}

export default StoryText;
