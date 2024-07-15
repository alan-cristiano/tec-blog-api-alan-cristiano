import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, ArticlesModule],
  exports: [UsersService],
})
export class UsersModule {}
