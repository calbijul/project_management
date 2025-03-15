import { createTask, updateTaskStatus, deleteTaskAPI, updateTaskDetails } from "../../api";
import type { Task } from "../../types";
import { useTaskState } from "./useTaskState";

export const useTaskActions = (state: ReturnType<typeof useTaskState>) => {
  const { 
    tasks,
    setTasks,
    newTask,
    setNewTask,
    setError,
    setShowToast,
    setDeletedTask,
    setShowDeleteModal,
    setShowEditModal,
    ...restState
  } = state;

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
      restState.setShowAddTaskForm(false);
      handleToast("Created Task!", "success");
    } catch (error) {
      handleToast(`Error adding task: ${error}`, "error");
    }
  };

  const handleStatusUpdate = async (id: number, status: Task["status"]) => {
    try {
      await updateTaskStatus(id, status);
      const updatedTasks = tasks.map((task) => 
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
    if (!state.editingTask || !validateTask(state.editingTask)) return;
    try {
      await updateTaskDetails(state.editingTask.id, {
        title: state.editingTask.title,
        description: state.editingTask.description,
      });
      setTasks(tasks.map((task) => 
        task.id === state.editingTask?.id ? state.editingTask : task
      ));
      setShowEditModal(false);
      handleToast("Updated Task!", "success");
    } catch (error) {
      handleToast(`Error updating task: ${error}`, "error");
    }
  };

  const handleUndoDelete = async () => {
    if (!state.deletedTask) return;
    try {
      const restoredTask = await createTask(state.deletedTask);
      setTasks([restoredTask, ...tasks]);
      setDeletedTask(null);
      handleToast("Task Restored!", "success");
    } catch (error) {
      handleToast(`Error restoring task: ${error}`, "error");
    }
  };

  return {
    handleAddTask,
    handleStatusUpdate,
    handleDelete,
    handleEdit,
    handleUndoDelete,
    validateTask
  };
};