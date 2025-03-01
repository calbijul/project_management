  import React from "react";
  import { FaCheck, FaTrash, FaEdit, FaClock} from "react-icons/fa";
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
        <li
          key={task.id}
          className={clsx(
            "border p-4 rounded-lg cursor-pointer mb-4",
            {
              "border-blue-500 bg-white": task.status === "To Do",
              "border-yellow-500": task.status === "Ongoing",
              "border-green-500": task.status === "Complete",
            }
          )}
          onDoubleClick={() => onEdit(task)}
        >
          <h2 className="text-xl font-semibold break-words">{task.title}</h2>
          <p className="text-gray-700 break-words mt-2">{task.description}</p>
          <p className={clsx("mt-2 text-sm", {
            "text-green-500": task.status === "Complete",
            "text-yellow-500": task.status === "Ongoing",
            "text-gray-500": task.status === "To Do",
          })}>
            Status: {task.status}
          </p>
          
          {status === "Complete" ? (
            <div className="flex justify-between items-center mt-4">
              <FaEdit
                className="text-blue-500 cursor-pointer"
                onClick={() => onToggleButtons(task.id)}
              />
              {showButtons[task.id] && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => onUpdateStatus(task.id, "Ongoing")}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    <FaClock />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => onUpdateStatus(task.id, status === "To Do" ? "Ongoing" : "Complete")}
                className={clsx("px-4 py-2 text-white rounded-lg transition", {
                  "bg-yellow-500 hover:bg-yellow-600": status === "To Do",
                  "bg-green-500 hover:bg-green-600": status === "Ongoing",
                })}
              >
                {status === "To Do" ? <FaClock /> : <FaCheck />}
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </li>
      ))}
    </>
  );

  export default TaskList;