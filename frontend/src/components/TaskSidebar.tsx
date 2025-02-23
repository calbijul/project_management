import React from "react";
import clsx from "clsx";

interface TaskSidebarProps {
  selectedStatus: "To Do" | "Ongoing" | "Complete" | null;
  setSelectedStatus: (status: "To Do" | "Ongoing" | "Complete" | null) => void;
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({ selectedStatus, setSelectedStatus }) => (
  <div className="side-panel w-64 min-h-screen p-4 bg-gray-50 border-r border-gray-200">
    <div className="space-y-2">
      <p className="font-bold flex justify-center pt-5 pb-5">NAANA</p>
      <button
        onClick={() => setSelectedStatus(selectedStatus === 'To Do' ? null : 'To Do')}
        className={clsx(
          "w-full px-4 py-2 text-left rounded-lg transition-colors",
          {
            "bg-blue-500 text-white hover:bg-blue-600": selectedStatus === 'To Do',
            "hover:bg-gray-200": selectedStatus !== 'To Do',
          }
        )}
      >
        To Do
      </button>
      <button
        onClick={() => setSelectedStatus(selectedStatus === 'Ongoing' ? null : 'Ongoing')}
        className={clsx(
          "w-full px-4 py-2 text-left rounded-lg transition-colors",
          {
            "bg-yellow-500 text-white hover:bg-yellow-600": selectedStatus === 'Ongoing',
            "hover:bg-gray-200": selectedStatus !== 'Ongoing',
          }
        )}
      >
        Ongoing
      </button>
      <button
        onClick={() => setSelectedStatus(selectedStatus === 'Complete' ? null : 'Complete')}
        className={clsx(
          "w-full px-4 py-2 text-left rounded-lg transition-colors",
          {
            "bg-green-500 text-white hover:bg-green-600": selectedStatus === 'Complete',
            "hover:bg-gray-200": selectedStatus !== 'Complete',
          }
        )}
      >
        Complete
      </button>
    </div>
  </div>
);

export default TaskSidebar;