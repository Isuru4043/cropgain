"use client";

import React, { useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import "@/app/globals.css";
import ConfirmDialog from "@/components/ConfirmDialog";

interface DataItem {
  id: number;
  date: string;
  previousMonth: number;
  description: string;
  subTotal: number;
  total: number;
}

const initialIncomeData: DataItem[] = [
  {
    id: 1,
    date: "2023-01-01",
    previousMonth: 100,
    description: "Product Sales",
    subTotal: 200,
    total: 300,
  },
];

const initialExpenseData: DataItem[] = [
  {
    id: 1,
    date: "2023-01-02",
    previousMonth: 50,
    description: "Utilities",
    subTotal: 100,
    total: 150,
  },
];

const Table: React.FC = () => {
  const [incomeData, setIncomeData] = useState<DataItem[]>(initialIncomeData);
  const [expenseData, setExpenseData] =
    useState<DataItem[]>(initialExpenseData);
  const [newItem, setNewItem] = useState<DataItem>({
    id: 0,
    date: new Date().toISOString().split("T")[0],
    previousMonth: 0,
    description: "",
    subTotal: 0,
    total: 0,
  });
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [isIncome, setIsIncome] = useState(true); // Track if the action is for Income or Expense
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const handleAddItem = (isIncome: boolean) => {
    const newEntry = {
      ...newItem,
      id: (isIncome ? incomeData : expenseData).length + 1,
      total: newItem.previousMonth + newItem.subTotal,
    };
    if (isIncome) {
      setIncomeData([...incomeData, newEntry]);
    } else {
      setExpenseData([...expenseData, newEntry]);
    }
    setNewItem({
      id: 0,
      date: new Date().toISOString().split("T")[0],
      previousMonth: 0,
      description: "",
      subTotal: 0,
      total: 0,
    });
  };

  const handleEdit = (id: number, isIncome: boolean) => {
    setEditItemId(id);
    setIsIncome(isIncome);
    const item = (isIncome ? incomeData : expenseData).find(
      (item) => item.id === id
    );
    if (item) setNewItem(item);
  };

  const handleSave = () => {
    const updatedData = (isIncome ? incomeData : expenseData).map((item) =>
      item.id === editItemId
        ? { ...newItem, total: newItem.previousMonth + newItem.subTotal }
        : item
    );
    if (isIncome) {
      setIncomeData(updatedData);
    } else {
      setExpenseData(updatedData);
    }
    setEditItemId(null);
    setNewItem({
      id: 0,
      date: new Date().toISOString().split("T")[0],
      previousMonth: 0,
      description: "",
      subTotal: 0,
      total: 0,
    });
  };

  const openDeleteDialog = (id: number, isIncome: boolean) => {
    setDeleteItemId(id);
    setIsIncome(isIncome);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    const updatedData = (isIncome ? incomeData : expenseData).filter(
      (item) => item.id !== deleteItemId
    );
    if (isIncome) {
      setIncomeData(updatedData);
    } else {
      setExpenseData(updatedData);
    }
    setDialogOpen(false);
    setDeleteItemId(null);
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setDeleteItemId(null);
  };

  const totalPreviousMonth = (data: DataItem[]) =>
    data.reduce((acc, item) => acc + item.previousMonth, 0);
  const totalSubTotal = (data: DataItem[]) =>
    data.reduce((acc, item) => acc + item.subTotal, 0);
  const totalAmount = (data: DataItem[]) =>
    data.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-green-700">
        Financial Overview
      </h2>

      {["Income", "Expense"].map((section) => {
        const data = section === "Income" ? incomeData : expenseData;
        const addItem = () => handleAddItem(section === "Income");

        return (
          <div key={section}>
            <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">
              {section}
            </h3>
            <table className="min-w-full border-collapse border border-gray-300 mb-4">
              <thead className="bg-green-200">
                <tr>
                  <th className="border border-gray-300 p-3 text-left text-gray-700">
                    Date
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-gray-700">
                    Previous Month
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-gray-700">
                    Description
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-gray-700">
                    Sub Total
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-gray-700">
                    Total
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="bg-gray-50">
                    <td className="border border-gray-300 p-3 text-gray-800">
                      {item.date}
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-800">
                      {editItemId === item.id ? (
                        <input
                          type="number"
                          value={newItem.previousMonth}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              previousMonth: parseFloat(e.target.value),
                            })
                          }
                          className="w-full border p-1"
                        />
                      ) : (
                        item.previousMonth
                      )}
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-800">
                      {editItemId === item.id ? (
                        <input
                          type="text"
                          value={newItem.description}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              description: e.target.value,
                            })
                          }
                          className="w-full border p-1"
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-800">
                      {editItemId === item.id ? (
                        <input
                          type="number"
                          value={newItem.subTotal}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              subTotal: parseFloat(e.target.value),
                            })
                          }
                          className="w-full border p-1"
                        />
                      ) : (
                        item.subTotal
                      )}
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-800">
                      {item.total}
                    </td>
                    <td className="border border-gray-300 p-3 flex space-x-4">
                      {editItemId === item.id ? (
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <FaSave />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleEdit(item.id, section === "Income")
                          }
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <FaEdit />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          openDeleteDialog(item.id, section === "Income")
                        }
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-green-100">
                  <td className="border border-gray-300 p-3 font-semibold text-gray-800"></td>
                  <td className="border border-gray-300 p-3 font-semibold text-gray-800">
                    {totalPreviousMonth(data)}
                  </td>
                  <td className="border border-gray-300 p-3 font-semibold text-gray-800">
                    Total
                  </td>
                  <td className="border border-gray-300 p-3 font-semibold text-gray-800">
                    {totalSubTotal(data)}
                  </td>
                  <td className="border border-gray-300 p-3 font-semibold text-gray-800">
                    {totalAmount(data)}
                  </td>
                  <td className="border border-gray-300 p-3"></td>
                </tr>
              </tbody>
            </table>

            {/* Add Row Icon for each section */}
            <div
              className="flex items-center justify-center mt-2 cursor-pointer text-gray-600 hover:text-green-700 transition-colors"
              onClick={addItem}
            >
              <FaPlus className="mr-2" size={20} />
              <span className="font-semibold">Add Row</span>
            </div>
          </div>
        );
      })}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={dialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this entry?"
      />
    </div>
  );
};

export default Table;
