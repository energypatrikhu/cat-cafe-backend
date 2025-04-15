import { NextFunction, Request, Response } from 'express';
import { PrismaService } from './prisma.service';

const prisma = new PrismaService();

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  console.log('Headers:', req.headers);
  let token = req.headers.Authorization;

  if (!token) {
    token = req.headers.authorization;
  }

  if (token) {
    token = token.toString().replace('Bearer ', '');

    const user = await findUserByToken(token);

    if (user) {
      delete user.password;
      req.user = { ...user, token };
    }
  }

  next();
}

async function findUserByToken(token: string) {
  const tokenRecord = await prisma.token.findUnique({
    where: { token },
    select: { User: true },
  });

  return tokenRecord?.User || null;
}
