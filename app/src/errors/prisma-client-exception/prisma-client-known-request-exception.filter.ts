import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientKnownRequestExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    // console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');
    console.error(exception.code);
    console.error(message);

    switch (exception.code) {
      case 'P2023': {
        const status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          message: 'malformed id field',
          statusCode: status,
        });
        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }
}
