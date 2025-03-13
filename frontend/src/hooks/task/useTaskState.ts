import { useState, useEffect } from "react";
import { Task, ToastType } from "../../types";
import { fetchTasks } from "../../api";

export const useTaskState = () => {
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        setShowToast({ message: `Error fetching tasks: ${error}`, type: "error" });
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    tasks,
    setTasks,
    newTask,
    setNewTask,
    showButtons,
    setShowButtons,
    showAddTaskForm,
    setShowAddTaskForm,
    error,
    setError,
    showDeleteModal,
    setShowDeleteModal,
    taskToDelete,
    setTaskToDelete,
    editingTask,
    setEditingTask,
    showEditModal,
    setShowEditModal,
    searchQuery,
    setSearchQuery,
    showToast,
    setShowToast,
    deletedTask,
    setDeletedTask,
    selectedStatus,
    setSelectedStatus,
    isSidebarOpen,
    setIsSidebarOpen,
    isScrolled
  };
};