import React from "react";

interface RoadmapBlockProps {
  text: string;
}

const RoadmapBlock: React.FC<RoadmapBlockProps> = ({ text }) => {
  return (
    <div className="roadmap-block">
      <div className="roadmap-block__icon"></div>
      <div className="roadmap-block__content">
        <p className="roadmap-block__text">{text}</p>
      </div>
    </div>
  );
};

export default RoadmapBlock;
