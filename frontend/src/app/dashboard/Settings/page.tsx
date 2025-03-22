'use client';

import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    username: '',
    email: '',
    password: '',
    notificationsEnabled: true,
    language: 'en',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  // State for managing dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State for controlling the dropdown visibility
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  // Set the theme from localStorage or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    } else {
      // Default to light mode
      document.body.classList.add('light');
    }
  }, []);

  // Toggle dark/light mode
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);

    // Apply the theme class to the body
    document.body.classList.toggle('dark', !isDarkMode);
    document.body.classList.toggle('light', isDarkMode);

    // Save the selected theme in localStorage
    localStorage.setItem('theme', newTheme);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [name]: checked,
      }));
    } else {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: '',
      password: '',
    };

    if (!settings.username) {
      newErrors.username = 'Username is required.';
      isValid = false;
    }
    if (!settings.email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(settings.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }
    if (!settings.password && isEditing) {
      newErrors.password = 'Password is required when editing.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validate()) {
      console.log('Saved Settings:', settings);
      setIsEditing(false);
    }
  };

  const toggleEditMode = () => setIsEditing(!isEditing);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <button className="text-xl text-gray-500 dark:text-gray-300 hover:text-gray-700">&#8592;</button> {/* Back Button */}
          <h1 className="text-2xl font-semibold dark:text-white">Settings</h1>
          <div></div> {/* Empty div for symmetry */}
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
          {/* Account */}
          <div className="flex justify-between items-center p-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                <span className="font-bold">A</span>
              </div>
              <span className="font-medium dark:text-white">Account</span>
            </div>
            <span>&#8594;</span>
          </div>

          {/* Notifications */}
          <div className="flex justify-between items-center p-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <span className="font-bold">N</span>
              </div>
              <span className="font-medium dark:text-white">Notifications</span>
            </div>
            <span>&#8594;</span>
          </div>

          {/* Appearance (show options for light/dark mode) */}
          <div
            className="flex justify-between items-center p-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
            onClick={() => setShowThemeOptions(!showThemeOptions)} // Toggle dropdown
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                <span className="font-bold">P</span>
              </div>
              <span className="font-medium dark:text-white">Appearance</span>
            </div>
            <span>&#8594;</span>
          </div>

          {/* Theme Options Dropdown */}
          {showThemeOptions && (
            <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              {/* Light Mode */}
              <div
                onClick={() => toggleTheme()}
                className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Light Mode
              </div>
              {/* Dark Mode */}
              <div
                onClick={() => toggleTheme()}
                className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Dark Mode
              </div>

              {/* Toggle Switch for Light/Dark Mode */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm dark:text-white">Light</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={toggleTheme} // Toggle between light/dark
                    className="sr-only"
                  />
                  <div className="w-16 h-8 bg-gray-200 rounded-full dark:bg-gray-600"></div>
                  <div className="absolute w-6 h-6 bg-white rounded-full transition transform left-1 top-1 dark:left-8 dark:bg-teal-500"></div>
                </label>
                <span className="text-sm dark:text-white">Dark</span>
              </div>
            </div>
          )}

          {/* Other Settings */}
          <div className="flex justify-between items-center p-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
                <span className="font-bold">P</span>
              </div>
              <span className="font-medium dark:text-white">Privacy & Security</span>
            </div>
            <span>&#8594;</span>
          </div>

          {/* Help & Support */}
          <div className="flex justify-between items-center p-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <span className="font-bold">H</span>
              </div>
              <span className="font-medium dark:text-white">Help & Support</span>
            </div>
            <span>&#8594;</span>
          </div>

          {/* About */}
          <div className="flex justify-between items-center p-3 border rounded-md dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white">
                <span className="font-bold">A</span>
              </div>
              <span className="font-medium dark:text-white">About</span>
            </div>
            <span>&#8594;</span>
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
