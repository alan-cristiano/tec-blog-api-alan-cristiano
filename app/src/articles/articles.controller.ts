import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';

@Controller('/api/articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  @ApiOperation({ summary: 'Get all published articles' })
  async findAll(@Query() query: any) {
    const { search } = query;
    const articles = await this.articlesService.findAll(search);
    return articles.map((article) => new ArticleEntity(article));
  }

  @Get(':articleId')
  @ApiOkResponse({ type: ArticleEntity })
  @ApiOperation({ summary: 'Get one published article by id' })
  async findOne(@Param('articleId') articleId: string) {
    return new ArticleEntity(await this.articlesService.findById(articleId));
  }
}
