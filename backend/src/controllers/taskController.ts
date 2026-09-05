import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../utils/prisma';

// Create Task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { columnId, title, description } = req.body;

    if (!columnId || !title) {
      return res.status(400).json({ message: 'Column ID and title are required' });
    }

    const lastTask = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastTask ? lastTask.order + 1000 : 1000;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        columnId,
        order: newOrder,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error });
  }
};

// Task Movement API: Cross-column and Same-column Reordering
export const moveTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { targetColumnId, prevTaskId, nextTaskId } = req.body;

    if (!targetColumnId) {
      return res.status(400).json({ message: 'Target Column ID is required' });
    }

    let newOrder: number;

    if (!prevTaskId && !nextTaskId) {
      // Empty Column case
      newOrder = 1000;
    } else if (!prevTaskId && nextTaskId) {
      // Placed at the very top of the column
      const nextTask = await prisma.task.findUnique({ where: { id: nextTaskId } });
      newOrder = nextTask ? nextTask.order / 2 : 1000;
    } else if (prevTaskId && !nextTaskId) {
      // Placed at the very bottom of the column
      const prevTask = await prisma.task.findUnique({ where: { id: prevTaskId } });
      newOrder = prevTask ? prevTask.order + 1000 : 1000;
    } else {
      // Placed in-between two tasks
      const prevTask = await prisma.task.findUnique({ where: { id: prevTaskId } });
      const nextTask = await prisma.task.findUnique({ where: { id: nextTaskId } });

      if (prevTask && nextTask) {
        newOrder = (prevTask.order + nextTask.order) / 2;
      } else {
        newOrder = 1000;
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        columnId: targetColumnId,
        order: newOrder,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to move task', error });
  }
};

// Update Task Details
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title, description } = req.body;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { title, description },
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
};

// Delete Task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error });
  }
};