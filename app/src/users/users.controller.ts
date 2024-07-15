import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnerUserGuard } from '../auth/owner-user.guard';
import { ArticleEntity } from 'src/articles/entities/article.entity';
import { UpdateArticleDto } from 'src/articles/dto/update-article.dto';
import { ArticlesService } from 'src/articles/articles.service';
import { OwnerArticleGuard } from 'src/auth/owner-article.guard';
import { CreateArticleDto } from 'src/articles/dto/create-article.dto';

@Controller('/api/users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly articlesService: ArticlesService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: 'Register a new user' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard, OwnerUserGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({ summary: 'Retrieve user data' })
  async findOneUser(@Param('userId') userId: string) {
    return new UserEntity(await this.usersService.findOne(userId));
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard, OwnerUserGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: 'Update user data' })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(
      await this.usersService.update(userId, updateUserDto),
    );
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, OwnerUserGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({ summary: 'Remove user data' })
  async removeUser(@Param('userId') userId: string) {
    return new UserEntity(await this.usersService.remove(userId));
  }

  @Post(':userId/articles')
  @UseGuards(JwtAuthGuard, OwnerUserGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ArticleEntity })
  @ApiOperation({ summary: 'Create new article' })
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Param('userId') userId: string,
  ) {
    return new ArticleEntity(
      await this.articlesService.create({
        ...createArticleDto,
        authorId: userId,
      }),
    );
  }

  @Get(':userId/articles/drafts')
  @UseGuards(JwtAuthGuard, OwnerUserGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  @ApiOperation({
    summary: 'Retrieve all unpublished articles (drafts) by the user',
  })
  async findDrafts(@Param('userId') userId: string) {
    const drafts = await this.articlesService.findDrafts(userId);
    return drafts.map((draft) => new ArticleEntity(draft));
  }

  @Get(':userId/articles/')
  @UseGuards(JwtAuthGuard, OwnerUserGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  @ApiOperation({ summary: 'Retrieve all published articles by the user' })
  async findByAuthorId(@Param('userId') userId: string) {
    const articles = await this.articlesService.findByAuthorId(userId);
    return articles.map((article) => new ArticleEntity(article));
  }

  @Patch(':userId/articles/:articleId')
  @UseGuards(JwtAuthGuard, OwnerUserGuard, OwnerArticleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ArticleEntity })
  @ApiOperation({ summary: 'Update an article' })
  async updateArticle(
    @Param('articleId') articleId: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return new ArticleEntity(
      await this.articlesService.update(articleId, updateArticleDto),
    );
  }

  @Delete(':userId/articles/:articleId')
  @UseGuards(JwtAuthGuard, OwnerUserGuard, OwnerArticleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ArticleEntity })
  @ApiOperation({ summary: 'Remove an article' })
  async removeArticle(@Param('articleId') articleId: string) {
    return new ArticleEntity(await this.articlesService.remove(articleId));
  }
}
