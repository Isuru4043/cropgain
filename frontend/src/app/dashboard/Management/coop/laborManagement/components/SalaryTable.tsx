import React, { useState, useEffect, useRef } from "react";

interface Worker {
  _id: string;
  fullName: string;
  epfNumber: string;
}

interface SalaryRecord {
  _id: string;
  workerId: Worker;
  month: string;
  hoursWorked: number;
  hourlyRate: number;
  overtimeHours: number;
  overtimeRate: number;
  baseSalary: number;
  overtimePay: number;
  allowances: number;
  deductions: number;
  tax: number;
  netSalary: number;
}

interface SalaryData {
  workerId: string;
  month: string;
  hoursWorked: number;
  hourlyRate: number;
  overtimeHours: number;
  overtimeRate: number;
  allowances: number;
  deductions: number;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SalaryTable({
  isSalaryTab = false,
}: {
  isSalaryTab?: boolean;
}) {
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editSalaryId, setEditSalaryId] = useState<string | null>(null);
  const [newSalary, setNewSalary] = useState<SalaryData>({
    workerId: "",
    month: "",
    hoursWorked: 0,
    hourlyRate: 0,
    overtimeHours: 0,
    overtimeRate: 0,
    allowances: 0,
    deductions: 0,
  });

  const fetchSalaries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/salaries`);
      if (!response.ok) throw new Error("Failed to fetch salaries");
      const data = await response.json();
      setSalaries(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await fetch(`${API_URL}/workers`);
      if (!response.ok) throw new Error("Failed to fetch workers");
      const data = await response.json();
      setWorkers(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchSalaries();
    fetchWorkers();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditSalaryId(null);
    setNewSalary({
      workerId: "",
      month: "",
      hoursWorked: 0,
      hourlyRate: 0,
      overtimeHours: 0,
      overtimeRate: 0,
      allowances: 0,
      deductions: 0,
    });
  };

  const handleEditSalary = (salary: SalaryRecord) => {
    setEditSalaryId(salary._id);
    setNewSalary({
      workerId: salary.workerId._id,
      month: salary.month,
      hoursWorked: salary.hoursWorked,
      hourlyRate: salary.hourlyRate,
      overtimeHours: salary.overtimeHours,
      overtimeRate: salary.overtimeRate,
      allowances: salary.allowances,
      deductions: salary.deductions,
    });
    setIsModalOpen(true);
  };

  const handleDeleteSalary = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this salary record?"))
      return;

    try {
      const response = await fetch(`${API_URL}/salaries/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete salary record");
      setSalaries(salaries.filter((s) => s._id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/salaries`, {
        method: editSalaryId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newSalary,
          workerId: newSalary.workerId,
          month: newSalary.month,
          hoursWorked: newSalary.hoursWorked,
          hourlyRate: newSalary.hourlyRate,
          overtimeHours: newSalary.overtimeHours,
          overtimeRate: newSalary.overtimeRate,
          allowances: newSalary.allowances,
          deductions: newSalary.deductions,
          tax: 0, // Assuming tax is not editable here
        }),
      });

      if (!response.ok) throw new Error("Failed to save salary record");
      const savedSalary = await response.json();
      setSalaries((prev) =>
        editSalaryId
          ? prev.map((s) => (s._id === editSalaryId ? savedSalary : s))
          : [...prev, savedSalary]
      );
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {isSalaryTab ? "Salary Records" : "My Salary"}
        </h2>
        {isSalaryTab && (
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Salary Record
          </button>
        )}
      </div>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      {salaries.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-8">
          No salary records found.{" "}
          {isSalaryTab ? "Add a new record above." : "Check back later."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Employee</th>
                <th className="py-3 px-4 text-left">Month</th>
                <th className="py-3 px-4 text-left">Hours Worked</th>
                <th className="py-3 px-4 text-left">Hourly Rate</th>
                <th className="py-3 px-4 text-left">Overtime Hours</th>
                <th className="py-3 px-4 text-left">Overtime Rate</th>
                <th className="py-3 px-4 text-left">Allowances</th>
                <th className="py-3 px-4 text-left">Deductions</th>
                <th className="py-3 px-4 text-left">Net Salary</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((salary) => (
                <tr key={salary._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-t">
                    {salary.workerId.fullName}
                  </td>
                  <td className="py-3 px-4 border-t">{salary.month}</td>
                  <td className="py-3 px-4 border-t">{salary.hoursWorked}</td>
                  <td className="py-3 px-4 border-t">Rs.{salary.hourlyRate}</td>
                  <td className="py-3 px-4 border-t">{salary.overtimeHours}</td>
                  <td className="py-3 px-4 border-t">
                    Rs.{salary.overtimeRate}
                  </td>
                  <td className="py-3 px-4 border-t">Rs.{salary.allowances}</td>
                  <td className="py-3 px-4 border-t">Rs.{salary.deductions}</td>
                  <td className="py-3 px-4 border-t font-medium">
                    Rs.{salary.netSalary}
                  </td>
                  <td className="py-3 px-4 border-t">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSalary(salary)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSalary(salary._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Salary Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium mb-4">
              {editSalaryId ? "Edit Salary Record" : "Add Salary Record"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee
                </label>
                <select
                  value={newSalary.workerId}
                  onChange={(e) =>
                    setNewSalary({ ...newSalary, workerId: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select an employee</option>
                  {workers.map((worker) => (
                    <option key={worker._id} value={worker._id}>
                      {worker.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <input
                  type="text"
                  value={newSalary.month}
                  onChange={(e) =>
                    setNewSalary({ ...newSalary, month: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="YYYY-MM"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regular Hours
                  </label>
                  <input
                    type="number"
                    value={newSalary.hoursWorked}
                    onChange={(e) =>
                      setNewSalary({
                        ...newSalary,
                        hoursWorked: parseInt(e.target.value),
                      })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overtime Hours
                  </label>
                  <input
                    type="number"
                    value={newSalary.overtimeHours}
                    onChange={(e) =>
                      setNewSalary({
                        ...newSalary,
                        overtimeHours: parseInt(e.target.value),
                      })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate (Rs.)
                  </label>
                  <input
                    type="number"
                    value={newSalary.hourlyRate}
                    onChange={(e) =>
                      setNewSalary({
                        ...newSalary,
                        hourlyRate: parseFloat(e.target.value),
                      })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overtime Rate (Rs.)
                  </label>
                  <input
                    type="number"
                    value={newSalary.overtimeRate}
                    onChange={(e) =>
                      setNewSalary({
                        ...newSalary,
                        overtimeRate: parseFloat(e.target.value),
                      })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allowances (Rs.)
                  </label>
                  <input
                    type="number"
                    value={newSalary.allowances}
                    onChange={(e) =>
                      setNewSalary({
                        ...newSalary,
                        allowances: parseFloat(e.target.value),
                      })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deductions (Rs.)
                  </label>
                  <input
                    type="number"
                    value={newSalary.deductions}
                    onChange={(e) =>
                      setNewSalary({
                        ...newSalary,
                        deductions: parseFloat(e.target.value),
                      })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  {editSalaryId ? "Update Record" : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
