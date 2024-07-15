import { ConflictException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticleTitleAlreadyApplied implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const articleData = req.body;

    if (articleData.title) {
      const foundArticleWithSameTitle = await this.prisma.article.findUnique({
        where: { title: articleData.title },
      });

      if (foundArticleWithSameTitle) {
        throw new ConflictException('Article title already exists', {
          cause: new Error(),
        });
      }
    }

    return next();
  }
}
