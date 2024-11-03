
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faPlus,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Calendar from "react-calendar"; 
import "react-calendar/dist/Calendar.css"; 
import "react-datepicker/dist/react-datepicker.css"; 
import DatePicker from "react-datepicker"; 

const AddEvent: React.FC = () => {
  const router = useRouter();
  const [formattedDate, setFormattedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventInputs, setEventInputs] = useState<
    { name: string; time: Date | null }[]
  >([]); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateString = params.get("date");

    if (dateString) {
      const date = new Date(dateString);
      setFormattedDate(
        date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
      setSelectedDate(date);
    }
  }, []);

  const handleBack = () => {
    router.back();
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFormattedDate(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
    setShowCalendar(false);
  };

  const handleAddEventClick = () => {
    setEventInputs([...eventInputs, { name: "", time: null }]); // Add new input fields
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newInputs = [...eventInputs];
    newInputs[index].name = event.target.value; // Update event name
    setEventInputs(newInputs);
  };

  const handleTimeChange = (index: number, time: Date) => {
    const newInputs = [...eventInputs];
    newInputs[index].time = time; // Update event time
    setEventInputs(newInputs);
  };

  const handleSaveEvents = () => {
    // Logic to save all events
    console.log("Events to save:", eventInputs);
    // Reset input fields after saving
    setEventInputs([]);
  };

  const handleDeleteEvent = (index: number) => {
    setEventInputs(eventInputs.filter((_, i) => i !== index)); // Remove the event input at the specified index
  };

  const handleEditEvent = (index: number) => {
    // Placeholder function to handle editing
    // Currently, the input fields themselves are editable.
    console.log("Editing event at index:", index);
  };

  return (
    <div className="flex flex-col items-center p-10 text-lg">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-7xl mb-6">
        <div className="flex items-center space-x-4 text-2xl font-semibold w-2/3">
          <h1 className="text-3xl font-medium text-gray-800 font-roboto">
            {formattedDate || "Select a date"}
          </h1>
        </div>

        {/* Calendar Icon */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleCalendar}
            className="p-4 bg-gray-200 rounded-lg text-3xl"
          >
            <FontAwesomeIcon icon={faCalendar} className="text-blue-700"/>
          </button>
        </div>
      </div>

      {/* Display the calendar if showCalendar is true */}
      {showCalendar && (
        <div className="mb-4">
          <Calendar
            onChange={handleDateSelect}
            value={selectedDate}
            className="border-2 border-gray-300 rounded-lg"
          />
        </div>
      )}

      <div className="w-full max-w-7xl flex items-center justify-between mb-4">
        <button
          onClick={handleAddEventClick}
          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg text-xl transform transition-transform duration-300 ease-in-out hover:scale-105"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Add Event</span>
        </button>
      </div>



{/* Input Fields for Events */}
<div className="w-full max-w-7xl bg-gray-200 rounded-lg p-8 flex flex-col items-center">
  {eventInputs.map((input, index) => (
    <div key={index} className="w-full flex items-center mb-4 font-roboto">
      {/* Event Name Input */}
      <input
        type="text"
        value={input.name}
        onChange={(event) => handleInputChange(index, event)}
        placeholder="Enter event name"
        className="border p-2 rounded w-4/5 mr-6" // Full width for event name
      />

      {/* Time Picker Wrapper with Reduced Width */}
      <div className="w-1/4">
        <DatePicker
          selected={input.time}
          onChange={(time) => handleTimeChange(index, time)}
          showTimeSelect
          showTimeSelectOnly // Show only time picker
          timeIntervals={15} // Time intervals (15 minutes)
          dateFormat="h:mm aa" // Format for time display
          className="border p-2 rounded w-2/5 font-roboto"
          placeholderText="Time"
        />
      </div>

      {/* Buttons with Reduced Gap */}
      <div className="flex space-x-6 text-xl -ml-14"> {/* Changed from space-x-6 to space-x-3 */}
        {/* Edit Button */}
        <button
          onClick={() => handleEditEvent(index)}
          className="text-blue-600 hover:scale-105"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => handleDeleteEvent(index)}
          className="text-red-600 hover:scale-105"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  ))}











        <button
          onClick={handleSaveEvents}
          className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
        >
          Save All Events
        </button>
      </div>

      <button
        onClick={handleBack}
        className="px-4 py-2 bg-blue-600 text-white rounded mt-10"
      >
        Go Back
      </button>
    </div>
  );
};

export default AddEvent;
