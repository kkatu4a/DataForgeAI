import React from "react";
import type {
  GeneralAnalytics as GeneralAnalyticsType,
  ClassData,
} from "../types/types";
import ClassPieChart from "./ClassPieChart";

interface GeneralAnalyticsProps {
  general: GeneralAnalyticsType;
  classData: ClassData[];
}

const GeneralAnalytics: React.FC<GeneralAnalyticsProps> = ({
  general,
  classData,
}) => {
  return (
    <div className="general-analytics">
      <div className="general-analytics__stats">
        <div className="general-analytics__stat">
          <span className="general-analytics__stat-label">
            Уровень готовности
          </span>
          <span className="general-analytics__stat-value">
            {general.readinessLevel}%
          </span>
        </div>
        <div className="general-analytics__stat">
          <span className="general-analytics__stat-label">
            Количество объектов
          </span>
          <span className="general-analytics__stat-value">
            {general.totalObjects}
          </span>
        </div>
        <div className="general-analytics__stat">
          <span className="general-analytics__stat-label">
            Количество классов
          </span>
          <span className="general-analytics__stat-value">
            {general.totalClasses}
          </span>
        </div>
      </div>
      <div className="general-analytics__charts">
        <ClassPieChart data={classData} />
      </div>
    </div>
  );
};

export default GeneralAnalytics;
