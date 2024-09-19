import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { Observable } from 'rxjs';
import { Constraint, ExceptionResponse } from '../types/exception.response';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseRpcExceptionFilter {
  constructor() {
    super();
  }

  private readonly logger = new Logger(PrismaExceptionFilter.name);

  override catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): Observable<any> {
    this.logger.debug(exception);
    let err: ExceptionResponse;
    console.log(exception);
    if (exception.code === 'P2000') {
      err = { message: exception.message, statusCode: 400 };
    } else if (exception.code === 'P2002') {
      const regexp = RegExp(
        /Unique constraint failed on the fields?: \(\s*`?(\w+)`?\s*\)/i,
      );
      const fieldName = regexp.exec(exception.message)[1];
      err = {
        message: { [fieldName]: ['Zauzeto'] },
        statusCode: 409,
      } satisfies ExceptionResponse<Constraint>;
    } else if (exception.code === 'P2025') {
      err = { message: exception.meta || exception.message, statusCode: 404 };
    } else {
      err = { message: exception.message, statusCode: 400 };
    }

    return super.catch(new RpcException(err), host);
  }
}
