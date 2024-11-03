// components/Table.tsx
"use client";

import React, { useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import "@/app/globals.css";



interface DataItem {
  id: number;
  previousMonth: string;
  description: string;
  subTotal: number;
  total: number;
}

const initialData: DataItem[] = [
  { id: 1, previousMonth: "January", description: "Utilities", subTotal: 100, total: 120 },
  { id: 2, previousMonth: "February", description: "Supplies", subTotal: 200, total: 220 },
];

const Table: React.FC = () => {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [newItem, setNewItem] = useState<DataItem>({
    id: 0,
    previousMonth: "",
    description: "",
    subTotal: 0,
    total: 0,
  });

  const addItem = () => {
    setData([...data, { ...newItem, id: data.length + 1 }]);
    setNewItem({ id: 0, previousMonth: "", description: "", subTotal: 0, total: 0 });
  };

  const deleteItem = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: number) => {
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, ...newItem } : item
    );
    setData(updatedData);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Financial Overview</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-green-200">
          <tr>
            <th className="border border-gray-300 p-3 text-left text-gray-700">Previous Month</th>
            <th className="border border-gray-300 p-3 text-left text-gray-700">Description</th>
            <th className="border border-gray-300 p-3 text-left text-gray-700">Sub Total</th>
            <th className="border border-gray-300 p-3 text-left text-gray-700">Total</th>
            <th className="border border-gray-300 p-3 text-left text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-gray-300 p-3 text-gray-800">{item.previousMonth}</td>
              <td className="border border-gray-300 p-3 text-gray-800">{item.description}</td>
              <td className="border border-gray-300 p-3 text-gray-800">{item.subTotal}</td>
              <td className="border border-gray-300 p-3 text-gray-800">{item.total}</td>
              <td className="border border-gray-300 p-3 flex space-x-4">
                <button
                  onClick={() => handleUpdate(item.id)}
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Row Icon */}
      <div
        className="flex items-center justify-center mt-6 cursor-pointer text-gray-600 hover:text-green-700 transition-colors"
        onClick={addItem}
      >
        <FaPlus className="mr-2" size={20} />
        <span className="font-semibold">Add Row</span>
      </div>
    </div>
  );
};

export default Table;