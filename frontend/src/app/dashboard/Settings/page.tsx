"use client";

import React, { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import ReactSwitch from "react-switch";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  const [settings, setSettings] = useState({
    username: "",
    email: "",
    password: "",
    notificationsEnabled: true,
    language: "en",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    const name = target.name;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { username: "", email: "", password: "" };

    if (!settings.username) {
      newErrors.username = "Username is required.";
      isValid = false;
    }
    if (!settings.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(settings.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }
    if (!settings.password && isEditing) {
      newErrors.password = "Password is required when editing.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validate()) {
      console.log("Saved Settings:", settings);
      setIsEditing(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <button className="text-xl text-gray-500 dark:text-gray-300 hover:text-gray-700">
            ←
          </button>
          <h1 className="text-2xl font-semibold dark:text-white">Settings</h1>
        </div>

        {/* Search Section */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search for a setting..."
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Settings List */}
        <div className="space-y-4 p-4">
          {/* Account Section */}
          <div className="flex justify-between items-center p-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                <span className="font-bold">A</span>
              </div>
              <span className="font-medium dark:text-white">Account</span>
            </div>
            <span>&#8594;</span>
          </div>

          {/* Notifications Section */}
          <div className="flex justify-between items-center p-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <span className="font-bold">N</span>
              </div>
              <span className="font-medium dark:text-white">Notifications</span>
            </div>
            <span>&#8594;</span>
          </div>

          {/* Appearance Section */}
          <div className="flex justify-between items-center p-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                <span className="font-bold">P</span>
              </div>
              <span className="font-medium dark:text-white">Appearance</span>
            </div>
            <span>&#8594;</span>
          </div>

          {/* Light/Dark Mode Toggle */}
          <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm dark:text-white">Light</span>
              <ReactSwitch
                checked={theme === "dark"}
                onChange={toggleTheme}
                offColor="#ccc"
                onColor="#4ade80"
                uncheckedIcon={false}
                checkedIcon={false}
                height={24}
                width={48}
              />
              <span className="text-sm dark:text-white">Dark</span>
            </div>
          </div>
        </div>

        {/* Footer (edit or save) */}
        <div className="p-4 flex justify-between">
          {!isEditing ? (
            <button
              type="button"
              onClick={toggleEditMode}
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Edit Settings
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={toggleEditMode}
                className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
