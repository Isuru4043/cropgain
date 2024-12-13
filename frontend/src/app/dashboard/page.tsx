import React from "react";

import CropOverview from "../../components/CropOverview";
import FarmDetails from "../../components/FarmDetails";
import CropGrowthMonitoring from "../../components/CropGrowthMonitoring";
import MyCrops from "../../components/MyCrops";
import Weather from "../../components/Weather";

const App: React.FC = () => {
  const cropData = {
    Tea: 7450,
    Coconut: 2700,
    Cinnamon: 4500,
    Other: 2800,
  };

  const landData = {
    Tea: 20,
    Coconut: 5,
    Cinnamon: 3,
    Other: 2,
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <div
          className="text-gray-700 bg-blue-50 flex items-center space-x-4 font-roboto text-lg
          rounded-lg shadow-lg font-medium justify-center"
          style={{ width: "330px", height: "70px" }}
        >
          <Weather />
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-2">
          <CropOverview incomeData={cropData} landData={landData} />
        </section>

        <section
          className="lg:col-span-2 -ml-20 shadow-md"
          style={{ width: "112%", height: "430px" }}
        >
          <FarmDetails />
        </section>

        <section className="lg:col-span-2 flex gap-6 mt-6">
          <div className="flex-1">
            <CropGrowthMonitoring />
          </div>
          <div className="flex-1">
            <MyCrops />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
