"use client";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Fetch today's events for notifications
  useEffect(() => {
    const fetchTodaysEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events/notifications');
        const data = await response.json();
        if (data.events && data.events.length > 0) {
          setNotificationData(data.events);  // Update state with events to show
        } else {
          setNotificationData([]);  // No events for today
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (isOpen) {
      fetchTodaysEvents();  // Fetch when dropdown is opened
    }

    // Optionally, you can poll every minute or so
    const interval = setInterval(fetchTodaysEvents, 60000);  // Fetch every minute

    return () => clearInterval(interval);  // Cleanup interval on unmount or when isOpen changes
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 text-gray-600 hover:text-gray-800"
      >
        <FontAwesomeIcon icon={faBell} size="lg" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4">
          <h3 className="font-semibold text-gray-700">Notifications</h3>
          <ul className="mt-2">
            {notificationData.length > 0 ? (
              notificationData.map((event, index) => (
                <li key={index} className="p-2 text-gray-600 border-b border-gray-200">
                  {event.name} at {event.time}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-600">No events for today</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
