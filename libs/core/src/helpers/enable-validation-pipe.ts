import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from '../factories';

export const validationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  exceptionFactory: validationExceptionFactory,
});
