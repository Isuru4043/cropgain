"use client";

import React, { useState } from "react";
import HarvestAnalytics from "./HarvestAnalytics";
import HarvestScheduling from "./HarvestScheduling";
import PostHarvestHandling from "./PostHarvestHandling";
import YieldTracking from "./YieldTracking";

const HarvestManagementPage = () => {
  const [selectedModule, setSelectedModule] = useState<string>("Harvest Analytics");

  const renderModule = () => {
    switch (selectedModule) {
      case "Harvest Analytics":
        return <HarvestAnalytics />;
      case "Harvest Scheduling":
        return <HarvestScheduling />;
      case "Post-Harvest Handling":
        return <PostHarvestHandling />;
      case "Yield Tracking":
        return <YieldTracking />;
      default:
        return <div>Select a module from the navigation bar.</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <nav className="bg-green-200 p-4">
        <ul className="flex space-x-44">
          {[
            "Harvest Scheduling",
            "Harvest Analytics",
            "Post-Harvest Handling",
            "Yield Tracking"
          ].map((module) => (
            <li
              key={module}
              className={`cursor-pointer px-3 py-2 rounded-md text-gray-800 font-medium ${
                selectedModule === module
                  ? "bg-green-400 text-white"
                  : "hover:bg-green-300"
              }`}
              onClick={() => setSelectedModule(module)}
            >
              {module}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        {renderModule()}
      </div>
    </div>
  );
};

export default HarvestManagementPage;