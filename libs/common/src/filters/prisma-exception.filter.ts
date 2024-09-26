import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Constraint, ExceptionResponse } from '../types/exception.response';
import { nth } from 'lodash';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  override catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    this.logger.debug(exception);

    let err: ExceptionResponse;
    console.log(exception);
    if (exception.code === 'P2000') {
      err = { message: exception.message, statusCode: 400 };
    } else if (exception.code === 'P2002') {
      const regexp = RegExp(
        /Unique constraint failed on the fields?: \(\s*`?(\w+)`?\s*\)/i,
      );
      const matches = regexp.exec(exception.message);
      console.log(matches);
      const fieldName = nth(matches, 1);
      err = {
        message: { [fieldName]: ['Zauzeto'] },
        statusCode: 409,
      } satisfies ExceptionResponse<Constraint>;
    } else if (exception.code === 'P2025') {
      err = { message: exception.meta || exception.message, statusCode: 404 };
    } else {
      err = { message: exception.message, statusCode: 400 };
    }

    super.catch(err, host);
  }
}
