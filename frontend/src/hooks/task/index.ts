import { useTaskState } from "./useTaskState";
import { useTaskActions } from "./useTaskActions";
import { useTaskUI } from "./useTaskUI";

export const useTaskManager = () => {
  const state = useTaskState();
  const actions = useTaskActions(state);
  const ui = useTaskUI(state, actions);

  return {
    ...state,
    ...actions,
    ...ui,
    handleSidebarToggle: () => state.setIsSidebarOpen(prev => !prev)
  };
};