import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OwnerArticleGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const articleIdFromParams = request.params.articleId;

    const article = await this.prisma.article.findUnique({
      where: { id: articleIdFromParams },
    });

    if (user.id !== article.authorId) {
      throw new UnauthorizedException(
        'You are not allowed to perform this action',
        {
          cause: new Error(),
        },
      );
    }

    return true;
  }
}
