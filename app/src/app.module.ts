import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ArticleExistsCreateFind } from './articles/middlewares/article-exists-create-find.middleware';
import { UserExists } from './users/middlewares/user-exists.middleware';
import { ArticlesController } from './articles/articles.controller';
import { UsersController } from './users/users.controller';
import { ArticleTitleAlreadyApplied } from './articles/middlewares/article-title-already-applied.middleware';
import { ArticleExistsUpdateDelete } from './articles/middlewares/article-exists-update-delete.middleware';
import { UserEmailAlreadyApplied } from './users/middlewares/user-email-already-applied.middleware copy';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        PORT: Joi.string().default('3000'),
      }),
    }),
    PrismaModule,
    ArticlesModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserExists)
      .forRoutes(ArticlesController, UsersController)
      .apply(ArticleExistsCreateFind)
      .exclude(
        {
          path: '/api/users/:userId/articles/:articleId',
          method: RequestMethod.PATCH,
        },
        {
          path: '/api/users/:userId/articles/:articleId',
          method: RequestMethod.DELETE,
        },
      )
      .forRoutes(ArticlesController, UsersController)
      .apply(ArticleExistsUpdateDelete)
      .forRoutes(
        {
          path: '/api/users/:userId/articles/:articleId',
          method: RequestMethod.PATCH,
        },
        {
          path: '/api/users/:userId/articles/:articleId',
          method: RequestMethod.DELETE,
        },
      )
      .apply(ArticleTitleAlreadyApplied)
      .forRoutes(
        { path: '/api/users/:userId/articles', method: RequestMethod.POST },
        {
          path: '/api/users/:userId/articles/:articleId',
          method: RequestMethod.PATCH,
        },
      )
      .apply(UserEmailAlreadyApplied)
      .forRoutes(
        { path: '/api/users', method: RequestMethod.POST },
        { path: '/api/users/:userId', method: RequestMethod.PATCH },
      );
  }
}
