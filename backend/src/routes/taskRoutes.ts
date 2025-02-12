import { Router, Request, Response } from 'express';
import mysql, { OkPacket, RowDataPacket } from 'mysql2';

// db connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "passconfig0110",
  database: 'task_manager',
});

const router = Router();


// Get tasks
router.get('/tasks', (req: Request, res: Response) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tasks' });
    }
    const tasks = results as RowDataPacket[];
    res.json(tasks);
  });
});

// Create task
router.post('/tasks', (req: Request, res: Response) => {
  const { title, description, status } = req.body;
  const query = 'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)';
  db.query(query, [title, description, status], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding task' });
    }
    const insertResult = results as OkPacket;
    res.status(201).json({ id: insertResult.insertId, title, description, status });
  });
});

// Update task
router.put('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`Received request to update task with ID: ${id} and status: ${status}`);

  const query = 'UPDATE tasks SET status = ? WHERE id = ?';

  db.query(query, [status, id], (err) => {
    if (err) {
      console.error('Error updating task:', err); 
      return res.status(500).json({ message: 'Error updating task', error: err });
    }
    res.json({ message: 'Task updated successfully' });
  });
});

// Delete task
router.delete('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting task' });
    }
    res.json({ message: 'Task deleted' });
  });
});

export default router;
