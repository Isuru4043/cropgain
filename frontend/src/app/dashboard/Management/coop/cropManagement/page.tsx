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
  const [showForm, setShowForm] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null); // Use string | null
  const tableRef = useRef<HTMLTableElement>(null);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [formValues, setFormValues] = useState({
    cropName: "",
    scientificName: "",
    cropType: "",
    growthCycle: "",
    optimalGrowingConditions: "",
    soilTypePreference: "",
    expectedYieldValue: "",
    expectedYieldUnit: "kg/acre",
    fertilizerType: "",
    fertilizerQuantity: "",
    fertilizerFrequency: "",
    harvestFrequency: "",
    compatibleCrops: "",
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
        cropName: "",
        scientificName: "",
        cropType: "",
        growthCycle: "",
        optimalGrowingConditions: "",
        soilTypePreference: "",
        expectedYieldValue: "",
        expectedYieldUnit: "",
        fertilizerType: "",
        fertilizerQuantity: "",
        fertilizerFrequency: "",
        harvestFrequency: "",
        compatibleCrops: "",
      });
    }
  }, [selectedCrop]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setSelectedCropId(null);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleAddNewCrop = () => {
    setShowForm(true);
    setViewAll(false);
    setSearchQuery("");
  };

  const handleViewAllCrops = async () => {
    setViewAll(true);
    setShowForm(false);
    setSearchQuery("");

    try {
      const response = await fetch("http://localhost:5000/api/crops", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch crops");
      }

      const data = await response.json();

      // Transform the data to handle MongoDB format
      const transformedData = data.map((crop: any) => ({
        ...crop,
        expectedYieldValue: crop.expectedYieldValue?.$numberInt
          ? parseInt(crop.expectedYieldValue.$numberInt, 10)
          : crop.expectedYieldValue || 0,
        expectedYieldUnit: crop.expectedYieldUnit || "N/A",
        fertilizerQuantity: crop.fertilizerQuantity?.$numberInt
          ? parseFloat(crop.fertilizerQuantity.$numberInt)
          : crop.fertilizerQuantity || 0,
        fertilizerType: crop.fertilizerType || "N/A",
        fertilizerFrequency: crop.fertilizerFrequency || "N/A",
      }));

      setCrops(transformedData);
    } catch (error) {
      console.error("Error fetching crops:", error);
      alert("Failed to fetch crops. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      cropName: formValues.cropName.trim(),
      scientificName: formValues.scientificName.trim(),
      cropType: formValues.cropType,
      growthCycle: parseInt(formValues.growthCycle, 10),
      optimalGrowingConditions: formValues.optimalGrowingConditions,
      soilTypePreference: formValues.soilTypePreference,
      expectedYieldValue: parseFloat(formValues.expectedYieldValue),
      expectedYieldUnit: formValues.expectedYieldUnit,
      fertilizerType: formValues.fertilizerType,
      fertilizerQuantity: parseFloat(formValues.fertilizerQuantity),
      fertilizerFrequency: formValues.fertilizerFrequency,
      harvestFrequency: formValues.harvestFrequency,
      compatibleCrops: formValues.compatibleCrops
        ? formValues.compatibleCrops
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== "")
        : [],
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch("http://localhost:5000/api/crops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      // Log the full response details
      const responseText = await response.text();
      console.log("Server Response Status:", response.status);
      console.log(
        "Server Response Headers:",
        Object.fromEntries(response.headers)
      );
      console.log("Server Response Body:", responseText);

      if (!response.ok) {
        let errorMessage;
        try {
          // Try to parse the response as JSON
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || responseText;
        } catch {
          // If parsing fails, use the raw text
          errorMessage = responseText;
        }
        throw new Error(`Server Error: ${errorMessage}`);
      }

      alert("Crop submitted successfully!");
      setShowForm(false);
      setSelectedCrop(null);
      handleViewAllCrops();
    } catch (error) {
      console.error("Full error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      });
      alert(`Failed to submit crop data: ${error.message}`);
    }
  };
  //render crops

  const renderCrops = () => {
    if (crops.length === 0) {
      return <p>No crops found.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table
          ref={tableRef}
          className="min-w-full bg-white border border-gray-300"
        >
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Crop Name</th>
              <th className="px-4 py-2 border">Scientific Name</th>
              <th className="px-4 py-2 border">Crop Type</th>
              <th className="px-4 py-2 border">Growth Cycle (Days)</th>
              <th className="px-4 py-2 border">Optimal Conditions</th>
              <th className="px-4 py-2 border">Soil Type</th>
              <th className="px-4 py-2 border">Expected Yield</th>
              <th className="px-4 py-2 border">Fertilizer</th>
              <th className="px-4 py-2 border">Harvest Frequency</th>
              <th className="px-4 py-2 border">Compatible Crops</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop) => (
              <tr
                key={crop._id}
                className={`px-4 py-2 border ${
                  selectedCropId === crop._id ? "bg-gray-200" : ""
                }`}
                onClick={() =>
                  setSelectedCropId(
                    crop._id === selectedCropId ? null : crop._id
                  )
                }
              >
                <td className="px-4 py-2 border">{crop.cropName}</td>
                <td className="px-4 py-2 border">{crop.scientificName}</td>
                <td className="px-4 py-2 border">{crop.cropType}</td>
                <td className="px-4 py-2 border">{crop.growthCycle}</td>
                <td className="px-4 py-2 border">
                  {crop.optimalGrowingConditions}
                </td>
                <td className="px-4 py-2 border">{crop.soilTypePreference}</td>
                <td className="px-4 py-2 border">
                  {crop.expectedYieldValue} {crop.expectedYieldUnit}
                </td>
                <td className="px-4 py-2 border">
                  {crop.fertilizerType} ({crop.fertilizerQuantity} kg,{" "}
                  {crop.fertilizerFrequency})
                </td>
                <td className="px-4 py-2 border">{crop.harvestFrequency}</td>
                <td className="px-4 py-2 border">
                  {crop.compatibleCrops.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleUpdate = (crop: Crop) => {
    if (crop && crop._id) {
      setSelectedCrop(crop);
      setShowForm(true);
      setViewAll(false);
    } else {
      console.error("Invalid crop selected for update.");
    }
  };

  const handleDelete = async (cropId: string) => {
    console.log("handleDelete called with cropId:", cropId);
    if (confirm("Are you sure you want to delete this crop?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/crops/${cropId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete crop");
        }

        alert("Crop deleted successfully!");
        setCrops((prevCrops) =>
          prevCrops.filter((crop) => crop._id !== cropId)
        );
        setSelectedCropId(null);
      } catch (error) {
        console.error("Error deleting crop:", error);
        alert("Failed to delete crop. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            className="w-full sm:w-auto bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
            onClick={handleAddNewCrop}
          >
            Add New Crop
          </button>
          <button
            className="w-full sm:w-auto bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
            onClick={handleViewAllCrops}
          >
            View All Crops
          </button>
        </div>
      </div>

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-md max-w-4xl mx-auto"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground">
            {selectedCrop ? "Update Crop" : "Add New Crop"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Crop Name
                </label>
                <input
                  type="text"
                  name="cropName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter crop name"
                  value={formValues.cropName}
                  onChange={(e) =>
                    setFormValues({ ...formValues, cropName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Scientific Name
                </label>
                <input
                  type="text"
                  name="scientificName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter scientific name (optional)"
                  value={formValues.scientificName}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      scientificName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Crop Type
                </label>
                <select
                  name="cropType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={formValues.cropType}
                  onChange={(e) =>
                    setFormValues({ ...formValues, cropType: e.target.value })
                  }
                  required
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
            </div>

            {/* Growing Conditions */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Growth Cycle (Days)
                </label>
                <input
                  type="number"
                  name="growthCycle"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter growth cycle in days"
                  value={formValues.growthCycle}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      growthCycle: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Optimal Growing Conditions
                </label>
                <select
                  name="optimalGrowingConditions"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={formValues.optimalGrowingConditions}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      optimalGrowingConditions: e.target.value,
                    })
                  }
                  required
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

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Soil Type Preference
                </label>
                <select
                  name="soilTypePreference"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={formValues.soilTypePreference}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      soilTypePreference: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select soil type</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Clay">Clay</option>
                  <option value="Silty">Silty</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition-colors"
            >
              {selectedCrop ? "Update" : "Submit"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedCrop(null);
                setFormValues({
                  cropName: "",
                  scientificName: "",
                  cropType: "",
                  growthCycle: "",
                  optimalGrowingConditions: "",
                  soilTypePreference: "",
                  expectedYieldValue: "",
                  expectedYieldUnit: "",
                  fertilizerType: "",
                  fertilizerQuantity: "",
                  fertilizerFrequency: "",
                  harvestFrequency: "",
                  compatibleCrops: "",
                });
              }}
              className="w-full sm:w-auto bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : viewAll ? (
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">All Crops</h2>
            {selectedCropId && (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="w-full sm:w-auto bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                  onClick={() =>
                    handleUpdate(
                      crops.find((crop) => crop._id === selectedCropId)
                    )
                  }
                >
                  Update
                </button>
                <button
                  className="w-full sm:w-auto bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition-colors"
                  onClick={() => handleDelete(selectedCropId)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          {renderCrops()}
        </div>
      ) : null}
    </div>
  );
};

export default CropManagement;
