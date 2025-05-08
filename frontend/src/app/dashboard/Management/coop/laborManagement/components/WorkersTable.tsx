import { faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Worker } from "./types";

export default function WorkersTable() {
  const [search, setSearch] = useState("");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWorkers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/workers`);
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
    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter(
    (w) =>
      w.fullName.toLowerCase().includes(search.toLowerCase()) ||
      w.epfNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = async (epf: string) => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/workers/${epf}`
      );
      if (!response.ok) throw new Error("Failed to fetch worker details");
      const worker = await response.json();
      // Handle viewing worker details (e.g., through a modal)
      console.log(worker);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEdit = async (epf: string) => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/workers/${epf}`
      );
      if (!response.ok) throw new Error("Failed to fetch worker details");
      const worker = await response.json();
      // Handle editing worker (e.g., through a form)
      console.log(worker);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async (epf: string) => {
    if (!window.confirm("Are you sure you want to delete this worker?")) return;
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/workers/${epf}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete worker");
      setWorkers(workers.filter((w) => w.epfNumber !== epf));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Workers</h3>
        <input
          type="text"
          placeholder="Search by name or EPF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {error && (
        <div className="text-red-500 p-2 bg-red-50 rounded">{error}</div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : filteredWorkers.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No workers found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                {[
                  "Full Name",
                  "EPF Number",
                  "Age",
                  "Role",
                  "Date Joined",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="py-2 px-4 border-b text-xl font-medium text-gray-700"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((w) => (
                <tr key={w._id}>
                  <td className="py-2 px-4 border-b text-lg">{w.fullName}</td>
                  <td className="py-2 px-4 border-b text-lg">{w.epfNumber}</td>
                  <td className="py-2 px-4 border-b text-lg">{w.age}</td>
                  <td className="py-2 px-4 border-b text-lg">{w.role}</td>
                  <td className="py-2 px-4 border-b text-lg">
                    {new Date(w.dateJoined).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b text-lg flex space-x-8">
                    <button
                      onClick={() => handleView(w.epfNumber)}
                      className="text-gray-600 hover:text-green-600 text-lg"
                      title="View"
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </button>
                    <button
                      onClick={() => handleEdit(w.epfNumber)}
                      className="text-gray-600 hover:text-green-600 text-lg"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(w.epfNumber)}
                      className="text-gray-600 hover:text-red-600 text-lg"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
