// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Define the context for theme management
// const ThemeContext = createContext(null);

// // Define a provider component
// export const ThemeProvider = ({ children }: any) => {
//   const [theme, setTheme] = useState('light'); // Default to light mode

//   // Load saved theme from localStorage
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme) {
//       setTheme(savedTheme);
//       document.body.classList.add(savedTheme);
//       document.body.classList.remove(savedTheme === 'dark' ? 'light' : 'dark');
//     } else {
//       document.body.classList.add('light');
//     }
//   }, []);

//   // Toggle the theme between light and dark
//   const toggleTheme = () => {
//     const newTheme = theme === 'dark' ? 'light' : 'dark';
//     setTheme(newTheme);

//     // Apply the theme class to the body
//     document.body.classList.remove(theme);
//     document.body.classList.add(newTheme);

//     // Save the selected theme in localStorage
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// // Custom hook to use the theme context
// export const useTheme = () => useContext(ThemeContext);

// context/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const API_BASE = "http://localhost:5000"; // your backend URL

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        // ✅ Use full backend URL with /api
        const response = await fetch(`${API_BASE}/api/settings/theme`, { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTheme(data.theme);
        document.documentElement.classList.remove(data.theme === 'dark' ? 'light' : 'dark');
        document.documentElement.classList.add(data.theme);
      } catch (error) {
        console.error('Failed to fetch theme:', error);
      }
    };
    fetchTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    try {
      // ✅ Use full backend URL with /api
      const response = await fetch(`${API_BASE}/api/settings/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ theme: newTheme })
      });
      if (!response.ok) throw new Error("Failed to update theme");
      setTheme(newTheme);
      document.documentElement.classList.remove(theme);
      document.documentElement.classList.add(newTheme);
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
