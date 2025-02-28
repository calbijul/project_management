import checkValidationErrors from '../middleware/checkValidationErrors';
import { body, param } from 'express-validator';
import taskController from '../controllers/taskController';
import { Router } from 'express';

const router = Router();


router.get('/tasks', taskController.getAllTasks);
router.post(
  '/tasks',
  [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('status').optional().isIn(['To Do', 'Ongoing', 'Complete'])
  ],
  checkValidationErrors,
  taskController.createTask
);

router.post(
  '/tasks',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('status').optional().isIn(['To Do', 'Ongoing', 'Complete']).withMessage('Invalid status')
  ],
  checkValidationErrors,
  taskController.createTask
);

router.put(
  '/tasks/:id/status',
  [
    param('id').isNumeric().withMessage('Task ID must be a number'),
    body('status').isIn(['To Do', 'Ongoing', 'Complete']).withMessage('Invalid status')
  ],
  checkValidationErrors,
  taskController.updateStatus
);

router.put(
  '/tasks/:id/edit',
  [
    param('id').isNumeric().withMessage('Task ID must be a number'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body().custom((value, { req }) => {
      if (!req.body.title && !req.body.description) {
        throw new Error('At least one of title or description must be provided');
      }
      return true;
    })
  ],
  checkValidationErrors,
  taskController.updateDetails
);

router.delete(
  '/tasks/:id',
  [param('id').isNumeric().withMessage('Task ID must be a number')],
  checkValidationErrors,
  taskController.deleteTask
);

export default router;