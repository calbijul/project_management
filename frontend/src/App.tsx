import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa'; // Importing edit icon from react-icons

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'To Do' | 'Ongoing' | 'Complete';
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
  
  // State to track whether buttons are visible for each task
  const [showButtons, setShowButtons] = useState<{ [key: number]: boolean }>({});
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);  // New state to control form visibility

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = () => {
    axios.post('http://localhost:5000/tasks', newTask)
      .then(response => {
        setTasks([response.data, ...tasks]); // Add new task at the top
        setNewTask({ title: '', description: '', status: 'To Do' });
        setShowAddTaskForm(false);  // Hide the form after adding a task
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const updateTaskStatus = (id: number, status: 'To Do' | 'Ongoing' | 'Complete') => {
    axios.put(`http://localhost:5000/tasks/${id}`, { status })
      .then(() => {
        const updatedTasks = tasks.map(task =>
          task.id === id ? { ...task, status } : task
        );
        setTasks(updatedTasks);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = (id: number) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(error => console.error('Error deleting task:', error));
  };

  const toggleButtons = (id: number) => {
    setShowButtons((prevState) => ({
      ...prevState,
      [id]: !prevState[id],  // Toggle the state for the clicked task
    }));
  };

  const activeTasks = tasks.filter(task => task.status !== 'Complete');
  const completedTasks = tasks.filter(task => task.status === 'Complete');

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        {!showAddTaskForm && (
          <h2 className="text-2xl font-semibold">Active Tasks</h2>
        )}
        {!showAddTaskForm && (
          <button
            onClick={() => setShowAddTaskForm(true)} 
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Create Task
          </button>
        )}
      </div>
    
      {showAddTaskForm && (
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        
          <div className="flex space-x-3">
            <button
              onClick={addTask}
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Add Task
            </button>
            <button
              onClick={() => setShowAddTaskForm(false)} 
              className="w-1/4 py-2 bg-red-600 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Tasks - only visible if the Add Task Form is not open */}
      {!showAddTaskForm && (
        <ul className="space-y-4 mb-6">
          {activeTasks.map((task) => (
            <li key={task.id} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-700">{task.description}</p>
              <p className="mt-2 text-sm text-gray-500">Status: {task.status}</p>

              <div className="mt-4 flex space-x-3">
                {/* Only show "Ongoing" button if the task status is not "Ongoing" */}
                {task.status !== 'Ongoing' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'Ongoing')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Ongoing
                  </button>
                )}
                {/* Only show "Complete" button if the task status is not "Complete" */}
                {task.status !== 'Complete' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'Complete')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

 
      <h2 className="text-2xl font-semibold mb-4">Completed Tasks</h2>
      <ul className="space-y-4">
        {completedTasks.map((task) => (
          <li key={task.id} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-700">{task.description}</p>
            <p className="mt-2 text-sm text-gray-500">Status: {task.status}</p>

          
            <div className="flex justify-between items-center mt-4">
              <FaEdit
                className="text-blue-500 cursor-pointer"
                onClick={() => toggleButtons(task.id)}  // Show buttons when clicked
              />

              {/* Buttons for completing, ongoing, and deleting tasks */}
              {showButtons[task.id] && (
                <div className="flex space-x-3">
                  {/* Only show "Ongoing" button if the task status is not "Ongoing" */}
                  {task.status !== 'Ongoing' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'Ongoing')}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Ongoing
                    </button>
                  )}
                  {/* Only show "Complete" button if the task status is not "Complete" */}
                  {task.status !== 'Complete' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'Complete')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;