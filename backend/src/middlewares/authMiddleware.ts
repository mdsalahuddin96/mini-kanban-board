import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

// Access Control Logic: Ensures user has permission for a specific board
export const authorizeBoardAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const boardId = req.params.boardId || req.body.boardId;

    if (!boardId) {
      return res.status(400).json({ message: 'Board ID is required' });
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { members: true },
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const isOwner = board.ownerId === userId;
    const isMember = board.members.some((member) => member.userId === userId);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this board' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error during authorization check' });
  }
};