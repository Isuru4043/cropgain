"use client";

import { Chart as ChartJS, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register all Chart.js components
ChartJS.register(...registerables);

// Optionally register plugins
ChartJS.register(ChartDataLabels);

// Add any global defaults here
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

// Export for use in components
export { ChartJS };
