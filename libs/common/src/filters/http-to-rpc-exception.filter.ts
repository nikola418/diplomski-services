import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

@Catch(HttpException)
export class HttpToRpcExceptionFilter extends BaseRpcExceptionFilter<RpcException> {
  catch(exception: any, host: ArgumentsHost) {
    return super.catch(new RpcException(exception.getResponse()), host);
  }
}
