import { faCalendar, faDollarSign, faTasks, faUser, faUserCheck, faUserFriends, faUserGroup, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface CardProps { title: string; value: number | string; icon: React.ReactNode; }

const stats = [
  { title: 'Total Workers', value: 3, icon: <span className="text-4xl text-gray-200"><FontAwesomeIcon icon={faUsers} className='text-green-300'/></span> },
  { title: 'Active Workers', value: 3, icon: <span className="text-4xl text-gray-200"><FontAwesomeIcon icon={faUserCheck} className='text-green-300'/></span> },
  { title: 'Pending Tasks', value: 2, icon: <span className="text-4xl text-gray-200"><FontAwesomeIcon icon={faTasks} className='text-green-300'/></span> },
  { title: "Salaries", value: 0, icon: <span className="text-4xl text-gray-200"><FontAwesomeIcon icon={faDollarSign} className='text-green-300'/></span> },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div key={s.title} className="bg-white rounded-lg p-4 flex items-center justify-between shadow-lg w-64 h-32 ml-7">
          <div>
            <p className="text-gray-500 text-xl">{s.title}</p>
            <p className="text-3xl font-bold text-green-600 mt-4">{s.value}</p>
          </div>
          <div>{s.icon}</div>
        </div>
      ))}
    </div>
  );
}