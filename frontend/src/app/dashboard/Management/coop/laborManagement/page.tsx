'use client';
import React, { useState } from 'react';
import {
  faTachometerAlt,
  faUsers,
  faUserPlus,
  faDollarSign,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardCards from './components/DashboardCards';
import WorkersTable from './components/WorkersTable';
import RegistrationForm from './components/RegistrationForm';
import SalaryTable from './components/SalaryTable';
import TasksOverview from './components/TasksOverview';
import RecentWorkers from './components/RecentWorkers';
import UpcomingTasks from './components/UpcomingTasks';

const tabs = [
  { key: 'dashboard', label: 'Dashboard', icon: faTachometerAlt },
  { key: 'workers', label: 'Workers', icon: faUsers },
  { key: 'registration', label: 'Registration', icon: faUserPlus },
  { key: 'salaries', label: 'Salaries', icon: faDollarSign },
  { key: 'tasks', label: 'Tasks', icon: faClipboardList },
];

export default function LabourPage() {
  const [active, setActive] = useState('dashboard');

  return (
    <div className="bg-gray-50 rounded-lg shadow p-4">
      {/* Tabs */}
      <nav className="flex space-x-24 mb-10 ml-14">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex items-center px-4 py-2 text-xl rounded-t ${
              active === tab.key
                ? 'bg-white text-green-600 font-semibold'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      {active === 'dashboard' && (
        <div>
          <DashboardCards />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <UpcomingTasks />
            <RecentWorkers />
          </div>
        </div>
      )}
      {active === 'workers' && <WorkersTable />}
      {active === 'registration' && <RegistrationForm />}
      {active === 'salaries' && <SalaryTable />}
      {active === 'tasks' && <TasksOverview isTasksTab={true} />}
    </div>
  );
}