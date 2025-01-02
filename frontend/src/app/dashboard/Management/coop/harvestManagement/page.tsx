"use client";
import React, { useState } from "react";

const HarvestManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddNewSchedule = () => {
    setShowForm(true);
    setViewAll(false);
    setSearchQuery("");
  };

  const handleViewAllSchedules = () => {
    setViewAll(true);
    setShowForm(false);
    setSearchQuery("");
  };

  // Dummy data for harvest schedules
  const schedules = [
    {
      id: 1,
      cropName: "Tea",
      area: "Section A",
      date: "2025-01-10",
      tasks: "Plucking and Packing",
    },
    {
      id: 2,
      cropName: "Coconut",
      area: "Section C",
      date: "2025-01-12",
      tasks: "Harvest and Transport",
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
      schedule.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.tasks.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-4/5 bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Buttons */}
        <div className="flex space-x-2">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
            onClick={handleAddNewSchedule}
          >
            Add New Schedule
          </button>
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      {viewAll ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 rounded-md shadow-md">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="text-left px-4 py-2">Crop Name</th>
                <th className="text-left px-4 py-2">Area</th>
                <th className="text-left px-4 py-2">Scheduled Date</th>
                <th className="text-left px-4 py-2">Tasks</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className="border-b hover:bg-gray-100"
                  >
                    <td className="px-4 py-2">{schedule.cropName}</td>
                    <td className="px-4 py-2">{schedule.area}</td>
                    <td className="px-4 py-2">{schedule.date}</td>
                    <td className="px-4 py-2">{schedule.tasks}</td>
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
            Add New Harvest Schedule
          </h2>

          {/* Form Fields */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Crop Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter crop name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Area
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter area (e.g., Section A)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Scheduled Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Assigned Tasks
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter tasks for this schedule"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
          >
            Submit
          </button>
        </form>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Welcome to Harvest Management
          </h2>
          <p className="text-gray-600">
            Select a module from the left sidebar to begin managing your harvest schedules and yields.
          </p>
        </div>
      )}
    </div>
  );
};

export default HarvestManagement;
