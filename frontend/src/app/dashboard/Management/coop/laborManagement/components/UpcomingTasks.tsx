import React from 'react';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Task {
  title: string;
  due: string;
  desc: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'in-progress' | 'completed';
  assignees: string;
}

const tasks: Task[] = [
  {
    title: 'Mango Harvesting - North Field',
    due: '15/06/2025',
    desc: 'Harvest ripe mangoes from the north field section',
    priority: 'High',
    status: 'in-progress',
    assignees: 'John Smith, Dinesh Perera',
  },
  {
    title: 'Equipment Maintenance',
    due: '10/06/2025',
    desc: 'Regular maintenance of harvesting tools and machinery',
    priority: 'Medium',
    status: 'pending',
    assignees: 'Dinesh Perera',
  },
  {
    title: 'Field Preparation',
    due: '20/06/2025',
    desc: 'Prepare south field for next planting season',
    priority: 'Medium',
    status: 'pending',
    assignees: 'Kumari Silva, John Smith',
  },
];

export default function UpcomingTasks() {
  const currentDate = new Date('2025-05-07'); // Current date from context
  const upcomingTasks = tasks.filter((t) => {
    const taskDate = new Date(t.due.split('/').reverse().join('-')); // Convert DD/MM/YYYY to Date
    return (t.status === 'pending' || t.status === 'in-progress') && taskDate >= currentDate;
  });

  return (
    <div className="bg-white rounded-lg p-4 space-y-2 shadow-sm">
      <h3 className="text-lg font-semibold flex items-center">
        <span className="text-green-600 mr-2"><FontAwesomeIcon icon={faCalendarDays} className="text-green-300" /></span>
        Upcoming Tasks
      </h3>
      <ul className="space-y-2">
        {upcomingTasks.map((t) => (
          <li key={t.title} className="border rounded p-3 space-y-1">
            <p className="font-semibold">{t.title}</p>
            <p className="text-sm text-gray-600">{t.desc}</p>
            <p className="text-sm text-gray-600">Due: {t.due}</p>
            <div className="flex space-x-2">
              <span
                className={`text-sm px-2 py-1 rounded ${
                  t.priority === 'High'
                    ? 'bg-pink-100 text-pink-700'
                    : t.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {t.priority.toLowerCase()} priority
              </span>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  t.status === 'in-progress'
                    ? 'bg-purple-100 text-purple-700'
                    : t.status === 'pending'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {t.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}