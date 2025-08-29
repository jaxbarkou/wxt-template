import React, { useState } from "react";

import DisplayHoverCard from "./DisplayHoverCard";
import SiderIconSettings from "./SiderIconSettings";

const Sidebar = () => {
  return (
    <div className="mt-3">
      <DisplayHoverCard />
      <SiderIconSettings />
    </div>
  );
};

export default Sidebar;
