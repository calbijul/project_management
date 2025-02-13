import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa'; 

import { BiLoaderCircle } from 'react-icons/bi';
import clsx from 'clsx';


interface Task {
  id: number;
  title: string;
  description: string;
  status: 'To Do' | 'Ongoing' | 'Complete';
  createdAt: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
  const [showButtons, setShowButtons] = useState<{ [key: number]: boolean }>({});
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => {
        const sortedTasks = response.data.sort(
          (a: Task, b: Task) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTasks(sortedTasks);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const validateTask = (task: { title: string; description: string }) => {
    if (!task.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!task.description.trim()) {
      setError('Description is required');
      return false;
    }
    setError(null);
    return true;
  };

  const addTask = () => {
    if (!validateTask(newTask)) {
      return;
    }

    axios.post('http://localhost:5000/tasks', newTask)
      .then(response => {
        setTasks(prevTasks => [response.data, ...prevTasks]);
        setNewTask({ title: '', description: '', status: 'To Do' });
        setShowAddTaskForm(false);
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const updateTaskStatus = (id: number, status: 'To Do' | 'Ongoing' | 'Complete') => {
    axios.put(`http://localhost:5000/tasks/${id}/status`, { status })
      .then(() => {
        const updatedTasks = tasks.map(task =>
          task.id === id ? { ...task, status } : task
        );
        const sortedTasks = updatedTasks.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTasks(sortedTasks);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = () => {
    if (taskToDelete !== null) {
      axios.delete(`http://localhost:5000/tasks/${taskToDelete}`)
        .then(() => {
          setTasks(tasks.filter(task => task.id !== taskToDelete));
          setShowDeleteModal(false);
          setTaskToDelete(null);
        })
        .catch(error => console.error('Error deleting task:', error));
    }
  };

  const toggleButtons = (id: number) => {
    setShowButtons((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setShowEditModal(false);
  };

  const saveEditedTask = () => {
    if (editingTask && validateTask(editingTask)) {
      axios
        .put(`http://localhost:5000/tasks/${editingTask.id}/edit`, {
          title: editingTask.title,
          description: editingTask.description,
        })
        .then(() => {
          const updatedTasks = tasks.map(task =>
            task.id === editingTask.id ? editingTask : task
          );
          setTasks(updatedTasks);
          setEditingTask(null);
          setShowEditModal(false);
        })
        .catch(error => console.error('Error updating task:', error));
    }
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
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${!newTask.title && error ? 'border-red-500' : 'border-gray-300'}`}
            value={newTask.title}
            onChange={(e) => {
              setNewTask({ ...newTask, title: e.target.value });
              if (e.target.value) {
                setError('');
              }
            }}
          />
          <textarea
            placeholder="Description"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${!newTask.description && error ? 'border-red-500' : 'border-gray-300'}`}
            value={newTask.description}
            onChange={(e) => {
              setNewTask({ ...newTask, description: e.target.value });
              if (e.target.value) {
                setError('');
              }
            }}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
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

      {showEditModal && editingTask && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
            <h3 className="text-xl font-semibold mb-4">Edit Task</h3>
            <input
              type="text"
              placeholder="Title"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 ${!editingTask.title && error ? 'border-red-500' : 'border-gray-300'}`}
              value={editingTask.title}
              onChange={(e) => {
                setEditingTask({ ...editingTask, title: e.target.value });
                if (e.target.value) {
                  setError('');
                }
              }}
            />
            <textarea
              placeholder="Description"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 ${!editingTask.description && error ? 'border-red-500' : 'border-gray-300'}`}
              value={editingTask.description}
              onChange={(e) => {
                setEditingTask({ ...editingTask, description: e.target.value });
                if (e.target.value) {
                  setError('');
                }
              }}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelEditing}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedTask}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <ul className="space-y-4 mb-6">
        {activeTasks.length === 0 ? (
          <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white">
            <p className="text-xl font-semibold text-gray-500">No Active Tasks</p>
          </div>
        ) : (
          activeTasks.map((task) => (
            <li
              key={task.id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white cursor-pointer"
              onDoubleClick={() => startEditing(task)}
            >
              <h2 className="text-xl font-semibold break-words">{task.title}</h2>
              <p className="text-gray-700 break-words mt-2">{task.description}</p>
              <p className={clsx('mt-2 text-sm', {
  'text-green-500': task.status === 'Complete',
  'text-yellow-500': task.status === 'Ongoing',
  'text-gray-500': task.status !== 'Complete' && task.status !== 'To Do',
})}>
  Status: {task.status}
</p>
              <div className="mt-4 flex space-x-3"> 
                {task.status !== 'Ongoing' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'Ongoing')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    <BiLoaderCircle />
                  </button>
                )}
                {task.status === 'Ongoing' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'Complete')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <FaCheck />
                  </button>
                )}
                {task.status === 'Complete' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'To Do')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    To Do
                  </button>
                )}
                <button
                  onClick={() => {
                    setTaskToDelete(task.id);
                    setShowDeleteModal(true);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <h2 className="text-2xl font-semibold">Completed Tasks</h2>
      <ul className="space-y-4">
        {completedTasks.map((task) => (
          <li
            key={task.id}
            className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white cursor-pointer"
          >
            <h2 className="text-xl font-semibold break-words">{task.title}</h2>
            <p className="text-gray-700 break-words mt-2">{task.description}</p>
            <p className={clsx('mt-2 text-sm', {
  'text-green-500': task.status === 'Complete',
  'text-yellow-500': task.status === 'Ongoing',
  'text-gray-500': task.status !== 'Complete' && task.status !== 'To Do',
})}>
  Status: {task.status}
</p>
            <div className="flex justify-between items-center mt-4">
                <FaEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => toggleButtons(task.id)}
                />
                {showButtons[task.id] && (
                  <div className="flex space-x-3">
                    {task.status !== 'Ongoing' && (
                     <button
                     onClick={() => updateTaskStatus(task.id, 'Ongoing')}
                     className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                   >
                      <BiLoaderCircle />
                   </button>
                    )}
                    {task.status !== 'Complete' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'Complete')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setTaskToDelete(task.id);
                        setShowDeleteModal(true);
                      }}
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

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/5">
            <h3 className="text-xl font-semibold mb-4">Delete this task?</h3>
            <div className="flex justify-between space-x-4">
              <button
                onClick={deleteTask}
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
