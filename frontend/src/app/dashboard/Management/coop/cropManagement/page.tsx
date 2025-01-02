"use client";
import React, { useState } from "react";

const CropManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const handleAddNewCrop = () => {
    setShowForm(true);
    setViewAll(false); // Hide table if form is shown
    setSearchQuery(""); // Reset search when adding a new crop
  };

  const handleViewAllCrops = () => {
    setViewAll(true);
    setShowForm(false); // Hide form if table is shown
    setSearchQuery(""); // Reset search when viewing all crops
  };

  // Dummy data for crops
  const crops = [
    {
      id: 1,
      name: "Tea",
      category: "Beverage",
      growthCycle: 180,
      optimalConditions: "Cool climate, well-drained soil",
      yield: "500kg/acre",
    },
    {
      id: 2,
      name: "Coconut",
      category: "Oil",
      growthCycle: 365,
      optimalConditions: "Tropical climate, sandy soil",
      yield: "100 nuts/tree",
    },
    {
      id: 3,
      name: "Cinnamon",
      category: "Spice",
      growthCycle: 90,
      optimalConditions: "Hot climate, well-drained soil",
      yield: "200kg/acre",
    },
    // Add more crops as needed
  ];

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered crops based on search query
  const filteredCrops = crops.filter(
    (crop) =>
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.optimalConditions
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      crop.yield.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-4/5 bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Buttons */}
        <div className="flex space-x-2">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
            onClick={handleAddNewCrop}
          >
            Add New Crop
          </button>
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
            onClick={handleViewAllCrops}
          >
            View All Crops
          </button>
        </div>

        {/* Search Bar */}
        {viewAll && (
          <div className="w-1/3">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search crops..."
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
                <th className="text-left px-4 py-2">Category</th>
                <th className="text-left px-4 py-2">Growth Cycle (Days)</th>
                <th className="text-left px-4 py-2">Optimal Conditions</th>
                <th className="text-left px-4 py-2">Yield</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCrops.length > 0 ? (
                filteredCrops.map((crop) => (
                  <tr key={crop.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{crop.name}</td>
                    <td className="px-4 py-2">{crop.category}</td>
                    <td className="px-4 py-2">{crop.growthCycle}</td>
                    <td className="px-4 py-2">{crop.optimalConditions}</td>
                    <td className="px-4 py-2">{crop.yield}</td>
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
                    colSpan="6"
                    className="text-center px-4 py-2 text-gray-600"
                  >
                    No crops found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : showForm ? (
        <form className="bg-gray-50 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Add New Crop
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
              Category
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter crop category (e.g., Tea, Coconut)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Growth Cycle (Days)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter growth duration"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Optimal Growing Conditions
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Describe the optimal conditions for this crop"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Yield Expectations
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter yield expectations (e.g., 100kg/acre)"
            />
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
            Welcome to Crop Management
          </h2>
          <p className="text-gray-600">
            Select a module from the left sidebar to begin managing your
            agricultural operations.
          </p>
        </div>
      )}
    </div>
  );
};

export default CropManagement;
