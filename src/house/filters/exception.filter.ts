import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Catch()
export class HouseCreateFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let resBody = {
      error: true,
      message: exception,
    };
    const ctx = host.switchToHttp();

    if (
      exception instanceof BadRequestException &&
      exception.message === 'Bad Request Exception'
    ) {
      httpStatus = HttpStatus.BAD_REQUEST;
      resBody = {
        error: true,
        message: exception.getResponse(),
      };
    }
    if (
      exception instanceof HttpException &&
      exception.message !== 'Bad Request Exception'
    ) {
      httpStatus = HttpStatus.BAD_REQUEST;
      resBody = {
        error: true,
        message: exception.message,
      };
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      httpStatus = HttpStatus.BAD_REQUEST;

      if (exception.code === 'P2002')
        resBody = {
          error: true,
          message: 'Location must be unique',
        };
    }

    if (
      exception instanceof Error &&
      exception.message === 'Only png svg jpg jpeg is accepted'
    )
      resBody = {
        error: true,
        message: 'Only png svg jpg jpeg is accepted',
      };
    httpAdapter.reply(ctx.getResponse(), resBody, httpStatus);
  }
}
