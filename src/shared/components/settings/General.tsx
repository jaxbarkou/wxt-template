import React from "react";
import DisplayHoverCard from "./DisplayHoverCard";

const General: React.FC = () => {
  return (
    <div className="">
      {/* General Settings Section */}
      <div className="mb-4">
        <h2 className="text-base font-normal text-variable-collection mb-3">
          General
        </h2>
        <DisplayHoverCard />
      </div>
    </div>
  );
};

export default General; 