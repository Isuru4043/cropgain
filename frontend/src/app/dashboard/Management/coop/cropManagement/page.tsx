"use client";

import React, { useEffect, useRef, useState } from "react";
import type { JSX } from "react";

interface Crop {
  _id: string;
  cropName: string;
  scientificName: string;
  cropType: string;
  growthCycle: number;
  optimalGrowingConditions: string;
  soilTypePreference: string;
  expectedYieldValue: number; 
  expectedYieldUnit: string; 
  fertilizerType: string; 
  fertilizerQuantity: number; 
  fertilizerFrequency: string; 
  harvestFrequency: string;
  compatibleCrops: string[];
}

const CropManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null); // Use string | null
  const tableRef = useRef<HTMLTableElement>(null);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [formValues, setFormValues] = useState({
    cropName: '',
    scientificName: '',
    cropType: '',
    growthCycle: '',
    optimalGrowingConditions: '',
    soilTypePreference: '',
    expectedYieldValue: '',
    expectedYieldUnit: '',
    fertilizerType: '',
    fertilizerQuantity: '',
    fertilizerFrequency: '',
    harvestFrequency: '',
    compatibleCrops: '',
  });
  

  useEffect(() => {
    if (selectedCrop) {
      setFormValues({
        cropName: selectedCrop.cropName,
        scientificName: selectedCrop.scientificName,
        cropType: selectedCrop.cropType,
        growthCycle: selectedCrop.growthCycle.toString(),
        optimalGrowingConditions: selectedCrop.optimalGrowingConditions,
        soilTypePreference: selectedCrop.soilTypePreference,
        expectedYieldValue: selectedCrop.expectedYieldValue.toString(),
        expectedYieldUnit: selectedCrop.expectedYieldUnit,
        fertilizerType: selectedCrop.fertilizerType,
        fertilizerQuantity: selectedCrop.fertilizerQuantity.toString(),
        fertilizerFrequency: selectedCrop.fertilizerFrequency,
        harvestFrequency: selectedCrop.harvestFrequency,
        compatibleCrops: selectedCrop.compatibleCrops.join(", "),
      });
    } else {
      setFormValues({
        cropName: '',
        scientificName: '',
        cropType: '',
        growthCycle: '',
        optimalGrowingConditions: '',
        soilTypePreference: '',
        expectedYieldValue: '',
        expectedYieldUnit: '',
        fertilizerType: '',
        fertilizerQuantity: '',
        fertilizerFrequency: '',
        harvestFrequency: '',
        compatibleCrops: '',
      });
    }
  }, [selectedCrop]);
  
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setSelectedCropId(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);


  const handleAddNewCrop = () => {
    setShowForm(true);
    setViewAll(false);
    setSearchQuery("");
  };

  const handleViewAllCrops = async () => {
    setViewAll(true);
    setShowForm(false); // Hide form if table is shown
    setSearchQuery(""); // Reset search when viewing all crops
  };

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
      {showForm ? (
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
              Scientific Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter scientific name (optional)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Crop Type
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
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
            <label className="block text-gray-700 font-medium mb-1">
              Growth Cycle (Days)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter growth cycle in days"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Optimal Growing Conditions
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
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
            <label className="block text-gray-700 font-medium mb-1">
              Soil Type Preference
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
              <option value="">Select soil type</option>
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
              <option value="Clay">Clay</option>
              <option value="Silty">Silty</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Expected Yield per Unit Area
            </label>
            <div className="flex">
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter yield"
              />
              <select className="border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-600">
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
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
                  <option value="">Select fertilizer type</option>
                  <option value="Nitrogen-based">Nitrogen-based</option>
                  <option value="Phosphorus-based">Phosphorus-based</option>
                  <option value="Potassium-based">Potassium-based</option>
                  <option value="Organic">Organic</option>
                  <option value="Compost">Compost</option>
                </select>

                {/* Quantity Input */}
                <input
                  type="number"
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Quantity (kg)"
                />
              </div>

              {/* Frequency Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Frequency of Application
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
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
            <label className="block text-gray-700 font-medium mb-1">
              Harvest Frequency
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
              <option value="">Select frequency</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Compatible Crops for Rotation
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter compatible crops for rotation"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Attachments (Optional)
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

        <div className="flex space-x-4">
        <button
  type="submit"
  className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
>
  {selectedCrop ? "Update" : "Submit"}
</button>
          
<button
  type="button"
  onClick={() => {
    setShowForm(false);
    setSelectedCrop(null);
    setFormValues({
      cropName: '',
      scientificName: '',
      cropType: '',
      growthCycle: '',
      optimalGrowingConditions: '',
      soilTypePreference: '',
      expectedYieldValue: '',
      expectedYieldUnit: '',
      fertilizerType: '',
      fertilizerQuantity: '',
      fertilizerFrequency: '',
      harvestFrequency: '',
      compatibleCrops: '',
    });
  }}
  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
>
  Cancel
</button>
        </div>
      </form>
      ) : viewAll ? (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Welcome to Crop Management
          </h2>
          <p className="text-gray-600">
            Select a module from the left sidebar to begin managing your
            agricultural operations.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default CropManagement;