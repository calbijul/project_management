import React from "react";
import { FaCheck, FaTrash, FaEdit, FaClock } from "react-icons/fa";
import clsx from "clsx";
import { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
  onUpdateStatus: (id: number, status: Task["status"]) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onToggleButtons: (id: number) => void;
  showButtons: { [key: number]: boolean };
  status: Task["status"];
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateStatus,
  onDelete,
  onEdit,
  onToggleButtons,
  showButtons,
  status
}) => (
  <>
    {tasks.map((task) => (
      <div
        key={task.id}
        className={clsx(
          "border-2 border-gray-200 p-4 rounded-lg cursor-pointer mb-4 bg-white",
        )}
        onDoubleClick={() => onEdit(task)}
      >
        <div className="flex items-start">
          <div className="group relative">
            <div
              className={clsx("w-3 h-3 rounded-full mt-1.5 mr-10", {
                "bg-blue-500": task.status === "To Do",
                "bg-yellow-500": task.status === "Ongoing",
                "bg-green-500": task.status === "Complete",
              })}
            />
            <span className={clsx(
              "absolute invisible group-hover:visible z-10 px-2 py-1 text-sm text-white rounded-md -top-8 left-1/2 transform -translate-x-1/2",
              {
                "bg-blue-500": task.status === "To Do",
                "bg-yellow-500": task.status === "Ongoing",
                "bg-green-500": task.status === "Complete",
              }
            )}>
              {task.status}
              <div className="absolute w-2 h-2 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" 
                   style={{ 
                     backgroundColor: {
                       "To Do": "#3b82f6",
                       "Ongoing": "#eab308",
                       "Complete": "#22c55e"
                     }[task.status]
                   }} 
              />
            </span>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold break-words">{task.title}</h2>
            <p className="text-gray-700 break-words mt-2">{task.description}</p>
          </div>
        </div>

        {status === "Complete" ? (
  <div className="flex justify-between items-center mt-4">
    <div className="flex items-center gap-2">
      <button
        onClick={() => onToggleButtons(task.id)}
        className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="More actions"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5"
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>
      
      {showButtons[task.id] && (
        <div className="flex gap-2">
          <button
            onClick={() => onUpdateStatus(task.id, "Ongoing")}
            className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            <FaClock className="flex-shrink-0" />
            <span className="text-sm">Mark Ongoing</span>
          </button>
        </div>
      )}
    </div>
    
    <div className="flex gap-2">
      {showButtons[task.id] && (
        <button
          onClick={() => onDelete(task.id)}
          className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
        >
          <FaTrash className="flex-shrink-0" />
          <span className="text-sm">Delete</span>
        </button>
      )}
    </div>
  </div>
) : (
  <div className="mt-4 flex justify-between items-center">
    <div className="flex gap-2">
      <button
        onClick={() => onUpdateStatus(task.id, status === "To Do" ? "Ongoing" : "Complete")}
        className={clsx(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
          {
            "bg-blue-100 text-blue-800 hover:bg-blue-200": status === "To Do",
            "bg-green-100 text-green-800 hover:bg-green-200": status === "Ongoing",
          }
        )}
      >
        {status === "To Do" ? (
          <>
            <FaClock className="flex-shrink-0" />
            <span className="text-sm">Start Task</span>
          </>
        ) : (
          <>
            <FaCheck className="flex-shrink-0" />
            <span className="text-sm">Complete Task</span>
          </>
        )}
      </button>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => onEdit(task)}
        className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Edit task"
      >
        <FaEdit className="h-5 w-5" />
      </button>
      <button
        onClick={() => onDelete(task.id)}
        className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Delete task"
      >
        <FaTrash className="h-5 w-5" />
      </button>
    </div>
  </div>
)}
      </div>
    ))}
  </>
);

export default TaskList;