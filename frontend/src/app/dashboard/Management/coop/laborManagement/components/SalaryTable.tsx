import React, { useState, useEffect, useRef } from "react";

// Enhanced interface with more detailed information
interface WorkerHours {
  id: string;
  name: string;
  hoursWorked: number;
  overtimeHours: number;
  deductions: number;
  date: string;
  hourlyRate: number; // Individual hourly rate for each employee
  allowances: number; // Additional allowances (bonuses, etc.) - kept in data model but hidden from UI
  tax: number; // Estimated tax withholding - kept in data model but hidden from UI
}

interface Salary {
  id: string;
  name: string;
  baseSalary: number;
  overtime: number;
  allowances: number; // Kept in model but hidden from UI
  grossPay: number; // Before deductions
  tax: number; // Kept in model but hidden from UI
  deductions: number;
  netPay: number;
  date: string;
}

// Generate mock data for all months of multiple years
const generateMockData = () => {
  const data: Record<string, WorkerHours[]> = {};
  const years = [2024, 2025];
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  years.forEach((year) => {
    for (let month = 1; month <= 12; month++) {
      // Handle leap year for February
      const daysInMonth =
        month === 2 && year % 4 === 0 ? 29 : monthDays[month - 1];
      const formattedMonth = month.toString().padStart(2, "0");
      const key = `${year}-${formattedMonth}`;

      // Generate random but realistic work hours
      const baseHours = month === 2 ? 160 - 8 : 160; // February has fewer days
      const johnHours = baseHours + Math.floor(Math.random() * 8) - 4;
      const janeHours = baseHours + Math.floor(Math.random() * 8) - 4;

      data[key] = [
        {
          id: "1",
          name: "John Doe",
          hoursWorked: johnHours,
          overtimeHours: 5 + Math.floor(Math.random() * 10),
          deductions: 150,
          tax: 400 + Math.floor(Math.random() * 80) - 40,
          allowances: 100,
          date: `${daysInMonth}/${formattedMonth}/${year}`,
          hourlyRate: 12.5,
        },
        {
          id: "2",
          name: "Jane Smith",
          hoursWorked: janeHours,
          overtimeHours: 8 + Math.floor(Math.random() * 10),
          deductions: 200,
          tax: 450 + Math.floor(Math.random() * 60) - 30,
          allowances: 150,
          date: `${daysInMonth}/${formattedMonth}/${year}`,
          hourlyRate: 13.75,
        },
      ];
    }
  });

  return data;
};

const mockMonthlyData = generateMockData();

