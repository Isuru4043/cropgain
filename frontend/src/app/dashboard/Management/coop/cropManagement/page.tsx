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

      {viewAll && (
        <div className="w-1/3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search crops..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      )}
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
          <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Crop</h2>

          {/* Form Fields */}
          <div className="mb-4">
            <label
              htmlFor="cropName"
              className="block text-gray-700 font-medium mb-1"
            >
              Crop Name
            </label>
            <input
              id="cropName"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter crop name"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="scientificName"
              className="block text-gray-700 font-medium mb-1"
            >
              Scientific Name
            </label>
            <input
              id="scientificName"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter scientific name (optional)"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="cropType"
              className="block text-gray-700 font-medium mb-1"
            >
              Crop Type
            </label>
            <select
              id="cropType"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select crop type</option>
              <option value="Fruit">Fruit</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Spice">Spice</option>
              <option value="Grain">Grain</option>
              <option value="Oil">Oil</option>
              <option value="Beverage">Beverage</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="growthCycle"
              className="block text-gray-700 font-medium mb-1"
            >
              Growth Cycle (Days)
            </label>
            <input
              id="growthCycle"
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter growth cycle in days"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="optimalConditions"
              className="block text-gray-700 font-medium mb-1"
            >
              Optimal Growing Conditions
            </label>
            <select
              id="optimalConditions"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select growing condition</option>
              <option value="Cool and Humid">Cool and Humid</option>
              <option value="Warm and Dry">Warm and Dry</option>
              <option value="Hot and Humid">Hot and Humid</option>
              <option value="Moderate with Partial Shade">
                Moderate with Partial Shade
              </option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="soilType"
              className="block text-gray-700 font-medium mb-1"
            >
              Soil Type Preference
            </label>
            <select
              id="soilType"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select soil type</option>
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
              <option value="Clay">Clay</option>
              <option value="Silty">Silty</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="expectedYield"
              className="block text-gray-700 font-medium mb-1"
            >
              Expected Yield per Unit Area
            </label>
            <div className="flex">
              <input
                id="expectedYield"
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter yield"
              />
              <select
                id="yieldUnit"
                className="border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="kg/acre">kg/acre</option>
                <option value="tons/hectare">tons/hectare</option>
                <option value="kg/hectare">kg/hectare</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Fertilizer Requirements
            </label>
            <div className="flex flex-col space-y-2">
              {/* Dropdown for Fertilizer Type */}
              <div className="flex space-x-2">
                <select
                  id="fertilizerType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Select fertilizer type</option>
                  <option value="Nitrogen-based">Nitrogen-based</option>
                  <option value="Phosphorus-based">Phosphorus-based</option>
                  <option value="Potassium-based">Potassium-based</option>
                  <option value="Organic">Organic</option>
                  <option value="Compost">Compost</option>
                </select>

                {/* Quantity Input */}
                <input
                  id="fertilizerQuantity"
                  type="number"
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Quantity (kg)"
                />
              </div>

              {/* Frequency Input */}
              <div>
                <label
                  htmlFor="applicationFrequency"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Frequency of Application
                </label>
                <select
                  id="applicationFrequency"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Select frequency</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Bi-Annually">Bi-Annually</option>
                  <option value="Annually">Annually</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="harvestFrequency"
              className="block text-gray-700 font-medium mb-1"
            >
              Harvest Frequency
            </label>
            <select
              id="harvestFrequency"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select frequency</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="compatibleCrops"
              className="block text-gray-700 font-medium mb-1"
            >
              Compatible Crops for Rotation
            </label>
            <input
              id="compatibleCrops"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter compatible crops for rotation"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="attachments"
              className="block text-gray-700 font-medium mb-1"
            >
              Attachments (Optional)
            </label>
            <input
              id="attachments"
              type="file"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
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
