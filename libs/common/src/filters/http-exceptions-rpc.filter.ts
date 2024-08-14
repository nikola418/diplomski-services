import { Catch, HttpException, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionsRpcFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(HttpExceptionsRpcFilter.name);

  override catch(exception: HttpException) {
    this.logger.debug(exception);
    return throwError(() => exception);
  }
}
