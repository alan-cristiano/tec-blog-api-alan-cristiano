import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';

import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientValidationError)
export class PrismaClienValidationtExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    console.error(message);
    const statusCode = HttpStatus.BAD_REQUEST;

    response.status(statusCode).json({
      message: 'title must be a string',
      statusCode,
    });
  }
}
