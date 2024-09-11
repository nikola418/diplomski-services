import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { Observable } from 'rxjs';

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
    let err: any;

    if (exception.code === 'P2000') {
      err = { message: exception.message, statusCode: 400 };
    } else if (exception.code === 'P2002') {
      const fieldName = exception.message.split('(`')[1].split('`)')[0];
      err = { message: `Zauzeto: ${fieldName}`, statusCode: 409 };
    } else if (exception.code === 'P2025') {
      err = { message: exception.meta || exception.message, statusCode: 404 };
    } else {
      err = { message: exception.message, statusCode: 400 };
    }

    return super.catch(new RpcException(err), host);
  }
}