export default function SalaryTable() {
  // State for application
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [workerHours, setWorkerHours] = useState<WorkerHours[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<WorkerHours | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [customRate, setCustomRate] = useState(1.5); // Default overtime multiplier

  // Create refs for detecting clicks outside
  const monthPickerRef = useRef<HTMLDivElement>(null);
  const monthButtonRef = useRef<HTMLButtonElement>(null);

  // Full selected month string (YYYY-MM format)
  const monthYearKey = `${selectedYear}-${selectedMonth}`;

  // Get data for the selected month
  useEffect(() => {
    const monthData = mockMonthlyData[monthYearKey] || [];
    setWorkerHours(monthData);
    setSalaries([]);
  }, [monthYearKey]);

  // Handle clicks outside of the month picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showMonthPicker &&
        monthPickerRef.current &&
        monthButtonRef.current &&
        !monthPickerRef.current.contains(event.target as Node) &&
        !monthButtonRef.current.contains(event.target as Node)
      ) {
        setShowMonthPicker(false);
      }
    }

    // Add event listener when month picker is shown
    if (showMonthPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMonthPicker]);

  // Handle escape key press to close modals
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (showMonthPicker) setShowMonthPicker(false);
        if (showEditModal) setShowEditModal(false);
      }
    }

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showMonthPicker, showEditModal]);

  // Available years for selection
  const availableYears = [2024, 2025, 2026];

  // Month names array
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Format date display
  const formatMonthDisplay = () => {
    const monthIndex = parseInt(selectedMonth) - 1;
    return `${monthNames[monthIndex]} ${selectedYear}`;
  };

  // Calculate employee salaries
  const calculateSalaries = () => {
    const calculatedSalaries = workerHours.map((wh) => {
      const baseSalary = wh.hoursWorked * wh.hourlyRate;
      const overtime = wh.overtimeHours * (wh.hourlyRate * customRate);
      const grossPay = baseSalary + overtime + wh.allowances;
      const netPay = grossPay - wh.deductions - wh.tax;

      return {
        id: wh.id,
        name: wh.name,
        baseSalary: Math.round(baseSalary),
        overtime: Math.round(overtime),
        allowances: wh.allowances,
        grossPay: Math.round(grossPay),
        tax: wh.tax,
        deductions: wh.deductions,
        netPay: Math.round(netPay),
        date: wh.date,
      };
    });

    setSalaries(calculatedSalaries);
  };

  // Handle employee edit modal
  const handleEditEmployee = (employee: WorkerHours) => {
    setEditEmployee({ ...employee });
    setShowEditModal(true);
  };

  // Save employee edits
  const saveEmployeeChanges = () => {
    if (editEmployee) {
      const updatedWorkerHours = workerHours.map((wh) =>
        wh.id === editEmployee.id ? editEmployee : wh
      );
      setWorkerHours(updatedWorkerHours);
      setShowEditModal(false);
    }
  };

  // Toggle details view for a salary record
  const toggleDetails = (id: string) => {
    setShowDetails(showDetails === id ? null : id);
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    if (salaries.length === 0) return null;

    const totalBaseSalary = salaries.reduce((sum, s) => sum + s.baseSalary, 0);
    const totalOvertime = salaries.reduce((sum, s) => sum + s.overtime, 0);
    const totalDeductions = salaries.reduce((sum, s) => sum + s.deductions, 0);
    const totalNetPay = salaries.reduce((sum, s) => sum + s.netPay, 0);

    return {
      totalBaseSalary,
      totalOvertime,
      totalDeductions,
      totalNetPay,
    };
  };

  const summary = calculateSummary();

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/salaries`);
        if (!response.ok) {
          throw new Error("Failed to fetch salaries");
        }
        const data = await response.json();
        setSalaries(data);
      } catch (err) {
        console.error("Error fetching salaries:", err);
      }
    };

    fetchSalaries();
  }, []);

  const handleAddSalary = async (salaryData: any) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/salaries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salaryData),
      });

      if (!response.ok) {
        throw new Error("Failed to add salary");
      }

      const newSalary = await response.json();
      setSalaries([...salaries, newSalary]);
    } catch (err) {
      console.error("Error adding salary:", err);
    }
  };

  const handleUpdateSalary = async (id: string, salaryData: any) => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/salaries/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(salaryData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update salary");
      }

      const updatedSalary = await response.json();
      setSalaries(salaries.map((s) => (s.id === id ? updatedSalary : s)));
    } catch (err) {
      console.error("Error updating salary:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 space-y-6 shadow-md">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold">Payroll and Compensation</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Custom Month & Year Selector */}
          <div className="relative">
            <button
              ref={monthButtonRef}
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="border rounded px-3 py-2 text-sm flex items-center justify-between min-w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>{formatMonthDisplay()}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Month Picker Dropdown */}
            {showMonthPicker && (
              <div
                ref={monthPickerRef}
                className="absolute z-10 mt-1 w-64 bg-white border rounded shadow-lg p-3"
              >
                {/* Year Selector */}
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() =>
                      setSelectedYear((prev) => Math.max(2020, prev - 1))
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="text-sm font-medium focus:outline-none"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() =>
                      setSelectedYear((prev) => Math.min(2030, prev + 1))
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Month Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {monthNames.map((month, index) => {
                    const monthNum = (index + 1).toString().padStart(2, "0");
                    const isSelected = selectedMonth === monthNum;

                    return (
                      <button
                        key={month}
                        onClick={() => {
                          setSelectedMonth(monthNum);
                          setShowMonthPicker(false);
                        }}
                        className={`py-2 text-sm rounded ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {month.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm whitespace-nowrap">OT Rate:</label>
            <select
              value={customRate}
              onChange={(e) => setCustomRate(parseFloat(e.target.value))}
              className="border rounded px-2 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          <button
            onClick={calculateSalaries}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
          >
            Calculate Salaries
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-700">
                Base Salary
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-700">
                Overtime
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-700">
                Deductions
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-700">
                Net Pay
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {salaries.length > 0 ? (
              <>
                {salaries.map((s) => (
                  <React.Fragment key={s.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-t text-sm font-medium">
                        {s.name}
                      </td>
                      <td className="py-3 px-4 border-t text-sm">
                        Rs.{s.baseSalary}
                      </td>
                      <td className="py-3 px-4 border-t text-sm">
                        Rs.{s.overtime}
                      </td>
                      <td className="py-3 px-4 border-t text-sm">
                        Rs.{s.deductions}
                      </td>
                      <td className="py-3 px-4 border-t text-sm font-medium">
                        Rs.{s.netPay}
                      </td>
                      <td className="py-3 px-4 border-t text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleDetails(s.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {showDetails === s.id ? "Hide" : "Details"}
                          </button>
                          <button
                            onClick={() =>
                              handleEditEmployee(
                                workerHours.find((wh) => wh.id === s.id)!
                              )
                            }
                            className="text-green-600 hover:text-green-800"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                    {showDetails === s.id && (
                      <tr>
                        <td colSpan={6} className="py-3 px-4 bg-gray-50">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Hours Breakdown:</p>
                              <p>
                                Regular:{" "}
                                {
                                  workerHours.find((wh) => wh.id === s.id)
                                    ?.hoursWorked
                                }{" "}
                                hrs
                              </p>
                              <p>
                                Overtime:{" "}
                                {
                                  workerHours.find((wh) => wh.id === s.id)
                                    ?.overtimeHours
                                }{" "}
                                hrs
                              </p>
                              <p>
                                Hourly Rate: Rs.
                                {
                                  workerHours.find((wh) => wh.id === s.id)
                                    ?.hourlyRate
                                }
                                /hr
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Salary Breakdown:</p>
                              <p>Gross Pay: Rs.{s.grossPay}</p>
                              <p>Total Deductions: Rs.{s.deductions + s.tax}</p>
                              <p>Pay Date: {s.date}</p>
                            </div>
                            <div>
                              <p className="font-medium">Payment Method:</p>
                              <p>Direct Deposit</p>
                              <p>
                                Statement Available:{" "}
                                <span className="text-blue-600 cursor-pointer">
                                  Download
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {summary && (
                  <tr className=" font-medium bg-blue-100">
                    <td className="py-3 px-4 border-t text-sm ">Total</td>
                    <td className="py-3 px-4 border-t text-sm">
                      Rs.{summary.totalBaseSalary}
                    </td>
                    <td className="py-3 px-4 border-t text-sm">
                      Rs.{summary.totalOvertime}
                    </td>
                    <td className="py-3 px-4 border-t text-sm">
                      Rs.{summary.totalDeductions}
                    </td>
                    <td className="py-3 px-4 border-t text-sm">
                      Rs.{summary.totalNetPay}
                    </td>
                    <td className="py-3 px-4 border-t text-sm"></td>
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 px-4 text-center text-sm text-gray-500"
                >
                  Select a month and click &quot;Calculate Salaries&quot; to view data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {salaries.length > 0 ? (
          <>
            {salaries.map((s) => (
              <div
                key={s.id}
                className="border rounded-lg p-4 space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{s.name}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleDetails(s.id)}
                      className="text-xs text-blue-600"
                    >
                      {showDetails === s.id ? "Hide" : "Details"}
                    </button>
                    <button
                      onClick={() =>
                        handleEditEmployee(
                          workerHours.find((wh) => wh.id === s.id)!
                        )
                      }
                      className="text-xs text-green-600"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    Base Salary:{" "}
                    <span className="font-medium">Rs.{s.baseSalary}</span>
                  </p>
                  <p>
                    Overtime:{" "}
                    <span className="font-medium">Rs.{s.overtime}</span>
                  </p>
                  <p>
                    Deductions:{" "}
                    <span className="font-medium">Rs.{s.deductions}</span>
                  </p>
                </div>

                <div className="flex justify-between pt-2 border-t">
                  <p className="text-sm font-medium">Net Pay:</p>
                  <p className="text-sm font-medium">Rs.{s.netPay}</p>
                </div>

                {showDetails === s.id && (
                  <div className="mt-3 pt-3 border-t space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Hours Breakdown:</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <p>
                          Regular:{" "}
                          {
                            workerHours.find((wh) => wh.id === s.id)
                              ?.hoursWorked
                          }{" "}
                          hrs
                        </p>
                        <p>
                          Overtime:{" "}
                          {
                            workerHours.find((wh) => wh.id === s.id)
                              ?.overtimeHours
                          }{" "}
                          hrs
                        </p>
                        <p>
                          Hourly Rate: Rs.
                          {workerHours.find((wh) => wh.id === s.id)?.hourlyRate}
                          /hr
                        </p>
                        <p>Pay Date: {s.date}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-blue-600">
                        Download Pay Statement
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {summary && (
              <div className="border-t pt-4 mt-4">
                <p className="font-medium mb-2">Monthly Summary</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    Total Base:{" "}
                    <span className="font-medium">
                      Rs.{summary.totalBaseSalary}
                    </span>
                  </p>
                  <p>
                    Total Overtime:{" "}
                    <span className="font-medium">
                      Rs.{summary.totalOvertime}
                    </span>
                  </p>
                  <p>
                    Total Deductions:{" "}
                    <span className="font-medium">
                      Rs.{summary.totalDeductions}
                    </span>
                  </p>
                  <p>
                    Total Net Pay:{" "}
                    <span className="font-medium">
                      Rs.{summary.totalNetPay}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center py-8 text-sm text-gray-500">
            Select a month and click &quot;Calculate Salaries&quot; to view data.
          </p>
        )}
      </div>

      {/* Edit Employee Modal */}
      {showEditModal && editEmployee && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEditModal(false);
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Edit Employee Hours</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={editEmployee.name}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, name: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regular Hours
                  </label>
                  <input
                    type="number"
                    value={editEmployee.hoursWorked}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        hoursWorked: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overtime Hours
                  </label>
                  <input
                    type="number"
                    value={editEmployee.overtimeHours}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        overtimeHours: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border rounded px-3 py-2 text-sm"
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
                    step="0.01"
                    value={editEmployee.hourlyRate}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        hourlyRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deductions (Rs.)
                  </label>
                  <input
                    type="number"
                    value={editEmployee.deductions}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        deductions: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Hidden but available tax input */}
              <div className="hidden">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Withholding (Rs.)
                </label>
                <input
                  type="number"
                  value={editEmployee.tax}
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      tax: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEmployeeChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
