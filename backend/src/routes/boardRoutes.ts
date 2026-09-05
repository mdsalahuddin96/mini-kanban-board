import { Router } from 'express';
import { createBoard, getUserBoards, getBoardById, shareBoard } from '../controllers/boardController';
import { createColumn, deleteColumn, getColumn } from '../controllers/columnController';
import { createTask, moveTask, updateTask, deleteTask } from '../controllers/taskController';
import { authenticate, authorizeBoardAccess } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

// Board Routes
router.post('/', createBoard);
router.get('/', getUserBoards);
router.get('/:boardId', authorizeBoardAccess, getBoardById);
router.post('/:boardId/share', authorizeBoardAccess, shareBoard);

// Column Routes
router.post('/:boardId/columns', authorizeBoardAccess, createColumn);
router.delete('/:boardId/columns/:columnId', authorizeBoardAccess, deleteColumn);
router.get("/:boardId/columns",authorizeBoardAccess,getColumn);
// Task Routes
router.post('/:boardId/tasks', authorizeBoardAccess, createTask);
router.patch('/:boardId/tasks/:taskId/move', authorizeBoardAccess, moveTask);
router.put('/:boardId/tasks/:taskId', authorizeBoardAccess, updateTask);
router.delete('/:boardId/tasks/:taskId', authorizeBoardAccess, deleteTask);

export default router;