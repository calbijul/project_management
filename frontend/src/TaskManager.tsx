import React, { useEffect, useState } from "react";
import { Task, ToastType } from "./types";
import {
  fetchTasks,
  createTask,
  updateTaskStatus,
  deleteTaskAPI,
  updateTaskDetails,
} from "./api";
import TaskSidebar from "./components/TaskSidebar";
import TaskList from "./components/TaskList";
import { AddTaskModal, EditTaskModal, DeleteTaskModal } from "./components/Modals";
import Toast from "./components/Toast";
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
        setTasks(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        handleToast(`Error fetching tasks: ${error}`, "error");
      }
    };
    loadTasks();
  }, []);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      setIsSidebarOpen(isDesktop);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, status } : task));
      setTasks(updatedTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      if (status === "Complete") handleToast("Completed Task!", "success");
    } catch (error) {
      handleToast(`Error updating status: ${error}`, "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (task) setDeletedTask(task);
      await deleteTaskAPI(id);
      setTasks(tasks.filter((task) => task.id !== id));
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
        description: editingTask.description,
      });
      setTasks(tasks.map((task) => (task.id === editingTask.id ? editingTask : task)));
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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus ? task.status === selectedStatus : true;

    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    "To Do": "bg-blue-500",
    Ongoing: "bg-yellow-500",
    Complete: "bg-green-500",
  };

  const commonListProps = {
    onUpdateStatus: handleStatusUpdate,
    onDelete: (id: number) => {
      setTaskToDelete(id);
      setShowDeleteModal(true);
    },
    onEdit: (task: Task) => {
      setEditingTask(task);
      setShowEditModal(true);
    },
    onToggleButtons: (id: number) => setShowButtons((prev) => ({ ...prev, [id]: !prev[id] })),
    showButtons,
  };

  const renderTaskList = (tasks: Task[]) => (
    tasks.length > 0 ? (
      <TaskList
        tasks={tasks}
        {...commonListProps}
        status={selectedStatus || "To Do"}
      />
    ) : (
      <EmptyState message={`No ${selectedStatus?.toLowerCase() || ""} tasks`} />
    )
  );

  const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TaskSidebar
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        isSidebarOpen={isSidebarOpen}
        onClose={handleSidebarToggle}
        className={isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
        <div className="mx-auto p-4 md:p-8 max-w-7xl w-full">
          <header className="mb-8 space-y-4">
            <div className="flex items-center justify-between md:justify-start gap-4">
              {!isSidebarOpen && (
                <div className="md:hidden">
                  <MenuButton onClick={handleSidebarToggle} className={""} />
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900 hidden md:block">Task Dashboard</h1>

              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <button
                onClick={() => setShowAddTaskForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden md:inline">New Task</span>
              </button>
            </div>
          </header>

          <div className="grid gap-6 md:gap-8">
            {selectedStatus ? (
              <section>
                <div className="flex items-center gap-3 mb-4 p-2 bg-white rounded-lg">
                  <div className={`w-2 h-8 rounded-full ${statusColors[selectedStatus || "To Do"]}`} />
                  <h3 className="text-lg font-semibold text-gray-900">{selectedStatus || "To Do"} Tasks</h3>
                </div>
                {renderTaskList(filteredTasks)}
              </section>
            ) : (
              <>
                <section>
                  <div className="flex items-center gap-3 mb-4 p-2 bg-white rounded-lg">
                    <div className="w-2 h-8 rounded-full bg-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900">To Do</h3>
                  </div>
                  {filteredTasks.filter(t => t.status === "To Do").length > 0 ? (
                    <TaskList
                      tasks={filteredTasks.filter(t => t.status === "To Do")}
                      {...commonListProps}
                      status="To Do"
                    />
                  ) : (
                    <EmptyState message="No tasks to do" />
                  )}
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4 p-2 bg-white rounded-lg">
                    <div className="w-2 h-8 rounded-full bg-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Ongoing</h3>
                  </div>
                  {filteredTasks.filter(t => t.status === "Ongoing").length > 0 ? (
                    <TaskList
                      tasks={filteredTasks.filter(t => t.status === "Ongoing")}
                      {...commonListProps}
                      status="Ongoing"
                    />
                  ) : (
                    <EmptyState message="No ongoing tasks" />
                  )}
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4 p-2 bg-white rounded-lg">
                    <div className="w-2 h-8 rounded-full bg-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
                  </div>
                  {filteredTasks.filter(t => t.status === "Complete").length > 0 ? (
                    <TaskList
                      tasks={filteredTasks.filter(t => t.status === "Complete")}
                      {...commonListProps}
                      status="Complete"
                    />
                  ) : (
                    <EmptyState message="No completed tasks" />
                  )}
                </section>
              </>
            )}
          </div>

          {showAddTaskForm && (
            <AddTaskModal
              newTask={newTask}
              setNewTask={setNewTask}
              error={error}
              onClose={() => setShowAddTaskForm(false)}
              onSave={handleAddTask}
            />
          )}

          {showEditModal && editingTask && (
            <EditTaskModal
              editingTask={editingTask}
              setEditingTask={setEditingTask}
              error={error}
              onClose={() => setShowEditModal(false)}
              onSave={handleEdit}
            />
          )}

          {showDeleteModal && taskToDelete && (
            <DeleteTaskModal
              onConfirm={() => handleDelete(taskToDelete)}
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
      </main>
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-6 bg-white rounded-xl border border-dashed border-gray-200 text-center">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <p className="mt-2 text-gray-500">{message}</p>
  </div>
);

export default TaskManager;