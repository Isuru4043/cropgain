import React, { useState } from "react";

const PostHarvestHandling = () => {
  const [handlingProcesses] = useState([
    { id: 1, process: "Drying", status: "Completed", location: "Processing Unit A" },
    { id: 2, process: "Sorting", status: "In Progress", location: "Processing Unit B" },
    { id: 3, process: "Packaging", status: "Pending", location: "Packaging Unit C" },
  ]);

  return (
    <div>
      
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-6 py-3 border">Process</th>
            <th className="px-6 py-3 border">Status</th>
            <th className="px-6 py-3 border">Location</th>
          </tr>
        </thead>
        <tbody>
          {handlingProcesses.map((process) => (
            <tr key={process.id}>
              <td className="px-6 py-4 border">{process.process}</td>
              <td className="px-6 py-4 border">
                <span
                  className={`px-2 py-1 rounded ${
                    process.status === "Completed"
                      ? "bg-green-200 text-green-800"
                      : process.status === "In Progress"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {process.status}
                </span>
              </td>
              <td className="px-6 py-4 border">{process.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostHarvestHandling;
