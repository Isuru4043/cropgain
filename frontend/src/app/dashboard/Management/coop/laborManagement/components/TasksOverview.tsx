"use client";

import React, { useState, useEffect } from "react";

interface Worker {
  _id: string;
  fullName: string;
  epfNumber: string;
}

interface WorkerReference {
  _id: string;
  [key: string]: any;
}

interface BaseTask {
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "pending" | "in-progress" | "completed";
}

interface NewTask extends BaseTask {
  assignedTo: string[]; // Only worker IDs for new tasks
}

interface Task extends BaseTask {
  _id: string;
  assignedTo: Worker[]; // Full worker objects for fetched tasks
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function TasksOverview({
  isTasksTab = false,
}: {
  isTasksTab?: boolean;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "pending",
    assignedTo: [],
  });

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!API_URL) {
        setError("API URL is not configured");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Fetch workers for assignment
  useEffect(() => {
    const fetchWorkers = async () => {
      if (!API_URL) {
        console.error("API URL is not configured");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/workers`);
        if (!response.ok) throw new Error("Failed to fetch workers");
        const data = await response.json();
        setWorkers(data);
      } catch (err) {
        console.error("Error fetching workers:", err);
      }
    };
    fetchWorkers();
  }, []);

  const handleCreateTask = () => {
    setIsEditing(false);
    setEditTaskId(null);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      status: "pending",
      assignedTo: [],
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditTaskId(null);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      status: "pending",
      assignedTo: [],
    });
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkerSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Get all selected options
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    setNewTask((prev) => ({
      ...prev,
      assignedTo: selectedOptions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!API_URL) {
      setError("API URL is not configured");
      return;
    }

    try {
      // Prepare the date in ISO format, with error handling
      let formattedDate;
      try {
        // Make sure there's a valid date
        const dateObj = newTask.dueDate
          ? new Date(newTask.dueDate)
          : new Date();
        formattedDate = dateObj.toISOString();
      } catch (dateError) {
        setError("Invalid date format");
        return;
      }

      // Create a copy of newTask to avoid reference issues
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        dueDate: formattedDate,
        priority: newTask.priority,
        status: newTask.status,
        // Ensure assignedTo is an array even if it's null or undefined
        assignedTo: Array.isArray(newTask.assignedTo) ? newTask.assignedTo : [],
      };

      const url =
        isEditing && editTaskId
          ? `${API_URL}/tasks/${editTaskId}`
          : `${API_URL}/tasks`;
      const method = isEditing ? "PUT" : "POST";

      console.log("Submitting task data:", taskData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        throw new Error(
          errorData.message ||
            `Failed to ${isEditing ? "update" : "create"} task`
        );
      }

      const resultTask = await response.json();

      if (isEditing && editTaskId) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === editTaskId ? resultTask : t))
        );
      } else {
        setTasks((prevTasks) => [...prevTasks, resultTask]);
      }

      handleModalClose();
    } catch (err) {
      console.error("Error submitting task:", err);
      setError((err as Error).message);
    }
  };

  const handleEdit = (taskId: string) => {
    const taskToEdit = tasks.find((t) => t._id === taskId);
    if (!taskToEdit) return;

    // Format date properly
    let formattedDate = "";
    try {
      formattedDate = new Date(taskToEdit.dueDate).toISOString().split("T")[0];
    } catch (err) {
      console.error("Error formatting date:", err);
    } // Extract worker IDs from the assigned workers array
    const assignedWorkerIds = taskToEdit.assignedTo.map(
      (worker) => worker._id || worker.toString()
    );

    setIsEditing(true);
    setEditTaskId(taskId);
    setNewTask({
      title: taskToEdit.title || "",
      description: taskToEdit.description || "",
      dueDate: formattedDate,
      priority: taskToEdit.priority || "Medium",
      status: taskToEdit.status || "pending",
      assignedTo: assignedWorkerIds,
    });

    setIsModalOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    if (!API_URL) {
      setError("API URL is not configured");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Helper function to safely format dates
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      return "Invalid date";
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 space-y-4 shadow-sm">
      {isTasksTab && (
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">All Tasks</h3>
          <button
            onClick={handleCreateTask}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 flex items-center"
          >
            <span className="mr-2">+</span> Create Task
          </button>
        </div>
      )}
      {!isTasksTab && <h3 className="text-xl font-semibold">Upcoming Tasks</h3>}

      {error && (
        <div className="text-red-500 p-2 bg-red-50 rounded">{error}</div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No tasks found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="border rounded p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">{task.title}</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(task._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-600">
                Due: {formatDate(task.dueDate)}
              </p>
              <div className="flex space-x-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : task.status === "in-progress"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assigned to:</p>
                <div className="flex flex-wrap gap-1">
                  {" "}
                  {task.assignedTo.length > 0 ? (
                    task.assignedTo.map((worker) => (
                      <span
                        key={worker._id}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {worker.fullName || "Unknown worker"}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">
                      No workers assigned
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={newTask.status}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Workers
                </label>
                {workers.length > 0 ? (
                  <>
                    <select
                      multiple
                      value={newTask.assignedTo}
                      onChange={handleWorkerSelection}
                      className="w-full border rounded px-3 py-2 text-sm"
                      size={Math.min(4, workers.length)}
                    >
                      {workers.map((worker) => (
                        <option key={worker._id} value={worker._id}>
                          {worker.fullName}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Hold Ctrl/Cmd to select multiple workers
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No workers available</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {isEditing ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
