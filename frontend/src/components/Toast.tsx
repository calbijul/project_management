import React from "react";
// import { ToastType } from "../types";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onUndo?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onUndo }) => (
  <div
    className={`toast delay-300 flex items-center ${
      type === "success" ? "toast-success" : "toast-error"
    }`}
  >
    <p className="px-2">{message}</p>
    {onUndo && (
      <button
        onClick={onUndo}
        className="py-0.5 px-5 bg-red-200 text-red-600 rounded-lg hover:bg-red-100 border border-red-600 transition"
      >
        Undo
      </button>
    )}
  </div>
);

export default Toast;