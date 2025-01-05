"use client";

import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2"; // For charts (Pie and Bar)
import "chart.js/auto"; // Required for Chart.js

export default function LandManagement() {
  const [selectedSection, setSelectedSection] = useState("Section A");
  const [showForm, setShowForm] = useState(false); // State for Add Crop form visibility
  const [showSummary, setShowSummary] = useState(false); // State for View Summary modal
  
  const [cropsData, setCropsData] = useState({
    "Section A": [],
    "Section B": [],
    "Section C": [],
    "Section D": [],
    "Section E": [],
  });

  const landUsageData = {
    labels: ["Section A", "Section B", "Section C", "Section D", "Section E"],
    datasets: [
      {
        label: "Land Usage",
        data: [
          cropsData["Section A"]?.reduce(
            (sum, crop) => sum + parseFloat(crop.area || 0),
            0
          ) || 0,
          cropsData["Section B"]?.reduce(
            (sum, crop) => sum + parseFloat(crop.area || 0),
            0
          ) || 0,
          cropsData["Section C"]?.reduce(
            (sum, crop) => sum + parseFloat(crop.area || 0),
            0
          ) || 0,
          cropsData["Section D"]?.reduce(
            (sum, crop) => sum + parseFloat(crop.area || 0),
            0
          ) || 0,
          cropsData["Section E"]?.reduce(
            (sum, crop) => sum + parseFloat(crop.area || 0),
            0
          ) || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800"],
      },
    ],
  };
  
  

  

useEffect(() => {
  fetch("http://localhost:5000/api/crops")
    .then((response) => response.json())
    .then((data) => setCropsData(data))
    .catch((error) => console.error("Error fetching crops data:", error));
}, []);

  

const summaryBarData = {
  labels: ["Section A", "Section B", "Section C", "Section D", "Section E"],
  datasets: [
    {
      label: "Land Area (ha)",
      data: ["Section A", "Section B", "Section C", "Section D", "Section E"].map(
        (section) =>
          cropsData[section]?.reduce((sum, crop) => sum + parseFloat(crop.area || 0), 0) || 0
      ),
      backgroundColor: "#4CAF50",
    },
    {
      label: "Number of Plants",
      data: ["Section A", "Section B", "Section C", "Section D", "Section E"].map(
        (section) =>
          cropsData[section]?.filter((crop) => crop.numberOfPlants)
            .reduce((sum, crop) => sum + crop.numberOfPlants, 0) || 0
      ),
      backgroundColor: "#2196F3",
    },
  ],
};


  const handleAddCrop = () => {
    setShowForm(true);
  };

  //handleFormSubmit function

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const cropName = formData.get("cropName");
    const isPlantCountRequired = cropName.toLowerCase() === "coconut"; // Example condition
    const newCrop = {
      crop: cropName,
      area: `${formData.get("area")} ha`,
      plantingDate: formData.get("plantingDate"),
      harvestDate: formData.get("harvestDate"),
      numberOfPlants: isPlantCountRequired
        ? parseInt(formData.get("numberOfPlants"), 10)
        : null,
      section: selectedSection, // Add selected section for backend reference
    };
  
    try {
      const response = await fetch("/api/crops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCrop),
      });
  
      if (!response.ok) throw new Error("Failed to add crop");
  
      const updatedCropsData = await response.json();
      setCropsData(updatedCropsData);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding crop:", error);
    }
  };

  //handleDeleteCrop function

  const handleDeleteCrop = async (cropId) => {
    try {
      const response = await fetch(`/api/crops/${cropId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to delete crop");
  
      const updatedCropsData = await response.json();
      setCropsData(updatedCropsData);
    } catch (error) {
      console.error("Error deleting crop:", error);
    }
  };


  //Edit Crop function
  const handleEditCrop = async (event, cropId) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const updatedCrop = {
      crop: formData.get("cropName"),
      area: `${formData.get("area")} ha`,
      plantingDate: formData.get("plantingDate"),
      harvestDate: formData.get("harvestDate"),
      numberOfPlants: formData.get("numberOfPlants")
        ? parseInt(formData.get("numberOfPlants"), 10)
        : null,
    };
  
    try {
      const response = await fetch(`/api/crops/${cropId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCrop),
      });
  
      if (!response.ok) throw new Error("Failed to update crop");
  
      const updatedCropsData = await response.json();
      setCropsData(updatedCropsData);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating crop:", error);
    }
  };
  
  
  

  return (
    <div className="flex-1 p-6 bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Land Management</h1>
        <div className="space-x-4">
        <button
  onClick={handleAddCrop}
  className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
  aria-label="Add new crop"
>
  Add New Crop
</button>

          <button
            onClick={() => setShowSummary(true)} // Show Summary Modal
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          >
            View Summary
          </button>
        </div>
      </div>

      {/* Section Buttons */}
      <div className="flex space-x-4 mb-6">
        {["Section A", "Section B", "Section C", "Section D", "Section E"].map(
          (section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-4 py-2 rounded-md ${
                selectedSection === section
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {section}
            </button>
          )
        )}
      </div>

      {/* Table Section */}
      <div className="bg-gray-50 p-4 border rounded-md shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Crops in {selectedSection}
        </h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Crop Name</th>
              <th className="px-4 py-2 text-left">Area</th>
              <th className="px-4 py-2 text-left">Number of Plants</th>
              
              <th className="px-4 py-2 text-left">Planting Date</th>
              <th className="px-4 py-2 text-left">Harvest Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>


          <tbody>
  {(cropsData[selectedSection] || []).length > 0 ? (
    cropsData[selectedSection].map((crop, index) => (
      <tr key={index} className="hover:bg-gray-100 border-b">
        <td className="px-4 py-2">{crop.crop}</td>
        <td className="px-4 py-2">{crop.area}</td>
        <td className="px-4 py-2">
          {crop.numberOfPlants !== null ? crop.numberOfPlants : "N/A"}
        </td>
        <td className="px-4 py-2">{crop.plantingDate}</td>
        <td className="px-4 py-2">{crop.harvestDate}</td>
        <td className="px-4 py-2">
          <button className="text-blue-600 hover:underline mr-2">
            Edit
          </button>
          <button
            onClick={() => handleDeleteCrop(crop.id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="text-center px-4 py-2 text-gray-500">
        No crops assigned yet.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      {/* Pie Chart Section */}
      <div className="bg-gray-50 p-4 border rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Land Usage</h2>
        <div className="max-w-md mx-auto">
          <Pie data={landUsageData} />
        </div>
      </div>

      {/* View Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/2 max-h-[80%] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Land Usage Summary</h2>

            {/* Summary Table */}
            <table className="min-w-full bg-gray-50 border border-gray-300 rounded-md mb-6">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Section</th>
                  <th className="px-4 py-2 text-left">Total Crops</th>
                  <th className="px-4 py-2 text-left">Total Area</th>
                  <th className="px-4 py-2 text-left">
                    Total Number of Plants
                  </th>
                  {/* New Column */}
                </tr>
              </thead>
              <tbody>
                {Object.keys(cropsData).map((section) => (
                  <tr key={section} className="hover:bg-gray-100 border-b">
                    <td className="px-4 py-2">{section}</td>
                    <td className="px-4 py-2">{cropsData[section].length}</td>
                    <td className="px-4 py-2">
                      {cropsData[section].reduce(
                        (sum, crop) => sum + parseFloat(crop.area),
                        0
                      )}
                      ha
                    </td>
                    <td className="px-4 py-2">
                      {cropsData[section]
                        .filter((crop) => crop.numberOfPlants)
                        .reduce((sum, crop) => sum + crop.numberOfPlants, 0) ||
                        "N/A"}
                    </td>
                    {/* Display Total Number of Plants */}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Bar Chart */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Land Area by Section
              </h3>
              <Bar data={summaryBarData} />
            </div>

            <button
              onClick={() => setShowSummary(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Crop Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              Add Crop to {selectedSection}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Crop Name
                </label>
                <input
                  type="text"
                  name="cropName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter crop name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Area (in hectares)
                </label>
                <input
                  type="number"
                  name="area"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter area"
                  required
                />
              </div>
              {/* Conditional Number of Plants Field */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Number of Plants
                </label>
                <input
                  type="number"
                  name="numberOfPlants"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter number of plants"
                  min="1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Planting Date
                </label>
                <input
                  type="date"
                  name="plantingDate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Harvest Date
                </label>
                <input
                  type="date"
                  name="harvestDate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
                >
                  Add Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
