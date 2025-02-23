import axios from "axios";
import { Task } from "./types";

const API_BASE = "http://localhost:5000/tasks";

export const fetchTasks = async () => {
  const response = await axios.get(API_BASE);
  return response.data;
};

export const createTask = async (task: Omit<Task, "id" | "createdAt">) => {
  const response = await axios.post(API_BASE, task);
  return response.data;
};

export const updateTaskStatus = async (id: number, status: Task["status"]) => {
  await axios.put(`${API_BASE}/${id}/status`, { status });
};

export const deleteTaskAPI = async (id: number) => {
  await axios.delete(`${API_BASE}/${id}`);
};

export const updateTaskDetails = async (id: number, task: { title: string; description: string }) => {
  await axios.put(`${API_BASE}/${id}/edit`, task);
};