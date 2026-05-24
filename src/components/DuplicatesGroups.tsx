import React from "react";

interface DuplicatesGroupsProps {
  groups: Array<{
    groupName: string;
    images: string[];
  }>;
}

const DuplicatesGroups: React.FC<DuplicatesGroupsProps> = ({ groups }) => {
  return (
    <div className="duplicates-groups">
      <div className="duplicates-groups__scroll-wrapper">
        {groups.map((group, index) => (
          <div key={index} className="duplicates-groups__group">
            <div className="duplicates-groups__group-header">
              <span className="duplicates-groups__group-name">
                {group.groupName}
              </span>
              <span className="duplicates-groups__group-count">
                ({group.images.length} фото)
              </span>
            </div>
            <div className="duplicates-groups__group-content">
              <div className="duplicates-groups__images">
                {group.images.map((imageUrl, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={imageUrl}
                    alt={`duplicate-${index}-${imgIndex}`}
                    className="duplicates-groups__thumbnail"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DuplicatesGroups;
