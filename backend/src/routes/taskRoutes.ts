import { Router } from 'express';
import taskController from '../controllers/taskController';

const router = Router();

router.get('/tasks', taskController.getAllTasks);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id/status', taskController.updateStatus);
router.put('/tasks/:id/edit', taskController.updateDetails);
router.delete('/tasks/:id', taskController.deleteTask);

export default router;