import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import "../../../../../lib/chartConfig";

const HarvestAnalytics = () => {
  const [cropData] = useState([
    { crop: "Tea", yield: 500 },
    { crop: "Coconut", yield: 300 },
    { crop: "Cinnamon", yield: 200 },
  ]);

  const totalYield = cropData.reduce((sum, crop) => sum + crop.yield, 0);

  const pieChartData = {
    labels: cropData.map((crop) => crop.crop),
    datasets: [
      {
        data: cropData.map((crop) => crop.yield),
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
      },
    ],
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Pie Chart */}
        <div className="w-full md:w-1/2">
          <h3 className="text-2xl font-semibold mb-2">Yield Distribution</h3>
          <Pie
            data={pieChartData}
            options={{
              plugins: {
                legend: { position: "bottom" },
                title: { display: true, text: "Crop Yield Distribution" },
              },
            }}
          />
        </div>

        {/* Yield Details */}
        <div className="w-full md:w-1/2">
          <h3 className="text-2xl font-semibold mb-2">Yield Summary</h3>
          <ul className="space-y-2">
            {cropData.map((crop, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded-md shadow-md flex justify-between"
              >
                <span>{crop.crop}</span>
                <span>{((crop.yield / totalYield) * 100).toFixed(2)}%</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-lg font-semibold">
            Total Yield: <span className="text-green-600">{totalYield} kg</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HarvestAnalytics;
