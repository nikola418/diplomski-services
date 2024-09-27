import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const validationExceptionFactory: (errors: ValidationError[]) => any = (
  errors,
) => {
  const message = new Object();
  errors.forEach((err) => {
    message[err.property] = Object.values(err.constraints);
  });
  return new BadRequestException({
    message,
    error: 'Bad Request',
    statusCode: 400,
  });
};
