import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../utils/prisma';

// Create a new Board
export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const userId = req.user?.id;

    if (!title || !userId) {
      return res.status(400).json({ message: 'Board title is required' });
    }

    const board = await prisma.board.create({
      data: {
        title,
        ownerId: userId,
        // Auto create default workflow columns
        columns: {
          create: [
            { title: 'To Do', order: 1000 },
            { title: 'In Progress', order: 2000 },
            { title: 'Done', order: 3000 },
          ],
        },
      },
      include: { columns: true },
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create board', error });
  }
};

// Get all boards accessible by the current user
export const getUserBoards = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const boards = await prisma.board.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch boards', error });
  }
};

// Share board with another user using email
export const shareBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { boardId } = req.params;
    const { email } = req.body;
    const userId = req.user?.id;

    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board || board.ownerId !== userId) {
      return res.status(403).json({ message: 'Only board owners can share this board' });
    }

    const targetUser = await prisma.user.findUnique({ where: { email } });
    if (!targetUser) {
      return res.status(404).json({ message: 'User with provided email not found' });
    }

    if (targetUser.id === userId) {
      return res.status(400).json({ message: 'You are already the owner of this board' });
    }

    const member = await prisma.boardMember.upsert({
      where: {
        boardId_userId: { boardId, userId: targetUser.id },
      },
      update: {},
      create: {
        boardId,
        userId: targetUser.id,
        role: 'MEMBER',
      },
    });

    res.json({ message: 'Board shared successfully', member });
  } catch (error) {
    res.status(500).json({ message: 'Failed to share board', error });
  }
};

// Add to src/controllers/boardController.ts

export const getBoardById = async (req: AuthRequest, res: Response) => {
  try {
    const { boardId } = req.params;

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        columns: {
          orderBy: { order: 'asc' },
          include: {
            tasks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch board details', error });
  }
};