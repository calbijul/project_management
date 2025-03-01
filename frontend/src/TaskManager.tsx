import React, { useEffect, useState } from "react";
import { Task, ToastType } from "./types";
import { fetchTasks, createTask, updateTaskStatus, deleteTaskAPI, updateTaskDetails } from "./api";
import TaskSidebar from "./components/TaskSidebar";
import TaskList from "./components/TaskList";
import { AddTaskModal, EditTaskModal, DeleteTaskModal } from "./components/Modals";
import Toast from "./components/Toast";
import { CheckCircle, ClipboardCheck, Clock } from "lucide-react";
import MenuButton from "./assets/components/menuButton";

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "createdAt">>({
    title: "",
    description: "",
    status: "To Do",
  });
  const [showButtons, setShowButtons] = useState<{ [key: number]: boolean }>({});
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState<ToastType>({ message: "", type: "success" });
  const [deletedTask, setDeletedTask] = useState<Task | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"To Do" | "Ongoing" | "Complete" | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data.sort((a: Task, b: Task) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } catch (error) {
        handleToast(`Error fetching tasks: ${error}`, "error");
      }
    };
    loadTasks();
  }, []);

  const validateTask = (task: { title: string; description: string }) => {
    if (!task.title.trim() && !task.description.trim()) {
      setError("Both fields are required");
      handleToast("Both fields are required!", "error");
      return false;
    }
    if (!task.title.trim()) {
      setError("Title is required");
      handleToast("Title is required!", "error");
      return false;
    }
    if (!task.description.trim()) {
      setError("Description is required");
      handleToast("Description is required!", "error");
      return false;
    }
    setError(null);
    return true;
  };

  const handleToast = (message: string, type: "success" | "error") => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast({ message: "", type }), 3000);
  };

  const handleAddTask = async () => {
    if (!validateTask(newTask)) return;
    try {
      const createdTask = await createTask(newTask);
      setTasks([createdTask, ...tasks]);
      setNewTask({ title: "", description: "", status: "To Do" });
      setShowAddTaskForm(false);
      handleToast("Created Task!", "success");
    } catch (error) {
      handleToast(`Error adding task: ${error}`, "error");
    }
  };

  const handleStatusUpdate = async (id: number, status: Task["status"]) => {
    try {
      await updateTaskStatus(id, status);
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, status } : task
      );
      setTasks(updatedTasks.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      if (status === "Complete") handleToast("Completed Task!", "success");
    } catch (error) {
      handleToast(`Error updating status: ${error}`, "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) setDeletedTask(task);
      await deleteTaskAPI(id);
      setTasks(tasks.filter(task => task.id !== id));
      setShowDeleteModal(false);
      handleToast("Deleted Task!", "success");
    } catch (error) {
      handleToast(`Error deleting task: ${error}`, "error");
    }
  };

  const handleEdit = async () => {
    if (!editingTask || !validateTask(editingTask)) return;
    try {
      await updateTaskDetails(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description
      });
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? editingTask : task
      ));
      setShowEditModal(false);
      handleToast("Updated Task!", "success");
    } catch (error) {
      handleToast(`Error updating task: ${error}`, "error");
    }
  };

  const handleUndoDelete = async () => {
    if (!deletedTask) return;
    try {
      const restoredTask = await createTask(deletedTask);
      setTasks([restoredTask, ...tasks]);
      setDeletedTask(null);
      handleToast("Task Restored!", "success");
    } catch (error) {
      handleToast(`Error restoring task: ${error}`, "error");
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toDoTasks = filteredTasks.filter(task =>
    task.status === "To Do" && (selectedStatus === null || selectedStatus === "To Do")
  );
  const ongoingTasks = filteredTasks.filter(task =>
    task.status === "Ongoing" && (selectedStatus === null || selectedStatus === "Ongoing")
  );
  const completedTasks = filteredTasks.filter(task =>
    task.status === "Complete" && (selectedStatus === null || selectedStatus === "Complete")
  );

  const handleSidebarToggle = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const hasActiveTasks = toDoTasks.length > 0 || ongoingTasks.length > 0;

  return (
    <div className="flex">
      <TaskSidebar
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        isSidebarOpen={isSidebarOpen}
        onClose={handleSidebarToggle}
      />
      <div className={`flex-1 min-w-0 ${isSidebarOpen ? 'md' : 'ml-0'}`}>
        <div className="mx-auto p-4 md:p-16 pt-16">
          <div className="flex justify-between items-center mb-6">
            {!isSidebarOpen && (
              <MenuButton className="sticky" onClick={handleSidebarToggle} />
            )}

            <h2 className="text-2xl font-semibold flex-1 text-center md:text-left">Active Tasks</h2>

            <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setShowAddTaskForm(true)}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Create Task
              </button>
            </div>
          </div>

          <div className="md:hidden flex flex-col gap-4 mb-6">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setShowAddTaskForm(true)}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Create Task
            </button>
          </div>

          {hasActiveTasks ? (
            <>
              {(selectedStatus === null || selectedStatus === "To Do") && (
                <div>
                  <h3 className="text-xl font-semibold mb-4"><ClipboardCheck className="inline-block mr-2" />To Do</h3>
                  {toDoTasks.length === 0 ? (
                    <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white">
                      <p className="text-gray-500">No tasks to do</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      <TaskList
                        tasks={toDoTasks}
                        onUpdateStatus={handleStatusUpdate}
                        onDelete={(id) => {
                          setTaskToDelete(id);
                          setShowDeleteModal(true);
                        }}
                        onEdit={(task) => {
                          setEditingTask(task);
                          setShowEditModal(true);
                        }}
                        onToggleButtons={(id) => setShowButtons(prev => ({
                          ...prev,
                          [id]: !prev[id]
                        }))}
                        showButtons={showButtons}
                        status="To Do"
                      />
                    </ul>
                  )}
                </div>
              )}

              {(selectedStatus === null || selectedStatus === "Ongoing") && (
                <div className="pt-3">
                  <h3 className="text-xl font-semibold mb-4"><Clock className="inline-block mr-2" />Ongoing</h3>
                  {ongoingTasks.length === 0 ? (
                    <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white">
                      <p className="text-gray-500">No ongoing tasks</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      <TaskList
                        tasks={ongoingTasks}
                        onUpdateStatus={handleStatusUpdate}
                        onDelete={(id) => {
                          setTaskToDelete(id);
                          setShowDeleteModal(true);
                        }}
                        onEdit={(task) => {
                          setEditingTask(task);
                          setShowEditModal(true);
                        }}
                        onToggleButtons={(id) => setShowButtons(prev => ({
                          ...prev,
                          [id]: !prev[id]
                        }))}
                        showButtons={showButtons}
                        status="Ongoing"
                      />
                    </ul>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white">
              <p className="text-gray-500">No active task available</p>
            </div>
          )}

          {(selectedStatus === null || selectedStatus === "Complete") && (
            <div className="pt-3">
              <h2 className="text-xl font-semibold mb-4"> <CheckCircle className="inline-block mr-2" />Completed Tasks</h2>
              {completedTasks.length === 0 ? (
                <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white">
                  <p className="text-gray-500">No completed tasks</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  <TaskList
                    tasks={completedTasks}
                    onUpdateStatus={handleStatusUpdate}
                    onDelete={(id) => {
                      setTaskToDelete(id);
                      setShowDeleteModal(true);
                    }}
                    onEdit={(task) => {
                      setEditingTask(task);
                      setShowEditModal(false);
                    }}
                    onToggleButtons={(id) => setShowButtons(prev => ({
                      ...prev,
                      [id]: !prev[id]
                    }))}
                    showButtons={showButtons}
                    status="Complete"
                  />
                </ul>
              )}
            </div>
          )}

          {showAddTaskForm && (
            <AddTaskModal
              newTask={newTask}
              setNewTask={setNewTask}
              error={error}
              onClose={() => setShowAddTaskForm(false)}
              onSave={handleAddTask}
            />
          )}

          {showEditModal && (
            <EditTaskModal
              editingTask={editingTask}
              setEditingTask={setEditingTask}
              error={error}
              onClose={() => setShowEditModal(false)}
              onSave={handleEdit}
            />
          )}

          {showDeleteModal && (
            <DeleteTaskModal
              onConfirm={() => taskToDelete && handleDelete(taskToDelete)}
              onCancel={() => setShowDeleteModal(false)}
            />
          )}

          {showToast.message && (
            <Toast
              message={showToast.message}
              type={showToast.type}
              onUndo={showToast.message === "Deleted Task!" ? handleUndoDelete : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
