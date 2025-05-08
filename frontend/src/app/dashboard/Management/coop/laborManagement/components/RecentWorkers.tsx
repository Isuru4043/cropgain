import React, { useState, useEffect } from 'react';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Worker } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RecentWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecentWorkers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/workers/recent`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Worker[] = await response.json();
        setWorkers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentWorkers();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 space-y-2 shadow-sm">
      <h3 className="text-lg font-semibold flex items-center">
        <span className="text-green-600 mr-2">
          <FontAwesomeIcon icon={faUserGroup} className="text-green-600" />
        </span>
        Recently Added Workers
      </h3>
      {error && <div className="text-red-500">{error}</div>}
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : workers.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No recent workers found</div>
      ) : (
        <ul className="space-y-2">
          {workers.map((w) => (
            <li key={w._id} className="border rounded p-3 flex justify-between">
              <div>
                <p className="font-semibold">{w.fullName}</p>
                <p className="text-gray-500 text-sm">EPF: {w.epfNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-700 text-sm">{w.skills.join(', ')}</p>
                <p className="text-gray-500 text-sm">
                  Joined: {new Date(w.dateJoined).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}