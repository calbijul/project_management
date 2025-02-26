import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "../types";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children, onClose }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 bg-black/30 flex items-center justify-center p-4"
      onClick={onClose}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export const AddTaskModal: React.FC<{
  newTask: Omit<Task, "id" | "createdAt">;
  setNewTask: (task: Omit<Task, "id" | "createdAt">) => void;
  error: string | null;
  onClose: () => void;
  onSave: () => void;
}> = ({ newTask, setNewTask, error, onClose, onSave }) => (
  <ModalWrapper onClose={onClose}>
    <div className="p-6 ">
      <h3 className="text-xl font-semibold mb-4">Add Task</h3>
      <input
        type="text"
        placeholder="Title"
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 ${
          !newTask.title && error ? "border-red-500" : "border-gray-300"
        }`}
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 ${
          !newTask.description && error ? "border-red-500" : "border-gray-300"
        }`}
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      />
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Save
        </button>
      </div>
    </div>
  </ModalWrapper>
);

export const EditTaskModal: React.FC<{
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  error: string | null;
  onClose: () => void;
  onSave: () => void;
}> = ({ editingTask, setEditingTask, error, onClose, onSave }) => (
  <ModalWrapper onClose={onClose}>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Edit Task</h3>
      <input
        type="text"
        placeholder="Title"
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 ${
          !editingTask?.title && error ? "border-red-500" : "border-gray-300"
        }`}
        value={editingTask?.title || ""}
        onChange={(e) => editingTask && setEditingTask({ ...editingTask, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 ${
          !editingTask?.description && error ? "border-red-500" : "border-gray-300"
        }`}
        value={editingTask?.description || ""}
        onChange={(e) => editingTask && setEditingTask({ ...editingTask, description: e.target.value })}
      />
      {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>} */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  </ModalWrapper>
);

export const DeleteTaskModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <ModalWrapper onClose={onCancel}>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Delete this task?</h3>
      <div className="flex justify-between space-x-4">
        <button
          onClick={onConfirm}
          className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex-1"
        >
          Yes, Delete
        </button>
        <button
          onClick={onCancel}
          className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex-1"
        >
          Cancel
        </button>
      </div>
    </div>
  </ModalWrapper>
);