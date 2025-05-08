import React, { useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../../globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

interface HarvestData {
  cropName: string;
  location: string;
  date: Date;
  urgency: string;
  estimatedYield: string;
  yieldUnit: string;
  actualYield: string;
  notes: string;
}

const HarvestScheduling = () => {
  const [scheduledHarvests, setScheduledHarvests] = useState<HarvestData[]>([
    {
      cropName: "Tea",
      location: "Section A",
      date: new Date("2025-05-20"),
      urgency: "High",
      estimatedYield: "500",
      yieldUnit: "kg",
      actualYield: "",
      notes: "Morning harvest preferred",
    },
    {
      cropName: "Coconut",
      location: "Section B",
      date: new Date("2025-06-15"),
      urgency: "Medium",
      estimatedYield: "1000",
      yieldUnit: "kg",
      actualYield: "",
      notes: "Check weather forecast",
    },
    {
      cropName: "Cinnamon",
      location: "Section C",
      date: new Date("2025-07-24"),
      urgency: "Medium",
      estimatedYield: "20",
      yieldUnit: "kg",
      actualYield: "",
      notes: "Harvest before noon",
    },
  ]);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit" | "complete">("add");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<HarvestData>({
    cropName: "",
    location: "",
    urgency: "",
    estimatedYield: "",
    yieldUnit: "kg",
    actualYield: "",
    notes: "",
    date: new Date(), // Add default date
  });

  const urgencyColors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };

  const handleInputChange = (field: keyof HarvestData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleAddHarvest = () => {
    if (
      formMode === "add" &&
      selectedDate &&
      formData.cropName &&
      formData.location &&
      formData.urgency
    ) {
      const newHarvest: HarvestData = {
        ...formData,
        date: selectedDate,
        actualYield: "",
      };
      setScheduledHarvests([...scheduledHarvests, newHarvest]);
      resetForm();
    } else if (formMode === "edit" && editIndex !== null) {
      const updatedHarvests = [...scheduledHarvests];
      updatedHarvests[editIndex] = {
        ...formData,
        date: selectedDate || updatedHarvests[editIndex].date,
      };
      setScheduledHarvests(updatedHarvests);
      resetForm();
    } else if (formMode === "complete" && editIndex !== null) {
      const updatedHarvests = [...scheduledHarvests];
      updatedHarvests[editIndex] = {
        ...updatedHarvests[editIndex],
        actualYield: formData.actualYield,
      };

      // Remove the completed harvest
      const remainingHarvests = updatedHarvests.filter(
        (_, i) => i !== editIndex
      );

      setScheduledHarvests(remainingHarvests);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedDate(null);
    setShowForm(false);
    setFormMode("add");
    setEditIndex(null);
    setFormData({
      cropName: "",
      location: "",
      urgency: "",
      estimatedYield: "",
      yieldUnit: "kg",
      actualYield: "",
      notes: "",
      date: new Date(), // Add default date
    });
  };

  const handleBackToCalendar = () => {
    resetForm();
  };

  const handleEdit = (index: number) => {
    const harvestToEdit = scheduledHarvests[index];
    setFormData({
      cropName: harvestToEdit.cropName,
      location: harvestToEdit.location,
      urgency: harvestToEdit.urgency,
      estimatedYield: harvestToEdit.estimatedYield,
      yieldUnit: "kg",
      notes: harvestToEdit.notes,
    });
    setSelectedDate(harvestToEdit.date);
    setShowForm(true);
    setFormMode("edit");
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedHarvests = scheduledHarvests.filter((_, i) => i !== index);
    setScheduledHarvests(updatedHarvests);
  };

  const handleComplete = (index: number) => {
    const harvestToComplete = scheduledHarvests[index];
    setFormData({
      ...harvestToComplete,
      actualYield: "",
    });
    setSelectedDate(harvestToComplete.date);
    setShowForm(true);
    setFormMode("complete");
    setEditIndex(index);
  };

  const getUpcomingHarvests = () => {
    return scheduledHarvests
      .filter((harvest) => harvest.date >= new Date() && !harvest.actualYield) // Exclude completed harvests
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const hasScheduledHarvest = (date: Date) => {
    return scheduledHarvests.some(
      (harvest) => harvest.date.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-grow flex-basis-[60%]">
          {showForm ? (
            // Form View
            <div>
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-medium ml-2">
                  {formMode === "add"
                    ? "Add New Harvest"
                    : formMode === "edit"
                    ? "Edit Harvest"
                    : "Complete Harvest"}
                </h2>
                <button
                  onClick={handleBackToCalendar}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  ← Back to Calendar
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-blue-800">
                    Selected Date: {selectedDate?.toLocaleDateString()}
                  </p>
                </div>
                {formMode !== "complete" && (
                  <>
                    <input
                      className="w-full p-2 border rounded-md"
                      placeholder="Crop Name"
                      value={formData.cropName}
                      onChange={(e) =>
                        handleInputChange("cropName", e.target.value)
                      }
                    />
                    <select
                      className="w-full p-2 border rounded-md"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                    >
                      <option value="">Select Location</option>
                      <option value="Section A">Section A</option>
                      <option value="Section B">Section B</option>
                      <option value="Section C">Section C</option>
                      <option value="Section D">Section D</option>
                      <option value="Section E">Section E</option>
                    </select>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={formData.urgency}
                      onChange={(e) =>
                        handleInputChange("urgency", e.target.value)
                      }
                    >
                      <option value="">Select Urgency</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <div className="flex items-center">
                      <input
                        className="flex-grow p-2 border rounded-md w-[84%]"
                        placeholder="Estimated Yield"
                        value={formData.estimatedYield}
                        onChange={(e) =>
                          handleInputChange("estimatedYield", e.target.value)
                        }
                      />
                      <select
                        className="p-2 border rounded-md ml-2"
                        value={formData.yieldUnit}
                        onChange={(e) =>
                          handleInputChange("yieldUnit", e.target.value)
                        }
                      >
                        <option value="kg">kg</option>
                        <option value="units">units</option>
                      </select>
                    </div>
                    <input
                      className="w-full p-2 border rounded-md"
                      placeholder="Notes"
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                    />
                  </>
                )}
                {formMode === "complete" && (
                  <div>
                    <p className="text-lg mb-2">
                      Complete Harvest for {formData.cropName}
                    </p>
                    <div className="flex items-center">
                      <input
                        className="flex-grow p-2 border rounded-md w-[84%]"
                        placeholder="Actual Yield"
                        value={formData.actualYield}
                        onChange={(e) =>
                          handleInputChange("actualYield", e.target.value)
                        }
                      />
                      <select
                        className="p-2 border rounded-md ml-2"
                        value={formData.yieldUnit}
                        onChange={(e) =>
                          handleInputChange("yieldUnit", e.target.value)
                        }
                      >
                        <option value="kg">kg</option>
                        <option value="units">units</option>
                      </select>
                    </div>
                  </div>
                )}
                <button
                  className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  onClick={handleAddHarvest}
                  disabled={
                    (formMode === "add" &&
                      (!formData.cropName ||
                        !formData.location ||
                        !formData.urgency)) ||
                    (formMode === "complete" && !formData.actualYield)
                  }
                >
                  {formMode === "add"
                    ? "Add Harvest"
                    : formMode === "edit"
                    ? "Update Harvest"
                    : "Complete Harvest"}
                </button>
              </div>
            </div>
          ) : (
            // Calendar View (remains the same)
            <div>
              <div className="p-4 border-b">
                <h2 className="text-2xl text-center font-medium ">
                  Select Harvest Date
                </h2>
              </div>
              <div className="p-4">
                <Calendar
                  value={selectedDate}
                  onChange={handleDateSelect}
                  className="w-full"
                  tileClassName={({ date }) =>
                    hasScheduledHarvest(date) ? "bg-blue-100" : null
                  }
                  tileContent={({ date, view }) => {
                    if (view === "month" && hasScheduledHarvest(date)) {
                      return (
                        <div className="flex justify-center items-center">
                          <span className="w-2 h-2 bg-blue-500 ml-0.5"></span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <p className="text-base text-black mt-4 text-center">
                  Select a date from the calendar to schedule a new harvest.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-grow flex-basis-[40%]">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-medium text-center">
              Upcoming Harvests
            </h2>
          </div>
          <div className="p-6 h-[465px] overflow-y-auto">
            <div className="space-y-8">
              {getUpcomingHarvests().map((harvest, index) => (
                <div
                  key={index}
                  className="relative flex flex-col p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="absolute top-2 right-2 text-base text-gray-500 mr-4">
                    {harvest.date.toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-medium">
                      {harvest.cropName}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full ${
                        urgencyColors[harvest.urgency]
                      }`}
                    >
                      {harvest.urgency}
                    </span>
                  </div>

                  <div className="text-blue-600">{harvest.location}</div>

                  {harvest.estimatedYield && (
                    <div className="text-gray-500 text-sm mt-1">
                      Estimated Yield: {harvest.estimatedYield}
                    </div>
                  )}

                  {harvest.actualYield && (
                    <div className="text-gray-500 text-sm mt-1">
                      Actual Yield: {harvest.actualYield}
                    </div>
                  )}

                  {harvest.notes && (
                    <div className="text-gray-500 text-sm mt-2">
                      📝 {harvest.notes}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end gap-2 text-sm">
                    <button
                      className="px-3 py-1 bg-yellow-200 text-yellow-700 rounded-md flex items-center gap-1 hover:bg-yellow-300"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-200 text-red-700 rounded-md flex items-center gap-1 hover:bg-red-300"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                    <button
                      className="px-3 py-1 bg-green-200 text-green-700 rounded-md flex items-center gap-1 hover:bg-green-300"
                      onClick={() => handleComplete(index)}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarvestScheduling;
