"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Modal from "react-modal";
import dynamic from "next/dynamic";

const PlantingGrowthTracking = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [plantingRecords, setPlantingRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const Calendar = dynamic(() => import("react-calendar"), {
    ssr: false,
  });
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().substring(0, 10);
  };

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  useEffect(() => {
    console.log("Selected Date:", selectedDate);
    console.log("Formatted Selected Date:", selectedDate.toISOString().split("T")[0]);
  }, [selectedDate]); // This will log whenever `selectedDate` changes
  


  // Generate notifications
  useEffect(() => {
    const generateNotifications = (plantingRecords) => {
      const notifications = [];
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      plantingRecords.forEach((record) => {
        const plantingDate = new Date(record.plantingDate);

        // Upcoming Planting Notification
        if (plantingDate > today && plantingDate <= nextWeek) {
          notifications.push({
            id: `upcoming-${record._id}`,
            type: "Upcoming Planting",
            message: `Planting for ${record.cropType} in ${record.section} is scheduled on ${new Date(record.plantingDate).toISOString().split("T")[0]}.`,
            date: record.plantingDate,
          });
        }

        // Unhealthy Plant Notification
        if (record.healthStatus === "Unhealthy") {
          notifications.push({
            id: `unhealthy-${record._id}`,
            type: "Unhealthy Plant",
            message: `The ${record.cropType} in ${record.section} is unhealthy. Please take action.`,
            date: today.toISOString().split("T")[0],
          });
        }
      });

      return notifications;
    };

    if (plantingRecords.length > 0) {
      const newNotifications = generateNotifications(plantingRecords);
      setNotifications(newNotifications);
    }
  }, [plantingRecords]);


  const openModal = (photo) => {
    setCurrentPhoto(photo);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentPhoto(null);
  };

  const filteredPlantings = plantingRecords.filter(
    (record) =>
      record.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.healthStatus.toLowerCase().includes(searchQuery.toLowerCase())
  );



  useEffect(() => {
    const fetchPlantings = async () => {
      console.log("Planting Records:", plantingRecords);
      try {
        const response = await fetch("http://localhost:5000/api/plantings");
        const data = await response.json();
        setPlantingRecords(data);
      } catch (error) {
        console.error("Error fetching plantings:", error);
      }
    };

    fetchPlantings();
  }, []);

 
  const handleViewAllPlantings = () => {
    setViewAll(true);
    setShowForm(false);
    setSearchQuery("");
  };


  const handleAddPlantingClick = () => {
    setShowForm(true);
    setViewAll(false);
    setEditingRecord(null);
  };

  const handleEdit = (record) => {
    console.log("Editing Record:", record); // Debugging
    setEditingRecord(record); // Set the record to be edited
    setShowForm(true); // Open the form
    setViewAll(false); // Close the "View All" section if open
  };




  const handleAddNewPlanting = async (newPlanting) => {
    try {
      const response = await fetch("http://localhost:5000/api/plantings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlanting),
      });
  
      const data = await response.json();
      setPlantingRecords((prevRecords) => [...prevRecords, data]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding planting:", error);
    }
  };


  
  const handleUpdatePlanting = async (updatedPlanting) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/plantings/${editingRecord._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPlanting),
        }
      );
  
      const data = await response.json();
  
      // Update the existing record in state
      setPlantingRecords((prevRecords) =>
        prevRecords.map((record) =>
          record._id === editingRecord._id ? data : record
        )
      );
  
      setEditingRecord(null); // Clear the editing state
      setShowForm(false); // Close the form
    } catch (error) {
      console.error("Error updating planting:", error);
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedPlanting = {
      cropType: form.cropType.value,
      section: form.section.value,
      plantingDate: form.plantingDate.value,
      numberOfPlants: parseInt(form.numberOfPlants.value, 10),
      growthStage: form.growthStage.value,
      healthStatus: form.healthStatus.value,
      growthMetrics: editingRecord ? editingRecord.growthMetrics : { days: 0, height: 0 },
      photos: editingRecord ? editingRecord.photos : [],
    };
  
    if (editingRecord) {
      // Update existing planting
      await handleUpdatePlanting(updatedPlanting);
    } else {
      // Add new planting
      await handleAddNewPlanting(updatedPlanting);
    }
  };





  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };



  const handlePhotoUpload = async (e, recordId) => {
    if (!recordId) {
      console.error('Record ID is missing');
      return;
    }
  
    const files = e.target.files;
    if (files.length === 0) return;
  
    const formData = new FormData();
    for (const file of files) {
      formData.append("photos", file);
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/plantings/${recordId}/photos`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setPlantingRecords((prevRecords) =>
        prevRecords.map((record) =>
          record._id === recordId
            ? { ...record, photos: [...(record.photos || []), ...data] }
            : record
        )
      );
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };
  
  // In the table row where the file input is rendered:
  {filteredPlantings.map((record) => (
    <tr key={record._id} className="border-b hover:bg-gray-100">
      {/* Other table cells */}
      <td className="px-4 py-2">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handlePhotoUpload(e, record._id)} // Use `record._id`
          className="text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100"
        />
      </td>
    </tr>
  ))}



  const handleDelete = async (id) => {
    console.log("Deleting record with ID:", id); // Debugging
    if (window.confirm("Are you sure you want to delete this planting record?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/plantings/${id}`, {
          method: "DELETE",
        });
        console.log("Delete Response:", response); // Debugging
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setPlantingRecords((prevRecords) =>
          prevRecords.filter((record) => record._id !== id)
        );
      } catch (error) {
        console.error("Error deleting planting:", error);
      }
    }
  };
  

  const growthProgressData = {
    labels: plantingRecords.map((record) => record.cropType),
    datasets: [
      {
        label: "Growth Days",
        data: plantingRecords.map((record) => record.growthMetrics.days),
        fill: false,
        backgroundColor: "#4CAF50",
        borderColor: "#4CAF50",
      },
      {
        label: "Height (cm)",
        data: plantingRecords.map((record) => record.growthMetrics.height),
        fill: false,
        backgroundColor: "#2196F3",
        borderColor: "#2196F3",
      },
    ],
  };

  const highlightedDates = plantingRecords.map(
    (record) => new Date(record.plantingDate)
  );

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0];
      const hasPlanting = plantingRecords.some(
        (record) => record.plantingDate === formattedDate
      );
      return hasPlanting ? (
        <div className="dot bg-green-500 rounded-full w-2 h-2 mt-1 mx-auto"></div>
      ) : null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-md shadow-md overflow-auto">
    <div className="flex flex-col lg:flex-row justify-between items-center mb-6 space-y-4 lg:space-y-0">
      {/* Buttons */}
      <div className="flex space-x-2">
        <button
          className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
          onClick={handleAddPlantingClick}
        >
          Add New Planting
        </button>
        <button
          className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
          onClick={handleViewAllPlantings}
        >
          View All Plantings
        </button>
      </div>

      {/* Search Bar */}
      {viewAll && (
        <div className="w-full lg:w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search plantings..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      )}
    </div>

    {/* Main Content */}
    {viewAll ? (
      <div>
        {/* Growth Progress Chart */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center lg:text-left">
            Growth Progress
          </h2>
          <div className="w-full h-64 sm:h-96">
            <Line
              data={growthProgressData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Planting Records Table */}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 rounded-md shadow-md">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="text-left px-4 py-2">Crop Type</th>
                <th className="text-left px-4 py-2">Section</th>
                <th className="text-left px-4 py-2">Planting Date</th>
                <th className="text-left px-4 py-2">Number of Plants</th>
                <th className="text-left px-4 py-2">Growth Stage</th>
                <th className="text-left px-4 py-2">Health Status</th>
                <th className="text-left px-4 py-2">Photos</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>



            <tbody>
        {filteredPlantings.length > 0 ? (
          filteredPlantings.map((record) => (
            
            <tr key={record._id || record.id} className="border-b hover:bg-gray-100">
              <td className="px-4 py-2">{record.cropType}</td>
              <td className="px-4 py-2" style={{ minWidth: "150px" }}>{record.section}</td>
              <td className="px-4 py-2" style={{ minWidth: "120px" }}>{new Date(record.plantingDate).toISOString().split("T")[0]}</td>
              <td className="px-4 py-2" style={{ minWidth: "40px" }}>{record.numberOfPlants}</td>
              <td className="px-4 py-2">{record.growthStage}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-white ${
                    record.healthStatus === "Healthy"
                      ? "bg-green-500"
                      : record.healthStatus === "At Risk"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {record.healthStatus}
                </span>
              </td>

              
              <td className="px-4 py-2" style={{ minWidth: "150px" }}>
        {record.photos?.length > 0 ? (
          <div className="flex space-x-2">
            {record.photos.map((photo, photoIndex) => (
              <img
                key={`${record._id}-photo-${photoIndex}`}
                src={photo.url}
                alt={`Plant ${record.cropType} ${photoIndex + 1}`}
                className="w-12 h-12 object-cover cursor-pointer"
                onClick={() => openModal(photo)}
              />
            ))}
          </div>
        ) : (
          "No Photos"
        )}
      </td>


                    <td className="px-4 py-2" style={{ minWidth: "250px" }}>
                      <button
                        className="text-blue-600 hover:underline mr-2"
                        onClick={() => handleEdit(record)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(record._id)}
                      >
                        Delete
                      </button>
                      {/* Photo Upload Input */}
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handlePhotoUpload(e, record._id)}
                          className="text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-green-50 file:text-green-700
                            hover:file:bg-green-100"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center px-4 py-2 text-gray-600"
                  >
                    No plantings found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


       

        {/* Photo Viewing Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Photo Modal"
          className="max-w-lg sm:max-w-2xl mx-auto mt-20 bg-white p-4 rounded-md shadow-lg outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          {currentPhoto && (
            <div>
              <img
                src={currentPhoto.url}
                alt="Plant Growth"
                className="w-full h-auto mb-4 rounded-md"
              />
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          )}
        </Modal>
      </div>
    ) : showForm ? (
      <form
        className="bg-gray-50 p-6 rounded-md shadow-md"
        onSubmit={handleFormSubmit}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center lg:text-left">
          {editingRecord ? "Edit Planting" : "Add New Planting"}
        </h2>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Crop Type */}
          <div>
            <label
              htmlFor="cropType"
              className="block text-gray-700 font-medium mb-1"
            >
              Crop Type
            </label>
            <select
              id="cropType"
              name="cropType"
              required
              defaultValue={editingRecord ? editingRecord.cropType : ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select crop type</option>
              <option value="Tea">Tea</option>
              <option value="Coconut">Coconut</option>
              <option value="Cinnamon">Cinnamon</option>
              <option value="Mango">Mango</option>
              <option value="Banana">Banana</option>
              <option value="Papaya">Papaya</option>
              <option value="Orange">Orange</option>
              <option value="Avocado">Avocado</option>
              <option value="Pineapple">Pineapple</option>
              <option value="Guava">Guava</option>
              {/* Add more options as needed */}
            </select>
          </div>

          {/* Section */}
          <div>
            <label
              htmlFor="section"
              className="block text-gray-700 font-medium mb-1"
            >
              Section
            </label>
            <select
              id="section"
              name="section"
              required
              defaultValue={editingRecord ? editingRecord.section : ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select section</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
              <option value="Section C">Section C</option>
              <option value="Section D">Section D</option>
              <option value="Section E">Section E</option>
              <option value="Section F">Section F</option>
              <option value="Section G">Section G</option>
              <option value="Section H">Section H</option>
              <option value="Section I">Section I</option>
              <option value="Section J">Section J</option>
              {/* Add more sections as needed */}
            </select>
          </div>

          {/* Planting Date */}
          <div>
            <label
              htmlFor="plantingDate"
              className="block text-gray-700 font-medium mb-1"
            >
              Planting Date
            </label>
            <input
              id="plantingDate"
              name="plantingDate"
              type="date"
              required
              defaultValue={editingRecord ? editingRecord.plantingDate : ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Number of Plants */}
          <div>
            <label
              htmlFor="numberOfPlants"
              className="block text-gray-700 font-medium mb-1"
            >
              Number of Plants
            </label>
            <input
              id="numberOfPlants"
              name="numberOfPlants"
              type="number"
              min="1"
              required
              defaultValue={editingRecord ? editingRecord.numberOfPlants : ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter number of plants"
            />
          </div>

          {/* Growth Stage */}
          <div>
            <label
              htmlFor="growthStage"
              className="block text-gray-700 font-medium mb-1"
            >
              Growth Stage
            </label>
            <select
              id="growthStage"
              name="growthStage"
              required
              defaultValue={
                editingRecord ? editingRecord.growthStage : "Germination"
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select growth stage</option>
              <option value="Germination">Germination</option>
              <option value="Vegetative">Vegetative</option>
              <option value="Flowering">Flowering</option>
              <option value="Fruiting">Fruiting</option>
              {/* Add more stages as needed */}
            </select>
          </div>

          {/* Health Status */}
          <div>
            <label
              htmlFor="healthStatus"
              className="block text-gray-700 font-medium mb-1"
            >
              Health Status
            </label>
            <select
              id="healthStatus"
              name="healthStatus"
              required
              defaultValue={
                editingRecord ? editingRecord.healthStatus : "Healthy"
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select health status</option>
              <option value="Healthy">Healthy</option>
              <option value="At Risk">At Risk</option>
              <option value="Unhealthy">Unhealthy</option>
              {/* Add more statuses as needed */}
            </select>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
          >
            {editingRecord ? "Update" : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingRecord(null);
            }}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    ) : (
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800 text-center">
          Planting Schedule
        </h2>


        <div className="flex justify-center -mr-24">
        <div className="w-full max-w-md">
          <Calendar
            onChange={(date) => {
              setSelectedDate(date);
              console.log("Selected Date (Calendar):", date); // Log when date changes
              console.log("Formatted Selected Date (Calendar):", formatLocalDate(date));
            }}
            value={selectedDate}
            className="rounded-md shadow-md w-full"
          />
        </div>
      </div>

        <p className="text-gray-600 mt-4 text-center">
          Selected Date:{" "}
          <span className="font-medium">{selectedDate.toDateString()}</span>
        </p>


 {/* Plantings for Selected Date */}
<div className="mt-6">
  <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-center lg:text-left">
    Plantings on {selectedDate.toDateString()}
  </h3>

  <ul className="space-y-4">
    {(() => {
      const plantingsForDate = plantingRecords.filter((record) => {

        const recordDate = formatLocalDate(new Date(record.plantingDate));
    const selectedDateFormatted = formatLocalDate(selectedDate);
    console.log("Record Date (Local):", recordDate);
    console.log("Selected Date (Local):", selectedDateFormatted);
    return recordDate === selectedDateFormatted;
      });

      if (plantingsForDate.length === 0) {
        return <p className="text-gray-600 text-center">No plantings on this date.</p>;
      }

      return plantingsForDate.map((record) => (
        <li
          key={record._id || record.id}
          className="p-4 bg-green-50 rounded-md shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p>
              <span className="font-medium">Crop Type:</span> {record.cropType}
            </p>
            <p>
              <span className="font-medium">Section:</span> {record.section}
            </p>
            <p>
              <span className="font-medium">Number of Plants:</span> {record.numberOfPlants}
            </p>
            <p>
              <span className="font-medium">Growth Stage:</span> {record.growthStage}
            </p>
            <p>
              <span className="font-medium">Health Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-white ${
                  record.healthStatus === "Healthy"
                    ? "bg-green-500"
                    : record.healthStatus === "At Risk"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {record.healthStatus}
              </span>
            </p>
          </div>

          {/* Photos */}
          {record.photos?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {record.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.url}
                  alt={`Plant ${record.cropType} ${index + 1}`}
                  className="w-16 h-16 object-cover cursor-pointer rounded-md border"
                  onClick={() => openModal(photo)}
                />
              ))}
            </div>
          )}
        </li>
      ));
    })()}
  </ul>
</div>



        {/* Notifications */}
<div className="mt-8">
  <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center lg:text-left">
    Notifications
  </h2>
  <ul className="space-y-4">
    {notifications.length > 0 ? (
      notifications.map((notification, index) => (
        <li
          key={notification.id || `notification-${index}`}
          className={`p-4 rounded-md ${
            notification.type === "Upcoming Planting"
              ? "bg-yellow-100 border border-yellow-300"
              : "bg-red-100 border border-red-300"
          }`}
        >
          <p className="font-medium">{notification.type}</p>
          <p>{notification.message}</p>
          <p className="text-sm text-gray-500">
          {new Date(notification.date).toISOString().split("T")[0]}
            </p>
        </li>
      ))
    ) : (
      <p className="text-gray-600 text-center">No notifications to display.</p>
    )}
  </ul>
</div>

        {/* Photo Viewing Modal */}
        <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Photo Modal"
      className="max-w-lg sm:max-w-2xl mx-auto mt-20 bg-white p-4 rounded-md shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      {currentPhoto && (
        <div>
          <img
            src={currentPhoto.url}
            alt="Plant Growth"
            className="w-full h-auto mb-4 rounded-md"
          />
          <button
            onClick={closeModal}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      )}
    </Modal>
      </div>
    )}
  </div>

  );
};

export default PlantingGrowthTracking;