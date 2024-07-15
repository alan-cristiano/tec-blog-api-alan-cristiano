import { ConflictException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserEmailAlreadyApplied implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const userData = req.body;

    if (userData.email) {
      const foundUserWithSameEmail = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (foundUserWithSameEmail) {
        throw new ConflictException('E-mail already exists', {
          cause: new Error(),
        });
      }
    }

    return next();
  }
}
