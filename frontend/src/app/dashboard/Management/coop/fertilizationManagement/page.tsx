"use client";
import React, { useState } from "react";

const FertilizationIrrigationManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const handleAddNewSchedule = () => {
    setShowForm(true);
    setViewAll(false); // Hide table if form is shown
    setSearchQuery(""); // Reset search when adding a new schedule
  };

  const handleViewAllSchedules = () => {
    setViewAll(true);
    setShowForm(false); // Hide form if table is shown
    setSearchQuery(""); // Reset search when viewing all schedules
  };

  // Dummy data for schedules
  const schedules = [
    {
      id: 1,
      crop: "Tea",
      fertilizerType: "Nitrogen-based",
      applicationDate: "2025-01-10",
      frequency: "Monthly",
    },
    {
      id: 2,
      crop: "Coconut",
      fertilizerType: "Phosphorous-based",
      applicationDate: "2025-02-05",
      frequency: "Quarterly",
    },
    {
      id: 3,
      crop: "Cinnamon",
      fertilizerType: "Potassium-based",
      applicationDate: "2025-03-15",
      frequency: "Bi-monthly",
    },
    // Add more schedules as needed
  ];

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered schedules based on search query
  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.fertilizerType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.applicationDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.frequency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-4/5 bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Buttons */}
        <div className="flex space-x-2">
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
            onClick={handleAddNewSchedule}
          >
            Add New Schedule
          </button>
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
            onClick={handleViewAllSchedules}
          >
            View All Schedules
          </button>
        </div>

        {/* Search Bar */}
        {viewAll && (
          <div className="w-1/3">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search schedules..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      {viewAll ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 rounded-md shadow-md">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="text-left px-4 py-2">Crop</th>
                <th className="text-left px-4 py-2">Fertilizer Type</th>
                <th className="text-left px-4 py-2">Application Date</th>
                <th className="text-left px-4 py-2">Frequency</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{schedule.crop}</td>
                    <td className="px-4 py-2">{schedule.fertilizerType}</td>
                    <td className="px-4 py-2">{schedule.applicationDate}</td>
                    <td className="px-4 py-2">{schedule.frequency}</td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:underline">
                        Edit
                      </button>{" "}
                      |{" "}
                      <button className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center px-4 py-2 text-gray-600"
                  >
                    No schedules found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : showForm ? (
        <form className="bg-gray-50 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Add New Fertilization Schedule
          </h2>

          {/* Form Fields */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Crop
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter crop name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Fertilizer Type
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter fertilizer type"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Application Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Frequency
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter frequency (e.g., Monthly)"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          >
            Submit
          </button>
        </form>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Welcome to Fertilization and Irrigation Management
          </h2>
          <p className="text-gray-600">
            Select a module from the left sidebar to begin managing your
            fertilization schedules.
          </p>
        </div>
      )}
    </div>
  );
};

export default FertilizationIrrigationManagement;
