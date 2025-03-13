import type { Task } from "../../types";
import { useTaskActions } from "./useTaskActions";
import { useTaskState } from "./useTaskState";

export const useTaskUI = (
  state: ReturnType<typeof useTaskState>,
  actions: ReturnType<typeof useTaskActions>
) => {
  const { tasks, searchQuery, selectedStatus } = state;

  const statusColors = {
    "To Do": "bg-blue-500",
    Ongoing: "bg-yellow-500",
    Complete: "bg-green-500",
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus ? task.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  const commonListProps = {
    onUpdateStatus: actions.handleStatusUpdate,
    onDelete: (id: number) => {
      state.setTaskToDelete(id);
      state.setShowDeleteModal(true);
    },
    onEdit: (task: Task) => {
      if (task.status !== "Complete") {
        state.setEditingTask(task);
        state.setShowEditModal(true);
      }
    },
    onToggleButtons: (id: number) => 
      state.setShowButtons((prev) => ({ ...prev, [id]: !prev[id] })),
    showButtons: state.showButtons,
  };

  return {
    statusColors,
    filteredTasks,
    commonListProps
  };
};