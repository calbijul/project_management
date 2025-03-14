import React from "react";
import TaskSidebar from "./components/TaskSidebar";
import TaskList from "./components/TaskList";
import {
  AddTaskModal,
  EditTaskModal,
  DeleteTaskModal,
} from "./components/Modals";
import Toast from "./components/Toast";
import MenuButton from "./assets/components/menuButton";
import { useTaskManager } from "./hooks/task";
import type { Task } from "./types";

const TaskManager: React.FC = () => {
  const {
    newTask,
    setNewTask,
    showAddTaskForm,
    setShowAddTaskForm,
    error,
    showDeleteModal,
    setShowDeleteModal,
    taskToDelete,
    editingTask,
    setEditingTask,
    showEditModal,
    setShowEditModal,
    searchQuery,
    setSearchQuery,
    showToast,
    selectedStatus,
    setSelectedStatus,
    isSidebarOpen,
    isScrolled,
    filteredTasks,
    statusColors,
    commonListProps,
    handleAddTask,
    handleDelete,
    handleEdit,
    handleUndoDelete,
    handleSidebarToggle,
  } = useTaskManager();

  const renderTaskList = (tasks: Task[]) =>
    tasks.length > 0 ? (
      <TaskList
        tasks={tasks}
        {...commonListProps}
        status={selectedStatus || "To Do"}
      />
    ) : (
      <EmptyState message={`No ${selectedStatus?.toLowerCase() || ""} tasks`} />
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TaskSidebar
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        isSidebarOpen={isSidebarOpen}
        onClose={handleSidebarToggle}
        className={isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "md:pl-64" : "pl-0"
        }`}
      >
        <div className="mx-auto p-4 md:p-8 max-w-7xl w-full">
          <header className="mb-8 space-y-4">
            <div className="flex items-center justify-between md:justify-center gap-10">
              {!isSidebarOpen && (
                <div className="md:hidden">
                  <MenuButton
                    onClick={handleSidebarToggle}
                    className={`transition-opacity duration-300 ${
                      isScrolled ? "opacity-50" : "opacity-100"
                    }`}
                  />
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900 hidden md:block">
                Task Dashboard
              </h1>

              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent"
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
                  <div
                    className={`w-2 h-8 rounded-full ${statusColors[selectedStatus]}`}
                  />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedStatus} Tasks
                  </h3>
                </div>
                {renderTaskList(filteredTasks)}
              </section>
            ) : (
              <>
                <section>
                  <div className="flex items-center gap-3 mb-4 p-2 bg-white rounded-lg">
                    <div className="w-2 h-8 rounded-full bg-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      To Do
                    </h3>
                  </div>
                  {filteredTasks.filter((t) => t.status === "To Do").length >
                  0 ? (
                    <TaskList
                      tasks={filteredTasks.filter((t) => t.status === "To Do")}
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
                    <h3 className="text-lg font-semibold text-gray-900">
                      Ongoing
                    </h3>
                  </div>
                  {filteredTasks.filter((t) => t.status === "Ongoing").length >
                  0 ? (
                    <TaskList
                      tasks={filteredTasks.filter(
                        (t) => t.status === "Ongoing"
                      )}
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
                    <h3 className="text-lg font-semibold text-gray-900">
                      Completed
                    </h3>
                  </div>
                  {filteredTasks.filter((t) => t.status === "Complete").length >
                  0 ? (
                    <TaskList
                      tasks={filteredTasks.filter(
                        (t) => t.status === "Complete"
                      )}
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
              onUndo={
                showToast.message === "Deleted Task!"
                  ? handleUndoDelete
                  : undefined
              }
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
