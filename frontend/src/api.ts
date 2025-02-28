import axios from "axios";
import { Task } from "./types";

const API_BASE = "http://localhost:5000/api/tasks";

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(API_BASE);
    return response.data;
  } catch (error) {

    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch tasks: ${(error.response?.data?.message || error.message)}`
      );
    } else {
      throw new Error(`An unknown error occurred: ${error}`);
    }
  }
};
export const createTask = async (task: Omit<Task, "id" | "createdAt">): Promise<Task> => {
  const response = await axios.post(API_BASE, task);
  return response.data;
};

export const updateTaskStatus = async (id: number, status: Task["status"]): Promise<void> => {
  await axios.put(`${API_BASE}/${id}/status`, { status });
};

export const deleteTaskAPI = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};

export const updateTaskDetails = async (
  id: number,
  task: { title: string; description: string }
): Promise<void> => {
  await axios.put(`${API_BASE}/${id}/edit`, task);
};