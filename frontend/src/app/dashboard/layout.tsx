"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [date, setDate] = useState(new Date());

  const toggleCalendar = () => {
    setCalendarOpen((prev) => !prev);
  };

  const handleDateClick = (selectedDate: Date) => {
    // Create a new Date object and set the time to the start of the day (local time)
    const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
    const formattedDate = localDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    router.push(`/add-event?date=${formattedDate}`); // Redirect with the date as a query parameter
  };
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-green-700 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold">CropGain</div>
          <nav className="flex space-x-10 text-xl mr-4">
            <Link href="/dashboard" className="hover:text-green-300">
              Dashboard
            </Link>
            <Link
              href="/dashboard/Accounts"
              className="hover:text-green-300"
            >
             Accounts
            </Link>
            <Link
              href="/dashboard/Management"
              className="hover:text-green-300"
            >
              Management
            </Link>
            <button
              onClick={toggleCalendar}
              aria-label="Toggle calendar"
              className="hover:text-green-300"
            >
              <FontAwesomeIcon icon={faCalendar} />
            </button>

            
            <Link href="#" className="hover:text-green-300">
              <FontAwesomeIcon icon={faBell} />
            </Link>


            <Link href="/settings" className="hover:text-green-300">
              <FontAwesomeIcon icon={faCog} />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-6 bg-white relative">
        {children}
        {isCalendarOpen && (
          <div
            ref={calendarRef}
            className="absolute top-10 right-10 bg-white shadow-lg rounded-lg p-4 z-10 -mt-4"
          >
            <h2 className="text-lg font-semibold">Calendar</h2>
            <Calendar onChange={handleDateClick} value={date} />
          </div>
        )}
      </main>
    </div>
  );
}
