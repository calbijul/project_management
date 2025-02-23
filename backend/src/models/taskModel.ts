import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface Task extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "Ongoing" | "Complete";
  createdAt: Date;
}

const TaskModel = {
  async getAll(): Promise<Task[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    return rows as Task[];
  },

  async create(
    title: string,
    description: string,
    status: string
  ): Promise<Task> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO tasks (title, description, status, created_at) VALUES (?, ?, ?, NOW())",
      [title, description, status]
    );

    const [newTask] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM tasks WHERE id = ?",
      [result.insertId]
    );

    return newTask[0] as Task;
  },

  async updateStatus(id: number, status: string): Promise<void> {
    await pool.query<ResultSetHeader>(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [status, id]
    );
  },

  async updateDetails(
    id: number,
    title: string,
    description: string
  ): Promise<void> {
    await pool.query<ResultSetHeader>(
      "UPDATE tasks SET title = ?, description = ? WHERE id = ?",
      [title, description, id]
    );
  },

  async delete(id: number): Promise<void> {
    await pool.query<ResultSetHeader>("DELETE FROM tasks WHERE id = ?", [id]);
  },
};

export default TaskModel;
