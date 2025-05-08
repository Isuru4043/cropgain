import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const YieldTracking = () => {
  const [yieldData] = useState([
    { crop: "Tea", expectedYield: 600, actualYield: 500 },
    { crop: "Coconut", expectedYield: 400, actualYield: 300 },
    { crop: "Cinnamon", expectedYield: 250, actualYield: 200 },
  ]);

  const barChartData = {
    labels: yieldData.map((item) => item.crop),
    datasets: [
      {
        label: "Expected Yield (kg)",
        data: yieldData.map((item) => item.expectedYield),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Actual Yield (kg)",
        data: yieldData.map((item) => item.actualYield),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Crop Yield Comparison",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Yield (kg)",
        },
      },
    },
  };

  return (
    <div className="p-4">
      <Bar data={barChartData} options={barChartOptions} />
    </div>
  );
};

export default YieldTracking;
