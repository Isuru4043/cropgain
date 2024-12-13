"use client";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Link from "next/link";

interface Row {
  account: string;
  description: string;
  income: string;
  expense: string;
  date?: string; // Optional field
  crop?: string; // Optional field
  unitPrice?: string; // Optional field
  units?: string; // Optional field
}

const TableComponent = () => {
  const initialRows: Row[] = [
    {
      account: "212,925.18",
      description: "Opening Balance",
      income: "212,925.18",
      expense: "",
    },
    {
      account: "212,925.18",
      description: "Total Income",
      income: "212,925.18",
      expense: "",
    },
    {
      account: "181,763.41",
      description: "Total Expenses",
      income: "",
      expense: "181,763.41",
    },
    {
      account: "13,200.00",
      description: "Fixed Expenses",
      income: "",
      expense: "13,200.00",
    },
    {
      account: "79,275.00",
      description: "Variable Expenses",
      income: "",
      expense: "79,275.00",
    },
    {
      account: "274,238.41",
      description: "Net Balance",
      income: "274,238.41",
      expense: "61,313.23",
    },
  ];

  const [rows, setRows] = useState<Row[]>(initialRows);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Row
  ) => {
    const newRows = [...rows];
    newRows[index][field] = e.target.value;
    setRows(newRows);
  };

  // Separate income and expense rows
  const incomeRows = rows.filter((row) => row.income !== "");
  const expenseRows = rows.filter((row) => row.expense !== "");

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">

      <h1 className="text-4xl text-center font-semibold">Income per crops</h1>
      {/* First Table - Crop Table */}
      <div className="overflow-x-auto mt-8">
        <table
          className="table-auto border-collapse border border-gray-400 w-full"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="text-2xl">
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2 text-center w-[200px]">
                Date
              </th>
              <th className="border border-gray-400 p-2 text-center w-[400px]">
                Crop
              </th>
              <th className="border border-gray-400 p-2 text-center w-[200px]">
                Unit per price
              </th>
              <th className="border border-gray-400 p-2 text-center w-[200px]">
                Number of units
              </th>
              <th className="border border-gray-400 p-2 text-center w-[200px]">
                Income per each crop
              </th>
            </tr>
          </thead>
          <tbody className="text-lg">
            {incomeRows.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2 text-center">
                  <input
                    type="date"
                    value={row.date || ""}
                    onChange={(e) => handleChange(e, index, "date")}
                    className="border-none bg-transparent text-center w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-400 p-2">
                  <input
                    type="text"
                    value={row.crop || ""}
                    onChange={(e) => handleChange(e, index, "crop")}
                    className="border-none bg-transparent w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  <input
                    type="text"
                    value={row.unitPrice || ""}
                    onChange={(e) => handleChange(e, index, "unitPrice")}
                    className="border-none bg-transparent text-center w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  <input
                    type="text"
                    value={row.units || ""}
                    onChange={(e) => handleChange(e, index, "units")}
                    className="border-none bg-transparent text-center w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  {/* Calculating Income per crop */}
                  <input
                    type="text"
                    value={
                      (parseFloat(row.unitPrice || "0") || 0) *
                      (parseFloat(row.units || "0") || 0)
                    }
                    readOnly
                    className="border-none bg-transparent text-center w-full focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Second Table - Income and Expenses */}
      <div className="overflow-x-auto mt-12">

      <h1 className="text-4xl text-center font-semibold">Genaral Profit and Loss Account</h1>
        <table
          className="table-auto border-collapse border border-gray-400 w-full mt-8"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="text-2xl">
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2 text-center w-[200px]">
                Previous month
              </th>
              <th className="border border-gray-400 p-2 text-center w-[400px]">
                Description
              </th>
              <th className="border border-gray-400 p-2 text-center w-[200px]">
                Sub Total
              </th>
              <th className="border border-gray-400 p-2 text-center w-[200px]">
                Total
              </th>
            </tr>
          </thead>

          {/* Income Section */}
          <thead>
            <tr className="bg-green-300">
              <th colSpan={4} className="text-2xl p-2 text-center">
                Income
              </th>
            </tr>
          </thead>
          <tbody className="text-lg">
            {incomeRows.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2 text-center">
                  <input
                    type="text"
                    value={row.account}
                    onChange={(e) => handleChange(e, index, "account")}
                    className="border-none bg-transparent text-center w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-400 p-2">
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleChange(e, index, "description")}
                    className="border-none bg-transparent w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  <input
                    type="text"
                    value={row.income}
                    onChange={(e) => handleChange(e, index, "income")}
                    className="border-none bg-transparent text-center w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  <input
                    type="text"
                    value={row.expense}
                    onChange={(e) => handleChange(e, index, "expense")}
                    className="border-none bg-transparent text-center w-full focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>

          {/* Expense Section */}
          <thead>
            <tr className="bg-red-300">
              <th colSpan={4} className="text-2xl p-2 text-center">
                Expenses
              </th>
            </tr>
          </thead>
          <tbody className="text-lg">
            {expenseRows.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2 text-center">
                  <input
                    type="text"
                    value={row.account}
                    onChange={(e) => handleChange(e, index, "account")}
                    className="border-none bg-transparent text-center w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-400 p-2">
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleChange(e, index, "description")}
                    className="border-none bg-transparent w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  <input
                    type="text"
                    value={row.income}
                    onChange={(e) => handleChange(e, index, "income")}
                    className="border-none bg-transparent text-center w-full focus:outline-none"
                  />
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  <input
                    type="text"
                    value={row.expense}
                    onChange={(e) => handleChange(e, index, "expense")}
                    className="border-none bg-transparent text-center w-full focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
