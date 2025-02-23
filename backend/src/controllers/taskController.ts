import { Request, Response } from "express";
import TaskModel from "../models/taskModel";

const taskController = {
  getAllTasks: async (req: Request, res: Response) => {
    try {
      const tasks = await TaskModel.getAll();
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching tasks" });
    }
  },

  createTask: async (req: Request, res: Response) => {
    try {
      const { title, description, status } = req.body;
      const newTask = await TaskModel.create(
        title,
        description,
        status || "To Do"
      );
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating task" });
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await TaskModel.updateStatus(Number(id), status);
      res.json({ message: "Status updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating status" });
    }
  },

  updateDetails: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      await TaskModel.updateDetails(Number(id), title, description);
      res.json({ message: "Task updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating task" });
    }
  },

  deleteTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await TaskModel.delete(Number(id));
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting task" });
    }
  },
};

export default taskController;
