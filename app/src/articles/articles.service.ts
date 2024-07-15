import { Injectable } from '@nestjs/common';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  create(payload: CreateArticleDto & { authorId: string }) {
    return this.prisma.article.create({ data: payload });
  }

  findAll(search: any) {
    if (search) {
      return this.prisma.article.findMany({
        where: {
          title: { contains: search, mode: 'insensitive' },
          published: true,
        },
        include: { author: true },
      });
    }
    return this.prisma.article.findMany({
      where: { published: true },
      include: { author: true },
    });
  }

  findDrafts(authorId: string) {
    return this.prisma.article.findMany({
      where: { authorId: authorId, published: false },
    });
  }

  findById(id: string) {
    return this.prisma.article.findUnique({
      where: { id: id, published: true },
      include: { author: true },
    });
  }

  findByAuthorId(authorId: string) {
    return this.prisma.article.findMany({
      where: { authorId: authorId, published: true },
      include: { author: true },
    });
  }

  update(id: string, payload: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: payload,
    });
  }

  remove(id: string) {
    return this.prisma.article.delete({ where: { id } });
  }
}
