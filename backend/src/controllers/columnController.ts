import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../utils/prisma';

// Create a new Column
export const createColumn = async (req: AuthRequest, res: Response) => {
  try {
    const { boardId, title } = req.body;

    if (!boardId || !title) {
      return res.status(400).json({ message: 'Board ID and title are required' });
    }

    // Get max order value
    const lastColumn = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastColumn ? lastColumn.order + 1000 : 1000;

    const column = await prisma.column.create({
      data: {
        title,
        boardId,
        order: newOrder,
      },
    });

    res.status(201).json(column);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create column', error });
  }
};
//Get column
export const getColumn = async (req: AuthRequest, res: Response) => {
  try {
    // const { boardId, title } = req.body;
    const {boardId}=req.params

    if (!boardId) {
      return res.status(400).json({ message: 'Board ID is required' });
    }

    // Get max order value
    const allColumn = await prisma.column.findMany({
      where: { boardId },
      orderBy: { order: 'desc' },
    });


    res.status(201).json(allColumn);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get column', error });
  }
};


// Delete Column
export const deleteColumn = async (req: AuthRequest, res: Response) => {
  try {
    const { columnId } = req.params;

    await prisma.column.delete({
      where: { id: columnId },
    });

    res.json({ message: 'Column deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete column', error });
  }
};