import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticleExistsCreateFind implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const articleId = req.params.articleId;

    if (articleId) {
      const article = await this.prisma.article.findUnique({
        where: { id: articleId, published: true },
      });

      if (!article) {
        throw new NotFoundException('Article not found', {
          cause: new Error(),
        });
      }
    }

    return next();
  }
}
