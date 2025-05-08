import React, { useState, useEffect } from "react";
import {
  faUsers,
  faChartLine,
  faCalendarAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DashboardStats {
  totalWorkers: number;
  activeProjects: number;
  upcomingTasks: number;
  alerts: number;
}

export default function DashboardCards() {
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkers: 0,
    activeProjects: 0,
    upcomingTasks: 0,
    alerts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/workers/stats`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch worker statistics");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Workers",
      value: stats.totalWorkers,
      icon: faUsers,
      color: "bg-blue-600",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: faChartLine,
      color: "bg-green-600",
    },
    {
      title: "Upcoming Tasks",
      value: stats.upcomingTasks,
      icon: faCalendarAlt,
      color: "bg-yellow-600",
    },
    {
      title: "Alerts",
      value: stats.alerts,
      icon: faExclamationTriangle,
      color: "bg-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm">{card.title}</p>
            <p className="text-2xl font-semibold mt-1">{card.value}</p>
          </div>
          <div className={`${card.color} p-3 rounded-full text-white`}>
            <FontAwesomeIcon icon={card.icon} className="text-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
