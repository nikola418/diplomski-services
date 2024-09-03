import {
  ArgumentsHost,
  Catch,
  ConflictException,
  HttpServer,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends PrismaClientExceptionFilter {
  constructor(applicationRef: HttpServer) {
    super(applicationRef);
  }

  private readonly logger = new Logger(PrismaExceptionFilter.name);

  override catch(
    exception: PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const res: Response = host.switchToHttp().getResponse();

    if (exception.code === 'P2000') {
    } else if (exception.code === 'P2002') {
      const fieldName = exception.message.split('(`')[1].split('`)')[0];
      exception.message = `Zauzeto: ${fieldName}`;

      res.status(409);
      res.json(new ConflictException(exception.message).getResponse());
    } else if (exception.code === 'P2000') {
    } else {
      super.catch(exception, host);
    }
  }
}
