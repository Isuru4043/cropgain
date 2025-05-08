import React, { useState } from 'react';

interface Task {
  title: string;
  due: string;
  desc: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'in-progress' | 'completed';
  assignees: string;
}

const initialTasks: Task[] = [
  {
    title: 'Mango Harvesting - North Field',
    due: '15/12/2023',
    desc: 'Harvest ripe mangoes from the north field section',
    priority: 'High',
    status: 'in-progress',
    assignees: 'John Smith, Dinesh Perera',
  },
  {
    title: 'Equipment Maintenance',
    due: '10/12/2023',
    desc: 'Regular maintenance of harvesting tools and machinery',
    priority: 'Medium',
    status: 'pending',
    assignees: 'Dinesh Perera',
  },
  {
    title: 'Field Preparation',
    due: '20/12/2023',
    desc: 'Prepare south field for next planting season',
    priority: 'Medium',
    status: 'pending',
    assignees: 'Kumari Silva, John Smith',
  },
];

export default function TasksOverview({ isTasksTab = false }: { isTasksTab?: boolean }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Task>({
    title: '',
    due: '',
    desc: '',
    priority: 'Medium',
    status: 'pending',
    assignees: '',
  });

  const handleCreateTask = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewTask({
      title: '',
      due: '',
      desc: '',
      priority: 'Medium',
      status: 'pending',
      assignees: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTasks([...tasks, newTask]);
    handleModalClose();
  };

  const handleEdit = (title: string) => {
    console.log(`Edit task: ${title}`);
    // Add logic to edit the task (e.g., open a modal)
  };

  const handleDelete = (title: string) => {
    console.log(`Delete task: ${title}`);
    // Add logic to delete the task (e.g., confirm and send API request)
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((t) => (
          <div key={t.title} className="border rounded p-4 space-y-1 relative">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{t.title}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(t.title)}
                  className="text-gray-600 hover:text-green-600"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(t.title)}
                  className="text-gray-600 hover:text-red-600"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">Due: {t.due}</p>
            <p className="text-gray-600 text-sm">{t.desc}</p>
            <div className="flex space-x-2">
              <span
                className={`text-sm px-2 py-1 rounded ${
                  t.priority === 'High'
                    ? 'bg-pink-100 text-pink-700'
                    : t.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {t.priority.toLowerCase()} priority
              </span>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  t.status === 'in-progress'
                    ? 'bg-purple-100 text-purple-700'
                    : t.status === 'pending'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {t.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">Assigned to:</p>
            <p className="text-sm">{t.assignees}</p>
          </div>
        ))}
      </div>

      {isTasksTab && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Create New Task</h3>
              <button onClick={handleModalClose} className="text-gray-600 hover:text-gray-800">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="e.g. Mango Harvesting - North Field"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  value={newTask.due}
                  onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Description</label>
                <textarea
                  value={newTask.desc}
                  onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="e.g. Harvest ripe mangoes from the north field section"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value as 'High' | 'Medium' | 'Low' })
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      status: e.target.value as 'pending' | 'in-progress' | 'completed',
                    })
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Assignees (Comma separated)</label>
                <input
                  type="text"
                  value={newTask.assignees}
                  onChange={(e) => setNewTask({ ...newTask, assignees: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="e.g. John Smith, Dinesh Perera"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-sm text-gray-600 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}